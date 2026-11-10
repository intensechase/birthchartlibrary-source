import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { query, queryCount } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'

interface UserRow {
  id: string
  email: string
  created_at: string
  hasChart: boolean
}

interface Props {
  userCount: number
  totalCharts: number
  primaryCharts: number
  otherCharts: number
  chartsToday: number
  articleCount: number
  celebCount: number
  guestSubCount: number
  sortedSources: Array<[string, number]>
  recentUsers: UserRow[]
  noChartUsers: UserRow[]
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {
  const [articleCount, celebCount, userCount, totalCharts, primaryCharts, guestSubCount] = await Promise.all([
    queryCount('SELECT count(*) FROM blog_articles'),
    queryCount('SELECT count(*) FROM celebrities'),
    queryCount('SELECT count(*) FROM profiles'),
    queryCount('SELECT count(*) FROM birth_charts'),
    queryCount('SELECT count(*) FROM birth_charts WHERE is_primary = true'),
    queryCount('SELECT count(*) FROM guest_subscribers WHERE unsubscribed_at IS NULL'),
  ])
  const otherCharts = totalCharts - primaryCharts

  const todayStart = new Date().toISOString().split('T')[0]
  const chartsToday = await queryCount('SELECT count(*) FROM birth_charts WHERE created_at >= $1', [todayStart])

  const [recentProfiles, sourceCounts] = await Promise.all([
    query<{ id: string; email: string; created_at: string; has_chart: boolean }>(
      `SELECT p.id, p.email, p.created_at,
        (COUNT(bc.id) > 0) AS has_chart
       FROM profiles p
       LEFT JOIN birth_charts bc ON bc.user_id = p.id
       GROUP BY p.id, p.email, p.created_at
       ORDER BY p.created_at DESC LIMIT 50`
    ),
    query<{ signup_source: string; count: string }>(
      `SELECT COALESCE(signup_source, 'unknown') AS signup_source, COUNT(*) AS count
       FROM profiles GROUP BY signup_source ORDER BY count DESC`
    ),
  ])

  const enrichedProfiles = recentProfiles.map(p => ({
    id: p.id,
    email: p.email || 'Unknown',
    created_at: p.created_at,
    hasChart: p.has_chart,
  }))

  const recentUsers = enrichedProfiles.slice(0, 10)
  const noChartUsers = enrichedProfiles.filter(p => !p.hasChart).slice(0, 20)
  const sortedSources = sourceCounts.map(r => [r.signup_source, parseInt(r.count)] as [string, number])

  return {
    props: {
      userCount,
      totalCharts,
      primaryCharts,
      otherCharts,
      chartsToday,
      articleCount,
      celebCount,
      sortedSources,
      recentUsers,
      noChartUsers,
      guestSubCount,
    },
  }
})

export default function AdminPage({
  userCount, totalCharts, primaryCharts, otherCharts, chartsToday,
  articleCount, celebCount, guestSubCount,
  sortedSources, recentUsers, noChartUsers,
}: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Admin Dashboard | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl tracking-wide mb-2">Admin</h1>
        <p className="text-slate-500 mb-8">Manage content for Birth Chart Library.</p>

        {/* User & Chart Stats */}
        <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Users &amp; Charts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          <div className="card text-center py-4">
            <p className="font-display text-3xl tracking-wide">{userCount}</p>
            <p className="text-slate-500 text-xs">Users</p>
          </div>
          <div className="card text-center py-4">
            <p className="font-display text-3xl tracking-wide">{totalCharts}</p>
            <p className="text-slate-500 text-xs">Total Charts</p>
          </div>
          <div className="card text-center py-4">
            <p className="font-display text-3xl tracking-wide">{primaryCharts}</p>
            <p className="text-slate-500 text-xs">Primary Charts</p>
          </div>
          <div className="card text-center py-4">
            <p className="font-display text-3xl tracking-wide">{otherCharts}</p>
            <p className="text-slate-500 text-xs">Charts for Others</p>
          </div>
          <div className="card text-center py-4">
            <p className="font-display text-3xl tracking-wide">{chartsToday}</p>
            <p className="text-slate-500 text-xs">Charts Today</p>
          </div>
          <div className="card text-center py-4">
            <Link href="/admin/subscribers" className="block hover:opacity-70 transition-opacity">
              <p className="font-display text-3xl tracking-wide">{guestSubCount}</p>
              <p className="text-slate-500 text-xs">Newsletter Subs</p>
            </Link>
          </div>
        </div>

        {/* Signup Sources */}
        {sortedSources.length > 0 && (
          <details className="mb-10 group">
            <summary className="text-xs uppercase tracking-widest text-slate-400 mb-3 cursor-pointer list-none flex items-center gap-2 hover:text-slate-600 transition-colors">
              <span className="transition-transform group-open:rotate-90">&#9654;</span>
              Signup Sources
            </summary>
            <div className="card mt-3 divide-y divide-slate-100">
              {sortedSources.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between py-2 px-1">
                  <span className="text-sm text-slate-600 capitalize">{source}</span>
                  <span className="text-sm font-medium text-slate-800">{count}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Recent Signups */}
        <details className="mb-10 group">
          <summary className="text-xs uppercase tracking-widest text-slate-400 mb-3 cursor-pointer list-none flex items-center gap-2 hover:text-slate-600 transition-colors">
            <span className="transition-transform group-open:rotate-90">&#9654;</span>
            Recent Signups ({recentUsers.length})
          </summary>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="card mt-3 divide-y divide-slate-100">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between py-2.5 px-1">
                  <div>
                    <p className="text-sm font-medium">{u.email}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {u.hasChart ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Chart created</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">No chart yet</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-6 mt-3">
              <p className="text-slate-500 text-sm">No users yet.</p>
            </div>
          )}
        </details>

        {/* Drop-off */}
        {noChartUsers.length > 0 && (
          <details className="mb-10 group">
            <summary className="text-xs uppercase tracking-widest text-slate-400 mb-3 cursor-pointer list-none flex items-center gap-2 hover:text-slate-600 transition-colors">
              <span className="transition-transform group-open:rotate-90">&#9654;</span>
              Signed Up Without a Chart ({noChartUsers.length})
            </summary>
            <div className="card mt-3 divide-y divide-slate-100">
              {noChartUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between py-2.5 px-1">
                  <p className="text-sm">{u.email}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Content Stats */}
        <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Content</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="card text-center">
            <p className="font-display text-3xl tracking-wide">{articleCount}</p>
            <p className="text-slate-500 text-sm">Blog Articles</p>
          </div>
          <div className="card text-center">
            <p className="font-display text-3xl tracking-wide">{celebCount}</p>
            <p className="text-slate-500 text-sm">Celebrities</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/admin/articles" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Blog Articles</h2>
            <p className="text-slate-500 text-sm">Write, edit, schedule, and publish blog articles.</p>
          </Link>
          <Link href="/admin/articles/new" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">+ New Article</h2>
            <p className="text-slate-500 text-sm">Write a new blog article.</p>
          </Link>
          <Link href="/admin/celebrities" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Celebrities</h2>
            <p className="text-slate-500 text-sm">Add or edit celebrity birth data.</p>
          </Link>
          <Link href="/admin/birth-times" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Birth Times</h2>
            <p className="text-slate-500 text-sm">Add verified birth times from AstroDatabank.</p>
          </Link>
          <Link href="/admin/requests" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Celebrity Requests</h2>
            <p className="text-slate-500 text-sm">View and manage celebrity requests from users.</p>
          </Link>
          <Link href="/admin/reading-room" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Reading Room</h2>
            <p className="text-slate-500 text-sm">Manage book recommendations and monthly picks.</p>
          </Link>
          <Link href="/admin/subscribers" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Newsletter Subscribers</h2>
            <p className="text-slate-500 text-sm">View guest email list, breakdown by sign, export CSV.</p>
          </Link>
          <Link href="/admin/social" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Social Post Generator</h2>
            <p className="text-slate-500 text-sm">Today&apos;s moon sign — ready-to-copy captions for every platform.</p>
          </Link>
          <Link href="/admin/glossary" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Glossary</h2>
            <p className="text-slate-500 text-sm">Edit astrology term definitions.</p>
          </Link>
          <Link href="/admin/interpretations" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Interpretations</h2>
            <p className="text-slate-500 text-sm">Edit planet, sign, house, and transit interpretations.</p>
          </Link>
          <Link href="/admin/audit-log" className="card block hover:border-slate-400 transition-colors group">
            <h2 className="font-semibold group-hover:text-slate-600 transition-colors">Audit Log</h2>
            <p className="text-slate-500 text-sm">Security-relevant account events (login, signup, password change, etc.) with brute-force watchlist.</p>
          </Link>
        </div>
      </main>
    </DashboardLayout>
  )
}
