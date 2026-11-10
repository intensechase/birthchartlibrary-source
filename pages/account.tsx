import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getUser, clearAuthCookie } from '@/lib/auth'
import { query, queryOne, parseJsonb } from '@/lib/db'
import { decryptBirthFields } from '@/lib/crypto'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import SignOutButton from '@/components/SignOutButton'
import DailyEmailToggle from '@/components/DailyEmailToggle'
import EmailSettings from '@/components/EmailSettings'
import ChartActions from '@/components/ChartActions'
import ChangePassword from '@/components/ChangePassword'
import ExportData from '@/components/ExportData'
import DeleteAccount from '@/components/DeleteAccount'
import { getElementColor } from '@/lib/zodiac-colors'
import DashboardLayout from '@/components/DashboardLayout'

interface ChartSummary {
  id: string
  label: string
  birthDate: string
  birthTime: string | null
  birthCity: string
  subjectName: string | null
  sunSign: string | null
  moonSign: string | null
  risingSign: string | null
  sunEc: { bg: string; text: string } | null
  moonEc: { bg: string; text: string } | null
  risingEc: { bg: string; text: string } | null
}

interface Props {
  email: string
  userId: string
  dailyEmail: boolean
  emailCadenceDays: number
  primaryChart: ChartSummary | null
  otherCharts: ChartSummary[]
}

function buildChartSummary(row: { id: string; label: string; birth_date: string; birth_time?: string | null; birth_time_enc?: string | null; birth_city: string | null; birth_city_enc?: string | null; subject_name?: string | null; chart_data: unknown }): ChartSummary {
  const cd = parseJsonb<BirthChartData | null>(row.chart_data)
  const sunSign = cd?.planets.find(p => p.planet === 'SUN')?.sign || null
  const moonSign = cd?.planets.find(p => p.planet === 'MOON')?.sign || null
  const risingSign = cd?.ascendantSign || null
  const decrypted = decryptBirthFields(row)
  return {
    id: row.id,
    label: row.label,
    birthDate: row.birth_date,
    birthTime: decrypted.birth_time,
    birthCity: decrypted.birth_city ?? '',
    subjectName: row.subject_name ?? null,
    sunSign,
    moonSign,
    risingSign,
    sunEc: sunSign ? getElementColor(sunSign) : null,
    moonEc: moonSign ? getElementColor(moonSign) : null,
    risingEc: risingSign ? getElementColor(risingSign) : null,
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = await getUser(context)
  if (!user) {
    // See daily-horoscope.tsx: without clearing here, an edge-valid but
    // DB-orphaned token loops forever between /login and this page.
    clearAuthCookie(context.res)
    return { redirect: { destination: '/login', permanent: false } }
  }

  const [profile, primaryChartRow, otherChartRows] = await Promise.all([
    queryOne<{ daily_email: boolean; email_cadence_days: number }>('SELECT daily_email, email_cadence_days FROM profiles WHERE id = $1', [user.id]),
    queryOne<{ id: string; label: string; birth_date: string; birth_time: string | null; birth_time_enc: string | null; birth_city: string | null; birth_city_enc: string | null; subject_name: string | null; chart_data: unknown }>(
      'SELECT id, label, birth_date, birth_time, birth_time_enc, birth_city, birth_city_enc, subject_name, chart_data FROM birth_charts WHERE user_id = $1 AND is_primary = true LIMIT 1',
      [user.id]
    ),
    query<{ id: string; label: string; birth_date: string; birth_city: string | null; birth_city_enc: string | null; subject_name: string | null; chart_data: unknown }>(
      'SELECT id, label, birth_date, birth_city, birth_city_enc, subject_name, chart_data FROM birth_charts WHERE user_id = $1 AND is_primary = false ORDER BY created_at DESC',
      [user.id]
    ),
  ])

  return {
    props: {
      email: user.email || '',
      userId: user.id,
      dailyEmail: profile?.daily_email ?? false,
      emailCadenceDays: profile?.email_cadence_days ?? 1,
      primaryChart: primaryChartRow ? buildChartSummary(primaryChartRow) : null,
      otherCharts: (otherChartRows || []).map(buildChartSummary),
    },
  }
}

export default function AccountPage({ email, userId, dailyEmail, emailCadenceDays, primaryChart, otherCharts }: Props) {
  const router = useRouter()
  const emailVerifyError = router.query.emailVerifyError as string | undefined

  return (
    <DashboardLayout>
      <Head>
        <title>My Account | Birth Chart Library</title>
        <meta name="description" content="View your birth chart, saved charts, and account settings." />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {emailVerifyError === 'expired' && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-300">
            Your verification link has expired. <Link href="/api/auth/resend-verification" className="underline font-medium">Resend verification email</Link>
          </div>
        )}
        {emailVerifyError === 'invalid' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
            That verification link is invalid or has already been used.
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-3xl tracking-wide">My Account</h1>
          <SignOutButton />
        </div>

        {/* Account email */}
        <div className="mb-10">
          <EmailSettings email={email} />
        </div>

        {/* Daily Email */}
        {primaryChart && (
          <section className="mb-10">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Daily Horoscope Email</h2>
            <DailyEmailToggle initialEnabled={dailyEmail} initialCadenceDays={emailCadenceDays} />
          </section>
        )}

        {/* Charts */}
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">My Chart</h2>
          {primaryChart ? (
            <Link href={`/birth-chart/${primaryChart.id}`} className="card block hover:border-slate-400 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">{primaryChart.label || 'My Chart'}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {primaryChart.birthDate}{primaryChart.birthTime ? ` at ${primaryChart.birthTime}` : ''} &middot; {primaryChart.birthCity}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                  Primary
                </span>
              </div>
              {(primaryChart.sunEc || primaryChart.moonEc || primaryChart.risingEc) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {primaryChart.sunEc && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${primaryChart.sunEc.bg} ${primaryChart.sunEc.text}`}>
                      &#9737; Sun in {primaryChart.sunSign}
                    </span>
                  )}
                  {primaryChart.moonEc && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${primaryChart.moonEc.bg} ${primaryChart.moonEc.text}`}>
                      &#9789; Moon in {primaryChart.moonSign}
                    </span>
                  )}
                  {primaryChart.risingEc && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${primaryChart.risingEc.bg} ${primaryChart.risingEc.text}`}>
                      Rising: {primaryChart.risingSign}
                    </span>
                  )}
                </div>
              )}
              <ChartActions chartId={primaryChart.id} currentLabel={primaryChart.label || 'My Chart'} isPrimary={true} />
            </Link>
          ) : (
            <div className="card text-center py-8">
              <p className="text-slate-500 mb-4">You haven&apos;t generated your birth chart yet.</p>
              <Link href="/birth-chart" className="btn-primary">Generate Your Chart</Link>
            </div>
          )}
        </section>

        {/* Chart Library */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-widest text-slate-400">Chart Library</h2>
            <Link href="/birth-chart" className="text-xs text-slate-600 hover:text-slate-600 transition-colors">
              + Generate a chart
            </Link>
          </div>

          {otherCharts && otherCharts.length > 0 ? (
            <div className="space-y-2">
              {otherCharts.map(chart => (
                <Link
                  key={chart.id}
                  href={`/birth-chart/${chart.id}`}
                  className="card block hover:border-slate-400 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{chart.subjectName || chart.label || 'Unnamed Chart'}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {chart.birthDate} &middot; {chart.birthCity}
                      </p>
                    </div>
                    {chart.sunSign && (
                      <span className="text-xs text-slate-400">
                        &#9737; {chart.sunSign}
                      </span>
                    )}
                  </div>
                  <ChartActions chartId={chart.id} currentLabel={chart.label || 'Chart'} isPrimary={false} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-6">
              <p className="text-slate-500 text-sm">
                No charts saved yet. Generate a chart for someone in your life — a friend, family member, or someone you&apos;re curious about.
              </p>
            </div>
          )}
        </section>

        {/* Settings */}
        <details className="mt-16 pt-8 border-t border-slate-100 group">
          <summary className="text-xs uppercase tracking-widest text-slate-300 cursor-pointer list-none flex items-center gap-2 hover:text-slate-500 transition-colors">
            <span className="transition-transform group-open:rotate-90">&#9658;</span>
            Account Settings
          </summary>
          <div className="mt-6 space-y-4">
            <ChangePassword />
            <div className="card flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1">Your Data</p>
                <p className="text-slate-500 text-sm">Download all your charts and account data as JSON.</p>
              </div>
              <ExportData />
            </div>
            <div className="pt-4 border-t border-slate-100">
              <DeleteAccount />
            </div>
          </div>
        </details>
      </main>
    </DashboardLayout>
  )
}
