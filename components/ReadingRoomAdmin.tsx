'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SIGN_LIST } from '@/lib/constants'

const CATEGORIES = ['beginner', 'intermediate', 'advanced', 'tools'] as const
const MONTH_OPTIONS = [
  { value: '', label: 'No monthly pick' },
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' }, { value: '04', label: 'April' },
  { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
]
const SIGNS = SIGN_LIST
const PLANETS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North Node','Chiron']
const TAG = 'birthchartlib-20'

function ensureTag(url: string): string {
  if (!url) return url
  try {
    const u = new URL(url)
    if (!u.searchParams.get('tag')) u.searchParams.set('tag', TAG)
    return u.toString()
  } catch { return url }
}

interface Book {
  id: number
  title: string
  author: string
  description: string
  why_we_recommend: string | null
  amazon_url: string
  category: string
  featured_month: string | null
  relevant_signs: string[]
  relevant_planets: string[]
  sort_order: number
  active: boolean
  cover_url: string | null
}

const EMPTY_FORM = {
  title: '', author: '', description: '', why_we_recommend: '',
  amazon_url: '', category: 'beginner', featured_month: '',
  relevant_signs: [] as string[], relevant_planets: [] as string[],
  sort_order: 0, active: true, cover_url: '',
}

function toggleArr<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

export default function ReadingRoomAdmin({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [editing, setEditing] = useState<Book | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openAdd() {
    setForm({ ...EMPTY_FORM })
    setEditing(null)
    setAdding(true)
    setError(null)
  }

  function openEdit(book: Book) {
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      why_we_recommend: book.why_we_recommend || '',
      amazon_url: book.amazon_url,
      category: book.category,
      featured_month: book.featured_month || '',
      relevant_signs: book.relevant_signs || [],
      relevant_planets: book.relevant_planets || [],
      sort_order: book.sort_order,
      active: book.active,
      cover_url: book.cover_url || '',
    })
    setEditing(book)
    setAdding(false)
    setError(null)
  }

  function closePanel() {
    setEditing(null)
    setAdding(false)
    setError(null)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const body = { ...form, amazon_url: ensureTag(form.amazon_url), sort_order: Number(form.sort_order) }

    try {
      if (adding) {
        const res = await fetch('/api/admin/reading-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to add book')
        // Reload to get the new ID
        window.location.reload()
      } else if (editing) {
        const res = await fetch(`/api/admin/reading-room/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to save')
        setBooks(prev => prev.map(b => b.id === editing.id ? { ...b, ...body, id: editing.id } : b))
        closePanel()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(book: Book) {
    const next = !book.active
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, active: next } : b))
    try {
      await fetch(`/api/admin/reading-room/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...book, active: next }),
      })
    } catch {
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, active: book.active } : b))
    }
  }

  async function handleDelete(book: Book) {
    if (!confirm(`Delete "${book.title}"?`)) return
    setBooks(prev => prev.filter(b => b.id !== book.id))
    try {
      await fetch(`/api/admin/reading-room/${book.id}`, { method: 'DELETE' })
    } catch {
      setBooks(prev => [...prev, book])
    }
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = books.filter(b => b.category === cat)
    return acc
  }, {} as Record<string, Book[]>)

  const catLabel: Record<string, string> = {
    beginner: 'Start Here', intermediate: 'Go Deeper',
    advanced: 'For the Dedicated Student', tools: 'Journals, Planners & Tools',
  }

  const panelOpen = adding || !!editing

  return (
    <div className="relative">
      <div className="flex justify-end mb-6">
        <button onClick={openAdd} className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">
          + Add book
        </button>
      </div>

      {/* Book list grouped by category */}
      <div className="space-y-10">
        {CATEGORIES.map(cat => (
          <div key={cat}>
            <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-3">{catLabel[cat]} ({grouped[cat].length})</h2>
            {grouped[cat].length === 0 ? (
              <p className="text-sm text-slate-300 italic">None</p>
            ) : (
              <div className="space-y-2">
                {grouped[cat].map(book => (
                  <div key={book.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${book.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                    {book.cover_url && (
                      <Image src={book.cover_url} alt="" width={40} height={56} className="w-10 h-14 object-cover rounded shrink-0 bg-slate-100" unoptimized />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800 text-sm">{book.title}</span>
                        {book.featured_month && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                            {MONTH_OPTIONS.find(m => m.value === book.featured_month)?.label} pick
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleActive(book)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${book.active ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100' : 'border-slate-200 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {book.active ? 'Live' : 'Off'}
                      </button>
                      <button onClick={() => openEdit(book)} className="text-xs text-slate-400 hover:text-slate-700 transition-colors px-2 py-1">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(book)} className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slide-in edit panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button className="flex-1 bg-black/30" onClick={closePanel} aria-label="Close" />
          <div className="w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">{adding ? 'Add book' : 'Edit book'}</h2>
              <button onClick={closePanel} className="text-slate-400 hover:text-slate-700 transition-colors text-xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Author *</label>
                  <input name="author" value={form.author} onChange={handleChange} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400">
                    {CATEGORIES.map(c => <option key={c} value={c}>{catLabel[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Monthly pick</label>
                  <select name="featured_month" value={form.featured_month} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400">
                    {MONTH_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400 resize-none" />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Why we recommend (shown in italics)</label>
                <textarea name="why_we_recommend" value={form.why_we_recommend} onChange={handleChange} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400 resize-none" />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Amazon URL * <span className="text-slate-400">(affiliate tag added automatically)</span></label>
                <input name="amazon_url" value={form.amazon_url} onChange={handleChange} required placeholder="https://www.amazon.com/dp/..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
                {form.amazon_url && (
                  <p className="text-xs text-slate-400 mt-1 truncate">Will save as: {ensureTag(form.amazon_url)}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Cover image URL</label>
                <input name="cover_url" value={form.cover_url} onChange={handleChange} placeholder="https://..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Relevant signs</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SIGNS.map(s => (
                      <button key={s} type="button"
                        onClick={() => setForm(prev => ({ ...prev, relevant_signs: toggleArr(prev.relevant_signs, s) }))}
                        className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${form.relevant_signs.includes(s) ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Relevant planets</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PLANETS.map(p => (
                      <button key={p} type="button"
                        onClick={() => setForm(prev => ({ ...prev, relevant_planets: toggleArr(prev.relevant_planets, p) }))}
                        className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${form.relevant_planets.includes(p) ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
                      >{p}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Sort order</label>
                  <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-slate-600">Active (visible on site)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Saving...' : adding ? 'Add book' : 'Save changes'}
                </button>
                <button type="button" onClick={closePanel} className="px-4 py-2.5 border border-slate-200 text-sm rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
