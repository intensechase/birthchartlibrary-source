import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'

interface Celeb {
  id: string
  name: string
  birth_date: string
  birth_city: string
  birth_name: string | null
}

interface Props {
  celebs: Celeb[]
  total: number
  page: number
  search: string
}

function adbUrl(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    const last = parts[parts.length - 1]
    const first = parts.slice(0, -1).join('_')
    return `https://www.astro.com/astro-databank/${last},_${first}`
  }
  return `https://www.astro.com/astro-databank/${name.replace(/\s+/g, '_')}`
}

const RATINGS = ['AA', 'A', 'B', 'C', 'DD', 'X']

function BirthTimeRow({ celeb, onSaved }: { celeb: Celeb; onSaved: (id: string) => void }) {
  const [time, setTime] = useState('')
  const [rating, setRating] = useState('AA')
  const [source, setSource] = useState('AstroDatabank')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const timeRef = useRef<HTMLInputElement>(null)

  async function save() {
    if (!time) { timeRef.current?.focus(); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/update-birth-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: celeb.id, birth_time: time, rodden_rating: rating, source_note: source }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Error saving')
      } else {
        onSaved(celeb.id)
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card py-3 px-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm truncate">{celeb.name}</span>
          {celeb.birth_name && celeb.birth_name !== celeb.name && (
            <span className="text-xs text-slate-400">({celeb.birth_name})</span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{celeb.birth_date} · {celeb.birth_city}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={adbUrl(celeb.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:text-blue-700 underline whitespace-nowrap"
        >
          ADB ↗
        </a>
        <input
          ref={timeRef}
          type="text"
          placeholder="HH:MM"
          value={time}
          onChange={e => setTime(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          className="border border-slate-200 rounded px-2 py-1 text-sm w-20 font-mono"
        />
        <select
          value={rating}
          onChange={e => setRating(e.target.value)}
          className="border border-slate-200 rounded px-2 py-1 text-sm"
        >
          {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={e => setSource(e.target.value)}
          className="border border-slate-200 rounded px-2 py-1 text-sm w-32"
        />
        <button
          onClick={save}
          disabled={saving || !time}
          className="btn-primary text-xs px-3 py-1.5 disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async ({ query: q }) => {
  const page = Math.max(1, parseInt((q.page as string) || '1'))
  const search = (q.search as string) || ''
  const limit = 50
  const offset = (page - 1) * limit

  const where = search
    ? `WHERE birth_time IS NULL AND name ILIKE $3`
    : `WHERE birth_time IS NULL`
  const params = search ? [limit, offset, `%${search}%`] : [limit, offset]

  const [celebs, total] = await Promise.all([
    query<Celeb>(
      `SELECT id, name, birth_date, birth_city, birth_name FROM celebrities ${where} ORDER BY name LIMIT $1 OFFSET $2`,
      params
    ),
    query<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM celebrities ${where.replace('LIMIT $1 OFFSET $2', '')}`,
      search ? [`%${search}%`] : []
    ).then(r => parseInt(r[0]?.count || '0')),
  ])

  return { props: { celebs, total, page, search } }
})

export default function BirthTimesPage({ celebs: initial, total, page, search }: Props) {
  const [celebs, setCelebs] = useState(initial)
  const [savedCount, setSavedCount] = useState(0)

  function onSaved(id: string) {
    setCelebs(prev => prev.filter(c => c.id !== id))
    setSavedCount(s => s + 1)
  }

  const totalPages = Math.ceil(total / 50)

  return (
    <DashboardLayout>
      <Head>
        <title>Birth Times | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">Admin</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-slate-800">Birth Times</span>
        </nav>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl tracking-wide">Birth Times</h1>
            <p className="text-slate-400 text-sm">{total} celebrities missing birth time{savedCount > 0 && ` · ${savedCount} saved this session`}</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Click <strong>ADB ↗</strong> to open AstroDatabank, find the birth time, then enter it in <strong>HH:MM</strong> (24-hour) format.
          Rodden Ratings: <strong>AA</strong> = birth cert, <strong>A</strong> = from memory, <strong>B</strong> = biography, <strong>C</strong> = unverified, <strong>DD</strong> = conflicting, <strong>X</strong> = no time.
        </div>

        {/* Search */}
        <form method="get" className="mb-4 flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name..."
            className="border border-slate-200 rounded px-3 py-1.5 text-sm flex-1"
          />
          <button type="submit" className="btn-primary text-sm px-4 py-1.5">Search</button>
          {search && <a href="/admin/birth-times" className="text-sm text-slate-400 hover:text-slate-600 py-1.5">Clear</a>}
        </form>

        <div className="space-y-2">
          {celebs.length === 0 && (
            <p className="text-slate-400 text-sm py-8 text-center">
              {savedCount > 0 ? `All done on this page! ${savedCount} saved.` : 'No results.'}
            </p>
          )}
          {celebs.map(c => (
            <BirthTimeRow key={c.id} celeb={c} onSaved={onSaved} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 mt-6 text-sm">
            {page > 1 && (
              <a href={`/admin/birth-times?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className="text-slate-500 hover:text-slate-800">← Prev</a>
            )}
            <span className="text-slate-400">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <a href={`/admin/birth-times?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className="text-slate-500 hover:text-slate-800">Next →</a>
            )}
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
