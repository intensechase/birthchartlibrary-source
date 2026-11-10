import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Image from 'next/image'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { GetStaticPaths, GetStaticProps } from 'next'
import { query, queryOne, parseJsonb } from '@/lib/db'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { generateCelebrityBio } from '@/lib/interpretations/biography'
import { getPlanetInfo } from '@/lib/interpretations'
import { PLANET_PATHS, toneOf } from '@/components/NatalChartWheel'
import Scallop from '@/components/Scallop'
import { formatBirthDate, formatBirthTime } from '@/lib/format-birth'
import { buildGlance, type Glance } from '@/lib/chart-glance'
import { SignGlyph } from '@/components/Glyph'
import { SIGN_LIST } from '@/lib/constants'
import { SIGN_ORDER, getPairSlug } from '@/lib/interpretations/compatibility-helpers'
import CelebrityChart, { type ChartPlacement } from '@/components/CelebrityChart'
import { personSchema, celebrityFaqSchema, breadcrumbSchema, jsonLd } from '@/lib/schema'
import { getChineseZodiac } from '@/lib/chinese-zodiac'
import { hasQualityBio, isServedCelebrity, getServedCelebritySlugs, QUALITY_BIO_SQL } from '@/lib/celebrities'
import { coupleNameToSlug, coupleHref } from '@/lib/couple-slugs'
import { getBirthTimeSource, type BirthTimeSource } from '@/lib/birth-time-source'
import { PHOTO_CREDIT_COLUMNS, toPhotoCredit, type PhotoCredit as PhotoCreditData } from '@/lib/photo-credit'
import PhotoCredit from '@/components/PhotoCredit'

interface PlanetData {
  planet: string
  sign: string
  signDegree: number
  house: number
  retrograde: boolean
  longitude: number
}

interface ChartData {
  planets: PlanetData[]
  houses: number[]
  ascendantSign: string
  midheavenSign: string
  ascendant: number
  midheaven: number
}

interface Props {
  celeb: {
    name: string
    slug: string
    birth_date: string
    birth_time: string | null
    birth_city: string
    category: string | null
    image_url: string | null
    image_proxy: string | null
    photo_credit: PhotoCreditData | null
    birth_name: string | null
    chart_summary: Record<string, unknown> | null
  }
  birthTimeSource: BirthTimeSource | null
  chartData: ChartData | null
  bio: string
  sunSign: string | null
  moonSign: string | null
  risingSign: string | null
  placements: ChartPlacement[]
  planetInfos: Record<string, { name: string; symbol: string }>
  schemaJson: Record<string, unknown>
  faqSchemaJson: Record<string, unknown> | null
  breadcrumbSchemaJson: Record<string, unknown>
  bornSameDay: { name: string; slug: string; image_url: string | null; year: number }[]
  chartTwins: { name: string; slug: string; image_url: string | null; matchLabel: string }[]
  couplePairs: { href: string; otherName: string; otherSign: string | null }[]
  glance: Glance | null
  shouldNoindex: boolean
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Build ZERO pages at deploy time — pages build on first visit and cache as static HTML
  // This is the key optimization for 3000+ celebrity pages that caused 300%+ CPU on App Router
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string

  // Stage 1: DB fetch — only true 404 if celeb genuinely not in DB
  type CelebRow = {
    name: string
    slug: string
    birth_date: string
    birth_time: string | null
    birth_city: string
    birth_lat: number | string | null
    birth_lng: number | string | null
    category: string | null
    image_url: string | null
    chart_data: unknown
    description: string | null
    bio_extended: string | null
    chart_summary: unknown | null
    birth_name: string | null
    bio: string | null
    gender: string | null
    metadata: unknown
    bio_source: string | null
    image_author: string | null
    image_license: string | null
    image_license_url: string | null
    image_file_page: string | null
  }
  let celeb: CelebRow | null = null
  try {
    celeb = await queryOne<CelebRow>(
      'SELECT name, slug, birth_date, birth_time, birth_city, birth_lat, birth_lng, category, image_url, chart_data, description, bio_extended, chart_summary, birth_name, bio, gender, metadata, bio_source, ' + PHOTO_CREDIT_COLUMNS + ' FROM celebrities WHERE slug = $1',
      [slug]
    )
  } catch (err) {
    console.error('[celebrity-birth-charts/slug] DB fetch error:', err)
    return { notFound: true }
  }

  if (!celeb) {
    return { notFound: true }
  }

  // Only people with a chart and a written bio have a page (2026-11-09,
  // docs/TEMPLATE-CELEB-REMOVAL-PLAN.md). Template-bio rows used to render with
  // noindex; they now 404 so Google stops crawling ~53k thin pages. The row
  // stays in the DB; writing a quality bio brings the page back.
  if (!isServedCelebrity(celeb)) {
    return { notFound: true, revalidate: 86400 }
  }

  // Stage 2: chart processing — fall back to partial page on any error
  try {
    const chartData = parseJsonb<BirthChartData | null>(celeb.chart_data)
    // Prefer bio_extended (new rich format), fall back to description, then generate on the fly
    const bio = celeb.bio_extended || celeb.description || (chartData ? generateCelebrityBio(celeb.name, chartData, { hasBirthTime: !!celeb.birth_time, shortBio: celeb.bio || undefined }) : '')

    const sun = chartData?.planets.find(p => p.planet === 'SUN')
    const moon = chartData?.planets.find(p => p.planet === 'MOON')

    // Interpretation text is NOT server-rendered: each placement paragraph
    // is shared verbatim by every celebrity with that placement and made up
    // ~70% of the page (2026-10-15 audit — e.g. George W. Bush and Sylvester
    // Stallone, same birthday, were 84% identical). Placements ship a lookup
    // key; CelebrityChart fetches the text from /api/interpretations-bulk
    // when the reader opens the interpretations. Sign-only keys without a
    // birth time (houses are noon estimates), as before.
    let placements: ChartPlacement[] = []
    const planetInfos: Record<string, { name: string; symbol: string }> = {}

    if (chartData) {
      const ascIdx = SIGN_LIST.indexOf(chartData.ascendantSign)

      placements = chartData.planets.map(p => {
        const info = getPlanetInfo(p.planet)
        if (info) planetInfos[p.planet] = { name: info.name, symbol: info.symbol }

        const placement: ChartPlacement = {
          planet: p.planet,
          sign: p.sign,
          signDegree: p.signDegree,
          retrograde: p.retrograde,
          placidusHouse: p.house,
          textKey: celeb.birth_time ? `${p.planet}_${p.sign}_H${p.house}` : `${p.planet}_${p.sign}`,
        }
        // Whole-Sign variant is only meaningful when the house differs AND
        // we have birth time (the toggle UI is hidden without it). Ship the
        // house number only; CelebrityChart fetches text on demand.
        if (celeb.birth_time) {
          const wsHouse = ((SIGN_LIST.indexOf(p.sign) - ascIdx + 12) % 12) + 1
          if (wsHouse !== p.house) {
            placement.wholeSign = { house: wsHouse }
          }
        }
        return placement
      })
    }

    const sunSignVal = sun?.sign || null
    const moonSignVal = moon?.sign || null
    const risingSignVal = chartData?.ascendantSign || null
    // With no birth time the Rising sign is a noon estimate. The page body can
    // show it marked "(est.)", but structured data can't carry that caveat.
    const knownRisingSign = celeb.birth_time ? risingSignVal : null

    // Inner planets for FAQ schema
    const mercury = chartData?.planets.find(p => p.planet === 'Mercury')
    const venus = chartData?.planets.find(p => p.planet === 'Venus')
    const mars = chartData?.planets.find(p => p.planet === 'Mars')
    const mercurySignVal = mercury?.sign || null
    const venusSignVal = venus?.sign || null
    const marsSignVal = mars?.sign || null

    // Chinese zodiac from birth year (for FAQ)
    let chineseAnimal: string | null = null
    let chineseElement: string | null = null
    const birthYear = new Date(celeb.birth_date + 'T12:00:00Z').getUTCFullYear()
    if (!Number.isNaN(birthYear) && birthYear >= 1924 && birthYear <= 2047) {
      const cz = getChineseZodiac(birthYear)
      chineseAnimal = cz.animal
      chineseElement = cz.element
    }

    // Pre-compute JSON-LD schema
    const adbUrl = (() => {
      try {
        const meta = parseJsonb<{ adb_url?: string } | null>(celeb.metadata)
        return meta?.adb_url || null
      } catch { return null }
    })()
    const schemaJson = personSchema({
      name: celeb.name,
      birthDate: celeb.birth_date,
      birthCity: celeb.birth_city,
      slug: celeb.slug,
      category: celeb.category,
      imageUrl: celeb.image_url,
      sunSign: sunSignVal,
      moonSign: moonSignVal,
      risingSign: knownRisingSign,
      alternateName: celeb.birth_name,
      gender: celeb.gender,
      birthLat: celeb.birth_lat,
      birthLng: celeb.birth_lng,
      adbUrl,
    })

    const faqSchemaJson = celebrityFaqSchema({
      name: celeb.name,
      sunSign: sunSignVal,
      moonSign: moonSignVal,
      risingSign: knownRisingSign,
      birthDate: celeb.birth_date,
      birthCity: celeb.birth_city,
      mercurySign: mercurySignVal,
      venusSign: venusSignVal,
      marsSign: marsSignVal,
      chineseAnimal,
      chineseElement,
    })

    const breadcrumbSchemaJson = breadcrumbSchema([
      { name: 'Home', url: 'https://birthchartlibrary.com' },
      { name: 'Celebrity Birth Charts', url: 'https://birthchartlibrary.com/celebrity-birth-charts' },
      { name: celeb.name, url: `https://birthchartlibrary.com/celebrity-birth-charts/${celeb.slug}` },
    ])

    // Ensure all props are JSON-serializable (no Date objects, no undefined, no class instances)
    const serializedChartData = chartData ? {
      planets: chartData.planets.map(p => ({
        planet: p.planet,
        sign: p.sign,
        signDegree: p.signDegree,
        house: p.house,
        retrograde: p.retrograde,
        longitude: p.longitude,
      })),
      houseCusps: chartData.houseCusps,
      ascendantSign: chartData.ascendantSign,
      midheavenSign: chartData.midheavenSign,
      ascendant: chartData.ascendant,
      midheaven: chartData.midheaven,
    } : null

    const sunSign = sunSignVal

    // "Born the same day" — same month+day, any year. Exact match first;
    // if fewer than 3 results, broaden to ±3 days for low-density dates.
    // Quality-bio filtered (see lib/celebrities.ts) — this renders on every
    // indexed celebrity page, so an unfiltered version was linking every
    // quality page out to 3 noindexed template pages, undermining the
    // hub-page exposure fix (see docs/GOOGLE-APPROVAL-CHECKLIST-2026-07-23.md).
    let bornSameDayRows = await query<{ name: string; slug: string; image_url: string | null; year: number }>(
      `SELECT name, slug, image_url, EXTRACT(YEAR FROM birth_date)::int AS year
       FROM celebrities
       WHERE EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM $1::date)
         AND EXTRACT(DAY FROM birth_date) = EXTRACT(DAY FROM $1::date)
         AND slug != $2
         AND image_url IS NOT NULL
         AND ${QUALITY_BIO_SQL}
       ORDER BY RANDOM() LIMIT 3`,
      [celeb.birth_date, slug]
    )
    if (bornSameDayRows.length < 3) {
      const existing = bornSameDayRows.map(r => r.slug)
      const fill = await query<{ name: string; slug: string; image_url: string | null; year: number }>(
        `SELECT name, slug, image_url, EXTRACT(YEAR FROM birth_date)::int AS year
         FROM celebrities
         WHERE ABS(EXTRACT(DOY FROM birth_date) - EXTRACT(DOY FROM $1::date)) <= 3
           AND slug != $2
           AND ($3::text[] IS NULL OR NOT (slug = ANY($3::text[])))
           AND image_url IS NOT NULL
           AND ${QUALITY_BIO_SQL}
         ORDER BY RANDOM() LIMIT $4`,
        [celeb.birth_date, slug, existing.length ? existing : null, 3 - bornSameDayRows.length]
      )
      bornSameDayRows = [...bornSameDayRows, ...fill]
    }
    const bornSameDay = bornSameDayRows

    // "Similar Big Three" — same Sun AND (Moon OR Rising). Prefers full
    // overlap, then Sun+Moon, then Sun+Rising. Quality-bio filtered for the
    // same reason as bornSameDay above.
    type TwinRow = { name: string; slug: string; image_url: string | null; moon_sign: string | null; rising_sign: string | null }
    const twinRows = sunSign && (moonSignVal || risingSignVal)
      ? await query<TwinRow>(
          `SELECT name, slug, image_url, moon_sign, rising_sign FROM celebrities
           WHERE sun_sign = $1
             AND (moon_sign = $2 OR rising_sign = $3)
             AND slug != $4
             AND image_url IS NOT NULL
             AND ${QUALITY_BIO_SQL}
           ORDER BY
             CASE
               WHEN moon_sign = $2 AND rising_sign = $3 THEN 0
               WHEN moon_sign = $2 THEN 1
               ELSE 2
             END,
             RANDOM()
           LIMIT 3`,
          [sunSign, moonSignVal, risingSignVal, slug]
        )
      : []
    const chartTwins = twinRows.map(r => {
      const moonMatch = !!moonSignVal && r.moon_sign === moonSignVal
      const risingMatch = !!risingSignVal && r.rising_sign === risingSignVal
      const matchLabel = moonMatch && risingMatch
        ? 'Sun, Moon & Rising'
        : moonMatch
          ? 'Sun & Moon'
          : 'Sun & Rising'
      return { name: r.name, slug: r.slug, image_url: r.image_url, matchLabel }
    })

    // Find celebrity-couple pair pages this person appears in (links to /love/[pair])
    const couplePairs: { href: string; otherName: string; otherSign: string | null }[] = []
    try {
      const csvPath = path.join(process.cwd(), 'data', 'celebrity-couples.csv')
      if (existsSync(csvPath)) {
        // href: the couple's /love article if one exists, else the compare
        // page. (Was always /love/{a}-and-{b}, which 404'd for every couple
        // without an article — 22 broken links across featured pages.)
        const lines = readFileSync(csvPath, 'utf8').trim().split('\n').slice(1)
        const served = await getServedCelebritySlugs()
        for (const line of lines) {
          const [name1, sign1, name2, sign2] = line.split(',').map(s => s?.trim() ?? '')
          if (!name1 || !name2) continue
          const slug1 = coupleNameToSlug(name1)
          const slug2 = coupleNameToSlug(name2)
          const href = coupleHref(slug1, slug2)
          // A compare page exists only when both people have pages.
          if (href.includes('/compare/') && !(served.has(slug1) && served.has(slug2))) continue
          if (slug1 === slug) {
            couplePairs.push({ href, otherName: name2, otherSign: sign2 || null })
          } else if (slug2 === slug) {
            couplePairs.push({ href, otherName: name1, otherSign: sign1 || null })
          }
        }
      }
    } catch { /* CSV missing or unreadable */ }

    // Require chartData AND a quality bio (hand-written or Opus/Haiku AI,
    // not the template fallback). The bio prop is always non-empty when
    // chartData exists (generateCelebrityBio fallback), so we gate on
    // bio_source rather than the prop. Aligns with sitemap-celebs-featured
    // which promotes the same bio_source set. Template-bio pages are thin
    // by AdSense standards — identical structure, no unique narrative.
    const shouldNoindex = !chartData || !hasQualityBio(celeb.bio_source)

    return {
      props: JSON.parse(JSON.stringify({
        celeb: {
          name: celeb.name,
          slug: celeb.slug,
          birth_date: celeb.birth_date,
          birth_time: celeb.birth_time,
          birth_city: celeb.birth_city,
          category: celeb.category,
          image_url: celeb.image_url,
          image_proxy: celeb.image_url ? `/api/img/${celeb.slug}` : null,
          photo_credit: toPhotoCredit(celeb),
          birth_name: celeb.birth_name || null,
          chart_summary: celeb.chart_summary as Record<string, unknown> | null,
        },
        birthTimeSource: getBirthTimeSource(celeb.birth_time, celeb.metadata),
        chartData: serializedChartData,
        bio,
        sunSign,
        moonSign: moonSignVal,
        risingSign: risingSignVal,
        placements,
        planetInfos,
        schemaJson,
        faqSchemaJson,
        breadcrumbSchemaJson,
        bornSameDay,
        chartTwins,
        couplePairs,
        glance: chartData ? buildGlance(chartData, !!celeb.birth_time) : null,
        shouldNoindex,
      })),
      revalidate: 604800, // 7 days
    }
  } catch (err) {
    // Chart processing failed — render partial page with basic celeb info instead of 404ing
    console.error('[celebrity-birth-charts/slug] chart processing error:', err)
    const adbUrl = (() => {
      try {
        const meta = parseJsonb<{ adb_url?: string } | null>(celeb.metadata)
        return meta?.adb_url || null
      } catch { return null }
    })()
    const schemaJson = personSchema({
      name: celeb.name,
      birthDate: celeb.birth_date,
      birthCity: celeb.birth_city,
      slug: celeb.slug,
      category: celeb.category,
      imageUrl: celeb.image_url,
      sunSign: null,
      moonSign: null,
      risingSign: null,
      alternateName: celeb.birth_name,
      gender: celeb.gender,
      birthLat: celeb.birth_lat,
      birthLng: celeb.birth_lng,
      adbUrl,
    })
    const breadcrumbSchemaJson = breadcrumbSchema([
      { name: 'Home', url: 'https://birthchartlibrary.com' },
      { name: 'Celebrity Birth Charts', url: 'https://birthchartlibrary.com/celebrity-birth-charts' },
      { name: celeb.name, url: `https://birthchartlibrary.com/celebrity-birth-charts/${celeb.slug}` },
    ])
    return {
      props: JSON.parse(JSON.stringify({
        celeb: {
          name: celeb.name,
          slug: celeb.slug,
          birth_date: celeb.birth_date,
          birth_time: celeb.birth_time,
          birth_city: celeb.birth_city,
          category: celeb.category,
          image_url: celeb.image_url,
          image_proxy: celeb.image_url ? `/api/img/${celeb.slug}` : null,
          photo_credit: toPhotoCredit(celeb),
          birth_name: celeb.birth_name || null,
          chart_summary: null,
        },
        birthTimeSource: getBirthTimeSource(celeb.birth_time, celeb.metadata),
        chartData: null,
        bio: celeb.bio_extended || celeb.description || '',
        sunSign: null,
        moonSign: null,
        risingSign: null,
        placements: [],
        planetInfos: {},
        schemaJson,
        faqSchemaJson: null,
        breadcrumbSchemaJson,
        bornSameDay: [],
        chartTwins: [],
        couplePairs: [],
        glance: null,
        // Chart processing failed — the page renders only partial info.
        // Always noindex broken renders rather than feed Google a low-quality
        // page; will retry hourly via revalidate.
        shouldNoindex: true,
      })),
      revalidate: 3600, // retry in 1 hour
    }
  }
}

const INK = 'text-slate-800 dark:text-slate-100'
const MUTED = 'text-slate-500 dark:text-slate-400'
const ACCENT_LINK = 'font-bold text-[var(--accent)] hover:underline'

// A sign or planet glyph in a ring of the wheel's tone color, as in the big-three pills.
const RISING_PATH = 'M-9 10L0 -10L9 10M-5.5 3H5.5'
function PillIcon({ path, sign }: { path: string; sign: string }) {
  return (
    <span
      aria-hidden="true"
      className="w-[34px] h-[34px] rounded-full border-[3px] border-[#1A1622] inline-flex items-center justify-center shrink-0"
      style={{ background: `var(--w-${toneOf(sign)})` }}
    >
      <span className="w-[22px] h-[22px] rounded-full bg-[#FFF9EA] inline-flex items-center justify-center">
        <svg viewBox="-13 -13 26 26" width="16" height="16"><path d={path} fill="none" stroke="#1A1622" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </span>
  )
}

const ringStyle = (tone: number) => ({ boxShadow: `0 0 0 3px var(--w-tone-${tone % 4}), 0 0 0 5.5px var(--outline)` })

function PersonLink({ href, slug, name, note, tone }: { href: string; slug?: string; name: string; note: string; tone: number }) {
  return (
    <Link href={href} className={`flex items-center gap-4 pl-1.5 ${INK} group`}>
      {slug ? (
        <Image
          src={`/api/img/${slug}`}
          alt=""
          width={52}
          height={52}
          className="w-[52px] h-[52px] rounded-full object-cover object-top shrink-0"
          style={ringStyle(tone)}
        />
      ) : null}
      <span className="leading-snug min-w-0">
        <span className="block font-black group-hover:underline">{name}</span>
        <span className={`block text-sm ${MUTED}`}>{note}</span>
      </span>
    </Link>
  )
}

export default function CelebrityChartPage({ celeb, birthTimeSource, chartData, bio, sunSign, moonSign, risingSign, placements, planetInfos, schemaJson, faqSchemaJson, breadcrumbSchemaJson, bornSameDay, chartTwins, couplePairs, glance, shouldNoindex }: Props) {
  // Titles and share cards only name a Rising sign that comes from a real birth time.
  const knownRisingSign = celeb.birth_time ? risingSign : null
  const bigThree = [sunSign, moonSign, knownRisingSign].filter(Boolean)
  const titleBigThree = bigThree.length === 3
    ? `${sunSign} Sun, ${moonSign} Moon, ${knownRisingSign} Rising`
    : bigThree.length > 0
    ? bigThree.map((s, i) => `${s} ${['Sun', 'Moon', 'Rising'][i]}`).join(', ')
    : 'Astrology Profile'
  const metaDescription = bigThree.length === 3
    ? `${celeb.name} is a ${sunSign} Sun with ${moonSign} Moon and ${knownRisingSign} Rising, born in ${celeb.birth_city}. In-depth natal chart with planetary interpretations.`
    : bigThree.length > 0
    ? `${celeb.name}'s chart: ${bigThree.map((s, i) => `${s} ${['Sun', 'Moon', 'Rising'][i]}`).join(', ')}, born in ${celeb.birth_city}. Full birth chart with planetary interpretations.`
    : `${celeb.name} was born in ${celeb.birth_city}. Full natal chart and astrological profile with planetary interpretations.`
  const firstName = celeb.name.split(' ')[0]

  const pills = chartData ? [
    sunSign && { key: 'sun', sign: sunSign, label: `${sunSign} Sun`, path: PLANET_PATHS.SUN },
    moonSign && { key: 'moon', sign: moonSign, label: `${moonSign} Moon`, path: PLANET_PATHS.MOON },
    risingSign && { key: 'rising', sign: risingSign, label: `${risingSign} Rising`, path: RISING_PATH },
  ].filter((p): p is { key: string; sign: string; label: string; path: string } => !!p) : []

  const chips = [
    celeb.category,
    glance && `${glance.dominantElement} dominant`,
    ...(glance?.signStelliums.map(s => `${s.sign} stellium`) ?? []),
  ].filter((c): c is string => !!c)

  const glanceRows = glance ? [
    glance.midheaven && { label: 'Midheaven', value: glance.midheaven },
    { label: 'Dominant', value: `${glance.dominantElement}, ${glance.dominantModality}` },
    ...glance.signStelliums.map(s => ({ label: 'Sign stellium', value: `${s.sign}: ${s.planets.join(', ')}` })),
    ...glance.houseStelliums.map(s => ({ label: 'House stellium', value: `House ${s.house}: ${s.planets.join(', ')}` })),
    glance.retrogrades.length > 0 && { label: 'Retrograde', value: glance.retrogrades.join(', ') },
  ].filter((r): r is { label: string; value: string } => !!r) : []

  const bioSection = bio ? (
    <div className="flex flex-wrap items-start gap-x-12 gap-y-8">
      <article className="flex-[999_1_560px] min-w-0 max-w-[40em] text-[17px] sm:text-lg leading-[1.7]">
        <h2 className="text-3xl sm:text-4xl mb-3.5">About {celeb.name}</h2>
        <div className="space-y-[18px]">
          {bio.replace(/\r\n/g, '\n').split('\n\n').filter(p => p.trim()).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
      {glanceRows.length > 0 && (
        <aside className="flex-[1_1_260px] min-w-0 rounded-2xl bg-[var(--band)] px-[22px] py-5">
          <h2 className={`!font-body text-lg font-black mb-3 ${INK}`}>At a glance</h2>
          <dl className="flex flex-col gap-3 text-[15px]">
            {glanceRows.map((r, i) => (
              <div key={i}>
                <dt className={`text-xs font-bold tracking-[.08em] uppercase ${MUTED}`}>{r.label}</dt>
                <dd className={`font-bold ${INK}`}>{r.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </div>
  ) : null

  const ctaBand = (
    <section className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 bg-[var(--gold)] text-[#1A1622] border-[3px] border-[var(--outline)] rounded-2xl shadow-[0_5px_0_var(--outline)] px-6 sm:px-[30px] py-[26px]">
      <div className="flex-[1_1_380px] min-w-0">
        <h2 className="!text-[#1A1622] text-2xl sm:text-[32px] mb-1">What does your chart look like?</h2>
        <p>Free natal chart: every planet, every placement, 1,700+ interpretations.</p>
      </div>
      <Link href="/birth-chart?ref=celeb-mid" className="inline-flex items-center min-h-[50px] px-6 rounded-xl font-black whitespace-nowrap bg-[#1A1622] text-[#FFF9EA] hover:translate-y-0.5 transition-transform">
        Get Mine Free
      </Link>
    </section>
  )

  const related = (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-x-8 gap-y-9">
      {bornSameDay.length > 0 && (
        <div>
          <h2 className="text-2xl mb-[18px]">Born the same day</h2>
          <ul className="flex flex-col gap-5">
            {bornSameDay.map((rc, i) => (
              <li key={rc.slug}>
                <PersonLink href={`/celebrity-birth-charts/${rc.slug}`} slug={rc.image_url ? rc.slug : undefined} name={rc.name} note={`Born ${rc.year}`} tone={i + 3} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {chartTwins.length > 0 && (
        <div>
          <h2 className="text-2xl mb-[18px]">Similar Big Three</h2>
          <ul className="flex flex-col gap-5">
            {chartTwins.map((rc, i) => (
              <li key={rc.slug}>
                <PersonLink href={`/celebrity-birth-charts/${rc.slug}`} slug={rc.image_url ? rc.slug : undefined} name={rc.name} note={rc.matchLabel} tone={i + 1} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        {couplePairs.length > 0 && (
          <>
            <h2 className="text-2xl mb-[18px]">Partnerships</h2>
            <ul className="flex flex-col gap-3 mb-6">
              {couplePairs.map(p => (
                <li key={p.href}>
                  <Link href={p.href} className={`font-black ${INK} hover:underline`}>
                    {firstName} &amp; {p.otherName}
                  </Link>
                  {p.otherSign && <span className={`block text-sm ${MUTED}`}>{p.otherSign}</span>}
                </li>
              ))}
            </ul>
          </>
        )}
        {couplePairs.length === 0 && <h2 className="text-2xl mb-[18px]">Compare charts</h2>}
        <p className="mb-1.5">
          <Link href={`/calculators/synastry?celebrity=${celeb.slug}`} className={ACCENT_LINK}>Compare your chart with {firstName} →</Link>
        </p>
        <p className="mb-1.5">
          <Link href={`/calculators/synastry?celebrity=${celeb.slug}`} className={ACCENT_LINK}>Compare {firstName} with another celebrity →</Link>
        </p>
        {!celeb.birth_time && (
          <p className={`text-xs ${MUTED} mt-2`}>
            Birth time unverified, so a comparison uses Sun, Moon and planetary aspects only.
          </p>
        )}
        <p className="mt-6">
          <Link href="/celebrity-birth-charts" className={`text-sm ${MUTED} hover:underline`}>Browse all celebrity charts →</Link>
        </p>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>{`${celeb.name} Birth Chart & Natal Chart — ${titleBigThree}`}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${celeb.name} Birth Chart — ${titleBigThree}`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/celebrity?name=${encodeURIComponent(celeb.name)}&sun=${encodeURIComponent(sunSign || '')}&moon=${encodeURIComponent(moonSign || '')}&rising=${encodeURIComponent(knownRisingSign || '')}&category=${encodeURIComponent(celeb.category || '')}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${celeb.name} birth chart — ${titleBigThree}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${celeb.name} Birth Chart — ${titleBigThree}`} />
        <meta name="twitter:description" content={metaDescription} />
        {(shouldNoindex || (!chartData && !bio)) && <meta name="robots" content="noindex,follow" />}
      </Head>
      {/* JSON-LD is wasted on noindex pages — Google ignores rich
          data on pages it's been told not to index. Saves ~2-3KB per
          response across 50K templated celeb pages and makes intent
          clearer. */}
      {!shouldNoindex && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schemaJson) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchemaJson) }} />
          {faqSchemaJson && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchemaJson) }} />}
        </>
      )}

      {/* Hero band */}
      <section className="bg-[var(--band)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-9">
          <AdminBreadcrumb
            className="mb-5 !text-sm"
            crumbs={[
              { label: 'Celebrity Charts', href: '/celebrity-birth-charts' },
              { label: celeb.name },
            ]}
          />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
            {celeb.image_proxy && (
              <figure className="ml-2.5 shrink-0">
                <Image
                  src={celeb.image_proxy}
                  alt={celeb.name}
                  width={150}
                  height={150}
                  className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full object-cover object-top"
                  style={ringStyle(sunSign ? SIGN_LIST.indexOf(sunSign) : 3)}
                  priority
                />
                <figcaption className={`mt-3 max-w-[150px] text-[11px] text-center break-words ${MUTED}`}><PhotoCredit credit={celeb.photo_credit} /></figcaption>
              </figure>
            )}
            <div className="flex-[1_1_420px] min-w-0">
              <h1 className="text-[clamp(2.6rem,6.6vw,4.5rem)] leading-[1.02] mb-1.5">{celeb.name}</h1>
              {celeb.birth_name && (
                <p className={`text-sm ${MUTED}`}>Born {celeb.birth_name}</p>
              )}
              <p className={`text-[17px] ${INK}`}>
                {formatBirthDate(celeb.birth_date)}{celeb.birth_time ? ` at ${formatBirthTime(celeb.birth_time)}` : ''} · {celeb.birth_city}
                {!celeb.birth_time && <span className="text-amber-700 dark:text-amber-300 text-sm ml-1">· birth time unknown</span>}
              </p>
              {birthTimeSource && (
                <p className={`text-sm ${MUTED} mb-4`}>
                  {birthTimeSource.rating ? (
                    <>
                      Birth time source:{' '}
                      {birthTimeSource.url ? (
                        <a href={birthTimeSource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800 dark:hover:text-slate-100 transition-colors">Astro-Databank</a>
                      ) : 'Astro-Databank'}
                      , Rodden rating {birthTimeSource.rating} ({birthTimeSource.meaning})
                    </>
                  ) : 'Birth time source: not yet verified'}
                </p>
              )}
              {!birthTimeSource && <div className="mb-4" />}
              {pills.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-3.5">
                  {pills.map(p => (
                    <Link
                      key={p.key}
                      href={`/zodiac-signs/${p.sign.toLowerCase()}`}
                      className="inline-flex items-center gap-2.5 py-[5px] pl-1.5 pr-4 bg-[var(--surface)] border-[3px] border-[var(--outline)] rounded-full shadow-[0_3px_0_var(--outline)] font-black text-slate-800 dark:text-slate-100 hover:translate-y-0.5 transition-transform"
                    >
                      <PillIcon path={p.path} sign={p.sign} />
                      {p.label}
                      {p.key === 'rising' && !celeb.birth_time && <span className="font-normal text-xs opacity-70">(est.)</span>}
                    </Link>
                  ))}
                </div>
              )}
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {chips.map(c => (
                    <span key={c} className={`inline-flex items-center min-h-7 px-3 rounded-full bg-[var(--surface)] text-sm font-bold ${INK}`}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Scallop id="hero-scallops" top="var(--band)" className="bg-[var(--background)]" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {chartData && !celeb.birth_time && (
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <span className="font-medium">Birth time unknown.</span> The Rising sign, house placements, and Midheaven shown below are estimated using noon. Only the Sun and Moon positions are reliable.
          </div>
        )}

        {chartData ? (
          <CelebrityChart
            chartData={chartData as unknown as BirthChartData}
            planetInfos={planetInfos}
            placements={placements}
            hasBirthTime={!!celeb.birth_time}
            middle={<>{bioSection}{ctaBand}</>}
            aside={related}
          />
        ) : (
          <div className="flex flex-col gap-14">
            {bioSection}
            <div className="card text-slate-500">Chart data not yet available for this celebrity.</div>
            {ctaBand}
            {related}
          </div>
        )}

        {/* Compatibility links */}
        {sunSign && (
          <section className="mt-14">
            <h2 className="text-2xl sm:text-3xl mb-1">{sunSign} compatibility</h2>
            <p className={`${MUTED} text-sm mb-5`}>
              How {sunSign} connects with every other sign.
            </p>
            <div className="flex flex-wrap gap-2">
              {SIGN_ORDER.map(s => (
                <Link
                  key={s}
                  href={`/compatibility/${getPairSlug(sunSign, s)}`}
                  className={`inline-flex items-center gap-1 min-h-8 px-3 rounded-full bg-[var(--surface)] text-sm font-bold ${INK} hover:underline`}
                >
                  <SignGlyph sign={s} decorative /> {s}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              <Link href={`/love/${sunSign.toLowerCase()}-in-love`} className={ACCENT_LINK}>
                {sunSign} in love →
              </Link>
              <Link href="/astrology-interpretations" className={ACCENT_LINK}>
                The full interpretation library →
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
