import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getCelebritiesWithPlacement, type PlacementCeleb } from '@/lib/celebrities'
import { PLANETS, SIGNS, HOUSES } from '@/lib/interpretations'
import { PLANET_IN_SIGN } from '@/lib/interpretations/planet_in_sign'
import { PLANET_IN_HOUSE } from '@/lib/interpretations/planet_in_house'
import { dbGetPlanetInSign, dbGetPlanetInHouse, dbGetCombinedInterpretation } from '@/lib/interpretations/db'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { PLANET_SLUG_LIST, SLUG_TO_PLANET_KEY, SIGN_LIST_LOWER } from '@/lib/constants'
import { SignGlyph } from '@/components/Glyph'
import { PLANET_PATHS, toneOf } from '@/components/NatalChartWheel'
import { CelebFace, cleanCelebName } from '@/components/FeaturedCelebs'
import Scallop from '@/components/Scallop'

const INK = 'text-slate-800 dark:text-slate-100'
const MUTED = 'text-slate-500 dark:text-slate-400'
const RULE = 'border-slate-300 dark:border-slate-600'
const ACCENT_LINK = 'font-bold text-[var(--accent)] hover:underline'
const H2 = 'text-[28px] sm:text-[34px] leading-tight mb-4'
const ASIDE_H = `text-[13px] font-black uppercase tracking-[0.08em] ${MUTED} mb-3`
const CHIP = `inline-flex items-center min-h-9 px-3.5 rounded-full bg-[var(--surface)] border-2 border-[var(--outline)] dark:border-slate-100 text-sm font-bold ${INK} hover:bg-[var(--gold)] hover:text-[#1A1622] transition-colors`
const ordinalOf = (n: number) => (n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`)

// A planet glyph (and sign glyph for planet-in-sign pages) in a tone ring, like the chart page's pills.
function ComboBadge({ planetKey, sign }: { planetKey: string; sign: string | null }) {
  const path = PLANET_PATHS[planetKey]
  const ring = (bg: string, child: React.ReactNode) => (
    <span
      aria-hidden="true"
      className="w-[92px] h-[92px] sm:w-[108px] sm:h-[108px] rounded-full border-[4px] border-[#1A1622] inline-flex items-center justify-center shrink-0 shadow-[0_5px_0_var(--outline)]"
      style={{ background: bg }}
    >
      <span className="w-[72%] h-[72%] rounded-full bg-[#FFF9EA] inline-flex items-center justify-center text-[44px] sm:text-[52px] leading-none text-[#1A1622]">{child}</span>
    </span>
  )
  return (
    <span className="flex items-center ml-1 shrink-0">
      {ring('var(--gold)', path ? (
        <svg viewBox="-13 -13 26 26" width="46" height="46"><path d={path} fill="none" stroke="#1A1622" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : null)}
      {sign && <span className="-ml-4">{ring(`var(--w-${toneOf(sign)})`, <SignGlyph sign={sign} decorative />)}</span>}
    </span>
  )
}

const PLANET_ORDER = PLANET_SLUG_LIST
const PLANET_KEYS = SLUG_TO_PLANET_KEY
const SIGN_NAMES = SIGN_LIST_LOWER

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
function planetLabel(key: string) { return PLANETS[key]?.name || key }

type Celebrity = PlacementCeleb

interface Props {
  type: 'sign' | 'house'
  planetSlug: string
  planetKey: string
  planetName: string
  signOrHouse: string
  title: string
  metaDescription: string
  interpretation: string
  combinedInterpretations: { house: number; text: string }[] | null
  celebrities: Celebrity[]
  relatedLinks: { href: string; label: string }[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { combo: string } }[] = []

  // Planet-in-sign: sun-in-aries, moon-in-taurus, etc.
  for (const planet of PLANET_ORDER) {
    for (const sign of SIGN_NAMES) {
      paths.push({ params: { combo: `${planet}-in-${sign}` } })
    }
  }

  // Planet-in-house: sun-in-house-1, moon-in-house-2, etc.
  for (const planet of PLANET_ORDER) {
    for (let h = 1; h <= 12; h++) {
      paths.push({ params: { combo: `${planet}-in-house-${h}` } })
    }
  }

  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const combo = params?.combo as string

  // Parse: "sun-in-aries" or "sun-in-house-3"
  const houseMatch = combo.match(/^(.+?)-in-house-(\d+)$/)
  const signMatch = combo.match(/^(.+?)-in-(.+)$/)

  if (houseMatch) {
    // Planet in house
    const planetSlug = houseMatch[1]
    const house = parseInt(houseMatch[2])
    const planetKey = PLANET_KEYS[planetSlug]
    if (!planetKey || house < 1 || house > 12) return { notFound: true }

    const pName = planetLabel(planetKey)
    const houseInfo = HOUSES[house]
    const interpretation = await dbGetPlanetInHouse(planetKey, house)
    const ordinal = house === 1 ? '1st' : house === 2 ? '2nd' : house === 3 ? '3rd' : `${house}th`

    const celebrities = await getCelebritiesWithPlacement(planetKey, { house })

    const relatedLinks: { href: string; label: string }[] = []
    // Other planets in this house
    for (const p of PLANET_ORDER) {
      if (p === planetSlug) continue
      const pk = PLANET_KEYS[p]
      if (PLANET_IN_HOUSE[`${pk}_H${house}`]) {
        relatedLinks.push({ href: `/interpretations/${p}-in-house-${house}`, label: `${planetLabel(pk)} in the ${ordinal} House` })
      }
    }
    // This planet in other houses
    for (let h = 1; h <= 12; h++) {
      if (h === house) continue
      const o = h === 1 ? '1st' : h === 2 ? '2nd' : h === 3 ? '3rd' : `${h}th`
      relatedLinks.push({ href: `/interpretations/${planetSlug}-in-house-${h}`, label: `${pName} in the ${o} House` })
    }

    return {
      props: {
        type: 'house',
        planetSlug,
        planetKey,
        planetName: pName,
        signOrHouse: `${ordinal} House`,
        title: `${pName} in the ${ordinal} House — Birth Chart Interpretation`,
        metaDescription: `What does ${pName} in the ${ordinal} house mean? ${houseInfo?.keywords?.slice(0, 3).join(', ') || ''} — explore this placement's meaning in your natal chart.`,
        interpretation,
        combinedInterpretations: null,
        celebrities,
        relatedLinks: relatedLinks.slice(0, 12),
      },
    }
  }

  if (signMatch && !houseMatch) {
    // Planet in sign
    const planetSlug = signMatch[1]
    const signSlug = signMatch[2]
    const planetKey = PLANET_KEYS[planetSlug]
    const signName = capitalize(signSlug)
    if (!planetKey || !SIGN_NAMES.includes(signSlug)) return { notFound: true }

    const pName = planetLabel(planetKey)
    const interpretation = await dbGetPlanetInSign(planetKey, signName)

    // Combined interpretations (planet in sign through each house)
    const combinedResults = await Promise.all(
      Array.from({ length: 12 }, (_, i) => dbGetCombinedInterpretation(planetKey, signName, i + 1))
    )
    const combinedInterpretations = combinedResults
      .map((text, i) => ({ house: i + 1, text }))
      .filter(c => c.text)

    // People whose own chart has this placement (read from chart_data).
    const celebrities = await getCelebritiesWithPlacement(planetKey, { sign: signName })

    const relatedLinks: { href: string; label: string }[] = []
    // Other planets in this sign
    for (const p of PLANET_ORDER) {
      if (p === planetSlug) continue
      const pk = PLANET_KEYS[p]
      if (PLANET_IN_SIGN[`${pk}_${signName}`]) {
        relatedLinks.push({ href: `/interpretations/${p}-in-${signSlug}`, label: `${planetLabel(pk)} in ${signName}` })
      }
    }
    // This planet in other signs
    for (const s of SIGN_NAMES) {
      if (s === signSlug) continue
      relatedLinks.push({ href: `/interpretations/${planetSlug}-in-${s}`, label: `${pName} in ${capitalize(s)}` })
    }

    return {
      props: JSON.parse(JSON.stringify({
        type: 'sign',
        planetSlug,
        planetKey,
        planetName: pName,
        signOrHouse: signName,
        title: `${pName} in ${signName} — Birth Chart Interpretation`,
        metaDescription: `What does ${pName} in ${signName} mean in your birth chart? Explore this placement's traits, strengths, challenges, and how it plays out in each house.`,
        interpretation,
        combinedInterpretations,
        celebrities,
        relatedLinks: relatedLinks.slice(0, 12),
      })),
      revalidate: 604800,
    }
  }

  return { notFound: true }
}

export default function InterpretationPage({ type, planetSlug, planetKey, planetName, signOrHouse, title, metaDescription, interpretation, combinedInterpretations, celebrities, relatedLinks }: Props) {
  const isSign = type === 'sign'
  const canonicalPath = `/interpretations/${planetSlug}-in-${isSign ? signOrHouse.toLowerCase() : `house-${signOrHouse.split(' ')[0].replace(/[a-z]/g, '')}`}`

  const paragraphs = interpretation
    ? interpretation.replace(/\r\n/g, '\n').split('\n\n').filter(p => p.trim())
    : []
  const faqItems: { question: string; answer: string }[] = []
  if (paragraphs.length > 0) {
    faqItems.push({
      question: isSign
        ? `What does ${planetName} in ${signOrHouse} mean in astrology?`
        : `What does ${planetName} in the ${signOrHouse} mean in a birth chart?`,
      answer: paragraphs[0].trim().slice(0, 450),
    })
  }
  if (paragraphs.length > 1) {
    faqItems.push({
      question: isSign
        ? `How does ${planetName} in ${signOrHouse} affect personality?`
        : `How does ${planetName} in the ${signOrHouse} influence someone's life?`,
      answer: paragraphs[1].trim().slice(0, 450),
    })
  }

  return (
    <>
      <Head>
        <title>{`${title} | Birth Chart Library`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" key="canonical" href={`https://birthchartlibrary.com${canonicalPath}`} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Interpretations', url: 'https://birthchartlibrary.com/astrology-interpretations' },
        { name: title, url: `https://birthchartlibrary.com${canonicalPath}` },
      ])) }} />
      {faqItems.length >= 2 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqItems)) }} />
      )}

      {/* Hero band */}
      <section className="bg-[var(--band)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-9">
          <AdminBreadcrumb className="mb-5 !text-sm" crumbs={[
            { label: 'Interpretations', href: '/astrology-interpretations' },
            { label: `${planetName} in ${signOrHouse}` },
          ]} />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
            <ComboBadge planetKey={planetKey} sign={isSign ? signOrHouse : null} />
            <div className="flex-[1_1_420px] min-w-0">
              <h1 className="text-[clamp(2.4rem,6vw,4rem)] leading-[1.04] mb-3">{planetName} in {isSign ? signOrHouse : `the ${signOrHouse}`}</h1>
              <div className="flex flex-wrap gap-2">
                <Link href={`/astrology-planets/${planetSlug === 'north-node' ? 'north_node' : planetSlug}`} className={CHIP}>About {planetName}</Link>
                {isSign ? (
                  <Link href={`/zodiac-signs/${signOrHouse.toLowerCase()}`} className={CHIP}>About {signOrHouse}</Link>
                ) : (
                  <Link href={`/astrology-houses/${signOrHouse.split(' ')[0].replace(/[a-z]/g, '')}`} className={CHIP}>About the {signOrHouse}</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Scallop id="hero-scallops" top="var(--band)" className="bg-[var(--background)]" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="flex flex-wrap gap-x-14 gap-y-12">
          {/* Reading column */}
          <article className={`flex-[1_1_520px] min-w-0 max-w-[42em] ${INK}`}>
            {paragraphs.length > 0 && (
              <div className="flex flex-col gap-4 mb-12">
                {paragraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? 'text-[20px] sm:text-[21px] leading-[1.55]' : 'text-[17px] leading-relaxed'}>{p.trim()}</p>
                ))}
              </div>
            )}

            {combinedInterpretations && combinedInterpretations.length > 0 && (
              <section>
                <h2 className={H2}>{planetName} in {signOrHouse} through the houses</h2>
                <div className={`border-t-2 ${RULE}`}>
                  {combinedInterpretations.map(ci => (
                    <details key={ci.house} className={`group border-b-2 ${RULE}`}>
                      <summary className="cursor-pointer list-none flex items-center justify-between gap-4 min-h-12 py-2 font-black text-[18px]">
                        <span>{planetName} in {signOrHouse}, {ordinalOf(ci.house)} house</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true" className="shrink-0 group-open:rotate-180 transition-transform">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </summary>
                      <div className="flex flex-col gap-3 pb-5">
                        {ci.text.replace(/\r\n/g, '\n').split('\n\n').filter(p => p.trim()).map((p, i) => (
                          <p key={i} className="text-[16px] leading-relaxed">{p.trim()}</p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Side column */}
          <aside className="flex-[1_1_280px] min-w-0 flex flex-col gap-10">
            {celebrities.length > 0 && (
              <section>
                <h2 className={ASIDE_H}>Famous people with {planetName} in {isSign ? signOrHouse : `the ${signOrHouse.toLowerCase()}`}</h2>
                <ul className="flex flex-col gap-4">
                  {celebrities.map(c => (
                    <li key={c.slug}>
                      <Link href={`/celebrity-birth-charts/${c.slug}`} className={`flex items-center gap-4 pl-1.5 ${INK} group`}>
                        <CelebFace slug={c.slug} sign={c.sun_sign} hasImage={!!c.image_url} size={52} />
                        <span className="min-w-0 leading-snug">
                          <span className="block font-black group-hover:underline">{cleanCelebName(c.name)}</span>
                          {c.sun_sign && <span className={`block text-sm ${MUTED}`}>{c.sun_sign} Sun</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {relatedLinks.length > 0 && (
              <section>
                <h2 className={ASIDE_H}>Related interpretations</h2>
                <ul className={`border-t ${RULE}`}>
                  {relatedLinks.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className={`flex items-center min-h-10 border-b ${RULE} ${INK} hover:underline`}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl bg-[var(--band)] px-[22px] py-5">
              <h2 className={ASIDE_H}>Go deeper</h2>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="/birth-chart?ref=interp-aside" className={ACCENT_LINK}>See where {planetName} falls in your chart →</Link></li>
                <li><Link href="/astrology-interpretations" className={ACCENT_LINK}>Interpretation library →</Link></li>
                <li><Link href="/reading-room" className={ACCENT_LINK}>Curated astrology books →</Link></li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </>
  )
}
