import type { GetServerSideProps } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import { withAdminAuth } from '@/lib/ssr'
import { queryOne } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { useAdminForm } from '@/lib/hooks/useAdminForm'
import type { Term } from '@/lib/types/db'

interface Props {
  term: Term
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth<Props>(async (context) => {
  const term = await queryOne<Term>(
    'SELECT id, term, definition, link, sort_order FROM glossary_terms WHERE id = $1',
    [context.params?.id]
  )

  if (!term) return { notFound: true }

  return { props: { term } }
})

export default function EditGlossaryTerm({ term }: Props) {
  const { saving, error, submit, destroy } = useAdminForm()
  const [form, setForm] = useState({
    term: term.term,
    definition: term.definition,
    link: term.link || '',
    sort_order: term.sort_order,
  })

  return (
    <DashboardLayout>
      <Head>
        <title>{`Edit ${term.term} — Glossary — Admin`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Glossary', href: '/admin/glossary' },
          { label: term.term },
        ]} className="mb-4" />

        <h1 className="text-2xl font-bold mb-6">Edit Term</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={e => submit(e, {
          url: `/api/admin/glossary/${term.id}`,
          body: form,
          redirectTo: '/admin/glossary',
        })} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Term</label>
            <input
              type="text"
              required
              value={form.term}
              onChange={e => setForm({ ...form, term: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Definition</label>
            <textarea
              required
              value={form.definition}
              onChange={e => setForm({ ...form, definition: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[120px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Link (optional)</label>
            <input
              type="text"
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="/zodiac-signs/aries"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => destroy({
                url: `/api/admin/glossary/${term.id}`,
                redirectTo: '/admin/glossary',
                message: 'Delete this glossary term?',
              })}
              className="text-sm text-red-400 hover:text-red-600"
            >
              Delete Term
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
