import type { MouseEvent, ReactElement } from 'react'
import type { VBody } from '@/lib/redesign/celeb-view'
import { BODY_NAME, DISC, bodySlug, ordinal } from '@/lib/redesign/astro'
import { useCards, CardLink } from './cards'

// The sky at the moment of birth, drawn as the visible half: a dome over the
// horizon, Rising (east) on the left, Setting (west) on the right (owner, 11/20:
// same as the home page). Positions come from stored chart data by rule, never by
// hand. Planets above the horizon are houses 7 to 12; the ones below the horizon
// are listed under the dome as chips that open their cards.
// Three or more planets in one sign above the horizon become one "N in Sign" mark.
const W = 360, CX = 180, CY = 184, R = 168, D = 13, CH = 6.9
const WORDS = ['', '', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']
const ORDER = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO', 'NORTH_NODE', 'CHIRON']
const f = (v: number) => Math.round(v * 10) / 10
const iconId = (id: string) => (id === 'NORTH_NODE' ? 'north-node' : id.toLowerCase())
const ang = (lon: number, asc: number) => ((((180 + lon - asc) % 360) + 360) % 360)
const pt = (a: number, r: number): [number, number] => [CX + r * Math.cos((a * Math.PI) / 180), CY - r * Math.sin((a * Math.PI) / 180)]

// Seeded stars so each person's sky is the same on every build.
function stars(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const rnd = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
  return Array.from({ length: 48 }, () => {
    const [x, y] = pt(rnd() * 180, Math.sqrt(rnd()) * (R - 6))
    return [f(x), f(y), f(0.35 + rnd() * 0.8), f(0.2 + rnd() * 0.45)]
  })
}

type Box = [number, number, number, number]
interface Item { a: number; g: VBody[]; label: string; card: string }

// base: where card links point. Empty on the celebrity page itself (cards open in
// place); the person's page elsewhere, such as the home page's chart of the day.
export default function SkyDiagram({ bodies, asc, mc, slug, city, name, stellium, base = '', hrefOf }: {
  bodies: VBody[]; asc: number; mc: number | null; slug: string; city: string; name: string; stellium: boolean; base?: string
  hrefOf?: (card: string) => string // the full reading: go to the planet's entry on the same page
}) {
  const { open, has } = useCards()
  const href = hrefOf ?? ((card: string) => `${base}?card=${card}`)
  const go = (card: string) => (e: MouseEvent) => {
    if (!has(card) || e.metaKey || e.ctrlKey) return
    e.preventDefault()
    open(card)
  }
  const up = bodies.filter(b => (b.house ?? 0) >= 7)
  const down = bodies.filter(b => (b.house ?? 0) < 7).sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
  const names = (l: VBody[]) => (l.length ? l.map(b => BODY_NAME[b.id]).join(', ') : 'no planets')
  const desc = `The sky over ${city} when ${name === 'You' ? 'you were' : name + ' was'} born. Above the horizon: ${names(up)}. Below the horizon: ${names(down)}.`

  // 1. what to place: same sign groups of 3+, everyone else alone
  const bySign = new Map<string, VBody[]>()
  for (const b of up) bySign.set(b.sign, [...(bySign.get(b.sign) ?? []), b])
  const items: Item[] = []
  for (const [sign, g] of bySign) {
    if (g.length >= 3) {
      g.sort((x, y) => x.lon - y.lon)
      items.push({ a: ang(g.reduce((t, b) => t + b.lon, 0) / g.length, asc), g, label: `${WORDS[g.length] ?? g.length} in ${sign}`, card: stellium ? 'stellium' : bodySlug(g[0].id) })
    } else g.forEach(b => items.push({ a: ang(b.lon, asc), g: [b], label: BODY_NAME[b.id], card: bodySlug(b.id) }))
  }
  items.sort((x, y) => y.g.length - x.g.length || ORDER.indexOf(x.g[0].id) - ORDER.indexOf(y.g[0].id))

  // 2. greedy placement: a few distances from the centre, both label sides, and a
  // small slide along the arc for marks near the horizon; never on top of another
  // mark, a label, the Midheaven tick or the Rising and Setting words.
  const m = mc != null ? pt(ang(mc, asc), R) : null
  const boxes: Box[] = [[0, CY - 2, 46, CY + 18], [W - 52, CY - 2, W, CY + 18]]
  if (m) boxes.push([m[0] - 12, m[1] - 4, m[0] + 12, m[1] + 16])
  const hit = (b: Box) => boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])
  const marks: ReactElement[] = []
  items.forEach((it, n) => {
    const w = it.g.length * (D * 2 + 2) - 2, lw = it.label.length * CH
    let best: { x: number; y: number; side: 'r' | 'l'; lab: Box } | null = null
    search: for (const da of [0, 6, -6, 12, -12, 20, -20]) {
      for (const r of [R - 38, R - 72, R - 104, R - 20, R - 130]) {
        const [x, y] = pt(Math.min(172, Math.max(8, it.a + da)), r)
        for (const side of (x < CX ? ['r', 'l'] : ['l', 'r']) as ('r' | 'l')[]) {
          const mark: Box = [x - w / 2, y - D, x + w / 2, y + D]
          const lab: Box = it.g.length > 1 ? [x - lw / 2, y + D + 2, x + lw / 2, y + D + 16]
            : side === 'r' ? [x + D + 4, y - 7, x + D + 4 + lw, y + 7] : [x - D - 4 - lw, y - 7, x - D - 4, y + 7]
          if ([mark, lab].some(b => b[0] < 2 || b[2] > W - 2 || b[1] < 2 || b[3] > CY - 4)) continue
          if (hit(mark) || hit(lab)) continue
          boxes.push(mark, lab)
          best = { x, y, side, lab }
          break search
        }
      }
    }
    if (!best) { // nowhere clear (very crowded skies): fall back to the true spot
      const [x, y] = pt(it.a, R - 60)
      best = { x, y, side: 'r', lab: [x + D + 4, y - 7, x + D + 4 + lw, y + 7] }
    }
    const { x, y, side, lab } = best
    const group = it.g.length > 1
    const tx = group ? (lab[0] + lab[2]) / 2 : side === 'r' ? lab[0] : lab[2]
    const aria = group ? `${it.label}: ${it.g.map(b => BODY_NAME[b.id]).join(', ')}` : `${BODY_NAME[it.g[0].id]} in ${it.g[0].sign}${it.g[0].house ? `, ${ordinal(it.g[0].house)} house` : ''}`
    marks.push(
      <a key={it.card + n} href={href(it.card)} rel="nofollow" onClick={go(it.card)} aria-label={aria} className="body" style={{ ['--i' as string]: n }}>
        <rect className="halo" x={f(x - w / 2 - 4)} y={f(y - D - 4)} width={f(w + 8)} height={f(D * 2 + 8)} rx={D + 4} fill="none" stroke="#C3CBFF" strokeWidth={1.25} />
        {it.g.map((b, k) => {
          const cx = x - (it.g.length - 1) * (D + 1) + k * (D * 2 + 2), gl = D * 1.3
          return (
            <g key={b.id}>
              <circle cx={f(cx)} cy={f(y)} r={D} fill={DISC[b.id]} />
              <svg x={f(cx - gl / 2)} y={f(y - gl / 2)} width={f(gl)} height={f(gl)} viewBox="0 0 24 24" fill="none" stroke="#12162E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" overflow="visible">
                <use href={`/icons.svg?v=1#${iconId(b.id)}`} />
              </svg>
            </g>
          )
        })}
        <text x={f(tx)} y={f(lab[1] + 11)} fontSize={12.5} fontWeight={group ? 650 : 500} fill="#E6E9F5" textAnchor={group ? 'middle' : side === 'r' ? 'start' : 'end'}>{it.label}</text>
      </a>,
    )
  })

  const legendDisc = (b: VBody) => (
    <i style={{ background: DISC[b.id] }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#12162E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><use href={`/icons.svg?v=1#${iconId(b.id)}`} /></svg>
    </i>
  )
  const st = stars(slug)
  return (
    <>
      <svg role="img" aria-labelledby={`skyt-${slug}`} viewBox={`0 0 ${W} 200`} fontFamily="inherit">
        <title id={`skyt-${slug}`}>{desc}</title>
        <defs>
          <radialGradient id={`dome-${slug}`} cx="50%" cy="100%" r="100%">
            <stop offset="0" stopColor="#262E62" />
            <stop offset="1" stopColor="#1A2048" />
          </radialGradient>
        </defs>
        <path d={`M${CX - R} ${CY}A${R} ${R} 0 0 1 ${CX + R} ${CY}Z`} fill={`url(#dome-${slug})`} />
        <g fill="#C3CBFF" aria-hidden="true">{st.map((s, k) => <circle key={k} cx={s[0]} cy={s[1]} r={s[2]} opacity={s[3]} />)}</g>
        <line x1={0} y1={CY} x2={W} y2={CY} stroke="#9AA8FF" strokeWidth={1.5} />
        <a href={href('rising')} rel="nofollow" onClick={go('rising')} aria-label="Rising sign">
          <text x={2} y={CY + 14} fontSize={12} fill="#9AA8FF">Rising</text>
        </a>
        <text x={W - 2} y={CY + 14} fontSize={12} fill="#9AA8FF" textAnchor="end">Setting</text>
        {m ? (
          <a href={href('midheaven')} rel="nofollow" onClick={go('midheaven')} aria-label="Midheaven">
            <line x1={f(m[0])} y1={f(m[1])} x2={f(CX + (m[0] - CX) * 0.94)} y2={f(CY + (m[1] - CY) * 0.94)} stroke="#9AA8FF" strokeWidth={1.5} />
          </a>
        ) : null}
        {marks}
      </svg>
      {down.length ? (
        <div className="below">
          <span>Below the horizon</span>
          {down.map(b => (
            base || hrefOf ? (
              <a key={b.id} href={href(bodySlug(b.id))} className="c">{legendDisc(b)}{BODY_NAME[b.id]}</a>
            ) : (
              <CardLink key={b.id} card={bodySlug(b.id)} className="c" label={`${BODY_NAME[b.id]} in ${b.sign}${b.house ? `, ${ordinal(b.house)} house` : ''}`}>
                {legendDisc(b)}{BODY_NAME[b.id]}
              </CardLink>
            )
          ))}
        </div>
      ) : null}
    </>
  )
}
