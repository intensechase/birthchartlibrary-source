import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import AdminListCard from '@/components/AdminListCard'
import type { Term } from '@/lib/types/db'

interface Props {
  terms: Term[]
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {

  const terms = await query<Term>(
    'SELECT id, term, definition, link, sort_order FROM glossary_terms ORDER BY sort_order ASC, term ASC'
  )

  return { props: { terms } }
})

export default function AdminGlossary({ terms }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Glossary — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Glossary' },
        ]} className="mb-4" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Glossary Terms</h1>
          <Link href="/admin/glossary/new" className="btn-primary text-sm px-4 py-2">
            Add Term
          </Link>
        </div>

        {terms.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No glossary terms yet.</p>
        ) : (
          <div className="space-y-2">
            {terms.map(term => (
              <AdminListCard
                key={term.id}
                href={`/admin/glossary/${term.id}`}
                title={term.term}
                subtitle={term.definition.length > 100 ? term.definition.slice(0, 100) + '...' : term.definition}
                meta={<>
                  {term.link && <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600">has link</span>}
                  <span className="inline-block ml-2 px-2 py-0.5 rounded bg-slate-100 text-slate-600">#{term.sort_order}</span>
                </>}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/glossary" className="text-sm text-slate-400 hover:text-slate-600">
            View public glossary &rarr;
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
