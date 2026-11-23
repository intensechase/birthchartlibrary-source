import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Icon from '@/components/Icon'
import { OWN_CHART_EVENT, purgeKept } from '@/lib/kept-chart'

// Site header for the redesign: three pillars, Library · Learn · My chart (owner,
// 11/19 and 11/23; /birth-chart opens the reader's chart, or the form), and a search that finds people only. When no person matches, one line
// points to the matching sign, planet or term (structure notes, Issue 3).
const PILLARS: { label: string; href: string; match: string[] }[] = [
  { label: 'Library', href: '/celebrity-birth-charts', match: ['/celebrity-birth-charts', '/born-today', '/born-on', '/celebrity-spotlight', '/celebrity-match', '/love/celebrity-couples'] },
  { label: 'Learn', href: '/start', match: ['/start', '/zodiac-signs', '/astrology-', '/interpretations', '/glossary', '/blog', '/compatibility', '/chinese-zodiac', '/horoscope', '/daily/', '/love', '/method', '/calculators'] },
  { label: 'My chart', href: '/birth-chart', match: [] }, // lit only on the reader's own chart
]
const SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron']
const ASPECTS = ['conjunction', 'sextile', 'square', 'trine', 'opposition']

function fallback(q: string): { href: string; text: string } | null {
  const w = q.trim().toLowerCase()
  const hit = (list: string[]) => list.find(x => w.includes(x))
  const a = hit(ASPECTS); if (a) return { href: `/astrology-aspects/${a}`, text: `Looking for the term ${a}? Read what it means` }
  const s = hit(SIGNS); if (s) return { href: `/zodiac-signs/${s}`, text: `Looking for ${s[0].toUpperCase() + s.slice(1)}? Read about the sign` }
  const p = hit(PLANETS); if (p) return { href: `/astrology-planets/${p}`, text: `Looking for the ${p[0].toUpperCase() + p.slice(1)}? Read what it means in a chart` }
  if (/rising|ascendant/.test(w)) return { href: '/calculators/rising-sign', text: 'Looking for your rising sign? Work it out here' }
  if (/house/.test(w)) return { href: '/astrology-houses', text: 'Looking for the houses? Read what each one covers' }
  return null
}

// Opens the account, or on a phone (no room for the words) sign in.
function PersonIcon() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19.5c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" /></svg>
}

interface Hit { name: string; slug: string; sun_sign: string | null }

export default function SiteHeader({ ownChart = false }: { ownChart?: boolean }) {
  const { asPath } = useRouter()
  const [guestOwn, setGuestOwn] = useState(false)
  useEffect(() => {
    const on = (e: Event) => setGuestOwn((e as CustomEvent<boolean>).detail)
    window.addEventListener(OWN_CHART_EVENT, on)
    return () => window.removeEventListener(OWN_CHART_EVENT, on)
  }, [])
  // A kept chart is deleted on the first page opened after its 7 days.
  useEffect(() => { purgeKept() }, [asPath])
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[] | null>(null)
  const input = useRef<HTMLInputElement>(null)
  // Client-visible flag cookie set at sign in (same one the old header read).
  // Not proof of a valid session; /account re-checks and sends to /login.
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  useEffect(() => { setSignedIn(document.cookie.split(';').some(c => c.trim().startsWith('bcl_logged_in='))) }, [asPath])

  useEffect(() => { setOpen(false); setQ(''); setHits(null) }, [asPath])
  useEffect(() => { if (open) input.current?.focus() }, [open])
  useEffect(() => {
    if (q.trim().length < 2) { setHits(null); return }
    const ctl = new AbortController()
    const t = setTimeout(() => {
      fetch(`/api/search/celebrities?q=${encodeURIComponent(q.trim())}`, { signal: ctl.signal })
        .then(r => (r.ok ? r.json() : []))
        .then((rows: Hit[]) => setHits(Array.isArray(rows) ? rows : []))
        .catch(() => {})
    }, 200)
    return () => { clearTimeout(t); ctl.abort() }
  }, [q])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const path = asPath.split('?')[0]
  // Only one section lights: the closest match (couples live under /love but belong to Library).
  const reach = (match: string[]) => Math.max(0, ...match.filter(m => path.startsWith(m)).map(m => m.length))
  const top = Math.max(...PILLARS.map(p => reach(p.match)))
  const fb = hits && hits.length === 0 ? fallback(q) : null

  return (
    <header className="rdp rdp-head">
      <div className="in">
        <Link href="/" className="brand" aria-label="Birth Chart Library, home">
          <img src="/brand/logo.svg" alt="" width={30} height={30} />
          <span>Birth Chart Library</span>
        </Link>
        <nav aria-label="Main">
          {PILLARS.map(p => (
            <Link key={p.label} href={p.href} aria-current={(p.label === 'My chart' ? ownChart || guestOwn : top > 0 && reach(p.match) === top) ? 'page' : undefined}>{p.label}</Link>
          ))}
        </nav>
        {signedIn === false && !path.startsWith('/login') && !path.startsWith('/signup')
          ? <Link href={`/login?redirectTo=${encodeURIComponent(path)}`} className="signin" aria-label="Sign in"><span>Sign in</span><PersonIcon /></Link>
          : null}
        {signedIn ? (
          <Link href="/account" className="find" aria-label="Your account" aria-current={path.startsWith('/account') ? 'page' : undefined}>
            <PersonIcon />
          </Link>
        ) : null}
        <button className="find" aria-label={open ? 'Close search' : 'Find a person'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open
            ? <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            : <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>}
        </button>
      </div>
      {open ? (
        <div className="search">
          <form className="box" role="search" action="/search" onSubmit={e => { if (hits?.length) { e.preventDefault(); window.location.href = `/celebrity-birth-charts/${hits[0].slug}` } }}>
            <label htmlFor="rdp-q" className="sr-only">Find anyone’s chart</label>
            <input id="rdp-q" ref={input} name="q" type="search" autoComplete="off" placeholder="Find anyone’s chart" value={q} onChange={e => setQ(e.target.value)} />
            {hits && hits.length ? (
              <div className="results">
                {hits.map(h => (
                  <Link key={h.slug} href={`/celebrity-birth-charts/${h.slug}`}>
                    <span>{h.name}</span>
                    {h.sun_sign ? <small><span style={{ display: 'inline-flex', verticalAlign: '-3px', marginRight: 4 }}><Icon name="sun" size={16} /></span>{h.sun_sign}</small> : null}
                  </Link>
                ))}
              </div>
            ) : null}
            {hits && !hits.length ? (
              <p className="hint">
                {fb ? <Link className="tlink" href={fb.href}>{fb.text}</Link> : <>No one by that name in the library yet.</>}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}
    </header>
  )
}
