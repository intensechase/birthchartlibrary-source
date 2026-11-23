import { useEffect, useRef, useState, type FormEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import { getUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'
import { SIGN_LIST } from '@/lib/constants'
import { isSignedIn, readKept } from '@/lib/kept-chart'
import { safeSessionGet, safeSessionSet } from '@/lib/safe-storage'
import { LearnHero, NextLinks } from '@/components/redesign/Learn'
import { Face, SignChip } from '@/components/redesign/HomePage'

interface Signs { sun: string; moon: string; rising: string; venus?: string; mars?: string; mercury?: string }
interface Match { name: string; slug: string; sun: string; moon: string; rising: string | null; big: number; shares: string[] }
interface Props { own: Signs | null }

const KEY = 'bcl-f:match'
const isSign = (v: unknown): v is string => typeof v === 'string' && SIGN_LIST.includes(v)
const list = (a: string[]) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`)
const GROUPS: [big: number, title: string][] = [[3, 'All three'], [2, 'Two of three'], [1, 'One of three']]

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const user = await getUser(context)
  if (!user) return { props: { own: null } }
  const row = await queryOne<{ timed: boolean; chart_data: { planets?: { planet: string; sign: string }[]; ascendantSign?: string } }>(
    'SELECT (birth_time_enc IS NOT NULL OR birth_time IS NOT NULL) AS timed, chart_data FROM birth_charts WHERE user_id = $1 AND is_primary = true',
    [user.id],
  )
  const sign = (id: string) => row?.chart_data?.planets?.find(p => p.planet === id)?.sign ?? ''
  if (!sign('SUN') || !sign('MOON')) return { props: { own: null } }
  return {
    props: {
      own: {
        sun: sign('SUN'), moon: sign('MOON'), rising: row?.timed ? row.chart_data.ascendantSign ?? '' : '',
        venus: sign('VENUS'), mars: sign('MARS'), mercury: sign('MERCURY'),
      },
    },
  }
}

export default function CelebrityMatchPage({ own }: Props) {
  const [mode, setMode] = useState<'date' | 'signs'>('date')
  const [date, setDate] = useState('')
  const [pick, setPick] = useState<Signs>({ sun: '', moon: '', rising: '' })
  const [shown, setShown] = useState<Signs | null>(null)
  const [other, setOther] = useState<{ sun?: string; moon?: string }>({})
  const [mine, setMine] = useState<Signs | null>(own)
  const [results, setResults] = useState<Match[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const run = useRef(0)
  const isMineRef = useRef(false)

  async function find(s: Signs, alt: { sun?: string; moon?: string } = {}) {
    const n = ++run.current
    setBusy(true); setError(null); setPick(s); setOther(alt)
    safeSessionSet(KEY, JSON.stringify({ sun: s.sun, moon: s.moon, rising: s.rising }))
    try {
      const r = await fetch('/api/celebrity-match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
      if (!r.ok) throw new Error()
      const d = await r.json()
      if (n !== run.current) return
      setResults(d.results ?? []); setShown(s)
      // The form moves above a lookup, so start the page from the top.
      if (isMineRef.current) window.scrollTo({ top: 0 })
    } catch {
      if (n === run.current) setError('That did not work. Try again in a moment.')
    } finally {
      if (n === run.current) setBusy(false)
    }
  }

  // The last signs looked up in this tab, else the reader's own chart: from the
  // account, or the one kept on this device.
  useEffect(() => {
    let me = own
    if (!me && !isSignedIn()) {
      const v = readKept()?.chart.view
      const big = (id: string) => v?.bodies.find(b => b.id === id)?.sign ?? ''
      if (v && big('SUN') && big('MOON')) me = { sun: big('SUN'), moon: big('MOON'), rising: v.hasTime ? v.risingSign ?? '' : '', venus: big('VENUS'), mars: big('MARS'), mercury: big('MERCURY') }
    }
    setMine(me)
    let last: Partial<Signs> | null = null
    try { last = JSON.parse(safeSessionGet(KEY) ?? 'null') } catch { /* ignore */ }
    if (last && isSign(last.sun) && isSign(last.moon)) {
      const s = { sun: last.sun, moon: last.moon, rising: isSign(last.rising) ? last.rising : '' }
      const same = me && me.sun === s.sun && me.moon === s.moon && me.rising === s.rising
      find(same ? me! : s)
      if (!same) setMode('signs')
    } else if (me) find(me)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function byDate(e: FormEvent) {
    e.preventDefault()
    if (!date) return
    setError(null); setBusy(true)
    try {
      const r = await fetch(`/api/twins?date=${encodeURIComponent(date)}`)
      if (!r.ok) throw new Error()
      const t = await r.json() as { sun: string; suns: string[]; moon: string; moons: string[] }
      await find({ sun: t.sun, moon: t.moon, rising: '' }, { sun: t.suns.find(x => x !== t.sun), moon: t.moons.find(x => x !== t.moon) })
    } catch {
      setBusy(false); setError('That date did not work. Check it and try again.')
    }
  }

  const isMine = !!mine && !!shown && mine.sun === shown.sun && mine.moon === shown.moon && mine.rising === shown.rising
  useEffect(() => { isMineRef.current = isMine }, [isMine])
  const select = (key: 'sun' | 'moon' | 'rising', label: string, empty: string) => (
    <label className="field">
      <span>{label}</span>
      <select value={pick[key]} onChange={e => setPick({ sun: pick.sun, moon: pick.moon, rising: pick.rising, [key]: e.target.value })} required={key !== 'rising'}>
        <option value="">{empty}</option>
        {SIGN_LIST.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </label>
  )

  // The reader's own matches come before the form; a lookup comes under it.
  const form = (
    <div className="mform">
      <div className="seg" role="radiogroup" aria-label="How to look">
        {([['date', 'By birth date'], ['signs', 'I know my signs']] as const).map(([k, label]) => (
          <button key={k} type="button" role="radio" aria-checked={mode === k} onClick={() => setMode(k)}>{label}</button>
        ))}
      </div>
      {mode === 'date' ? (
        <form className="fstack" onSubmit={byDate}>
          <label className="field"><span>Birth date</span><input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
          <button type="submit" className="btn wide" disabled={busy || !date}>{busy ? 'Looking…' : 'Find my twins'}</button>
        </form>
      ) : (
        <form className="fstack" onSubmit={e => { e.preventDefault(); if (pick.sun && pick.moon) find(mine && mine.sun === pick.sun && mine.moon === pick.moon && mine.rising === pick.rising ? mine : { sun: pick.sun, moon: pick.moon, rising: pick.rising }) }}>
          <div className="three">{select('sun', 'Sun sign', 'Pick one')}{select('moon', 'Moon sign', 'Pick one')}{select('rising', 'Rising sign', 'Not sure')}</div>
          <button type="submit" className="btn wide" disabled={busy || !pick.sun || !pick.moon}>{busy ? 'Looking…' : 'Find my twins'}</button>
        </form>
      )}
      {error ? <p className="err" role="alert">{error}</p> : null}
    </div>
  )
  const matches = shown && results ? (
      <section className="lsec" aria-live="polite">
        <h2>{isMine ? 'Your celebrity twins' : 'Celebrity twins'}</h2>
        <p className="chips"><SignChip sign={shown.sun} role="Sun" /><SignChip sign={shown.moon} role="Moon" />{shown.rising ? <SignChip sign={shown.rising} role="rising" /> : null}</p>
        {other.moon ? <p className="disclose">The Moon changed sign around that day, so it could be {other.moon}. <button type="button" className="tlink" onClick={() => find({ ...shown, moon: other.moon! }, { ...other, moon: shown.moon })}>Use {other.moon}</button></p> : null}
        {other.sun ? <p className="disclose">The Sun changed sign around that day, so it could be {other.sun}. <button type="button" className="tlink" onClick={() => find({ ...shown, sun: other.sun! }, { ...other, sun: shown.sun })}>Use {other.sun}</button></p> : null}
        {mine && !isMine ? <p><button type="button" className="tlink" onClick={() => find(mine)}>Back to your own chart</button></p> : null}
        {GROUPS.map(([n, title]) => {
          const people = results.filter(r => r.big === n)
          if (!people.length) return null
          return (
            <div key={n}>
              <h3>{shown.rising ? title : n === 2 ? 'Sun and Moon' : 'Sun or Moon'}</h3>
              <div className="matches">
                {people.map(p => (
                  <Link key={p.slug} href={`/celebrity-birth-charts/${p.slug}`}>
                    <Face name={p.name} slug={p.slug} sign={p.sun} size={44} />
                    <span><b>{p.name}</b><small>Same {list(p.shares)}</small></span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
        {!results.length ? <p>No one in the library shares these signs yet.</p> : null}
      </section>
    ) : null

  return (
    <>
      <Head>
        <title>Which Celebrity Shares Your Chart? | Birth Chart Library</title>
        <meta name="description" content="Enter your birth date, or your Sun, Moon and rising signs, and see which famous people share your chart. Free, no account." />
        <link rel="canonical" key="canonical" href="https://birthchartlibrary.com/celebrity-match" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Home', url: 'https://birthchartlibrary.com' },
          { name: 'Celebrity twins', url: 'https://birthchartlibrary.com/celebrity-match' },
        ])) }} />
      </Head>
      <main className="rdp"><div className="lrn twins">
        <LearnHero crumbs={[{ label: 'Library', href: '/celebrity-birth-charts' }, { label: 'Celebrity twins' }]} title="Which celebrity shares your chart?">
          <p>{mine ? 'The famous people whose signs match yours.' : 'Your birth date gives your Sun and Moon. Add your rising sign if you know it.'}</p>
        </LearnHero>

        {isMine ? matches : null}
        {isMine ? <h2 className="another">Look up someone else</h2> : null}
        {form}
        {isMine ? null : matches}

        {!mine ? (
          <section className="lsec">
            <h2>Get your rising sign too</h2>
            <p>Make your chart with your birth time and place. Your twins then match on your rising sign, Venus, Mars and Mercury as well.</p>
            <p><Link className="btn" href="/birth-chart?ref=match">Make your chart</Link></p>
          </section>
        ) : null}

        <section className="lsec">
          <h2>How matching works</h2>
          <p>Everyone in the library with a written profile is checked. Sharing all three of Sun, Moon and rising comes first, then two, then one. A rising sign only counts for people whose birth time is known.</p>
        </section>

        <NextLinks title="Keep going" links={[
          { href: '/calculators/synastry', title: 'Compare two charts', sub: 'You and anyone, planet by planet' },
          { href: '/love/celebrity-couples', title: 'Famous couples', sub: 'How their charts fit together' },
          { href: '/born-today', title: 'Born today', sub: 'Who shares today’s date' },
          { href: '/celebrity-birth-charts', title: 'The library', sub: 'Every chart' },
        ]} />
      </div></main>
    </>
  )
}
