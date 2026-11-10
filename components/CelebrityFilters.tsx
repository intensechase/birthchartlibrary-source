'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SignGlyph } from '@/components/Glyph'
import { CelebFace, cleanCelebName } from '@/components/FeaturedCelebs'
import { SIGN_LIST, CELEBRITY_CATEGORIES } from '@/lib/constants'
import { VERIFIED_RATINGS } from '@/lib/birth-time-source'
import { formatBirthDate } from '@/lib/format-birth'

interface Celebrity {
  id: string
  name: string
  slug: string
  birth_date: string
  birth_city: string
  category: string | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
  has_image?: boolean
}

const PAGE_SIZE = 12

const INK = 'text-slate-800 dark:text-slate-100'
const MUTED = 'text-slate-500 dark:text-slate-400'
const LABEL = `text-[13px] font-black uppercase tracking-[0.08em] ${MUTED} mb-2`
const toggleClass = (on: boolean) =>
  `min-h-9 px-3.5 rounded-full border-2 border-[var(--outline)] dark:border-slate-100 text-sm font-bold transition-colors ${
    on ? 'bg-[var(--gold)] text-[#1A1622]' : `bg-transparent ${INK} hover:bg-[var(--surface)]`
  }`

function FilterRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export default function CelebrityFilters() {
  const [category, setCategory] = useState('All')
  const [rating, setRating] = useState('Any')
  const [sunSigns, setSunSigns] = useState<string[]>([])
  const [moonSigns, setMoonSigns] = useState<string[]>([])
  const [risingSigns, setRisingSigns] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [celebrities, setCelebrities] = useState<Celebrity[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggleSign(arr: string[], sign: string): string[] {
    return arr.includes(sign) ? arr.filter(s => s !== sign) : [...arr, sign]
  }

  function buildFilterParams(): URLSearchParams {
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    if (rating !== 'Any') params.set('rating', rating)
    if (sunSigns.length > 0) params.set('sun', sunSigns.join(','))
    if (moonSigns.length > 0) params.set('moon', moonSigns.join(','))
    if (risingSigns.length > 0) params.set('rising', risingSigns.join(','))
    const q = searchQuery.trim()
    if (q) params.set('q', q)
    return params
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const params = buildFilterParams()
        params.set('limit', String(PAGE_SIZE))
        params.set('offset', '0')
        const res = await fetch(`/api/celebrities?${params}`)
        if (res.ok) {
          const data = await res.json()
          setCelebrities(data.rows)
          setTotal(data.total)
        }
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, rating, sunSigns, moonSigns, risingSigns, searchQuery])

  async function loadMore() {
    setLoadingMore(true)
    try {
      const params = buildFilterParams()
      params.set('limit', String(PAGE_SIZE))
      params.set('offset', String(celebrities.length))
      const res = await fetch(`/api/celebrities?${params}`)
      if (res.ok) {
        const data = await res.json()
        setCelebrities(prev => [...prev, ...data.rows])
        setTotal(data.total)
      }
    } finally {
      setLoadingMore(false)
    }
  }

  const hasFilters = category !== 'All' || rating !== 'Any' || sunSigns.length > 0 || moonSigns.length > 0 || risingSigns.length > 0 || searchQuery.trim().length > 0

  const signRow = (label: string, selected: string[], set: (v: string[]) => void) => (
    <FilterRow label={label}>
      {SIGN_LIST.map(sign => {
        const on = selected.includes(sign)
        return (
          <button key={sign} type="button" aria-pressed={on} onClick={() => set(toggleSign(selected, sign))} className={toggleClass(on)}>
            <SignGlyph sign={sign} decorative /> {sign}
          </button>
        )
      })}
    </FilterRow>
  )

  return (
    <>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <label htmlFor="celeb-search" className={`${LABEL} block`}>Search by name</label>
          <div className="relative max-w-xl">
            <input
              id="celeb-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Taylor Swift, Adele, Josh Allen"
              maxLength={64}
              className={`w-full min-h-11 px-5 pr-11 rounded-full border-[3px] border-[var(--outline)] dark:border-slate-100 bg-[var(--surface)] text-base ${INK} placeholder-slate-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold)]`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-xl ${INK} hover:bg-[var(--band)]`}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <FilterRow
          label={<>Birth time rating <Link href="/celebrity-birth-charts/rated-birth-times" className="normal-case tracking-normal font-bold text-[var(--accent)] hover:underline">what&apos;s this?</Link></>}
        >
          {['Any', ...VERIFIED_RATINGS].map((r) => (
            <button key={r} type="button" aria-pressed={rating === r} onClick={() => setRating(r)} className={toggleClass(rating === r)}>{r}</button>
          ))}
        </FilterRow>

        <FilterRow label="Category">
          {CELEBRITY_CATEGORIES.map((cat) => (
            <button key={cat} type="button" aria-pressed={category === cat} onClick={() => setCategory(cat)} className={toggleClass(category === cat)}>{cat}</button>
          ))}
        </FilterRow>

        {signRow('Sun sign', sunSigns, setSunSigns)}
        {signRow('Moon sign', moonSigns, setMoonSigns)}
        {signRow('Rising sign', risingSigns, setRisingSigns)}

        {hasFilters && (
          <button
            type="button"
            onClick={() => { setCategory('All'); setRating('Any'); setSunSigns([]); setMoonSigns([]); setRisingSigns([]); setSearchQuery('') }}
            className="self-start font-bold text-[var(--accent)] hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <p className={`text-sm ${MUTED} mb-5`} aria-live="polite">
        {loading
          ? 'Loading…'
          : total === 0
            ? '0 celebrities found'
            : `Showing ${celebrities.length.toLocaleString()} of ${total.toLocaleString()} ${total === 1 ? 'celebrity' : 'celebrities'}`}
      </p>

      {!loading && !celebrities.length ? (
        <p className={MUTED}>No celebrities match these filters.</p>
      ) : (
        <>
          <ul className={`grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-x-8 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {celebrities.map((celeb) => (
              <li key={celeb.id} className="min-w-0 border-t-2 border-slate-300 dark:border-slate-600">
                <Link href={`/celebrity-birth-charts/${celeb.slug}`} className={`flex items-center gap-[18px] py-4 pl-[7px] ${INK} group`}>
                  <CelebFace slug={celeb.slug} sign={celeb.sun_sign} hasImage={!!celeb.has_image} size={56} />
                  <span className="min-w-0 leading-snug">
                    <span className="block font-black text-[17px] group-hover:underline">{cleanCelebName(celeb.name)}</span>
                    <span className={`block text-sm ${MUTED}`}>{formatBirthDate(celeb.birth_date)} · {celeb.birth_city}</span>
                    <span className="block text-sm">
                      {[celeb.sun_sign && `${celeb.sun_sign} Sun`, celeb.moon_sign && `${celeb.moon_sign} Moon`, celeb.category].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {!loading && celebrities.length < total && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className={`${toggleClass(false)} min-h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingMore ? 'Loading…' : `Load more (${(total - celebrities.length).toLocaleString()} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
