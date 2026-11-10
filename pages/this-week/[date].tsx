import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getWeeklySky, getMondayOfWeek, type WeeklySky } from '@/lib/swisseph/weekly-sky'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { MOON_WEATHER } from '@/lib/interpretations/daily'
import { NOINDEX_THIN } from '@/lib/thin-pages'

// Weekly pages exist for real week starts only: Mondays from the first week the
// site covers through next week. Any other date used to render a page too
// (/this-week/1999-01-01, /this-week/2031-05-05), an endless set of near-identical
// URLs. Fixed 2026-11-10 with docs/TEMPLATE-CELEB-REMOVAL-PLAN.md.
const FIRST_WEEK = Date.UTC(2026, 0, 5)

interface Props {
  week: WeeklySky
  startStr: string
  endStr: string
  prevDate: string
  hasPrev: boolean
  nextDate: string
  isFuture: boolean
  dateParam: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const date = context.params?.date as string
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) return { notFound: true }

  const monday = new Date(Date.UTC(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3])))
  const iso = monday.toISOString().slice(0, 10)
  const lastWeek = getMondayOfWeek(new Date()).getTime() + 7 * 86400000
  if (iso !== date || monday.getUTCDay() !== 1 || monday.getTime() < FIRST_WEEK || monday.getTime() > lastWeek) {
    return { notFound: true, revalidate: 86400 }
  }
  const sunday = new Date(monday)
  sunday.setUTCDate(sunday.getUTCDate() + 6)
  try {

  const week = await getWeeklySky(monday)

  const startStr = monday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
  const endStr = sunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  // Prev/next week
  const prevMonday = new Date(monday)
  prevMonday.setUTCDate(prevMonday.getUTCDate() - 7)
  const nextMonday = new Date(monday)
  nextMonday.setUTCDate(nextMonday.getUTCDate() + 7)
  const prevDate = `${prevMonday.getUTCFullYear()}-${String(prevMonday.getUTCMonth() + 1).padStart(2, '0')}-${String(prevMonday.getUTCDate()).padStart(2, '0')}`
  const nextDate = `${nextMonday.getUTCFullYear()}-${String(nextMonday.getUTCMonth() + 1).padStart(2, '0')}-${String(nextMonday.getUTCDate()).padStart(2, '0')}`
  const isFuture = nextMonday > new Date()

  const dateParam = `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, '0')}-${String(monday.getUTCDate()).padStart(2, '0')}`

  return {
    props: { week, startStr, endStr, prevDate, hasPrev: prevMonday.getTime() >= FIRST_WEEK, nextDate, isFuture, dateParam },
    revalidate: 604800,
  }
  } catch (err) {
    console.error('[this-week/date] getStaticProps error:', err)
    return { notFound: true }
  }
}

export default function WeeklyPage({ week, startStr, endStr, prevDate, hasPrev, nextDate, isFuture, dateParam }: Props) {
  const metaTitle = `This Week in Astrology: ${startStr} \u2013 ${endStr}`
  const metaDesc = `Weekly astrology forecast for ${startStr} through ${endStr}. Sign changes, retrogrades, Moon transits, and planetary positions.`

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://birthchartlibrary.com/this-week/${dateParam}`} key="canonical" />
        {NOINDEX_THIN.thisWeek && <meta name="robots" content="noindex,follow" />}
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(startStr + ' – ' + endStr)}&subtitle=Weekly+Astrology+Forecast&symbol=✦&label=This+Week+in+Astrology`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: 'This Week' },
        ]} />

        <h1 className="font-display text-3xl sm:text-4xl tracking-wide mb-2">This Week in Astrology</h1>
        <p className="text-slate-500 mb-8">{startStr} &ndash; {endStr}</p>

        {/* Weekly events */}
        {week.events.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl tracking-wide mb-4">Key Events</h2>
            <div className="space-y-3">
              {week.events.map((event, i) => {
                const endP = week.endPositions.find(p => p.planet === event.planet)
                const ec = endP ? getElementColor(endP.sign) : { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
                return (
                  <div key={i} className={`card border-l-4 ${ec.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.type === 'sign_change' ? 'bg-blue-50 text-blue-600' :
                        event.type === 'retrograde_start' ? 'bg-amber-50 text-amber-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {event.type === 'sign_change' ? 'Sign Change' :
                         event.type === 'retrograde_start' ? 'Retrograde Begins' :
                         'Retrograde Ends'}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">{event.description}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {week.events.length === 0 && (
          <section className="mb-8">
            <div className="card text-center py-6">
              <p className="text-slate-500 text-sm">No major sign changes or retrograde shifts this week... a steady period for integrating what's already in motion.</p>
            </div>
          </section>
        )}

        {/* Moon this week */}
        <section className="mb-8">
          <h2 className="font-display text-xl tracking-wide mb-4">The Moon This Week</h2>
          <p className="text-slate-500 text-sm mb-4">
            The Moon passes through {week.moonSigns.length} signs this week: {week.moonSigns.join(', ')}.
          </p>
          <div className="space-y-3">
            {week.moonSigns.map(sign => {
              const ec = getElementColor(sign)
              return (
                <div key={sign} className={`card border-l-4 ${ec.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <SignGlyph sign={sign} decorative className={`text-lg ${ec.text}`} />
                    <span className="font-medium">Moon in {sign}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{MOON_WEATHER[sign] || ''}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Planet positions at week start */}
        <section className="mb-8">
          <h2 className="font-display text-xl tracking-wide mb-4">Planetary Positions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {week.startPositions.filter(p => p.planet !== 'MOON' && p.planet !== 'NORTH_NODE').map(p => {
              const ec = getElementColor(p.sign)
              const endP = week.endPositions.find(ep => ep.planet === p.planet)
              const changed = endP && endP.sign !== p.sign
              return (
                <div key={p.planet} className={`card py-3 px-2 text-center border-l-4 ${ec.border}`}>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{p.planet.replace('_', ' ')}</p>
                  <p className={`font-semibold text-sm ${ec.text}`}><SignGlyph sign={p.sign} decorative /> {p.sign}</p>
                  {changed && endP && (
                    <p className="text-[10px] text-blue-500 mt-0.5">&rarr; {endP.sign}</p>
                  )}
                  {p.retrograde && <p className="text-amber-500 text-[10px] font-semibold">℞</p>}
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center mb-8">
          <p className="font-display text-xl tracking-wide mb-2">How does this week affect your chart?</p>
          <p className="text-slate-500 text-sm mb-4">Generate your birth chart to see how this week's transits interact with your specific planetary positions.</p>
          <Link href="/signup" className="btn-primary">Create Your Free Chart</Link>
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          {hasPrev ? (
            <Link href={`/this-week/${prevDate}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              ← Previous week
            </Link>
          ) : <span />}
          {!isFuture && (
            <Link href={`/this-week/${nextDate}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              Next week →
            </Link>
          )}
        </div>
      </main>
    </>
  )
}
