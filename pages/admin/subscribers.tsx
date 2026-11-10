import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import { SIGN_SYMBOLS } from '@/lib/zodiac-colors'

interface Subscriber {
  id: string
  email: string
  sun_sign: string
  birth_month: number
  birth_day: number
  subscribed_at: string
  unsubscribed_at: string | null
}

interface Props {
  active: Subscriber[]
  unsubscribed: Subscriber[]
  signBreakdown: Array<{ sun_sign: string; count: number }>
  activeCount: number
  unsubCount: number
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {
  const [all, signBreakdown] = await Promise.all([
    query<Subscriber>(
      `SELECT id, email, sun_sign, birth_month, birth_day, subscribed_at, unsubscribed_at
       FROM guest_subscribers ORDER BY subscribed_at DESC LIMIT 1000`
    ),
    query<{ sun_sign: string; count: string }>(
      `SELECT sun_sign, COUNT(*) as count FROM guest_subscribers
       WHERE unsubscribed_at IS NULL GROUP BY sun_sign ORDER BY count DESC`
    ),
  ])

  const active = all.filter(s => !s.unsubscribed_at)
  const unsubscribed = all.filter(s => s.unsubscribed_at)

  return {
    props: {
      active,
      unsubscribed,
      signBreakdown: signBreakdown.map(r => ({ sun_sign: r.sun_sign, count: Number(r.count) })),
      activeCount: active.length,
      unsubCount: unsubscribed.length,
    },
  }
})

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function downloadCSV(rows: Subscriber[]) {
  const header = 'Email,Sun Sign,Birth Month,Birth Day,Subscribed At'
  const lines = rows.map(r =>
    `${r.email},${r.sun_sign},${r.birth_month},${r.birth_day},${new Date(r.subscribed_at).toISOString().split('T')[0]}`
  )
  const csv = [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bcl-subscribers-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminSubscribersPage({ active, unsubscribed, signBreakdown, activeCount, unsubCount }: Props) {
  const [search, setSearch] = useState('')
  const [signFilter, setSignFilter] = useState('All')
  const [tab, setTab] = useState<'active' | 'unsubscribed'>('active')

  const rows = tab === 'active' ? active : unsubscribed
  const filtered = rows.filter(s => {
    const matchSearch = !search || s.email.toLowerCase().includes(search.toLowerCase())
    const matchSign = signFilter === 'All' || s.sun_sign === signFilter
    return matchSearch && matchSign
  })

  const signs = ['All', ...Array.from(new Set(active.map(s => s.sun_sign))).sort()]

  return (
    <DashboardLayout>
      <Head>
        <title>Newsletter Subscribers | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">Admin</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-slate-800">Newsletter Subscribers</span>
        </nav>

        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-wide mb-1">Newsletter Subscribers</h1>
            <p className="text-sm text-slate-400">Daily horoscope email list — Moon sign + reflection (no personalized transits for guests)</p>
          </div>
          <button
            onClick={() => downloadCSV(active)}
            className="btn-outline text-sm px-4 py-2 shrink-0"
          >
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-800">{activeCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Active</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-500">{unsubCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Unsubscribed</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-800">{activeCount + unsubCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Total ever</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-800">
              {activeCount + unsubCount > 0 ? Math.round((activeCount / (activeCount + unsubCount)) * 100) : 0}%
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Retention</p>
          </div>
        </div>

        {/* Sign breakdown */}
        {signBreakdown.length > 0 && (
          <div className="card mb-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Active by Sun Sign</p>
            <div className="flex flex-wrap gap-2">
              {signBreakdown.map(s => (
                <button
                  key={s.sun_sign}
                  onClick={() => setSignFilter(signFilter === s.sun_sign ? 'All' : s.sun_sign)}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    signFilter === s.sun_sign
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span>{SIGN_SYMBOLS[s.sun_sign] ?? ''}</span>
                  <span>{s.sun_sign}</span>
                  <span className="text-slate-400 font-normal">{s.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab + search */}
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <div className="flex gap-2">
            {(['active', 'unsubscribed'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                  tab === t
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'text-slate-500 border-slate-200 hover:border-slate-400'
                }`}
              >
                {t === 'active' ? `Active (${activeCount})` : `Unsubscribed (${unsubCount})`}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ml-auto text-sm border border-slate-200 rounded-lg px-3 py-1.5 w-56 focus:outline-none focus:border-slate-400"
          />
        </div>

        <p className="text-xs text-slate-400 mb-3">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sun Sign</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Birthday</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Subscribed</th>
                  {tab === 'unsubscribed' && (
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Unsubscribed</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700 font-mono text-xs">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span>{SIGN_SYMBOLS[s.sun_sign] ?? ''}</span>
                        <span className="text-slate-600">{s.sun_sign}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{`${s.birth_month}/${s.birth_day}`}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(s.subscribed_at)}</td>
                    {tab === 'unsubscribed' && (
                      <td className="px-4 py-3 text-slate-400 text-xs">{s.unsubscribed_at ? fmtDate(s.unsubscribed_at) : '—'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-10">
            <p className="text-slate-400 text-sm">
              {activeCount === 0 && tab === 'active'
                ? 'No subscribers yet. The guest horoscope signup form sends emails to this list.'
                : 'No results.'}
            </p>
          </div>
        )}

        <div className="mt-8 card bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">What Subscribers Receive</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            A daily email with the current Moon sign, a Moon transit description, and a daily reflection prompt.
            Guest subscribers do <strong>not</strong> receive personalized planetary transits — that is reserved for registered
            accounts with a saved birth chart. They sign up with their email, Sun sign, and birthday.
          </p>
        </div>
      </main>
    </DashboardLayout>
  )
}
