import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { glossary } from '@/lib/glossary'
import { Face } from '@/components/redesign/HomePage'
import { LearnHero } from '@/components/redesign/Learn'

interface SearchResult {
  title: string
  href: string
  category: string
}

const STATIC_PAGES: SearchResult[] = [
  ...['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => ({
    title: s, href: `/zodiac-signs/${s.toLowerCase()}`, category: 'Sign',
  })),
  ...['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron', 'North Node'].map(p => ({
    title: p, href: `/astrology-planets/${p.toLowerCase().replace(' ', '_')}`, category: 'Planet',
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    title: `${i + 1}${['st','nd','rd'][i] || 'th'} House`, href: `/astrology-houses/${i + 1}`, category: 'House',
  })),
  { title: 'Daily horoscope', href: '/daily-horoscope', category: 'Page' },
  { title: 'Birth chart', href: '/birth-chart', category: 'Page' },
  { title: 'Celebrity birth charts', href: '/celebrity-birth-charts', category: 'Page' },
  { title: 'Chinese zodiac', href: '/chinese-zodiac', category: 'Page' },
  { title: 'Calculators', href: '/calculators', category: 'Page' },
  { title: 'Compare two charts', href: '/calculators/synastry', category: 'Page' },
  { title: 'Celebrity twins', href: '/celebrity-match', category: 'Page' },
  { title: 'Born today', href: '/born-today', category: 'Page' },
  { title: 'Sign compatibility', href: '/compatibility', category: 'Page' },
  ...glossary.map(g => ({ title: g.term, href: g.link || '/glossary', category: 'Glossary' })),
]

// Starts with the typed words first, then anywhere in the title.
function inPages(q: string): SearchResult[] {
  const t = q.toLowerCase()
  const at = (r: SearchResult) => r.title.toLowerCase().indexOf(t)
  return STATIC_PAGES.filter((r, i, all) => at(r) >= 0 && all.findIndex(x => x.href === r.href && x.title === r.title) === i).sort((a, b) => Number(at(a) > 0) - Number(at(b) > 0)).slice(0, 8)
}

export default function SearchPage() {
  const { isReady, query: params } = useRouter()
  const [q, setQ] = useState('')
  const [people, setPeople] = useState<{ name: string; slug: string; sun_sign: string | null; moon_sign: string | null }[]>([])
  const [articles, setArticles] = useState<{ title: string; slug: string }[]>([])
  const [done, setDone] = useState('') // the words the lists on screen are for

  // The header search sends what was typed there as ?q=.
  const sent = isReady && typeof params.q === 'string' ? params.q.slice(0, 100) : ''
  useEffect(() => { if (sent) setQ(sent) }, [sent])

  const words = q.trim()
  useEffect(() => {
    if (words.length < 2) { setPeople([]); setArticles([]); setDone(''); return }
    const ctl = new AbortController()
    const get = (path: string) => fetch(`/api/search/${path}?q=${encodeURIComponent(words)}`, { signal: ctl.signal }).then(r => (r.ok ? r.json() : [])).then(x => (Array.isArray(x) ? x : []))
    const t = setTimeout(() => {
      Promise.all([get('celebrities'), get('blog-articles')]).then(([p, a]) => { setPeople(p); setArticles(a); setDone(words) }).catch(() => {})
    }, 200)
    return () => { clearTimeout(t); ctl.abort() }
  }, [words])

  const pages = words.length < 2 ? [] : inPages(words)
  const none = done === words && words.length >= 2 && !people.length && !articles.length && !pages.length

  return (
    <>
      <Head>
        <title>Search | Birth Chart Library</title>
        <meta name="description" content="Search Birth Chart Library for celebrities, zodiac signs, planets, houses, glossary terms, and astrology articles." />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <main className="rdp"><div className="lrn">
        <LearnHero title="Search" />
        <form className="hsearch" role="search" onSubmit={e => e.preventDefault()}>
          <label htmlFor="site-q" className="sr-only">Search people, signs, planets, terms and articles</label>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input id="site-q" type="search" autoComplete="off" autoFocus placeholder="A person, sign, planet or word" value={q} onChange={e => setQ(e.target.value.slice(0, 100))} />
        </form>
        <div aria-live="polite">
          {people.length ? (
            <section className="lsec"><h2>People</h2><div className="matches">
              {people.map(p => (
                <Link key={p.slug} href={`/celebrity-birth-charts/${p.slug}`}>
                  <Face name={p.name} slug={p.slug} sign={p.sun_sign ?? undefined} size={44} />
                  <span><b>{p.name}</b>{p.sun_sign ? <small>{p.sun_sign} Sun{p.moon_sign ? `, ${p.moon_sign} Moon` : ''}</small> : null}</span>
                </Link>
              ))}
            </div></section>
          ) : null}
          {pages.length ? (
            <section className="lsec"><h2>Signs, planets and words</h2><div className="nexts">
              {pages.map(r => <Link key={r.href + r.title} className="nx" href={r.href}><b>{r.title}</b><small>{r.category}</small></Link>)}
            </div></section>
          ) : null}
          {articles.length ? (
            <section className="lsec"><h2>Articles</h2><div className="nexts">
              {articles.map(a => <Link key={a.slug} className="nx" href={`/blog/${a.slug}`}><b>{a.title}</b></Link>)}
            </div></section>
          ) : null}
          {none ? <section className="lsec"><p>Nothing for “{words}” yet. Try a first or last name, or <Link className="tlink" href="/celebrity-birth-charts">browse the library</Link>.</p></section> : null}
        </div>
        {words.length < 2 ? (
          <section className="lsec"><h2>Or start here</h2><div className="nexts">
            {[['/celebrity-birth-charts', 'Celebrity charts', 'Every person in the library'], ['/zodiac-signs', 'Signs', 'The twelve styles'], ['/glossary', 'Glossary', 'Every term in plain words'], ['/birth-chart', 'Your chart', 'Free, no account']].map(([href, b, small]) => <Link key={href} className="nx" href={href}><b>{b}</b><small>{small}</small></Link>)}
          </div></section>
        ) : null}
      </div></main>
    </>
  )
}
