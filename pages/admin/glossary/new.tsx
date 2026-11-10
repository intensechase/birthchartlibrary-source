import { useState } from 'react'
import Head from 'next/head'
import { withAdminAuth } from '@/lib/ssr'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { useAdminForm } from '@/lib/hooks/useAdminForm'

export const getServerSideProps = withAdminAuth()

export default function NewGlossaryTerm() {
  const { saving, error, submit } = useAdminForm()
  const [form, setForm] = useState({
    term: '',
    definition: '',
    link: '',
    sort_order: 0,
  })

  return (
    <DashboardLayout>
      <Head>
        <title>Add Term — Glossary — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Glossary', href: '/admin/glossary' },
          { label: 'Add Term' },
        ]} className="mb-4" />

        <h1 className="text-2xl font-bold mb-6">Add a Glossary Term</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={e => submit(e, {
          url: '/api/admin/glossary',
          body: form,
          redirectTo: '/admin/glossary',
          method: 'POST',
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

          <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2">
            {saving ? 'Saving...' : 'Create Term'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
