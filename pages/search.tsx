import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { glossary } from '@/lib/glossary'

interface SearchResult {
  title: string
  href: string
  category: string
}

const STATIC_PAGES: SearchResult[] = [
  ...['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => ({
    title: s, href: `/zodiac-signs/${s.toLowerCase()}`, category: 'Zodiac Sign',
  })),
  ...['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron', 'North Node'].map(p => ({
    title: p, href: `/astrology-planets/${p.toLowerCase().replace(' ', '_')}`, category: 'Planet',
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    title: `${i + 1}${['st','nd','rd'][i] || 'th'} House`, href: `/astrology-houses/${i + 1}`, category: 'House',
  })),
  { title: 'Daily Horoscope', href: '/daily-horoscope', category: 'Page' },
  { title: 'Birth Chart', href: '/birth-chart', category: 'Page' },
  { title: 'Celebrity Birth Charts', href: '/celebrity-birth-charts', category: 'Page' },
  { title: 'Chinese Zodiac', href: '/chinese-zodiac', category: 'Page' },
  { title: 'Calculators', href: '/calculators', category: 'Page' },
  ...glossary.map(g => ({ title: g.term, href: g.link || '/glossary', category: 'Glossary' })),
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [celebResults, setCelebResults] = useState<SearchResult[]>([])
  const [blogResults, setBlogResults] = useState<SearchResult[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

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

  const staticResults = query.length < 2 ? [] : STATIC_PAGES.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10)

  const results = [...staticResults, ...celebResults, ...blogResults].slice(0, 20)

  return (
    <>
      <Head>
        <title>Search | Birth Chart Library</title>
        <meta name="description" content="Search Birth Chart Library for celebrities, zodiac signs, planets, houses, glossary terms, and astrology articles." />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl tracking-wide mb-2">Search</h1>
        <p className="text-slate-500 mb-8">Find celebrities, zodiac signs, planets, houses, glossary terms, and articles.</p>

        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); searchCelebs(e.target.value); searchBlog(e.target.value) }}
          className="input text-lg py-3 mb-6"
          placeholder="Search celebrities, signs, planets..."
          autoFocus
        />

        {results.length > 0 ? (
          <div className="space-y-1">
            {results.map((r, i) => (
              <Link
                key={`${r.href}-${i}`}
                href={r.href}
                className="card block py-3 hover:border-slate-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.title}</span>
                  <span className="text-[10px] text-slate-400">{r.category}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : query.length >= 2 ? (
          <p className="text-slate-400 text-center py-8">No results for &ldquo;{query}&rdquo;</p>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">Start typing to search across 1,000+ pages</p>
          </div>
        )}
      </main>
    </>
  )
}
