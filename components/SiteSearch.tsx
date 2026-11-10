'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { glossary } from '@/lib/glossary'

interface SearchResult {
  title: string
  href: string
  category: string
}

// Static content index
const STATIC_PAGES: SearchResult[] = [
  // Zodiac signs
  ...['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => ({
    title: s, href: `/zodiac-signs/${s.toLowerCase()}`, category: 'Zodiac Sign',
  })),
  // Planets
  ...['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron', 'North Node'].map(p => ({
    title: p, href: `/astrology-planets/${p.toLowerCase().replace(' ', '_')}`, category: 'Planet',
  })),
  // Houses
  ...Array.from({ length: 12 }, (_, i) => ({
    title: `${i + 1}${['st','nd','rd'][i] || 'th'} House`, href: `/astrology-houses/${i + 1}`, category: 'House',
  })),
  // Main pages
  { title: 'Daily Horoscope', href: '/daily-horoscope', category: 'Page' },
  { title: 'Birth Chart', href: '/birth-chart', category: 'Page' },
  { title: 'Celebrity Birth Charts', href: '/celebrity-birth-charts', category: 'Page' },
  { title: 'Astrology Interpretations', href: '/astrology-interpretations', category: 'Page' },
  { title: 'Chinese Zodiac', href: '/chinese-zodiac', category: 'Page' },
  { title: 'Rising Sign Calculator', href: '/calculators/rising-sign', category: 'Calculator' },
  { title: 'Sun Moon Rising Calculator', href: '/calculators/sun-moon-rising', category: 'Calculator' },
  { title: 'Chinese Zodiac Calculator', href: '/calculators/chinese-zodiac', category: 'Calculator' },
  { title: 'Blog', href: '/blog', category: 'Page' },
  { title: 'Glossary', href: '/glossary', category: 'Page' },
  // Glossary terms
  ...glossary.map(g => ({
    title: g.term, href: g.link || '/glossary', category: 'Glossary',
  })),
]

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

export default function SiteSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [celebResults, setCelebResults] = useState<SearchResult[]>([])
  const [blogResults, setBlogResults] = useState<SearchResult[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const router = useRouter()

  // Keyboard shortcut: / to open
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => { setActiveIndex(0) }, [query, celebResults, blogResults])

  const searchCelebs = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setCelebResults([]); return }

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search/celebrities?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setCelebResults((data ?? []).map((c: { name: string; slug: string }) => ({
        title: c.name,
        href: `/celebrity-birth-charts/${c.slug}`,
        category: 'Celebrity',
      })))
    }, 200)
  }, [])

  const searchBlog = useCallback((q: string) => {
    if (q.length < 2) { setBlogResults([]); return }

    // Same debounce timer as searchCelebs would double-fire the timeout;
    // a separate timer keeps both requests independent.
    setTimeout(async () => {
      const res = await fetch(`/api/search/blog-articles?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setBlogResults((data ?? []).map((a: { title: string; slug: string }) => ({
        title: a.title,
        href: `/blog/${a.slug}`,
        category: 'Article',
      })))
    }, 200)
  }, [])

  function handleQueryChange(q: string) {
    setQuery(q)
    searchCelebs(q)
    searchBlog(q)
  }

  function close() {
    setOpen(false)
    setQuery('')
    setCelebResults([])
    setBlogResults([])
    setActiveIndex(0)
  }

  function navigate(href: string) {
    if (typeof window !== 'undefined' && (window as any).pintrk && query) {
      (window as any).pintrk('track', 'search', {
        event_id: `bcl-search-${Date.now()}`,
        search_query: query,
      })
    }
    close()
    router.push(href)
  }

  const staticResults = query.length < 2 ? [] : STATIC_PAGES.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const results = [...staticResults, ...celebResults, ...blogResults].slice(0, 8)

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results.length > 0) {
      navigate(results[activeIndex].href)
    }
  }

  if (!open) {
    return (
      <>
        {/* Desktop search button */}
        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5"
          title="Search (press /)"
        >
          <SearchIcon />
          <span className="hidden lg:inline">Search</span>
          <kbd className="hidden lg:inline text-[10px] text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700 rounded px-1">/</kbd>
        </button>
        {/* Mobile search button */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50" onClick={close} />

      {/* Search modal */}
      <div className="fixed top-[15%] sm:top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400 dark:text-slate-500 shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              placeholder="Search celebrities, signs, planets..."
              className="flex-1 text-sm outline-none bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              onKeyDown={handleKeyDown}
            />
            <kbd className="text-[10px] text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">esc</kbd>
          </div>

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {results.map((r, i) => (
                <button
                  key={`${r.href}-${i}`}
                  onClick={() => navigate(r.href)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left ${
                    i === activeIndex
                      ? 'bg-slate-100 dark:bg-slate-700'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-sm text-slate-700 dark:text-slate-200">{r.title}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{r.category}</span>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-2xl mb-2">✦</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try a celebrity name, zodiac sign, or planet</p>
            </div>
          )}

          {query.length < 2 && (
            <div className="px-4 py-5 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">Type to search celebrities, signs, planets, articles...</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
