import type { HouseOverlay } from '@/lib/swisseph/overlays'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { readFileSync } from 'fs'
import path from 'path'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { query } from '@/lib/db'
import { isServedCelebrity } from '@/lib/celebrities'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { computeSynastryAspects } from '@/lib/swisseph/synastry'
import { computeHouseOverlays } from '@/lib/swisseph/overlays'
import { scoreSynastry, POINT_NAME, type SynastryScoreV2, type SynTier } from '@/lib/swisseph/synastry-score'
import SynastryScoreCard from '@/components/SynastryScoreCard'
import SynastryText from '@/components/SynastryText'
import type { SynastryAspect } from '@/lib/swisseph/synastry'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'
import { SignGlyph } from '@/components/Glyph'
import { COUPLE_ARTICLES } from '@/lib/couple-articles'
import { redesignOn } from '@/lib/redesign'
import SynastryView, { type SynSide } from '@/components/redesign/SynastryView'
import { NextLinks } from '@/components/redesign/Learn'
import { Face } from '@/components/redesign/HomePage'
import { ToolDoors } from '@/components/redesign/ChartTool'

interface CelebData {
  name: string
  slug: string
  image_url: string | null
  bio: string | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
  birth_date: string
  birth_city: string
  category: string | null
}

interface Props {
  personA: CelebData
  personB: CelebData
  aspects: SynastryAspect[]
  overlays?: HouseOverlay[]
  score: SynastryScoreV2 | null
  missingChart?: string
  loveSlug?: string
  loveTitle?: string
  more: MoreCouple[]
}

interface MoreCouple { pair: string; nameA: string; nameB: string; tier: SynTier }

const TIER_COLOR: Record<SynTier, string> = {
  S: 'text-emerald-600 dark:text-emerald-400', A: 'text-emerald-500 dark:text-emerald-300',
  B: 'text-sky-600 dark:text-sky-400', C: 'text-amber-600 dark:text-amber-400', D: 'text-rose-500 dark:text-rose-400',
}


function BigThree({ sun, moon, rising }: { sun: string | null; moon: string | null; rising: string | null }) {
  return (
    <div className="flex flex-wrap justify-center content-start gap-1.5 sm:gap-2 mt-3">
      {sun && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 sm:px-3 py-1">
          <SignGlyph sign={sun} decorative />
          <span className="text-slate-500 dark:text-slate-400">{sun} Sun</span>
        </span>
      )}
      {moon && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 sm:px-3 py-1">
          <SignGlyph sign={moon} decorative />
          <span className="text-slate-500 dark:text-slate-400">{moon} Moon</span>
        </span>
      )}
      {rising && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 sm:px-3 py-1">
          <SignGlyph sign={rising} decorative />
          <span className="text-slate-500 dark:text-slate-400">{rising} Rising</span>
        </span>
      )}
    </div>
  )
}

export default function CelebCompare({ personA, personB, aspects, overlays, score, missingChart, loveSlug, loveTitle, more }: Props) {
  const title = `${personA.name} & ${personB.name} — Birth Chart Comparison`
  const description = `How do ${personA.name} and ${personB.name} compare astrologically? ${personA.name} is a ${personA.sun_sign} Sun with ${personA.rising_sign} Rising. ${personB.name} is a ${personB.sun_sign} Sun with ${personB.rising_sign} Rising. ${score ? `Synastry: ${score.label}.` : ''}`
  const ogImage = `https://birthchartlibrary.com/api/og/compare?nameA=${encodeURIComponent(personA.name)}&sunA=${encodeURIComponent(personA.sun_sign || '')}&moonA=${encodeURIComponent(personA.moon_sign || '')}&risingA=${encodeURIComponent(personA.rising_sign || '')}&nameB=${encodeURIComponent(personB.name)}&sunB=${encodeURIComponent(personB.sun_sign || '')}&moonB=${encodeURIComponent(personB.moon_sign || '')}&risingB=${encodeURIComponent(personB.rising_sign || '')}${score ? `&score=${encodeURIComponent(score.label)}&pct=${score.score}` : ''}`
  const canonicalUrl = `https://birthchartlibrary.com/celebrity-birth-charts/compare/${personA.slug}-vs-${personB.slug}`

  const topAspects = aspects.slice(0, 8)

  const head = (
      <Head>
        <title>{`${title} | Birth Chart Library`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Celebrity Birth Charts', url: 'https://birthchartlibrary.com/celebrity-birth-charts' },
          { name: `${personA.name} vs ${personB.name}`, url: canonicalUrl },
        ])) }} />
      </Head>
  )

  if (redesignOn('compare')) {
    const side = (p: CelebData): SynSide => ({ name: p.name, slug: p.slug, sun: p.sun_sign, moon: p.moon_sign, rising: p.rising_sign, city: p.birth_city })
    const split = (k: string) => { const i = k.lastIndexOf('-vs-'); return [k.slice(0, i), k.slice(i + 4)] }
    return (
      <>
        {head}
        <main className="rdp"><div className="lrn">
          <SynastryView
            a={side(personA)} b={side(personB)}
            score={missingChart ? null : score}
            aspects={missingChart ? [] : topAspects}
            overlays={missingChart ? [] : overlays ?? []}
            total={aspects.length}
            crumbs={[{ label: 'Famous couples', href: '/love/celebrity-couples' }, { label: 'Chart comparison' }]}
            kicker="Chart comparison"
            lead={missingChart ? <p>There is no full birth chart for {missingChart} yet, so the two charts cannot be compared. Check back soon.</p> : undefined}
          >
            {loveSlug && loveTitle && !missingChart ? (
              <NextLinks id="story" title="The full story" links={[{ href: `/love/${loveSlug}`, title: `${loveTitle}: their charts in depth`, sub: 'History, context and what their charts say about them' }]} />
            ) : null}
          </SynastryView>
          {more.length ? (
            <section className="lsec" id="more">
              <div className="bandhead"><h2>More famous couples</h2><Link className="more" href="/love/celebrity-couples">All famous couples</Link></div>
              <ul className="rank cpl">
                {more.map(c => {
                  const [sa, sb] = split(c.pair)
                  return (
                    <li key={c.pair}>
                      <Link href={`/celebrity-birth-charts/compare/${c.pair}`}>
                        <span className="cfaces" aria-hidden="true"><Face name={c.nameA} slug={sa} size={44} /><Face name={c.nameB} slug={sb} size={44} /></span>
                        <span className="rt"><b>{c.nameA} and {c.nameB}</b><small>Compare their charts</small></span>
                        <span className={`mt t-${c.tier}`}><b>{c.tier}</b><small>match</small></span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}
          <ToolDoors title="Compare your own" only={['/calculators/synastry']} />
        </div></main>
      </>
    )
  }

  return (
    <>
      {head}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/celebrity-birth-charts" className="hover:text-slate-600 dark:hover:text-slate-300">Celebrity charts</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Chart comparison</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-slate-800 dark:text-slate-100 mb-3">
            {personA.name} <span className="text-slate-300 dark:text-slate-600">&</span> {personB.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {score ? `Synastry ${score.tier} tier: smoother than ${score.ease}% of pairs of charts` : 'Birth chart comparison'}
          </p>
        </div>

        {/* Two-up celeb cards. Each card is a subgrid over the same five rows
            (photo, name, birthplace, Big Three, link), so a birthplace or pill
            row that wraps on a phone keeps both cards lined up. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-0 mb-10">
          {[personA, personB].map(person => (
            <div key={person.slug} className="card grid grid-rows-subgrid row-span-5 justify-items-center content-start text-center">
              <div>
              {person.image_url && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-slate-200 dark:ring-slate-700">
                  {/* Our S3 copy via /api/img, like every other celebrity photo: Wikimedia
                      rate limits (429) the image optimizer's hotlinked fetches. */}
                  <Image src={`/api/img/${person.slug}`} alt={person.name} fill className="object-cover" sizes="80px" unoptimized />

                </div>
              )}
              </div>
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-tight">{person.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{person.birth_city}</p>
              <BigThree sun={person.sun_sign} moon={person.moon_sign} rising={person.rising_sign} />
              <Link href={`/celebrity-birth-charts/${person.slug}`} className="self-start mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2">
                Full chart →
              </Link>
            </div>
          ))}
        </div>

        {/* Missing chart notice */}
        {missingChart && (
          <div className="card mb-10 border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              We don&apos;t have a full birth chart for {missingChart} yet — synastry analysis isn&apos;t available. Check back soon, or{' '}
              <Link href="/celebrity-birth-charts" className="underline underline-offset-2">explore other celebrity charts</Link>.
            </p>
          </div>
        )}

        {/* Compatibility score */}
        {!missingChart && score && <div className="card mb-10">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Synastry</h2>
          <SynastryScoreCard score={score} nameA={personA.name} nameB={personB.name} />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            Ease and Spark compare this pair with thousands of real pairs of charts. {aspects.length > topAspects.length
              ? `They share ${aspects.length} aspects between the planets Sun through Saturn; the ${topAspects.length} strongest are below.`
              : `The ${aspects.length} aspects below are the ones between the planets Sun through Saturn.`}
          </p>
        </div>}

        {/* Key aspects */}
        {topAspects.length > 0 && (
          <div className="card mb-10">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-5">Key aspects</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topAspects.map((a, i) => {
                const harmonic = a.isHarmonic
                return (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {personA.name.split(' ')[0]}&apos;s {POINT_NAME[a.planet1]} {a.aspectType} {personB.name.split(' ')[0]}&apos;s {POINT_NAME[a.planet2]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${harmonic ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {a.orb}° orb
                      </span>
                    </div>
                    <SynastryText text={a.interpretation} className="text-slate-500 dark:text-slate-400" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Love article: the next step after the aspects */}
        {loveSlug && loveTitle && !missingChart && (
          <Link
            href={`/love/${loveSlug}`}
            className="flex items-center justify-between gap-4 card mb-10 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">The full story</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{loveTitle}: their charts in depth</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">History, context and what their charts say about them</p>
            </div>
            <span className="text-slate-400 flex-shrink-0 text-lg">→</span>
          </Link>
        )}

        {/* More couples: keep reading */}
        {more.length > 0 && (
          <section className="mb-10">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">More famous couples</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {more.map(c => (
                <Link key={c.pair} href={`/celebrity-birth-charts/compare/${c.pair}`} className="card flex items-center justify-between gap-3 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.nameA} &amp; {c.nameB}</span>
                  <span className={`font-display text-2xl leading-none ${TIER_COLOR[c.tier]}`} aria-label={`${c.tier} tier`}>{c.tier}</span>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-sm">
              <Link href="/love/celebrity-couples" className="text-slate-500 dark:text-slate-400 underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300">All famous couples →</Link>
            </p>
          </section>
        )}

        <div className="text-center">
          <Link href="/calculators/synastry" className="btn-outline text-sm">Compare your chart with someone →</Link>
        </div>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-generate featured celebrity couples
  const csvPath = path.join(process.cwd(), 'data', 'celebrity-couples.csv')
  const lines = readFileSync(csvPath, 'utf8').trim().split('\n').slice(1)

  const slugify = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const paths: string[] = []
  for (const line of lines) {
    const [name1, , name2] = line.split(',')
    if (name1 && name2) paths.push(`${slugify(name1.trim())}-vs-${slugify(name2.trim())}`)
  }

  return {
    paths: paths.map(pair => ({ params: { pair } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const pair = params?.pair as string
  const vsIndex = pair.lastIndexOf('-vs-')
  if (vsIndex === -1) return { notFound: true }

  const slug1 = pair.slice(0, vsIndex)
  const slug2 = pair.slice(vsIndex + 4)

  const [rows1, rows2] = await Promise.all([
    query<CelebData & { chart_data: unknown; bio_source: string | null; timed: boolean }>(
      `SELECT name, slug, image_url, bio, sun_sign, moon_sign, rising_sign,
              to_char(birth_date, 'YYYY-MM-DD') AS birth_date, birth_city, category, chart_data, bio_source,
              (birth_time IS NOT NULL AND metadata->>'rodden_rating' IN ('AA','A','B')) AS timed
       FROM celebrities WHERE slug = $1 LIMIT 1`,
      [slug1]
    ),
    query<CelebData & { chart_data: unknown; bio_source: string | null; timed: boolean }>(
      `SELECT name, slug, image_url, bio, sun_sign, moon_sign, rising_sign,
              to_char(birth_date, 'YYYY-MM-DD') AS birth_date, birth_city, category, chart_data, bio_source,
              (birth_time IS NOT NULL AND metadata->>'rodden_rating' IN ('AA','A','B')) AS timed
       FROM celebrities WHERE slug = $1 LIMIT 1`,
      [slug2]
    ),
  ])

  const rawA = rows1[0]
  const rawB = rows2[0]
  if (!rawA || !rawB) return { notFound: true }
  // Both people need a public page (docs/TEMPLATE-CELEB-REMOVAL-PLAN.md); a compare
  // page of template-bio celebrities is the same thin content we removed.
  if (!isServedCelebrity(rawA) || !isServedCelebrity(rawB)) return { notFound: true, revalidate: 86400 }

  const chartA = (typeof rawA.chart_data === 'string' ? JSON.parse(rawA.chart_data) : rawA.chart_data) as BirthChartData | null
  const chartB = (typeof rawB.chart_data === 'string' ? JSON.parse(rawB.chart_data) : rawB.chart_data) as BirthChartData | null

  const clean = (r: typeof rawA): CelebData => ({
    name: r.name, slug: r.slug, image_url: r.image_url, bio: r.bio,
    sun_sign: r.sun_sign, moon_sign: r.moon_sign, rising_sign: r.rising_sign,
    birth_date: r.birth_date, birth_city: r.birth_city, category: r.category,
  })

  if (!chartA || !chartB) {
    const missing = !chartA ? rawA.name : rawB.name
    return {
      props: { personA: clean(rawA), personB: clean(rawB), aspects: [], score: null, missingChart: missing, more: await moreCouples(pair) },
      revalidate: 86400,
    }
  }

  const aspects = computeSynastryAspects(chartA, chartB, 'romantic')
  const score   = scoreSynastry(chartA, chartB, { timeKnownA: !!rawA.timed, timeKnownB: !!rawB.timed })
  const overlays = computeHouseOverlays(chartA, chartB, { timeKnownA: !!rawA.timed, timeKnownB: !!rawB.timed })

  const article = COUPLE_ARTICLES[pair]
  const more = await moreCouples(pair)

  return {
    props: {
      personA: clean(rawA), personB: clean(rawB), aspects, score, overlays,
      ...(article ? { loveSlug: article.slug, loveTitle: article.title } : {}),
      more,
    },
    revalidate: 604800,
  }
}

// Four other famous couples after this one in COUPLE_ARTICLES (wrapping), each
// with its synastry tier. Only couples whose two pages are public.
async function moreCouples(pair: string): Promise<MoreCouple[]> {
  const keys = Object.keys(COUPLE_ARTICLES)
  const at = keys.indexOf(pair)
  const picks = Array.from({ length: keys.length - 1 }, (_, k) => keys[(Math.max(at, 0) + 1 + k) % keys.length])
    .filter(k => k !== pair).slice(0, 8)
  const split = (k: string) => { const i = k.lastIndexOf('-vs-'); return [k.slice(0, i), k.slice(i + 4)] }
  const rows = await query<{ name: string; slug: string; chart_data: unknown; bio_source: string | null; timed: boolean }>(
    `SELECT name, slug, chart_data, bio_source,
            (birth_time IS NOT NULL AND metadata->>'rodden_rating' IN ('AA','A','B')) AS timed
     FROM celebrities WHERE slug = ANY($1)`, [picks.flatMap(split)])
  const by = new Map(rows.map(r => [r.slug, r]))
  const out: MoreCouple[] = []
  for (const k of picks) {
    const [a, b] = split(k).map(x => by.get(x))
    if (!a || !b || !isServedCelebrity(a) || !isServedCelebrity(b)) continue
    const ca = (typeof a.chart_data === 'string' ? JSON.parse(a.chart_data) : a.chart_data) as BirthChartData
    const cb = (typeof b.chart_data === 'string' ? JSON.parse(b.chart_data) : b.chart_data) as BirthChartData
    out.push({ pair: k, nameA: a.name, nameB: b.name, tier: scoreSynastry(ca, cb, { timeKnownA: !!a.timed, timeKnownB: !!b.timed }).tier })
    if (out.length === 4) break
  }
  return out
}
