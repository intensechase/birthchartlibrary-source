import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Reading, RAspect } from '@/lib/reading/build'

// "Sam's", "James'". Local copy: importing it from build.ts would pull the whole
// entry library into the client bundle.
const possessive = (name: string) => (/s$/i.test(name) ? `${name}'` : `${name}'s`)
import type { VBody } from '@/lib/redesign/celeb-view'
import { BODY_NAME, DISC, ELEMENT_OF, ordinal } from '@/lib/redesign/astro'
import { Disc } from './Disc'
import SectionStrip from './SectionStrip'
import SkyDiagram from './SkyDiagram'
import { PATTERN_NOTES } from '@/lib/reading/patterns'

// The whole reading of a visitor's own chart as one page (spec:
// docs/redesign/2026-11-20-reading-spec.md; layout from the approved 11/20 model).
// Phone: one column with the contents strip pinned on top. Desktop: the reading
// plus a rail with the chart wheel and contents that marks where you are.

const ICON: Record<string, string> = { ASC: 'ascendant', MC: 'midheaven', NORTH_NODE: 'north-node' }
const iconOf = (p: string) => ICON[p] ?? p.toLowerCase()
const NAME: Record<string, string> = { ...BODY_NAME, ASC: 'rising sign', MC: 'Midheaven' }
const kindOf = (t: string) => (t === 'trine' || t === 'sextile' ? 'easy' : t === 'conjunction' ? 'blend' : 'hard')
const KIND_WORD: Record<string, string> = { easy: 'easy aspect', blend: 'blending aspect', hard: 'hard aspect' }
const orbWords = (orb: number) => (orb < 1 ? 'About as exact as these get' : orb < 2 ? 'Very close' : orb < 4 ? 'Close' : 'Wide, a softer pull')

function Glyph({ id, size = 18 }: { id: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <use href={`/icons.svg?v=1#${iconOf(id)}`} />
    </svg>
  )
}

function Meter({ orb }: { orb: number }) {
  const n = orb < 1 ? 5 : orb < 2 ? 4 : orb < 4 ? 3 : orb < 6 ? 2 : 1
  return <span className="meter" aria-label={`${orb.toFixed(1)}° from exact`}>{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < n ? 'on' : ''} />)}</span>
}

// The same open/close mark on every card that folds (aspects, houses, patterns).
function Chev() {
  return <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
}

function Pair({ x }: { x: RAspect }) {
  return <span className={`ag ${kindOf(x.type)}`}><Glyph id={x.a} /><em><Glyph id={x.type} size={15} /></em><Glyph id={x.b} /></span>
}

function Paras({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map(t => t.trim()).filter(Boolean).map((t, i) => <p key={i}>{t}</p>)}</>
}

function ShortWatch({ short, watch }: { short?: string[]; watch?: string }) {
  return (
    <>
      {short?.length ? <div className="short"><b>In short</b>{short.map(s => <span key={s}>{s}</span>)}</div> : null}
      {watch ? <p className="watch"><b>Watch for</b> {watch}</p> : null}
    </>
  )
}

// Anchor for one aspect, so "What stands out" can jump straight to it.
const aspId = (x: RAspect) => `a-${x.key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

// Opens a details card when the reader arrives at it by link (#a-...).
function openTarget() {
  const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
  if (el instanceof HTMLDetailsElement) el.open = true
}

function AspectRow({ x, open }: { x: RAspect; open: boolean }) {
  return (
    <details className={`asp ${kindOf(x.type)}`} id={aspId(x)} open={open}>
      <summary><Pair x={x} /><span className="ah">{x.title}</span><Meter orb={x.orb} /><span className="orb">{x.orb.toFixed(1)}°</span><Chev /></summary>
      <div className="ab">
        <p className="exact">{orbWords(x.orb)}, {KIND_WORD[kindOf(x.type)]}.</p>
        {x.shared ? <p className="gen">{x.shared}</p> : null}
        {x.entry ? (
          <>
            <p>{x.entry.hook}</p>
            <Paras text={x.entry.text} />
            <ShortWatch short={x.entry.short} watch={x.entry.watch} />
          </>
        ) : (
          <p className="gen">{x.general} A reading written for this pair is on the way.</p>
        )}
      </div>
    </details>
  )
}

function KiteDrawing({ k }: { k: NonNullable<Reading['kite']> }) {
  const size = 220, c = size / 2, r = 78
  const base = k.lon[k.corners[0]]
  const at = (lon: number) => { const a = ((180 + lon - base) * Math.PI) / 180; return [c + r * Math.cos(a), c - r * Math.sin(a)] }
  const [o, s1, s2] = k.corners
  const lines: [string, string, string][] = [[o, s1, 'easy'], [s1, s2, 'easy'], [s2, o, 'easy'], [k.tip, o, 'hard'], [k.tip, s1, 'soft'], [k.tip, s2, 'soft']]
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label={`A Kite: ${[o, s1, s2].map(id => BODY_NAME[id]).join(', ')} in a triangle, ${BODY_NAME[k.tip]} at the tip`}>
      <circle cx={c} cy={c} r={c - 6} fill="none" stroke="var(--rule)" />
      {lines.map(([a, b, cls]) => { const [x1, y1] = at(k.lon[a]), [x2, y2] = at(k.lon[b]); return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} className={`kl ${cls}`} /> })}
      {[o, s1, s2, k.tip].map(id => {
        const [x, y] = at(k.lon[id])
        return (
          <g key={id}>
            <circle cx={x} cy={y} r={13} fill={DISC[id]} />
            <svg x={x - 8} y={y - 8} width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgb(var(--rd-dark))" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><use href={`/icons.svg?v=1#${iconOf(id)}`} /></svg>
          </g>
        )
      })}
    </svg>
  )
}

const CHAPTERS = [
  { id: 'glance', label: 'At a glance' }, { id: 'stands-out', label: 'What stands out' },
  { id: 'planets', label: 'Planets' }, { id: 'houses', label: 'Houses' }, { id: 'patterns', label: 'Patterns' },
]

export default function ReadingPage({ r, chartId, sky, subject = null }: { r: Reading; chartId: string; sky: { bodies: VBody[]; asc: number | null; mc: number | null }; subject?: string | null }) {
  const whose = subject ? possessive(subject) : 'your'
  const chapters = CHAPTERS.filter(c => c.id !== 'houses' || r.houses.length)
  const [here, setHere] = useState('glance')
  useEffect(() => {
    let frame = 0
    const pick = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let id = chapters[0].id
        for (const ch of chapters) { const el = document.getElementById(ch.id); if (el && el.getBoundingClientRect().top < innerHeight / 3) id = ch.id }
        setHere(id)
      })
    }
    addEventListener('scroll', pick, { passive: true })
    addEventListener('hashchange', openTarget)
    pick()
    openTarget()
    return () => { removeEventListener('scroll', pick); removeEventListener('hashchange', openTarget); cancelAnimationFrame(frame) }
  }, [chapters.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const elements = r.groups.find(g => g.name === 'Elements')?.members ?? []
  const modes = r.groups.find(g => g.name === 'Modalities')?.members ?? []
  const total = elements.reduce((t, m) => t + m.n, 0) || 1
  const bar = (m: { m: string; n: number; status: string }) => {
    const note = PATTERN_NOTES[m.m]
    const extra = m.status === 'lacking' ? note?.lacking : m.status === 'dominant' ? note?.dominant : null
    return (
      <details className={`bar m-${m.m.toLowerCase()}`} key={m.m}>
        <summary>
          <span>{m.m}</span><span className="tr"><i style={{ width: `${(m.n / total) * 100}%` }} /></span>
          <b>{m.n} of {total}{m.status === 'lacking' ? ', missing' : m.status === 'dominant' ? ', strongest' : ''}</b><Chev />
        </summary>
        {note ? <div className="pb"><p>{note.base}</p>{extra ? <p>{extra}</p> : null}</div> : null}
      </details>
    )
  }
  // The wheel stays inside the reading: each planet goes to its own entry.
  const anchors = new Set(r.planets.map(p => p.anchor))
  const wheelHref = (card: string) => (anchors.has(`p-${card}`) ? `#p-${card}` : card === 'rising' ? '#glance' : card === 'midheaven' && r.houses.length ? '#houses' : '#planets')
  const featHref = (x: RAspect) => (r.planets.some(p => p.aspects.some(a => a.key === x.key)) ? `#${aspId(x)}` : `#p-${x.a.toLowerCase().replace('_', '-')}`)

  return (
    <main className="rdp rdg">
      <div className="wrap">
        <div className="hero">
          <p className="when">{r.birthLine}<br />{r.place}</p>
          <h1>{subject ? `${possessive(subject)} reading` : 'Your reading'}</h1>
          <p className="sub">The whole chart in plain words: the three things that make you you, what stands out, every planet{r.houses.length ? ', your twelve houses' : ''} and the patterns they make.</p>
          {subject ? <p className="sub">Every entry is written as if speaking to {subject}, so read &ldquo;you&rdquo; as {subject}.</p> : null}
          <p className="back"><Link href={`/birth-chart/${chartId}`}>{subject ? `Back to ${possessive(subject)} chart` : 'Back to your chart'}</Link></p>
        </div>
        <div className="narrow-strip"><SectionStrip sections={chapters} label="Reading contents" /></div>
        <div className="grid">
          <div className="col">
            <section id="glance">
              <h2>At a glance</h2>
              <ul className="big">
                {r.big.map(b => (
                  <li key={b.key}>
                    <Disc disc={b.disc} size={40} iconSize={22} />
                    <div><b>{b.label}</b><small>{b.sub}</small>{b.hook ? <p>{b.hook}</p> : b.either?.map(e => <p key={e.sign}>If {e.sign}: {e.hook}</p>)}</div>
                  </li>
                ))}
              </ul>
              {!r.hasTime ? (
                <p className="lede notime">
                  Without a birth time there is no rising sign or houses, so this reading covers the planets by sign and their aspects.
                  {r.changed.map(c => ` The ${c.name} changed sign that day (${c.when === 'later' ? `${c.noon} to ${c.alt}` : `${c.alt} to ${c.noon}`}), so it could be either.`).join('')}{r.changed.length ? ' A birth time settles it.' : ''}
                </p>
              ) : null}
              {r.pair ? (
                <div className="pairx">
                  <h3>{r.pair.title}</h3>
                  <p>{r.pair.entry.hook}</p>
                  <Paras text={r.pair.entry.text} />
                  <ShortWatch short={r.pair.entry.short} watch={r.pair.entry.watch} />
                </div>
              ) : null}
            </section>

            {r.feats.length ? (
              <section id="stands-out">
                <h2>What stands out</h2>
                <p className="lede">{r.hasTime ? `The things an astrologer would mention first: planets sitting on ${whose} angles, then the tightest aspects.` : `The things an astrologer would mention first: ${whose} tightest aspects.`} Choose one to read it.</p>
                <div className="feats">
                  {r.feats.map(x => (
                    <a key={x.key} className="ft" href={featHref(x)} onClick={() => setTimeout(openTarget, 0)}>
                      <Pair x={x} />
                      <span className="tx"><b>{x.title}</b><small>{orbWords(x.orb)}, {KIND_WORD[kindOf(x.type)]}.</small></span>
                      <Meter orb={x.orb} />
                    </a>
                  ))}
                </div>
                {r.kite ? (
                  <div className="kite">
                    <div className="kd"><KiteDrawing k={r.kite} /></div>
                    <div>
                      <h3>A Kite in {r.kite.element.toLowerCase()}</h3>
                      <p>{r.kite.entry.hook}</p>
                      <Paras text={r.kite.entry.text} />
                      <p className="meta">Yours: {r.kite.corners.map(id => BODY_NAME[id]).join(', ').replace(/, ([^,]*)$/, ' and $1')} in {r.kite.element.toLowerCase()}, with {BODY_NAME[r.kite.tip]} at the tip{r.kite.tipHouse ? ` in your ${ordinal(r.kite.tipHouse)} house` : ''}.</p>
                      <p className="legend"><span className="easy">trine</span><span className="soft">sextile</span><span className="hard">opposition</span></p>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            <section id="planets">
              <h2>Planets</h2>
              <p className="lede">Each planet by sign{r.hasTime ? ' and house' : ''}, then the aspects it makes, tightest first. The closest two start open; open any other to read it.</p>
              {r.planets.map(p => (
                <article className="pl" id={p.anchor} key={p.id}>
                  <header>
                    <Disc disc={p.disc} size={40} iconSize={22} />
                    <div><h3>{p.title}</h3><p className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</p></div>
                  </header>
                  {p.generational ? <p className="gen">Everyone born across several years shares {BODY_NAME[p.id]} in this sign. The house is the personal part.</p> : null}
                  {p.alts?.map(a => <div key={a.sign}><h4>If it was in {a.sign}</h4>{a.paras.map((t, i) => <p key={i}>{t}</p>)}</div>)}
                  {p.paras.map((t, i) => <p key={i}>{t}</p>)}
                  {p.aspects.length ? (
                    <div className="asps">
                      <h4>{p.aspects.length} aspect{p.aspects.length === 1 ? '' : 's'}</h4>
                      {p.aspects.map((x, i) => <AspectRow key={x.key} x={x} open={!!x.entry && i < 2} />)}
                    </div>
                  ) : null}
                </article>
              ))}
            </section>

            {r.houses.length ? (
              <section id="houses">
                <h2>Houses</h2>
                <p className="lede">Twelve areas of life, each starting in a sign. Open one to read it; the number on the right is how many planets live there.</p>
                <div className="hlist">
                  {r.houses.map(h => (
                    <details className="hs" key={h.n}>
                      <summary>
                        <span className="hn">{h.n}</span>
                        <span className={`hz ${ELEMENT_OF[h.sign]?.toLowerCase()}`}><Glyph id={h.sign} /></span>
                        <span className="ht"><b>{h.sign} on the {ordinal(h.n)}</b><small>{h.area}</small></span>
                        <span className="hi">{h.inside.length || ''}</span><Chev />
                      </summary>
                      <p className="meta">
                        Ruled by {h.ruler}{h.rulerAt ? `, in ${h.rulerAt}` : ''}.{h.co ? ` Traditional ruler: ${h.co}.` : ''}{' '}
                        {h.inside.length ? `Planets here: ${h.inside.join(', ')}.` : 'No planets here.'}
                      </p>
                      {h.entry ? (
                        <div className="hb">
                          <p>{h.entry.hook}</p>
                          <Paras text={h.entry.text} />
                          <ShortWatch short={h.entry.short} watch={h.entry.watch} />
                        </div>
                      ) : null}
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <section id="patterns">
              <h2>Patterns</h2>
              <p className="lede">How the ten planets split by element and by mode. Open a row to see what it means.</p>
              <div className="bars">{elements.map(bar)}</div>
              <div className="bars">{modes.map(bar)}</div>
            </section>

            <section id="next">
              <h2>Where to go next</h2>
              <div className="nexts">
                <Link className="nx" href="/daily-horoscope"><b>Today, for your chart</b><small>What the current sky is doing to your planets.</small></Link>
                <Link className="nx" href={`/birth-chart/${chartId}`}><b>Your chart wheel</b><small>The picture of all this, plus a card to share.</small></Link>
                <Link className="nx" href="/celebrity-match"><b>Who shares your chart</b><small>Famous people with your Sun, Moon and rising.</small></Link>
                <Link className="nx" href="/calculators/synastry"><b>Compare with someone</b><small>Put your chart next to a partner or friend.</small></Link>
              </div>
            </section>
          </div>

          <aside className="rail">
            <div className="sticky">
              {sky.asc != null ? <SkyDiagram bodies={sky.bodies} asc={sky.asc} mc={sky.mc} slug="your-chart" city="" name="You" stellium={false} hrefOf={wheelHref} /> : null}
              <p className="rn">{r.summary}</p>
              <nav className="toc" aria-label="Reading contents">
                {chapters.map(c => <a key={c.id} href={`#${c.id}`} className={here === c.id ? 'on' : ''} aria-current={here === c.id ? 'true' : undefined}>{c.label}</a>)}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

