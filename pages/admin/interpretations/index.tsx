import type { GetServerSideProps } from 'next'
import type { Interpretation } from '@/lib/types/db'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import { INTERPRETATION_TYPES } from '@/lib/constants'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import AdminListCard from '@/components/AdminListCard'

interface Props {
  interpretations: Interpretation[]
  activeType: string
  total: number
  page: number
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async (context) => {

  const activeType = (context.query.type as string) || 'planet_info'
  const page = parseInt(context.query.page as string) || 1
  const limit = 50
  const offset = (page - 1) * limit

  const [interpretations, countResult] = await Promise.all([
    query<Interpretation>(
      'SELECT id, type, planet, sign, house, title, description FROM interpretations WHERE type = $1 ORDER BY planet ASC, sign ASC, house ASC LIMIT $2 OFFSET $3',
      [activeType, limit, offset]
    ),
    query<{ count: string }>(
      'SELECT COUNT(*)::text as count FROM interpretations WHERE type = $1',
      [activeType]
    ),
  ])

  return {
    props: {
      interpretations,
      activeType,
      total: parseInt(countResult[0]?.count || '0'),
      page,
    },
  }
})

export default function AdminInterpretations({ interpretations, activeType, total, page }: Props) {
  const router = useRouter()
  const totalPages = Math.ceil(total / 50)

  return (
    <DashboardLayout>
      <Head>
        <title>Interpretations — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Interpretations' },
        ]} className="mb-4" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Interpretations</h1>
          <Link href="/admin/interpretations/new" className="btn-primary text-sm px-4 py-2">
            Add Interpretation
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {INTERPRETATION_TYPES.map(t => (
            <button
              key={t}
              onClick={() => router.push(`/admin/interpretations?type=${t}`)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeType === t
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 mb-4">{total} total for {activeType.replace(/_/g, ' ')}</p>

        {interpretations.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No interpretations for this type.</p>
        ) : (
          <div className="space-y-2">
            {interpretations.map(interp => (
              <AdminListCard
                key={interp.id}
                href={`/admin/interpretations/${interp.id}`}
                title={interp.title || interp.description.slice(0, 50) + (interp.description.length > 50 ? '...' : '')}
                subtitle={[interp.planet, interp.sign, interp.house ? `House ${interp.house}` : null].filter(Boolean).join(' / ') || interp.type}
                meta={<span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600">{interp.type.replace(/_/g, ' ')}</span>}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Link
                href={`/admin/interpretations?type=${activeType}&page=${page - 1}`}
                className="text-sm text-slate-600 hover:text-slate-800 px-3 py-1 border border-slate-200 rounded"
              >
                Prev
              </Link>
            )}
            <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link
                href={`/admin/interpretations?type=${activeType}&page=${page + 1}`}
                className="text-sm text-slate-600 hover:text-slate-800 px-3 py-1 border border-slate-200 rounded"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
