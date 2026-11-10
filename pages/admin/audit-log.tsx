import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Fragment, useMemo, useState } from 'react'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import type { AuthEventType } from '@/lib/audit'

interface EventRow {
  id: string
  event_type: AuthEventType
  user_id: string | null
  email: string | null
  ip: string | null
  user_agent: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

interface BruteForceRow {
  email: string
  attempts: number
  last_attempt: string
}

interface Props {
  events: EventRow[]
  totalLoaded: number
  typeCounts: Array<{ event_type: AuthEventType; count: number }>
  bruteForce: BruteForceRow[]
}

const ROW_CAP = 1000
const LOAD_WINDOW_DAYS = 30

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {
  const [events, typeCounts, bruteForce] = await Promise.all([
    query<EventRow>(
      `SELECT id::text, event_type, user_id::text, email, ip, user_agent, metadata, created_at
       FROM auth_events
       WHERE created_at > NOW() - ($1 || ' days')::INTERVAL
       ORDER BY created_at DESC
       LIMIT $2`,
      [LOAD_WINDOW_DAYS, ROW_CAP]
    ),
    query<{ event_type: AuthEventType; count: string }>(
      `SELECT event_type, COUNT(*) AS count
       FROM auth_events
       WHERE created_at > NOW() - ($1 || ' days')::INTERVAL
       GROUP BY event_type
       ORDER BY count DESC`,
      [LOAD_WINDOW_DAYS]
    ),
    query<{ email: string; attempts: string; last_attempt: string }>(
      `SELECT email, COUNT(*) AS attempts, MAX(created_at) AS last_attempt
       FROM auth_events
       WHERE event_type = 'login_failure'
         AND created_at > NOW() - INTERVAL '1 hour'
         AND email IS NOT NULL
       GROUP BY email
       HAVING COUNT(*) > 10
       ORDER BY attempts DESC
       LIMIT 25`
    ),
  ])

  const serializedEvents = events.map(e => ({
    ...e,
    created_at: new Date(e.created_at).toISOString(),
  }))

  return {
    props: {
      events: serializedEvents,
      totalLoaded: events.length,
      typeCounts: typeCounts.map(r => ({ event_type: r.event_type, count: Number(r.count) })),
      bruteForce: bruteForce.map(r => ({
        email: r.email,
        attempts: Number(r.attempts),
        last_attempt: new Date(r.last_attempt).toISOString(),
      })),
    },
  }
})

type WindowKey = '1h' | '24h' | '7d' | '30d'
const WINDOWS: Array<{ key: WindowKey; label: string; ms: number }> = [
  { key: '1h', label: '1h', ms: 60 * 60 * 1000 },
  { key: '24h', label: '24h', ms: 24 * 60 * 60 * 1000 },
  { key: '7d', label: '7d', ms: 7 * 24 * 60 * 60 * 1000 },
  { key: '30d', label: '30d', ms: 30 * 24 * 60 * 60 * 1000 },
]

const EVENT_TONE: Record<string, string> = {
  login_success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  login_failure: 'bg-rose-50 text-rose-700 border-rose-200',
  signup: 'bg-sky-50 text-sky-700 border-sky-200',
  signout: 'bg-slate-50 text-slate-600 border-slate-200',
  password_changed: 'bg-amber-50 text-amber-700 border-amber-200',
  password_reset_requested: 'bg-amber-50 text-amber-700 border-amber-200',
  password_reset_completed: 'bg-amber-50 text-amber-700 border-amber-200',
  email_change_requested: 'bg-violet-50 text-violet-700 border-violet-200',
  email_change_completed: 'bg-violet-50 text-violet-700 border-violet-200',
  email_verified: 'bg-sky-50 text-sky-700 border-sky-200',
  account_deleted: 'bg-rose-50 text-rose-700 border-rose-200',
}

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export default function AdminAuditLogPage({ events, totalLoaded, typeCounts, bruteForce }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AuthEventType | 'all'>('all')
  const [windowKey, setWindowKey] = useState<WindowKey>('24h')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const now = Date.now()
  const windowMs = WINDOWS.find(w => w.key === windowKey)!.ms

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return events.filter(e => {
      if (now - new Date(e.created_at).getTime() > windowMs) return false
      if (typeFilter !== 'all' && e.event_type !== typeFilter) return false
      if (q) {
        const haystack = `${e.email ?? ''} ${e.ip ?? ''} ${e.user_id ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [events, search, typeFilter, windowKey, now, windowMs])

  const visibleTypeCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const e of events) {
      if (now - new Date(e.created_at).getTime() > windowMs) continue
      counts.set(e.event_type, (counts.get(e.event_type) ?? 0) + 1)
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [events, windowKey, now, windowMs])

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Audit Log | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">Admin</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-slate-800">Audit Log</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl tracking-wide mb-1">Audit Log</h1>
          <p className="text-sm text-slate-400">
            Security-relevant account events. Append-only, 1-year retention. Showing the last {totalLoaded.toLocaleString()} events
            from the past {LOAD_WINDOW_DAYS} days{totalLoaded === ROW_CAP ? ` (capped at ${ROW_CAP.toLocaleString()})` : ''}.
          </p>
        </div>

        {bruteForce.length > 0 && (
          <div className="card mb-8 border-rose-200 bg-rose-50/50">
            <p className="text-xs font-semibold text-rose-700 uppercase tracking-widest mb-3">
              Brute-force watchlist &middot; &gt;10 login failures in the last hour
            </p>
            <div className="divide-y divide-rose-100">
              {bruteForce.map(b => (
                <div key={b.email} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-mono text-rose-800">{b.email}</p>
                    <p className="text-xs text-rose-600 mt-0.5">last attempt {fmtRelative(b.last_attempt)}</p>
                  </div>
                  <button
                    onClick={() => { setSearch(b.email); setTypeFilter('login_failure'); setWindowKey('1h') }}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    {b.attempts} attempts &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">By event type ({windowKey})</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                typeFilter === 'all'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              All <span className="text-slate-400 ml-1">{filtered.length + (typeFilter !== 'all' ? 0 : 0)}</span>
            </button>
            {visibleTypeCounts.map(([type, count]) => (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? 'all' : type as AuthEventType)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  typeFilter === type
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {type}
                <span className={`ml-1.5 ${typeFilter === type ? 'text-slate-300' : 'text-slate-400'}`}>{count}</span>
              </button>
            ))}
            {visibleTypeCounts.length === 0 && (
              <p className="text-xs text-slate-400">No events in this window.</p>
            )}
          </div>

          {typeCounts.length > 0 && (
            <details className="mt-4 group">
              <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                Full {LOAD_WINDOW_DAYS}-day breakdown
              </summary>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 mt-3">
                {typeCounts.map(t => (
                  <div key={t.event_type} className="flex justify-between text-xs">
                    <span className="text-slate-600">{t.event_type}</span>
                    <span className="text-slate-400 font-medium">{t.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <div className="flex gap-2">
            {WINDOWS.map(w => (
              <button
                key={w.key}
                onClick={() => setWindowKey(w.key)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                  windowKey === w.key
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'text-slate-500 border-slate-200 hover:border-slate-400'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search email, IP, or user id..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ml-auto text-sm border border-slate-200 rounded-lg px-3 py-1.5 w-72 focus:outline-none focus:border-slate-400"
          />
        </div>

        <p className="text-xs text-slate-400 mb-3">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">When</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Who</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">IP</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(e => {
                  const isExpanded = expanded.has(e.id)
                  const hasMetadata = e.metadata && Object.keys(e.metadata).length > 0
                  return (
                    <Fragment key={e.id}>
                      <tr
                        className={`hover:bg-slate-50 transition-colors ${hasMetadata ? 'cursor-pointer' : ''}`}
                        onClick={() => hasMetadata && toggleExpand(e.id)}
                      >
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap" title={new Date(e.created_at).toISOString()}>
                          <div>{fmtDateTime(e.created_at)}</div>
                          <div className="text-slate-400">{fmtRelative(e.created_at)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block text-xs px-2 py-0.5 rounded-full border ${
                              EVENT_TONE[e.event_type] ?? 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {e.event_type}
                          </span>
                          {hasMetadata && (
                            <span className="ml-2 text-xs text-slate-400">{isExpanded ? '▾' : '▸'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {e.email ? (
                            <div className="font-mono text-slate-700">{e.email}</div>
                          ) : e.user_id ? (
                            <div className="font-mono text-slate-500" title={e.user_id}>{e.user_id.slice(0, 8)}…</div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                          {e.email && e.user_id && (
                            <div className="font-mono text-slate-400" title={e.user_id}>{e.user_id.slice(0, 8)}…</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{e.ip ?? <span className="text-slate-300">—</span>}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs max-w-xs truncate" title={e.user_agent ?? ''}>
                          {e.user_agent ?? <span className="text-slate-300">—</span>}
                        </td>
                      </tr>
                      {isExpanded && hasMetadata && (
                        <tr className="bg-slate-50/60">
                          <td colSpan={5} className="px-4 py-3">
                            <pre className="text-xs text-slate-600 whitespace-pre-wrap break-all font-mono">
                              {JSON.stringify(e.metadata, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-10">
            <p className="text-slate-400 text-sm">No events match the current filters.</p>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
