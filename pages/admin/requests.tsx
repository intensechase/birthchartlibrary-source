import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'

interface CelebRequest {
  id: string
  name: string
  status: string
  created_at: string
}

interface Props {
  pending: CelebRequest[]
  handled: CelebRequest[]
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {

  const requests = await query<CelebRequest>(
    'SELECT id, name, status, created_at FROM celebrity_requests ORDER BY created_at DESC'
  )

  const pending = (requests || []).filter(r => r.status === 'pending')
  const handled = (requests || []).filter(r => r.status !== 'pending')

  return { props: { pending, handled } }
})

export default function AdminRequestsPage({ pending, handled }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Celebrity Requests | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">Admin</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-slate-800">Celebrity Requests</span>
        </nav>

        <h1 className="font-display text-3xl tracking-wide mb-8">Celebrity Requests</h1>

        {/* Pending */}
        <h2 className="text-sm font-semibold text-slate-500 mb-3">Pending ({pending.length})</h2>
        {pending.length > 0 ? (
          <div className="space-y-2 mb-10">
            {pending.map(req => (
              <div key={req.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-medium">{req.name}</p>
                  <p className="text-xs text-slate-400">{req.created_at ? new Date(req.created_at).toLocaleDateString() : ''}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Pending</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-6 mb-10">
            <p className="text-slate-400 text-sm">No pending requests.</p>
          </div>
        )}

        {/* Handled */}
        {handled.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-slate-500 mb-3">Handled ({handled.length})</h2>
            <div className="space-y-2">
              {handled.map(req => (
                <div key={req.id} className="card flex items-center justify-between opacity-60">
                  <div>
                    <p className="font-medium">{req.name}</p>
                    <p className="text-xs text-slate-400">{req.created_at ? new Date(req.created_at).toLocaleDateString() : ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    req.status === 'added' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {req.status === 'added' ? 'Added' : 'Declined'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </DashboardLayout>
  )
}
