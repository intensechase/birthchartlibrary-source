import { useState } from 'react'
import { useRouter } from 'next/router'
import { SIGN_LIST_LOWER, PLANET_LIST_LOWER, BOOK_CATEGORIES, READING_ROOM_MONTHS } from '@/lib/constants'

interface BookData {
  id?: number
  title: string
  author: string
  description: string
  why_we_recommend: string
  amazon_url: string
  category: string
  featured_month: string
  relevant_signs: string[]
  relevant_planets: string[]
  sort_order: number
  active: boolean
  cover_url: string
}

interface Props {
  book?: BookData
}

export default function BookEditor({ book }: Props) {
  const router = useRouter()
  const isEditing = !!book?.id

  const [title, setTitle] = useState(book?.title || '')
  const [author, setAuthor] = useState(book?.author || '')
  const [description, setDescription] = useState(book?.description || '')
  const [whyWeRecommend, setWhyWeRecommend] = useState(book?.why_we_recommend || '')
  const [coverUrl, setCoverUrl] = useState(book?.cover_url || '')
  const [amazonUrl, setAmazonUrl] = useState(book?.amazon_url || '')
  const [category, setCategory] = useState(book?.category || 'beginner')
  const [featuredMonth, setFeaturedMonth] = useState(book?.featured_month || '')
  const [relevantSigns, setRelevantSigns] = useState<string[]>(book?.relevant_signs || [])
  const [relevantPlanets, setRelevantPlanets] = useState<string[]>(book?.relevant_planets || [])
  const [sortOrder, setSortOrder] = useState(book?.sort_order || 0)
  const [active, setActive] = useState(book?.active !== false)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const toggleSign = (sign: string) => {
    setRelevantSigns(prev => prev.includes(sign) ? prev.filter(s => s !== sign) : [...prev, sign])
  }

  const togglePlanet = (planet: string) => {
    setRelevantPlanets(prev => prev.includes(planet) ? prev.filter(p => p !== planet) : [...prev, planet])
  }

  const handleSave = async () => {
    if (!title || !author || !description || !amazonUrl) {
      setError('Title, author, description, and Amazon URL are required')
      return
    }
    setSaving(true)
    setError('')

    const body = { title, author, description, why_we_recommend: whyWeRecommend, amazon_url: amazonUrl, category, featured_month: featuredMonth || null, relevant_signs: relevantSigns, relevant_planets: relevantPlanets, sort_order: sortOrder, active, cover_url: coverUrl || null }

    const res = isEditing
      ? await fetch(`/api/admin/reading-room/${book!.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await fetch('/api/admin/reading-room', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

    setSaving(false)

    if (res.ok) {
      setSuccess(isEditing ? 'Book updated' : 'Book added')
      setTimeout(() => router.push('/admin/reading-room'), 1000)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Remove this book from the reading room?')) return
    setDeleting(true)
    const res = await fetch(`/api/admin/reading-room/${book!.id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/reading-room')
    } else {
      setDeleting(false)
      setError('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">{success}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input w-full" placeholder="The Only Astrology Book You'll Ever Need" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Author *</label>
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="input w-full" placeholder="Joanna Martine Woolfolk" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Amazon URL *</label>
        <input type="text" value={amazonUrl} onChange={e => setAmazonUrl(e.target.value)} className="input w-full" placeholder="https://www.amazon.com/s?k=book+title&tag=birthchartlib-20" />
        <p className="text-xs text-slate-400 mt-1">Paste any Amazon link. Make sure it includes your affiliate tag.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
        <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="input w-full" placeholder="https://covers.openlibrary.org/b/id/12345-M.jpg" />
        <p className="text-xs text-slate-400 mt-1">Open Library cover URL. Search at openlibrary.org/search and use the cover ID.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Your description *</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="input w-full" rows={3} placeholder="What's this book about and who is it for? Write it like you're recommending it to a friend." />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Why we recommend it</label>
        <textarea value={whyWeRecommend} onChange={e => setWhyWeRecommend(e.target.value)} className="input w-full" rows={2} placeholder="What makes this one stand out? What did you get from it?" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input w-full">
            {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Featured Month</label>
          <select value={featuredMonth} onChange={e => setFeaturedMonth(e.target.value)} className="input w-full">
            {READING_ROOM_MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Relevant Signs <span className="text-slate-400 font-normal">(for contextual placement)</span></label>
        <div className="flex flex-wrap gap-2">
          {SIGN_LIST_LOWER.map(sign => (
            <button key={sign} type="button" onClick={() => toggleSign(sign)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${relevantSigns.includes(sign) ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
              {sign.charAt(0).toUpperCase() + sign.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Relevant Planets <span className="text-slate-400 font-normal">(for contextual placement)</span></label>
        <div className="flex flex-wrap gap-2">
          {PLANET_LIST_LOWER.map(planet => (
            <button key={planet} type="button" onClick={() => togglePlanet(planet)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${relevantPlanets.includes(planet) ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
              {planet.charAt(0).toUpperCase() + planet.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
          <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} className="input w-full" />
          <p className="text-xs text-slate-400 mt-1">Lower numbers appear first</p>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" id="active" checked={active} onChange={e => setActive(e.target.checked)} className="rounded" />
          <label htmlFor="active" className="text-sm text-slate-700">Visible on reading room</label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2">
          {saving ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
        </button>
        <button onClick={() => router.push('/admin/reading-room')} className="text-sm text-slate-400 hover:text-slate-600">
          Cancel
        </button>
        {isEditing && (
          <button onClick={handleDelete} disabled={deleting} className="ml-auto text-sm text-red-400 hover:text-red-600">
            {deleting ? 'Removing...' : 'Remove Book'}
          </button>
        )}
      </div>
    </div>
  )
}
