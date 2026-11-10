import { useState } from 'react'
import Head from 'next/head'
import { withAdminAuth } from '@/lib/ssr'
import { SIGN_LIST, PLANET_LIST, INTERPRETATION_TYPES } from '@/lib/constants'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { useAdminForm } from '@/lib/hooks/useAdminForm'

export const getServerSideProps = withAdminAuth()

export default function NewInterpretation() {
  const { saving, error, submit } = useAdminForm()
  const [form, setForm] = useState({
    type: 'planet_info',
    planet: '',
    sign: '',
    house: '',
    aspect_planet: '',
    aspect_type: '',
    title: '',
    description: '',
    keywords: '',
  })

  function buildBody() {
    return {
      ...form,
      planet: form.planet || null,
      sign: form.sign || null,
      house: form.house ? parseInt(form.house) : null,
      aspect_planet: form.aspect_planet || null,
      aspect_type: form.aspect_type || null,
      title: form.title || null,
      keywords: form.keywords ? form.keywords.split(',').map(k => k.trim()).filter(Boolean) : null,
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Add Interpretation — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Interpretations', href: '/admin/interpretations' },
          { label: 'Add' },
        ]} className="mb-4" />

        <h1 className="text-2xl font-bold mb-6">Add an Interpretation</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={e => submit(e, {
          url: '/api/admin/interpretations',
          body: buildBody(),
          redirectTo: `/admin/interpretations?type=${form.type}`,
          method: 'POST',
        })} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Type</label>
            <select
              required
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              {INTERPRETATION_TYPES.map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Planet (optional)</label>
            <select
              value={form.planet}
              onChange={e => setForm({ ...form, planet: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {PLANET_LIST.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Sign (optional)</label>
            <select
              value={form.sign}
              onChange={e => setForm({ ...form, sign: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {SIGN_LIST.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">House (optional, 1-12)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={form.house}
              onChange={e => setForm({ ...form, house: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Aspect Planet (optional)</label>
            <input
              type="text"
              value={form.aspect_planet}
              onChange={e => setForm({ ...form, aspect_planet: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Aspect Type (optional)</label>
            <input
              type="text"
              value={form.aspect_type}
              onChange={e => setForm({ ...form, aspect_type: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Title (optional)</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
            <textarea
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[120px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Keywords (comma-separated, optional)</label>
            <input
              type="text"
              value={form.keywords}
              onChange={e => setForm({ ...form, keywords: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="identity, ego, self-expression"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2">
            {saving ? 'Saving...' : 'Create Interpretation'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
