import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { safeSessionSet } from '@/lib/safe-storage'
import type { HomeView, HomePerson } from '@/lib/redesign/home-view'
import { DISC, ELEMENT_OF, signIcon, BODY_ICON, HOUSE_KEYS, SIGN_NAMES } from '@/lib/redesign/astro'
import SkyDiagram from './SkyDiagram'
import AdSlot from './AdSlot'

// The home page as an app screen (Issue 17, model docs/redesign/models/home-model.html):
// message and search, chart of the day, today's sky, born this week, you, shelves,
// learn. Answer first; ads only after the chart of the day and between sections.
const ROLE_DISC: Record<string, [string, string]> = { Sun: [DISC.SUN, 'sun'], Moon: [DISC.MOON, 'moon'], Rising: [DISC.RISING, 'ascendant'] }
const ord = (n: number) => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th')
const initials = (n: string) => n.split(' ').filter(w => /^[A-Z]/.test(w)).map(w => w[0]).slice(0, 2).join('')
const ELC: Record<string, string> = { Fire: '#FF8A65', Earth: '#8FCB8F', Air: '#F2D16B', Water: '#5FA8F0' }

// A face: the photo when it loads, initials on the sign's element colour otherwise.
export function Face({ name, slug, sign, size }: { name: string; slug?: string; sign?: string; size: number }) {
  const [ok, setOk] = useState(true)
  return (
    <span className="face" style={{ width: size, height: size, background: ELC[ELEMENT_OF[sign ?? ''] ?? 'Air'] ?? '#C3CBFF', fontSize: Math.round(size * 0.36) }}>
      {initials(name)}
      {ok && slug ? <img src={`/api/img/${slug}`} alt="" width={size} height={size} loading="lazy" onError={() => setOk(false)} /> : null}
    </span>
  )
}

export function SignChip({ sign, role }: { sign: string; role?: string }) {
  return <span className="schip"><span className={`el-${ELEMENT_OF[sign]}`}><Icon name={signIcon(sign)} size={14} /></span>{sign}{role ? ` ${role}` : ''}</span>
}

// The Moon as it looks tonight: the lit part drawn over a dark disc. The lit limb is
// on the right while waxing; the terminator ellipse bulges into the dark side past half.
function MoonPhase({ elong, size = 64 }: { elong: number; size?: number }) {
  const r = 30, k = (1 - Math.cos((elong * Math.PI) / 180)) / 2
  const waxing = elong < 180, rx = Math.abs(1 - 2 * k) * r
  const limb = waxing ? 1 : 0, term = (k > 0.5) === waxing ? 1 : 0
  const d = `M0 ${-r} A${r} ${r} 0 0 ${limb} 0 ${r} A${f(rx)} ${r} 0 0 ${term} 0 ${-r}Z`
  return (
    <svg width={size} height={size} viewBox="-34 -34 68 68" aria-hidden="true">
      <circle r={r} fill="#2A3160" />
      <path d={d} fill="#E9ECF7" />
    </svg>
  )
}
const f = (v: number) => Math.round(v * 10) / 10

interface Twins { sun: string; suns: string[]; moon: string; moons: string[]; total: number; people: { name: string; slug: string; sun: string; moon: string }[] }
async function getTwins(date: string): Promise<Twins | null> {
  const r = await fetch(`/api/twins?date=${encodeURIComponent(date)}`)
  return r.ok ? r.json() : null
}

export function Search() {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<{ name: string; slug: string; sun_sign: string | null; moon_sign: string | null }[] | null>(null)
  useEffect(() => {
    if (q.trim().length < 2) { setHits(null); return }
    const ctl = new AbortController()
    const t = setTimeout(() => {
      fetch(`/api/search/celebrities?q=${encodeURIComponent(q.trim())}`, { signal: ctl.signal })
        .then(r => (r.ok ? r.json() : [])).then(rows => setHits(Array.isArray(rows) ? rows : [])).catch(() => {})
    }, 200)
    return () => { clearTimeout(t); ctl.abort() }
  }, [q])
  return (
    <form className="hsearch" role="search" action="/search" onSubmit={e => { if (hits?.length) { e.preventDefault(); window.location.href = `/celebrity-birth-charts/${hits[0].slug}` } }}>
      <label htmlFor="home-q" className="sr-only">Find anyone’s chart</label>
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      <input id="home-q" name="q" type="search" autoComplete="off" placeholder="Find anyone’s chart" value={q} onChange={e => setQ(e.target.value)} />
      {hits && hits.length ? (
        <div className="hits">
          {hits.map(h => (
            <Link key={h.slug} href={`/celebrity-birth-charts/${h.slug}`}>
              <Face name={h.name} slug={h.slug} sign={h.sun_sign ?? undefined} size={40} />
              <span><b>{h.name}</b>{h.sun_sign ? <small>{h.sun_sign} Sun{h.moon_sign ? `, ${h.moon_sign} Moon` : ''}</small> : null}</span>
            </Link>
          ))}
        </div>
      ) : null}
      {hits && !hits.length ? <p className="none">No one by that name in the library yet.</p> : null}
    </form>
  )
}

function TodayForYou({ moonSign }: { moonSign: string }) {
  const [date, setDate] = useState('')
  const [line, setLine] = useState<string | null>(null)
  const go = async (e: FormEvent) => {
    e.preventDefault()
    if (!date) return
    const t = await getTwins(date)
    if (!t) { setLine('That date did not work. Check it and try again.'); return }
    const h = ((SIGN_NAMES.indexOf(moonSign as never) - SIGN_NAMES.indexOf(t.sun as never) + 12) % 12) + 1
    setLine(`${t.sun} Sun. Today’s Moon is in your ${ord(h)} sign counting from the Sun, the part of life about ${HOUSE_KEYS[h]}. Add your birth time for a reading from your real houses.`)
  }
  return (
    <form className="you" onSubmit={go}>
      <label htmlFor="today-date">What today means for you</label>
      <div className="datein"><input id="today-date" type="date" value={date} onChange={e => setDate(e.target.value)} required /><button className="btn" type="submit">Show me</button></div>
      {line ? <p className="yourline" aria-live="polite">{line}</p> : null}
    </form>
  )
}

function WhoShares() {
  const [date, setDate] = useState('')
  const [t, setT] = useState<Twins | null | 'err'>(null)
  const go = async (e: FormEvent) => { e.preventDefault(); if (date) setT((await getTwins(date)) ?? 'err') }
  return (
    <>
      <form className="datein" onSubmit={go}>
        <label htmlFor="twin-date" className="sr-only">Your birth date</label>
        <input id="twin-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <button className="btn" type="submit">Find matches</button>
      </form>
      {t === 'err' ? <p className="lede">That date did not work. Check it and try again.</p> : null}
      {t && t !== 'err' ? (
        <div className="matches" aria-live="polite">
          <p>Your Sun is in <b>{t.sun}</b> and your Moon is in <b>{t.moons.join(' or ')}</b>{t.moons.length > 1 ? ' (it changed sign that day; a birth time settles it)' : ''}.</p>
          {t.people.slice(0, 3).map(p => (
            <Link key={p.slug} href={`/celebrity-birth-charts/${p.slug}`}>
              <Face name={p.name} slug={p.slug} sign={p.sun} size={44} />
              <span><b>{p.name}</b><small>{p.sun} Sun, {p.moon} Moon</small></span>
            </Link>
          ))}
          {!t.people.length ? <p className="lede">No one in the library shares both yet.</p> : null}
          {t.total > 3 ? <Link className="more" href="/celebrity-match" onClick={() => safeSessionSet('bcl-f:match', JSON.stringify({ sun: t.sun, moon: t.moon, rising: '' }))}>See all {t.total}</Link> : null}
        </div>
      ) : null}
    </>
  )
}

export function PersonCard({ p }: { p: HomePerson }) {
  return (
    <Link className="wkcard" href={`/celebrity-birth-charts/${p.slug}`}>
      <Face name={p.name} slug={p.slug} sign={p.sun} size={52} />
      <span><b>{p.name}</b><small>{p.date}</small></span>
      <span className="signs"><SignChip sign={p.sun} role="Sun" />{p.moon ? <SignChip sign={p.moon} role="Moon" /> : null}{p.rising ? <SignChip sign={p.rising} role="rising" /> : null}</span>
    </Link>
  )
}

export default function HomePage({ view }: { view: HomeView }) {
  const c = view.cotd
  return (
    <div className="wrap wide hm">
      <div className="homehead">
        <div className="open">
          <h1>Real people’s charts, read plainly. Then yours.</h1>
          <p className="sub">Celebrity birth charts with sourced birth times, explained in plain words. Find someone, learn as you read, then add your own.</p>
          <Search />
          {view.week.length ? (
            <div className="picks" aria-label="Born this week">
              <span>Born this week</span>
              {view.week.slice(0, 4).map(p => <Link key={p.slug} href={`/celebrity-birth-charts/${p.slug}`}>{p.name}</Link>)}
            </div>
          ) : null}
        </div>

        {c ? (
          <article className="card cotd" aria-labelledby="cotd-h">
            <div className="ctop">
              <span className="label">Chart of the day: {c.label}</span>
              <span className={c.tier ? 'tier' : 'tier none'}><b>{c.tier ?? '?'}</b>{c.tierText}</span>
            </div>
            <h2 id="cotd-h"><Link href={`/celebrity-birth-charts/${c.slug}`}>{c.name}</Link></h2>
            <p className="when">{c.when}<br />{c.place}</p>
            <div className="cotdbody">
              {c.hasTime && c.asc != null ? (
                <div className="sky">
                  <SkyDiagram bodies={c.bodies} asc={c.asc} mc={c.mc} slug={c.slug} city={c.city} name={c.name} stellium={false} base={`/celebrity-birth-charts/${c.slug}`} />
                </div>
              ) : null}
              <div className="cotdtext">
                <div className="big3">
                  {c.bigThree.map(b => (
                    <Link key={b.role} className="b3" href={`/celebrity-birth-charts/${c.slug}?card=${b.role === 'Rising' ? 'rising' : b.role.toLowerCase()}`}>
                      <span className="disc" style={{ width: 32, height: 32, background: ROLE_DISC[b.role][0] }}><Icon name={ROLE_DISC[b.role][1] as never} size={18} /></span>
                      <span><b>{b.sign}</b><small>{b.role}</small></span>
                    </Link>
                  ))}
                </div>
                {c.lead ? <p className="quote">{c.lead}</p> : null}
                <div><Link className="btn" href={`/celebrity-birth-charts/${c.slug}`}>Open the chart</Link></div>
              </div>
            </div>
          </article>
        ) : null}

        <aside className="card today" aria-labelledby="today-h">
          <span className="label">Today, {view.dateLabel}</span>
          <div className="moonrow">
            <MoonPhase elong={view.moon.elong} />
            <div><h2 id="today-h">{view.moon.phase} in {view.moon.sign}</h2><p>{view.moon.lit}% lit</p></div>
          </div>
          {view.moon.line ? <p className="mline">{view.moon.line}</p> : null}
          <ul className="facts">
            {view.facts.map(x => (
              <li key={x.title}>
                <span className="disc" style={{ width: 32, height: 32, background: DISC[x.body] }}><Icon name={BODY_ICON[x.body]} size={18} /></span>
                <span>{x.title}<small>{x.sub}</small></span>
              </li>
            ))}
          </ul>
          <TodayForYou moonSign={view.moon.sign} />
        </aside>
      </div>

      <AdSlot label="Ad 1: after the chart of the day" />

      {view.week.length ? (
        <section className="band" aria-labelledby="week-h">
          <div className="bandhead"><h2 id="week-h">Born this week</h2><Link className="more" href="/born-today">Born today</Link></div>
          <p className="lede">Charts with birthdays from {view.weekLabel}.</p>
          <div className="wkrow">{view.week.map(p => <PersonCard key={p.slug} p={p} />)}</div>
        </section>
      ) : null}

      <div className="pair">
        <section className="card" aria-labelledby="twins-h">
          <span className="label">You</span>
          <h2 id="twins-h">Who shares your chart?</h2>
          <p className="lede">Your birth date gives your Sun and Moon. Add a time and place for your Rising sign.</p>
          <WhoShares />
        </section>
        <section className="card" aria-labelledby="add-h">
          <span className="label">You</span>
          <h2 id="add-h">Put your own chart in the library</h2>
          <p className="lede ink">Your sky at birth, read the same way as every chart here. Private unless you choose otherwise, and yours to delete anytime.</p>
          <div className="btns"><Link className="btn" href="/birth-chart?ref=home">Make my chart</Link><Link className="btn ghost" href="/calculators/synastry">Compare two charts</Link></div>
        </section>
      </div>

      <section className="band" aria-labelledby="shelves-h">
        <div className="bandhead"><h2 id="shelves-h">Browse the library</h2><Link className="more" href="/celebrity-birth-charts">All charts</Link></div>
        <p className="lede">Every written chart, by what they are known for.</p>
        <div className="shelves">
          {view.shelves.map(s => (
            <Link key={s.title} className="shelf" href={s.href}>
              <span className="faces">{s.faces.map(p => <Face key={p.slug} name={p.name} slug={p.slug} size={34} />)}</span>
              <span><b>{s.title}</b><small>{s.count} charts</small></span>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot label="Ad 2: between sections" />

      <section className="band" aria-labelledby="learn-h">
        <h2 id="learn-h">Learn astrology from real charts</h2>
        <p className="lede">Every meaning page shows famous people who have it.</p>
        <div className="learn">
          <Link className="lt" href="/zodiac-signs"><span className="gl"><Icon name="aries" size={20} /><Icon name="taurus" size={20} /><Icon name="gemini" size={20} /></span><b>Signs</b><small>The twelve styles</small></Link>
          <Link className="lt" href="/astrology-planets"><span className="gl"><Icon name="sun" size={20} /><Icon name="moon" size={20} /><Icon name="venus" size={20} /></span><b>Planets</b><small>What acts</small></Link>
          <Link className="lt" href="/astrology-houses"><span className="gl num">1 7 10</span><b>Houses</b><small>Where in life</small></Link>
          <Link className="lt" href="/astrology-aspects"><span className="gl"><Icon name="conjunction" size={20} /><Icon name="trine" size={20} /><Icon name="square" size={20} /></span><b>Aspects</b><small>How they talk</small></Link>
        </div>
        <div className="start"><span><b>New to this?</b> <span className="sub">Start with what a birth chart is.</span></span><Link className="more" href="/start">Start here</Link></div>
      </section>
    </div>
  )
}
