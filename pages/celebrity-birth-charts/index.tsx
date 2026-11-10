import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { parseJsonb } from '@/lib/db'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { generateCelebrityBio } from '@/lib/interpretations/biography'
import { getCombinedInterpretation, getPlanetInfo } from '@/lib/interpretations'
import CelebrityRequestForm from '@/components/CelebrityRequestForm'
import CelebrityFilters from '@/components/CelebrityFilters'
import { SignGlyph } from '@/components/Glyph'
import { itemListSchema, jsonLd } from '@/lib/schema'
import { getFeaturedCelebrities, getListableCelebrities, type FeaturedCeleb } from '@/lib/celebrities'
import FeaturedCelebs, { faceRingStyle } from '@/components/FeaturedCelebs'
import { PLANET_PATHS, toneOf, formatDegree } from '@/components/NatalChartWheel'
import Scallop from '@/components/Scallop'
import { SIGN_LIST } from '@/lib/constants'
import { formatBirthDate } from '@/lib/format-birth'
import { PHOTO_CREDIT_COLUMNS, toPhotoCredit, type PhotoCredit as PhotoCreditData } from '@/lib/photo-credit'
import PhotoCredit from '@/components/PhotoCredit'

interface SpotlightPlanet {
  planet: string
  sign: string
  signDegree: number
  house: number
  retrograde: boolean
}

interface SpotlightData {
  name: string
  slug: string
  birth_date: string
  birth_city: string
  category: string | null
  image_url: string | null
  image_proxy: string | null
  photo_credit: PhotoCreditData | null
  bio: string
  ascendantSign: string
  planets: SpotlightPlanet[]
  planetInfos: Record<string, { name: string; symbol: string }>
  topInterpretations: { planet: string; sign: string; house: number; symbol: string; planetName: string; text: string }[]
  sunSign: string | null
  moonSign: string | null
  risingSign: string | null
  permalinkDate: string
  hasBirthTime: boolean
  // True when this is the day-of-year fallback pick rather than someone
  // actually born on this date — /celebrity-spotlight/[date].tsx does its
  // own independent same-day query with no fallback, so permalinking to
  // it here would show a different (or empty) result. Hide the link.
  isFallback: boolean
}

interface Props {
  spotlight: SpotlightData | null
  featuredCelebs: FeaturedCeleb[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const now = new Date()
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()

  // Both queries filter to quality bios only (see lib/celebrities.ts) — this
  // is the celebrity section's primary nav entry point, the highest-traffic
  // page in it. It previously linked celebrities with zero quality filter
  // (pure alphabetical / date order), which meant the very first link a
  // visitor — or an AdSense reviewer — could click led to a noindexed
  // template page.
  type SpotlightRow = { name: string; slug: string; birth_date: string; birth_time: string | null; birth_city: string; category: string | null; gender: string | null; image_url: string | null; chart_data: unknown; bio_extended: string | null; image_author: string | null; image_license: string | null; image_license_url: string | null; image_file_page: string | null }
  const spotlightColumns = 'name, slug, birth_date, birth_time, birth_city, category, gender, image_url, chart_data, bio_extended, ' + PHOTO_CREDIT_COLUMNS

  const [featuredCelebs, spotlightsToday] = await Promise.all([
    getFeaturedCelebrities(),
    getListableCelebrities<SpotlightRow>({
      columns: spotlightColumns,
      where: 'EXTRACT(MONTH FROM birth_date) = $1 AND EXTRACT(DAY FROM birth_date) = $2',
      params: [month, day],
      orderBy: 'name',
      limit: 10,
    }),
  ])

  const year = now.getUTCFullYear()
  let spotlightRow: SpotlightRow | null = spotlightsToday.length > 0
    ? spotlightsToday[year % spotlightsToday.length]
    : null

  // ~29% of calendar days (106/366) have zero quality-bio celebrities born
  // on them, so the exact-birthday match above resolves to null on almost
  // a third of visits. Rather than the section just not rendering, fall
  // back to a rotating pick from the full quality-bio pool, keyed off the
  // day of year so it's stable for the whole day and still changes daily.
  let usedFallback = false
  if (!spotlightRow) {
    usedFallback = true
    const startOfYear = Date.UTC(year, 0, 0)
    const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86400000)
    const fallbackPool = await getListableCelebrities<SpotlightRow>({
      columns: spotlightColumns,
      orderBy: 'name',
      limit: 500,
    })
    if (fallbackPool.length > 0) {
      spotlightRow = fallbackPool[dayOfYear % fallbackPool.length]
    }
  }

  let spotlight: SpotlightData | null = null

  if (spotlightRow) {
    const chartData = parseJsonb<BirthChartData | null>(spotlightRow.chart_data)
    if (chartData) {
      // Prefer the hand/AI-written bio_extended from the DB (matches what the
      // per-celebrity page shows). Fall back to the templated generator only
      // when no extended bio exists — and pass hasBirthTime so the generator
      // stops claiming the time "isn't on record" for charts that have one.
      const genderOpt: 'm' | 'f' | null = spotlightRow.gender === 'm' || spotlightRow.gender === 'f' ? spotlightRow.gender : null
      const fullBio = spotlightRow.bio_extended?.trim()
        || generateCelebrityBio(spotlightRow.name, chartData, {
          hasBirthTime: !!spotlightRow.birth_time,
          category: spotlightRow.category,
          gender: genderOpt,
        })
      // Show first 2 paragraphs on the index; the per-celeb page has the rest.
      // The existing "View complete chart" link below the spotlight is the
      // continuation affordance.
      const paragraphs = fullBio.split('\n\n')
      const bio = paragraphs.length > 2
        ? paragraphs.slice(0, 2).join('\n\n').replace(/\.{3}$|\.$/, '') + '…'
        : fullBio
      const sun = chartData.planets.find(p => p.planet === 'SUN')
      const moon = chartData.planets.find(p => p.planet === 'MOON')

      // Pre-compute planet infos
      const planetInfos: Record<string, { name: string; symbol: string }> = {}
      for (const p of chartData.planets) {
        const info = getPlanetInfo(p.planet)
        if (info) planetInfos[p.planet] = { name: info.name, symbol: info.symbol }
      }

      // Pre-compute top 3 interpretations
      const topInterpretations: SpotlightData['topInterpretations'] = []
      for (const p of chartData.planets.slice(0, 3)) {
        const info = getPlanetInfo(p.planet)
        const interp = getCombinedInterpretation(p.planet, p.sign, p.house)
        if (interp && info) {
          topInterpretations.push({
            planet: p.planet,
            sign: p.sign,
            house: p.house,
            symbol: info.symbol,
            planetName: info.name,
            text: interp,
          })
        }
      }

      spotlight = {
        name: spotlightRow.name,
        slug: spotlightRow.slug,
        birth_date: spotlightRow.birth_date,
        birth_city: spotlightRow.birth_city,
        category: spotlightRow.category,
        image_url: spotlightRow.image_url,
        image_proxy: spotlightRow.image_url ? `/api/img/${spotlightRow.slug}` : null,
        photo_credit: toPhotoCredit(spotlightRow),
        bio,
        ascendantSign: chartData.ascendantSign,
        planets: chartData.planets.map(p => ({
          planet: p.planet,
          sign: p.sign,
          signDegree: p.signDegree,
          house: p.house,
          retrograde: p.retrograde,
        })),
        planetInfos,
        topInterpretations,
        sunSign: sun?.sign || null,
        moonSign: moon?.sign || null,
        risingSign: chartData.ascendantSign || null,
        permalinkDate: now.toISOString().split('T')[0],
        hasBirthTime: !!spotlightRow.birth_time,
        isFallback: usedFallback,
      }
    }
  }

  return {
    props: JSON.parse(JSON.stringify({ spotlight, featuredCelebs })),
    revalidate: 86400,
  }
}

const INK = 'text-slate-800 dark:text-slate-100'
const MUTED = 'text-slate-500 dark:text-slate-400'
const RULE = 'border-slate-300 dark:border-slate-600'
const ACCENT_LINK = 'font-bold text-[var(--accent)] hover:underline'
const LABEL = `text-[13px] font-black uppercase tracking-[0.08em] ${MUTED} mb-2.5`
const CHIP = `inline-flex items-center gap-2 min-h-9 pl-1.5 pr-3.5 rounded-full bg-[var(--surface)] border-2 border-[var(--outline)] dark:border-slate-100 text-sm font-bold ${INK} hover:bg-[var(--gold)] hover:text-[#1A1622] transition-colors`

const CATEGORIES = [
  { slug: 'actor', label: 'Actors' },
  { slug: 'musician', label: 'Musicians' },
  { slug: 'athlete', label: 'Athletes' },
  { slug: 'entertainer', label: 'Entertainers' },
  { slug: 'public-figure', label: 'Public Figures' },
  { slug: 'creator', label: 'Creators' },
  { slug: 'politician', label: 'Politicians' },
  { slug: 'writer', label: 'Writers' },
  { slug: 'scientist', label: 'Scientists' },
  { slug: 'business', label: 'Business' },
  { slug: 'model', label: 'Models' },
  { slug: 'artist', label: 'Artists' },
]

function ToneDot({ sign }: { sign: string }) {
  return (
    <span
      aria-hidden="true"
      className="w-6 h-6 rounded-full border-2 border-[#1A1622] inline-flex items-center justify-center text-[13px] text-[#1A1622] shrink-0"
      style={{ background: `var(--w-${toneOf(sign)})` }}
    >
      <SignGlyph sign={sign} decorative />
    </span>
  )
}

function PlanetIcon({ planet }: { planet: string }) {
  const path = PLANET_PATHS[planet]
  if (!path) return <span className="w-[18px] shrink-0" aria-hidden="true" />
  return (
    <svg viewBox="-13 -13 26 26" width="18" height="18" aria-hidden="true" className="shrink-0">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Spotlight({ s }: { s: SpotlightData }) {
  const bigThree = [
    s.sunSign && { key: 'sun', sign: s.sunSign, label: `${s.sunSign} Sun` },
    s.moonSign && { key: 'moon', sign: s.moonSign, label: `${s.moonSign} Moon` },
    s.risingSign && { key: 'rising', sign: s.risingSign, label: `${s.risingSign} Rising` },
  ].filter(Boolean) as { key: string; sign: string; label: string }[]

  return (
    <section className="mb-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-5">
        <h2 className="text-3xl sm:text-[38px]">{s.isFallback ? 'Spotlight' : 'Born on this day'}</h2>
        {!s.isFallback && (
          <Link href={`/celebrity-spotlight/${s.permalinkDate}`} className={ACCENT_LINK}>Permalink →</Link>
        )}
      </div>

      <div className="rounded-2xl border-[3px] border-[var(--outline)] dark:border-slate-100 bg-[var(--surface)] shadow-[0_5px_0_var(--outline)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-5 mb-6">
          {s.image_proxy && (
            <figure className="ml-2 shrink-0">
              <Image
                src={s.image_proxy}
                alt={s.name}
                width={120}
                height={120}
                className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full object-cover object-top"
                style={faceRingStyle(s.sunSign)}
                sizes="120px"
                priority
                fetchPriority="high"
              />
              <figcaption className={`mt-3 max-w-[120px] text-[11px] text-center break-words ${MUTED}`}><PhotoCredit credit={s.photo_credit} /></figcaption>
            </figure>
          )}
          <div className="flex-[1_1_320px] min-w-0">
            <Link href={`/celebrity-birth-charts/${s.slug}`} className={`${INK} hover:underline`}>
              <h3 className="text-[clamp(1.9rem,4.4vw,2.6rem)] leading-[1.08] mb-1">{s.name}</h3>
            </Link>
            <p className={`text-[15px] ${MUTED} mb-3.5`}>
              {formatBirthDate(s.birth_date)} · {s.birth_city}
              {s.category && <> · {s.category}</>}
            </p>
            <div className="flex flex-wrap gap-2">
              {bigThree.map(p => (
                <Link key={p.key} href={`/zodiac-signs/${p.sign.toLowerCase()}`} className={CHIP}>
                  <ToneDot sign={p.sign} />
                  {p.label}
                  {p.key === 'rising' && !s.hasBirthTime && <span className="font-normal text-xs opacity-70">(est.)</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-8">
          <div className="flex-[1_1_420px] min-w-0">
            {s.bio && (
              <div className={`flex flex-col gap-3.5 max-w-[40em] text-[17px] leading-relaxed ${INK} mb-7`}>
                {s.bio.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              </div>
            )}

            {s.topInterpretations.length > 0 && (
              <>
                <h4 className={LABEL}>Key placements</h4>
                <ul className={`flex flex-col max-w-[40em] border-t-2 ${RULE}`}>
                  {s.topInterpretations.map(interp => (
                    <li key={interp.planet} className={`py-4 border-b-2 ${RULE}`}>
                      <p className={`flex items-center gap-2 font-black text-[17px] mb-1 ${INK}`}>
                        <PlanetIcon planet={interp.planet} />
                        {interp.planetName} in {interp.sign}{s.hasBirthTime ? `, House ${interp.house}` : ''}
                      </p>
                      <p className={`text-[15px] leading-relaxed line-clamp-4 ${INK}`}>{interp.text}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="flex-[1_1_240px] min-w-0">
            <h4 className={LABEL}>Planets</h4>
            <ul className={`flex flex-col border-t-2 ${RULE}`}>
              {s.planets.map(p => (
                <li key={p.planet} className={`flex items-center gap-3 min-h-10 border-b ${RULE} text-[15px] ${INK}`}>
                  <PlanetIcon planet={p.planet} />
                  <span className="font-bold w-[5.5em] shrink-0">{s.planetInfos[p.planet]?.name || p.planet.replace('_', ' ')}</span>
                  <span className="min-w-0">
                    {p.sign} {formatDegree(p.signDegree)}
                    {s.hasBirthTime && <span className={MUTED}>, H{p.house}</span>}
                    {p.retrograde && <span title="Retrograde"> ℞</span>}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <Link href={`/celebrity-birth-charts/${s.slug}`} className="btn-primary inline-block mt-7 px-6 py-3">
          See {s.name.replace(/\s*\([^)]*\)/g, '').trim()}&apos;s full chart →
        </Link>
      </div>
    </section>
  )
}

export default function CelebrityPage({ spotlight, featuredCelebs }: Props) {
  const router = useRouter()
  const hasFilters = Object.keys(router.query).length > 0

  return (
    <>
      <Head>
        <title>Celebrity Birth Charts — 550+ Researched Natal Charts</title>
        <meta name="description" content="Browse 550+ researched celebrity birth charts, each with a written reading and its birth-time source: Sun, Moon &amp; Rising signs and every placement, for actors, musicians, athletes and more." />
        <meta property="og:title" content="Celebrity Birth Charts — 550+ Researched Natal Charts" />
        <meta property="og:description" content="Browse 550+ researched celebrity birth charts, each with a written reading and its birth-time source: Sun, Moon &amp; Rising signs and every placement, for actors, musicians, athletes and more." />
        <link rel="canonical" key="canonical" href="https://birthchartlibrary.com/celebrity-birth-charts" />
        {hasFilters && <meta name="robots" content="noindex, follow" />}
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemListSchema(featuredCelebs.map(c => ({ name: c.name, url: `https://birthchartlibrary.com/celebrity-birth-charts/${c.slug}` })))) }} />

      {/* Hero band */}
      <section className="bg-[var(--band)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-10">
          <h1 className="text-[clamp(2.6rem,6.6vw,4.5rem)] leading-[1.02] mb-2.5">Celebrity Birth Charts</h1>
          <p className={`text-[19px] max-w-[34em] ${INK} mb-8`}>
            Sun, Moon, and Rising signs and full natal charts for actors, musicians, athletes, and public figures.
          </p>

          <p className={LABEL}>Browse by Sun sign</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {SIGN_LIST.map(sign => (
              <Link key={sign} href={`/celebrity-birth-charts/sign/${sign.toLowerCase()}`} className={CHIP}>
                <ToneDot sign={sign} />
                {sign}
              </Link>
            ))}
          </div>

          <p className={LABEL}>Browse by category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/celebrity-birth-charts/category/${cat.slug}`} className={`${CHIP} pl-3.5`}>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Scallop id="hero-scallops" top="var(--band)" className="bg-[var(--background)]" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        {featuredCelebs.length > 0 && (
          <section className="mb-14">
            <h2 className="text-3xl sm:text-[38px] mb-7">Popular Charts</h2>
            <FeaturedCelebs celebs={featuredCelebs} />
            <p className={`mt-7 ${INK}`}>
              Want to see where the birth time came from?{' '}
              <Link href="/celebrity-birth-charts/rated-birth-times" className={ACCENT_LINK}>Browse charts with a rated birth time →</Link>
            </p>
          </section>
        )}

        {spotlight && <Spotlight s={spotlight} />}

        <section className="mb-14">
          <h2 className="text-3xl sm:text-[38px] mb-5">Search the library</h2>
          <CelebrityFilters />
        </section>

        <CelebrityRequestForm />
      </main>
    </>
  )
}
