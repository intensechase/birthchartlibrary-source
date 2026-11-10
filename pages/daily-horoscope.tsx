import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getUser, clearAuthCookie } from '@/lib/auth'
import { queryOne, parseJsonb } from '@/lib/db'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { calculateDailyTransits, type Transit } from '@/lib/swisseph/transits'
import { describeTransit, describeMoonTransit } from '@/lib/interpretations/transits'
import { getPlanetInfo } from '@/lib/interpretations'
import { getElementColor } from '@/lib/zodiac-colors'
import DashboardLayout from '@/components/DashboardLayout'

interface Props {
  hasChart: boolean
  chartId?: string
  chartLabel?: string
  sunSign?: string
  moonSign?: string
  ascendantSign?: string
  dateStr?: string
  dayWord?: string
  dailyMoonSign?: string
  moonElementColor?: { bg: string; text: string }
  moonTransitParagraphs?: string[]
  todayTransits?: Array<Transit & { description: string; planetSymbol: string; planetName: string; natalPlanetName: string }>
  weekTransits?: Array<Transit & { description: string; planetSymbol: string; planetName: string; natalPlanetName: string }>
  seasonTransits?: Array<Transit & { description: string; planetSymbol: string; planetName: string; natalPlanetName: string }>
}

function dayLabel(offset: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

function findHouseForLongitude(longitude: number, cusps: number[]): number {
  for (let i = 1; i <= 12; i++) {
    const current = cusps[i]
    const next = cusps[i === 12 ? 1 : i + 1]
    if (current < next) {
      if (longitude >= current && longitude < next) return i
    } else {
      if (longitude >= current || longitude < next) return i
    }
  }
  return 1
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = await getUser(context)
  if (!user) {
    // A token can be edge-valid (unexpired, correct signature — see
    // middleware.ts's verifyJwtEdge) while its profile no longer exists in
    // the DB, which only this DB-backed check catches. Without clearing the
    // cookie here, middleware still sees a "valid" session on the next hit
    // to /login and bounces straight back to this page — an infinite
    // redirect loop between /login and /daily-horoscope.
    clearAuthCookie(context.res)
    return { redirect: { destination: '/login', permanent: false } }
  }

  const chart = await queryOne<{ id: string; label: string; chart_data: unknown }>(
    'SELECT id, label, chart_data FROM birth_charts WHERE user_id = $1 AND is_primary = true LIMIT 1',
    [user.id]
  )

  if (!chart || !chart.chart_data) {
    return { props: { hasChart: false } }
  }

  const day = (context.query.day as string) || undefined
  const offset = day === 'yesterday' ? -1 : day === 'tomorrow' ? 1 : 0
  const natalChart = parseJsonb<BirthChartData>(chart.chart_data)
  const daily = await calculateDailyTransits(natalChart, offset)

  const natalSun = natalChart.planets.find(p => p.planet === 'SUN')
  const natalMoon = natalChart.planets.find(p => p.planet === 'MOON')

  const moonPos = daily.todayPositions.find(p => p.planet === 'MOON')
  const moonHouseInNatal = moonPos ? findHouseForLongitude(moonPos.longitude, natalChart.houseCusps) : 1

  const dateStr = dayLabel(offset)
  const dayWord = offset === -1 ? 'Yesterday' : offset === 1 ? 'Tomorrow' : 'Today'

  const moonEc = getElementColor(daily.moonSign)

  function enrichTransit(t: Transit) {
    return {
      ...t,
      description: describeTransit(t as Parameters<typeof describeTransit>[0]),
      planetSymbol: getPlanetInfo(t.transitPlanet)?.symbol || '',
      planetName: getPlanetInfo(t.transitPlanet)?.name || t.transitPlanet,
      natalPlanetName: getPlanetInfo(t.natalPlanet)?.name || t.natalPlanet,
    }
  }

  return {
    props: {
      hasChart: true,
      chartId: chart.id,
      chartLabel: chart.label || 'you',
      sunSign: natalSun?.sign || '',
      moonSign: natalMoon?.sign || '',
      ascendantSign: natalChart.ascendantSign || '',
      dateStr,
      dayWord,
      dailyMoonSign: daily.moonSign,
      moonElementColor: moonEc,
      moonTransitParagraphs: describeMoonTransit(daily.moonSign, moonHouseInNatal).split('\n\n'),
      todayTransits: daily.transits.today.map(enrichTransit),
      weekTransits: daily.transits.week.map(enrichTransit),
      seasonTransits: daily.transits.season.map(enrichTransit),
    },
  }
}

export default function DailyHoroscopePage(props: Props) {
  const {
    hasChart, chartId, chartLabel, sunSign, moonSign, ascendantSign,
    dateStr, dayWord, dailyMoonSign, moonElementColor,
    moonTransitParagraphs, todayTransits, weekTransits, seasonTransits,
  } = props

  return (
    <DashboardLayout>
      <Head>
        <title>Your Daily Horoscope | Birth Chart Library</title>
        <meta name="description" content="A personalized daily horoscope based on your natal chart and current planetary transits." />
      </Head>

      {!hasChart ? (
        <main className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">Your Daily Horoscope</h1>
          <div className="card text-center py-10">
            <div className="text-4xl mb-4">&#10022;</div>
            <p className="text-slate-500 mb-2">Generate your birth chart first to unlock your personalized daily horoscope.</p>
            <p className="text-slate-400 text-sm mb-6">Your horoscope is calculated from your unique natal chart... no two are alike.</p>
            <Link href="/birth-chart" className="btn-primary">Generate Your Chart</Link>
          </div>
        </main>
      ) : (
        <main className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Daily Horoscope</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-1">{dateStr}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Personalized for {chartLabel}... {sunSign} Sun, {moonSign} Moon, {ascendantSign} Rising
            </p>
          </div>

          {/* Moon transit */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">&#9789;</span>
              <h2 className="text-lg font-semibold">{dayWord}</h2>
              {moonElementColor && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${moonElementColor.bg} ${moonElementColor.text}`}>Moon in {dailyMoonSign}</span>
              )}
            </div>

            <div className="card space-y-4">
              {moonTransitParagraphs?.map((paragraph, i) => (
                <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {todayTransits && todayTransits.length > 0 && (
              <div className="space-y-3 mt-3">
                {todayTransits.map((t, i) => (
                  <div key={i} className="card">
                    <p className="text-xs text-slate-400 mb-2">
                      {t.planetSymbol} {t.planetName} {t.aspect} {t.natalPlanetName}
                      <span className="ml-2 text-slate-400">{t.orb}&deg; orb</span>
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{t.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* This Week */}
          {weekTransits && weekTransits.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">&#10022;</span>
                <h2 className="text-lg font-semibold">This Week</h2>
              </div>

              <div className="space-y-3">
                {weekTransits.map((t, i) => (
                  <div key={i} className="card">
                    <p className="text-xs text-slate-400 mb-2">
                      {t.planetSymbol} {t.planetName} in {t.transitSign} {t.aspect} your {t.natalPlanetName}
                      <span className="ml-2 text-slate-400">{t.orb}&deg; orb</span>
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{t.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* This Season */}
          {seasonTransits && seasonTransits.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">&#9711;</span>
                <h2 className="text-lg font-semibold">This Season</h2>
              </div>

              <div className="space-y-3">
                {seasonTransits.map((t, i) => (
                  <div key={i} className="card">
                    <p className="text-xs text-slate-400 mb-2">
                      {t.planetSymbol} {t.planetName} in {t.transitSign} {t.aspect} your {t.natalPlanetName}
                      <span className="ml-2 text-slate-400">{t.orb}&deg; orb</span>
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{t.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 mt-10">
            <p>Readings refresh daily at midnight UTC</p>
            <Link href={`/birth-chart/${chartId}`} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors mt-1 inline-block">
              View your full birth chart &rarr;
            </Link>
          </div>
        </main>
      )}
    </DashboardLayout>
  )
}
