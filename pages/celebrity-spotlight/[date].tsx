import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { parseJsonb } from '@/lib/db'
import { getListableCelebrities } from '@/lib/celebrities'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { generateCelebrityBio } from '@/lib/interpretations/biography'
import { getCombinedInterpretation, getPlanetInfo } from '@/lib/interpretations'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { NOINDEX_THIN } from '@/lib/thin-pages'

interface PlanetData {
  planet: string
  sign: string
  signDegree: number
  house: number
  retrograde: boolean
  // Resolved in getStaticProps so the interpretation library stays out of the client bundle
  name: string
  symbol: string
  interp: string
}

interface Props {
  date: string
  dateStr: string
  celeb: {
    name: string
    slug: string
    birth_date: string
    birth_city: string
    category: string | null
    image_url: string | null
  } | null
  bio: string
  planets: PlanetData[]
  ascendantSign: string | null
  prevDate: string
  nextDate: string
  isFuture: boolean
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const date = context.params?.date as string
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return { notFound: true }
  }

  const month = parseInt(match[2])
  const day = parseInt(match[3])
  const year = parseInt(match[1])
  try {

  const withPhotos = await getListableCelebrities<{ name: string; slug: string; birth_date: string; birth_city: string; category: string | null; image_url: string | null; chart_data: unknown }>({
    columns: 'name, slug, birth_date, birth_city, category, image_url, chart_data',
    where: 'EXTRACT(MONTH FROM birth_date) = $1 AND EXTRACT(DAY FROM birth_date) = $2',
    params: [month, day],
    orderBy: 'name',
    limit: 10,
  })

  const celeb = withPhotos.length > 0
    ? withPhotos[year % withPhotos.length]
    : null

  const chartData = celeb ? (parseJsonb<BirthChartData | null>(celeb.chart_data)) : null
  const bio = chartData && celeb ? generateCelebrityBio(celeb.name, chartData) : ''
  const planets: PlanetData[] = (chartData?.planets ?? []).map(p => {
    const info = getPlanetInfo(p.planet)
    return {
      planet: p.planet,
      sign: p.sign,
      signDegree: p.signDegree,
      house: p.house,
      retrograde: p.retrograde,
      name: info?.name ?? '',
      symbol: info?.symbol ?? '',
      interp: getCombinedInterpretation(p.planet, p.sign, p.house),
    }
  })
  const ascendantSign = chartData?.ascendantSign ?? null

  const d = new Date(Date.UTC(year, month - 1, day))
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  const prevD = new Date(d); prevD.setUTCDate(prevD.getUTCDate() - 1)
  const nextD = new Date(d); nextD.setUTCDate(nextD.getUTCDate() + 1)
  const prevDate = `${prevD.getUTCFullYear()}-${String(prevD.getUTCMonth() + 1).padStart(2, '0')}-${String(prevD.getUTCDate()).padStart(2, '0')}`
  const nextDate = `${nextD.getUTCFullYear()}-${String(nextD.getUTCMonth() + 1).padStart(2, '0')}-${String(nextD.getUTCDate()).padStart(2, '0')}`
  const isFuture = d > new Date()

  return {
    props: {
      date,
      dateStr,
      celeb: celeb ? {
        name: celeb.name,
        slug: celeb.slug,
        birth_date: celeb.birth_date,
        birth_city: celeb.birth_city,
        category: celeb.category,
        image_url: celeb.image_url,
      } : null,
      bio,
      planets,
      ascendantSign,
      prevDate,
      nextDate,
      isFuture,
    },
    revalidate: 604800,
  }
  } catch (err) {
    console.error('[celebrity-spotlight/date] getStaticProps error:', err)
    return { notFound: true }
  }
}

export default function SpotlightArchivePage({ date, dateStr, celeb, bio, planets, ascendantSign, prevDate, nextDate, isFuture }: Props) {
  if (!celeb) {
    return (
      <>
        <Head>
          <title>Celebrity Spotlight | Birth Chart Library</title>
          <meta name="description" content="Celebrity spotlight archive." />
          <meta name="robots" content="noindex" />
        </Head>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <AdminBreadcrumb crumbs={[
            { label: 'Celebrity Charts', href: '/celebrity-birth-charts' },
            { label: 'Spotlight' },
          ]} />
          <div className="card text-center py-10">
            <p className="text-slate-500">No celebrity spotlight for this date.</p>
          </div>
        </main>
      </>
    )
  }

  const sun = planets.find(p => p.planet === 'SUN')
  const moon = planets.find(p => p.planet === 'MOON')
  const rising = ascendantSign

  return (
    <>
      <Head>
        <title>{`Celebrity Spotlight — ${dateStr}`}</title>
        <meta name="description" content={`Today's celebrity spotlight for ${dateStr}. Birthday birth chart analysis with full planetary positions and interpretations.`} />
        {NOINDEX_THIN.celebritySpotlight && <meta name="robots" content="noindex,follow" />}
        <link rel="canonical" href={`https://birthchartlibrary.com/celebrity-spotlight/${date}`} />
        <meta property="og:title" content={`Celebrity Spotlight — ${dateStr}`} />
        <meta property="og:description" content={`Today's celebrity spotlight for ${dateStr}. Birthday birth chart analysis with full planetary positions and interpretations.`} />
        <meta property="og:url" content={`https://birthchartlibrary.com/celebrity-spotlight/${date}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Celebrity Spotlight — ${dateStr}`} />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/celebrity-birth-charts" className="hover:text-slate-800 transition-colors">Celebrity Charts</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800">Spotlight — {dateStr}</span>
        </nav>

        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Celebrity Spotlight — {dateStr}</p>

        {/* Header with photo */}
        <div className="flex items-start gap-5 mb-6">
          {celeb.image_url && (
            <div className="shrink-0">
              <Image src={`/api/img/${celeb.slug}`} alt={celeb.name} width={144} height={144} className="w-28 h-28 md:w-36 md:h-36 rounded-xl object-cover border border-slate-200" sizes="(max-width: 768px) 112px, 144px" />
              <p className="text-[9px] text-slate-400 mt-1 text-center"><Link href="/photo-credits" className="hover:underline">Photo credit</Link></p>
            </div>
          )}
          <div>
            <Link href={`/celebrity-birth-charts/${celeb.slug}`} className="group">
              <h1 className="font-display text-3xl sm:text-4xl tracking-wide group-hover:text-slate-600 transition-colors">{celeb.name}</h1>
            </Link>
            <p className="text-slate-500 text-sm mt-1">
              Born {celeb.birth_date} · {celeb.birth_city}
              {celeb.category && <span className="text-slate-400"> · {celeb.category}</span>}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {sun && (() => { const ec = getElementColor(sun.sign); return (
                <span className={`text-sm px-3 py-1 rounded-full ${ec.bg} ${ec.text}`}>☉ {sun.sign} Sun</span>
              )})()}
              {moon && (() => { const ec = getElementColor(moon.sign); return (
                <span className={`text-sm px-3 py-1 rounded-full ${ec.bg} ${ec.text}`}>☽ {moon.sign} Moon</span>
              )})()}
              {rising && (() => { const ec = getElementColor(rising); return (
                <span className={`text-sm px-3 py-1 rounded-full ${ec.bg} ${ec.text}`}>↑ {rising} Rising</span>
              )})()}
            </div>
          </div>
        </div>

        {/* Biography */}
        {bio && (
          <div className="mb-8 space-y-3">
            {bio.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-slate-600 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        )}

        {planets.length > 0 && (
          <>
            {/* All planet positions */}
            <div className="mb-8">
              <h2 className="font-display text-2xl tracking-wide mb-4">Planetary Positions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {planets.map(p => {
                  const ec = getElementColor(p.sign)
                  return (
                    <div key={p.planet} className={`card py-3 border-l-4 ${ec.border}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-lg ${ec.text}`}>{p.symbol || '•'}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">{p.name || p.planet.replace('_', ' ')}</span>
                      </div>
                      <p className={`font-medium ${ec.text}`}><SignGlyph sign={p.sign} decorative /> {p.sign}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{Math.floor(p.signDegree)}° · House {p.house}{p.retrograde ? <span className="text-amber-500 ml-1">℞</span> : ''}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Full interpretations */}
            <div className="mb-8">
              <h2 className="font-display text-2xl tracking-wide mb-4">Chart Interpretations</h2>
              <div className="space-y-4">
                {planets.map(p => {
                  const ec = getElementColor(p.sign)
                  if (!p.interp) return null
                  return (
                    <div key={p.planet} className={`card border-l-4 ${ec.border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${ec.text}`}>{p.symbol}</span>
                        <h3 className="font-medium">{p.name || p.planet} in {p.sign} in House {p.house}</h3>
                        {p.retrograde && <span className="text-amber-500 text-xs">℞</span>}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{p.interp}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        <Link href={`/celebrity-birth-charts/${celeb.slug}`} className="text-slate-500 text-sm hover:text-slate-800 transition-colors">
          View {celeb.name}&apos;s full chart page →
        </Link>

        {/* Prev / Next */}
        <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
          <Link href={`/celebrity-spotlight/${prevDate}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            ← Previous day
          </Link>
          {!isFuture && (
            <Link href={`/celebrity-spotlight/${nextDate}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              Next day →
            </Link>
          )}
        </div>
      </main>
    </>
  )
}
