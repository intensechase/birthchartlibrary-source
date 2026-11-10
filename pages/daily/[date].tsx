import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getListableCelebrities } from '@/lib/celebrities'
import { getDailySky, type DailySky } from '@/lib/swisseph/daily-sky'
import { MOON_REFLECTIONS, MOON_WEATHER, RETROGRADE_DESCRIPTIONS, SUN_SEASON } from '@/lib/interpretations/daily'
import { getElementColor, SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { NOINDEX_THIN } from '@/lib/thin-pages'

interface CelebData {
  name: string
  slug: string
  birth_date: string
  birth_city: string
  category: string | null
  sun_sign: string | null
}

interface Props {
  date: string
  dateStr: string
  sky: DailySky
  celeb: CelebData | null
  prevDate: string
  nextDate: string
  isToday: boolean
  isFuture: boolean
}

function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const day = parseInt(match[3], 10)
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  if (year < 1900 || year > 2100) return null
  return { year, month, day }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const date = context.params?.date as string
  const parsed = parseDate(date)
  if (!parsed) return { notFound: true }

  const { year, month, day } = parsed
  try {

  // Get sky data
  const sky = await getDailySky(date)

  // Celebrity of the day
  const [celebRow] = await getListableCelebrities<{ name: string; slug: string; birth_date: string; birth_city: string; category: string | null; sun_sign: string | null }>({
    columns: 'name, slug, birth_date, birth_city, category, sun_sign',
    where: 'EXTRACT(MONTH FROM birth_date) = $1 AND EXTRACT(DAY FROM birth_date) = $2',
    params: [month, day],
    orderBy: 'name',
    limit: 1,
    requireImage: false,
  })

  const d = new Date(Date.UTC(year, month - 1, day))
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  // Prev/next dates
  const prevD = new Date(Date.UTC(year, month - 1, day - 1))
  const nextD = new Date(Date.UTC(year, month - 1, day + 1))
  const today = new Date()
  const isToday = year === today.getUTCFullYear() && month === today.getUTCMonth() + 1 && day === today.getUTCDate()
  const isFuture = d > today
  const prevDate = `${prevD.getUTCFullYear()}-${String(prevD.getUTCMonth() + 1).padStart(2, '0')}-${String(prevD.getUTCDate()).padStart(2, '0')}`
  const nextDate = `${nextD.getUTCFullYear()}-${String(nextD.getUTCMonth() + 1).padStart(2, '0')}-${String(nextD.getUTCDate()).padStart(2, '0')}`

  // Ensure celeb data is serializable (no undefined values)
  const celeb = celebRow ? {
    name: celebRow.name,
    slug: celebRow.slug,
    birth_date: celebRow.birth_date,
    birth_city: celebRow.birth_city,
    category: celebRow.category ?? null,
    sun_sign: celebRow.sun_sign ?? null,
  } : null

  return {
    props: { date, dateStr, sky, celeb, prevDate, nextDate, isToday, isFuture },
    revalidate: 604800,
  }
  } catch (err) {
    console.error('[daily/date] getStaticProps error:', err)
    return { notFound: true }
  }
}

export default function DailyArchivePage({ date, dateStr, sky, celeb, prevDate, nextDate, isToday, isFuture }: Props) {
  const moonSign = sky.moonSign
  const sunSign = sky.sunSign
  const retrogrades = sky.retrogrades
  const chart = { planets: sky.planets }

  const moonEc = getElementColor(moonSign)
  const sunEc = getElementColor(sunSign)
  const celebSunSign = celeb?.sun_sign

  const metaTitle = `${dateStr} — Daily Astrology Snapshot`
  const metaDesc = `Astrology for ${dateStr}: Moon sign, planetary positions, retrogrades, celebrity birthday, and daily reflection. Your daily snapshot of the sky.`

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        {NOINDEX_THIN.daily && <meta name="robots" content="noindex,follow" />}
        <link rel="canonical" href={`https://birthchartlibrary.com/daily/${date}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={`https://birthchartlibrary.com/daily/${date}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(dateStr)}&subtitle=Daily+Astrology+Snapshot&symbol=${encodeURIComponent(SIGN_SYMBOLS[moonSign] || '☽')}&label=Daily+Sky`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Date header */}
        <div className="text-center mb-10">
          <AdminBreadcrumb crumbs={[
            { label: 'Today', href: '/' },
            { label: dateStr },
          ]} className="mb-4" />
          <h1 className="font-display text-4xl md:text-5xl tracking-wide text-slate-800 dark:text-slate-100 mb-2">{dateStr}</h1>
          {isToday && <p className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 inline-block">Today</p>}
        </div>

        {/* Moon sign */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">☽</span>
            <h2 className="font-display text-xl tracking-wide">Moon</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${moonEc.bg} ${moonEc.text}`}>
              <SignGlyph sign={moonSign} decorative /> {moonSign}
            </span>
          </div>
          <div className="card">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{MOON_WEATHER[moonSign] || ''}</p>
          </div>
        </section>

        {/* Daily reflection */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✦</span>
            <h2 className="font-display text-xl tracking-wide">Reflection</h2>
          </div>
          <div className={`bg-gradient-to-br ${moonEc.gradient} border ${moonEc.border} rounded-xl p-6`}>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg italic">&ldquo;{MOON_REFLECTIONS[moonSign] || ''}&rdquo;</p>
          </div>
        </section>

        {/* Planetary weather */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">☉</span>
            <h2 className="font-display text-xl tracking-wide">The Sky</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${sunEc.bg} ${sunEc.text}`}>
              {sunSign} Season
            </span>
          </div>
          <div className="card mb-3">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{SUN_SEASON[sunSign] || ''}</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {chart.planets.filter(p => p.planet !== 'NORTH_NODE').map(p => {
              const ec = getElementColor(p.sign)
              return (
                <div key={p.planet} className={`card py-3 px-2 text-center border-l-4 ${ec.border}`}>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{p.planet.replace('_', ' ')}</p>
                  <p className={`font-semibold text-sm ${ec.text}`}><SignGlyph sign={p.sign} decorative /> {p.sign}</p>
                  <p className="text-[10px] text-slate-400">{Math.floor(p.signDegree)}°</p>
                  {p.retrograde && <p className="text-amber-500 text-[10px] font-semibold">℞ Retrograde</p>}
                </div>
              )
            })}
          </div>
        </section>

        {/* Retrogrades */}
        {retrogrades.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">℞</span>
              <h2 className="font-display text-xl tracking-wide">Retrogrades</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{retrogrades.length} active</span>
            </div>
            <div className="space-y-3">
              {retrogrades.map(r => {
                const ec = getElementColor(r.sign)
                return (
                  <div key={r.planet} className={`card border-l-4 ${ec.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-semibold ${ec.text}`}>{r.planet}</span>
                      <span className="text-xs text-slate-400">retrograde in {r.sign}</span>
                      <span className="text-amber-500 text-xs">℞</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{RETROGRADE_DESCRIPTIONS[r.planet] || ''}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Celebrity of the Day */}
        {celeb && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⭐</span>
              <h2 className="font-display text-xl tracking-wide">Celebrity Birthday</h2>
            </div>
            <Link href={`/celebrity-birth-charts/${celeb.slug}`} className="card block hover:border-slate-400 transition-colors group">
              <p className="font-display text-2xl tracking-wide group-hover:text-slate-600 transition-colors">{celeb.name}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {celeb.birth_date} · {celeb.birth_city}
              </p>
              {celebSunSign && (
                <div className="flex items-center gap-2 mt-2">
                  {(() => { const ec = getElementColor(celebSunSign); return (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ec.bg} ${ec.text}`}>
                      <SignGlyph sign={celebSunSign} decorative /> {celebSunSign} Sun
                    </span>
                  )})()}
                  {celeb.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{celeb.category}</span>
                  )}
                </div>
              )}
            </Link>
          </section>
        )}

        {/* Prev / Next navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Link href={`/daily/${prevDate}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            ← Previous day
          </Link>
          {!isFuture && (
            <Link href={`/daily/${nextDate}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Next day →
            </Link>
          )}
        </div>
      </main>
    </>
  )
}
