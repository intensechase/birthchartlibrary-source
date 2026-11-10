'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'

interface Props {
  article?: {
    id: string
    title: string
    slug: string
    description: string | null
    content: string
    category: string | null
    read_time: string | null
    publish_date: string
    published: boolean
  }
}

const CATEGORIES = ['Basics', 'Guides', 'Transits', 'Relationships', 'Planets', 'Seasonal', 'Intermediate', 'Advanced']

export default function ArticleEditor({ article }: Props) {
  const router = useRouter()
  const isNew = !article

  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    description: article?.description || '',
    content: article?.content || '',
    category: article?.category || 'Basics',
    read_time: article?.read_time || '5 min',
    publish_date: article?.publish_date || new Date().toISOString().split('T')[0],
    published: article?.published || false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    setForm(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }))
  }

  async function handleSave() {
    if (!form.title || !form.slug || !form.content) {
      setError('Title, slug, and content are required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    if (isNew) {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          description: form.description,
          content: form.content,
          category: form.category,
          read_time: form.read_time,
          publish_date: form.publish_date,
          published: form.published,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setSaving(false)
        return
      }

      setSuccess('Article created!')
      setTimeout(() => router.push('/admin/articles'), 1000)
    } else {
      const res = await fetch(`/api/admin/articles/${article!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          description: form.description,
          content: form.content,
          category: form.category,
          read_time: form.read_time,
          publish_date: form.publish_date,
          published: form.published,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setSaving(false)
        return
      }

      setSuccess('Article saved!')
    }

    setSaving(false)
  }

  async function handleDelete() {
    if (!article || !confirm('Delete this article? This cannot be undone.')) return

    await fetch(`/api/admin/articles/${article.id}`, { method: 'DELETE' })
    router.push('/admin/articles')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-slate-500">Title *</label>
          <input name="title" value={form.title} onChange={handleTitleChange} className="input" placeholder="Article title" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-500">Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="input" placeholder="article-slug" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-slate-500">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input min-h-20 resize-y" placeholder="Brief description for SEO and previews" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-1 text-slate-500">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-500">Read Time</label>
          <input name="read_time" value={form.read_time} onChange={handleChange} className="input" placeholder="5 min" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-500">Publish Date</label>
          <input type="date" name="publish_date" value={form.publish_date} onChange={handleChange} className="input" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 rounded border-slate-300" />
            <span className="text-sm text-slate-700">Published</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-slate-500">Content *</label>
        <RichTextEditor content={form.content} onChange={(html) => setForm(prev => ({ ...prev, content: html }))} />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : isNew ? 'Create Article' : 'Save Changes'}
        </button>
        {form.slug && (
          <a href={`/blog/${form.slug}`} target="_blank" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            Preview →
          </a>
        )}
        {!isNew && (
          <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 transition-colors ml-auto">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
