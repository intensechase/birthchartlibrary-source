// SERVER ONLY. Turns a chart view into the personal reading (spec:
// docs/redesign/2026-11-20-reading-spec.md; layout approved from the 11/20 model).
// Written entries come from ./entries; the planet text is the site's own sign and
// house text. Anything without writing shows only its facts, never a template.
import { either, type CelebView, type VBody, type VDisc } from '@/lib/redesign/celeb-view'
import { ASPECTS, natalOrb } from '@/lib/interpretations/aspects'
import { BODY_NAME, BODY_ORDER, DISC, ELEMENT_OF, SIGN_NAMES, TEN, bodySlug, ordinal } from '@/lib/redesign/astro'
import { MODERN_RULER, coRuler, DIGNITY_LABEL } from '@/lib/redesign/texts'
import { ENTRIES, type Entry } from './entries'
import { YOU_IN_HOUSE, YOU_IN_SIGN } from './planet-text'

export type Point = string // a body id, or ASC / MC
export interface RAspect { key: string; a: Point; b: Point; type: string; orb: number; title: string; entry: Entry | null; general: string; shared: string | null }
export interface RPlanet {
  id: string; anchor: string; title: string; disc: VDisc; tags: string[]
  generational: boolean; paras: string[]; aspects: RAspect[]
  // No birth time and it changed sign that day: the sign text for each.
  alts?: { sign: string; paras: string[] }[]
}
export interface RHouse { n: number; sign: string; area: string; ruler: string; rulerAt: string | null; co: string | null; inside: string[]; entry: Entry | null }
export interface Reading {
  birthLine: string; place: string; hasTime: boolean
  big: { key: string; label: string; sub: string; disc: VDisc; hook: string | null; either?: { sign: string; hook: string }[] }[]
  pair: { title: string; entry: Entry } | null
  feats: RAspect[]
  kite: { corners: string[]; tip: string; element: string; tipHouse: number | null; entry: Entry; lon: Record<string, number> } | null
  planets: RPlanet[]
  houses: RHouse[]
  groups: CelebView['groups']
  changed: CelebView['signChanges']
  summary: string
}

const SLOW = new Set(['URANUS', 'NEPTUNE', 'PLUTO'])
const NAME: Record<string, string> = { ...BODY_NAME, ASC: 'rising sign', MC: 'Midheaven' }
const AREA = ['', 'self, body, first impressions', 'money, values, belongings', 'siblings, speech, short trips', 'home, family, roots',
  'creativity, romance, play', 'work, health, daily routine', 'partners, marriage, rivals', 'shared money, intimacy, change',
  'travel, belief, learning', 'career, reputation, public life', 'friends, groups, hopes', 'solitude, the hidden, endings']
// Angle aspects (spec): conjunction, square, opposition within 8°; trine and sextile within 4°.
const ANGLE_TYPES: [string, number, number][] = [['conjunction', 0, 8], ['sextile', 60, 4], ['square', 90, 8], ['trine', 120, 4], ['opposition', 180, 8]]
const sep = (x: number, y: number) => { const d = Math.abs(x - y) % 360; return d > 180 ? 360 - d : d }
const parasOf = (t: string) => t.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean)
const bothSigns = (b: VBody) => (!b.alt ? [b.sign] : b.alt.when === 'earlier' ? [b.alt.sign, b.sign] : [b.sign, b.alt.sign])
const signOf = (lon: number) => SIGN_NAMES[Math.floor((((lon % 360) + 360) % 360) / 30)]

// Whose chart: "your" on the reader's own chart, "Sam's" on a chart saved for someone else.
let whose = 'your'
export const possessive = (name: string) => (/s$/i.test(name) ? `${name}'` : `${name}'s`)

function titleOf(a: Point, type: string, b: Point) {
  return `${NAME[a]} ${type} ${b === 'ASC' || b === 'MC' ? whose + ' ' + NAME[b] : NAME[b]}`
}
// Aspects between two slow planets are shared by everyone born around the same
// time, so the page says so once in code instead of every entry repeating it.
// Span = the aspect's full orb window (2 x orb) / mean relative motion, using
// NASA orbital periods in days (nssdc.gsfc.nasa.gov/planetary/factsheet,
// checked 11/20). Retrograde loops make real spans somewhat longer, hence
// "about". Uranus/Neptune/Pluto pairs skip the math: Pluto's eccentric orbit
// keeps pace with Neptune for decades, so mean motion misleads there.
const PERIOD: Record<string, number> = { JUPITER: 4331, SATURN: 10747, URANUS: 30589, NEPTUNE: 59800, PLUTO: 90560 }
export function sharedSpan(a: Point, b: Point, type: string): string | null {
  if (!PERIOD[a] || !PERIOD[b]) return null
  if (SLOW.has(a) && SLOW.has(b)) return 'Everyone born across several years shares this aspect, so it describes a generation. Where these planets sit in your houses is the personal part.'
  const rel = Math.abs(360 / PERIOD[a] - 360 / PERIOD[b])
  const months = (2 * natalOrb(type, a, b)) / rel / 30.44
  const m = Math.max(1, Math.round(months))
  const span = m === 12 ? 'about a year' : m < 18 ? `about ${m} months` : `about ${Math.round(months / 12)} years`
  return `Everyone born in the same stretch of ${span} shares this aspect. The houses these planets sit in are the personal part.`
}

function aspect(a: Point, b: Point, type: string, orb: number): RAspect {
  const key = `${a}|${type}|${b}`
  return { key, a, b, type, orb: Math.round(orb * 10) / 10, title: titleOf(a, type, b), entry: ENTRIES[key] ?? null, general: ASPECTS[type]?.summary ?? '', shared: sharedSpan(a, b, type) }
}

export function buildReading(v: CelebView, birth: { date: string; time: string | null; city: string }, subject: string | null = null): Reading {
  whose = subject ? possessive(subject) : 'your'
  const by: Record<string, VBody> = Object.fromEntries(v.bodies.map(b => [b.id, b]))
  const hasTime = v.hasTime && v.asc != null && v.mc != null

  // every aspect: the view's planet pairs, plus angles and Sun..Mars on the North Node
  const all: RAspect[] = v.aspects.map(x => aspect(x.a, x.b, x.type, x.orb))
  if (hasTime) for (const id of TEN) for (const [ang, lon] of [['ASC', v.asc!], ['MC', v.mc!]] as const) {
    const d = sep(by[id].lon, lon)
    for (const [t, deg, orb] of ANGLE_TYPES) if (Math.abs(d - deg) <= orb) all.push(aspect(id, ang, t, Math.abs(d - deg)))
  }
  if (by.NORTH_NODE) for (const id of ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS']) {
    const d = sep(by[id].lon, by.NORTH_NODE.lon)
    if (d <= 6) all.push(aspect(id, 'NORTH_NODE', 'conjunction', d))
  }

  // what stands out: planets on an angle first, then the tightest personal aspects
  const rank = (x: RAspect) => ((x.b === 'ASC' || x.b === 'MC') && x.type === 'conjunction' ? 0 : x.orb < 2 && !(SLOW.has(x.a) && SLOW.has(x.b)) ? 1 : 9)
  const feats = all.filter(x => rank(x) < 9).sort((x, y) => rank(x) - rank(y) || x.orb - y.orb).slice(0, 5)

  // the Kite: a Grand Trine plus a planet opposite one corner and sextile the other two
  const has = (p: string, t: string, q: string) => all.some(x => x.type === t && ((x.a === p && x.b === q) || (x.a === q && x.b === p)))
  let kite: Reading['kite'] = null
  const ten = TEN.filter(id => by[id])
  outer: for (let i = 0; i < ten.length; i++) for (let j = i + 1; j < ten.length; j++) for (let k = j + 1; k < ten.length; k++) {
    const [p, q, r] = [ten[i], ten[j], ten[k]]
    if (!(has(p, 'trine', q) && has(q, 'trine', r) && has(p, 'trine', r))) continue
    for (const tip of ten) {
      if ([p, q, r].includes(tip)) continue
      for (const [o, s1, s2] of [[p, q, r], [q, p, r], [r, p, q]]) {
        if (has(tip, 'opposition', o) && has(tip, 'sextile', s1) && has(tip, 'sextile', s2) && ENTRIES['PATTERN:kite']) {
          const lon: Record<string, number> = {}
          for (const id of [p, q, r, tip]) lon[id] = by[id].lon
          kite = { corners: [o, s1, s2], tip, element: ELEMENT_OF[by[p].sign], tipHouse: by[tip].house, entry: ENTRIES['PATTERN:kite'], lon }
          break outer
        }
      }
    }
  }

  // the Big Three, with an opening line where one is written
  const subs: Record<string, string> = { sun: 'who you are becoming', moon: 'what you need', rising: 'how you come across' }
  const keyOf: Record<string, string> = { sun: 'SUN', moon: 'MOON', rising: 'ASC' }
  const hookOf = (card: string, sign: string) => ENTRIES[`${keyOf[card]}:${sign}`]?.hook ?? null
  const big = v.bigThree.map(b => {
    const body = by[keyOf[b.card]]
    const both = body?.alt ? bothSigns(body).flatMap(sign => { const hook = hookOf(b.card, sign); return hook ? [{ sign, hook }] : [] }) : undefined
    return { key: b.card, label: b.label, sub: subs[b.card] ?? '', disc: b.disc, hook: hookOf(b.card, b.sign), ...(both ? { either: both } : {}) }
  })
  const sun = by.SUN?.sign, rising = v.risingSign
  const pairEntry = sun && rising ? ENTRIES[`SUN_ASC:${sun}|${rising}`] : undefined
  const pair = pairEntry ? { title: `${sun} Sun with ${rising} rising`, entry: pairEntry } : null

  // planets: sign and house text from the chart's own cards, aspects tightest first
  const planets: RPlanet[] = []
  for (const id of BODY_ORDER) {
    const b = by[id]
    if (!b) continue
    const card = v.cards[bodySlug(id)]
    const find = (head: string) => card?.parts.find(p => p.head === head)?.text ?? ''
    // "you" versions written for the reading win; the shared third person library is the fallback
    const signTextOf = (sign: string) => YOU_IN_SIGN[`${id}_${sign}`] ?? find(`${BODY_NAME[id]} in ${sign}`)
    const houseText = b.house ? (YOU_IN_HOUSE[`${id}_H${b.house}`] ?? find(`${BODY_NAME[id]} in the ${ordinal(b.house)} house`)) : ''
    const generational = SLOW.has(id)
    const alts = b.alt && !generational ? bothSigns(b).map(sign => ({ sign, paras: parasOf(signTextOf(sign)) })).filter(a => a.paras.length) : undefined
    const paras = [...(generational || alts ? [] : [signTextOf(b.sign)]), houseText].flatMap(parasOf)
    const tags = [b.alt ? either(b) : `${b.sign} ${Math.floor(b.deg)}°`]
    if (b.house) tags.push(`${ordinal(b.house)} house, ${AREA[b.house].split(',')[0]}`)
    if (!b.alt && b.dignity && b.dignity !== 'peregrine') tags.push(DIGNITY_LABEL[b.dignity])
    if (b.retro) tags.push('Retrograde')
    planets.push({
      id, anchor: `p-${bodySlug(id)}`, title: `${BODY_NAME[id]} in ${either(b)}${b.house ? `, ${ordinal(b.house)} house` : ''}`,
      disc: card?.disc ?? { color: DISC[id] ?? '#C3CBFF' }, tags, generational, paras, ...(alts ? { alts } : {}),
      aspects: all.filter(x => x.a === id).sort((x, y) => x.orb - y.orb),
    })
  }

  // houses: facts, plus the sign on each house where written ('HOUSE:7|Libra')
  const houses: RHouse[] = []
  if (hasTime && v.cusps) for (let h = 1; h <= 12; h++) {
    const s = signOf(v.cusps[h]), r = MODERN_RULER[s], rb = by[r], co = coRuler(s)
    houses.push({
      n: h, sign: s, area: AREA[h], ruler: BODY_NAME[r],
      rulerAt: rb && rb.house ? `${rb.sign}, ${ordinal(rb.house)} house` : rb ? rb.sign : null,
      co: co ? BODY_NAME[co] : null,
      inside: v.bodies.filter(b => b.house === h).map(b => BODY_NAME[b.id]),
      entry: ENTRIES[`HOUSE:${h}|${s}`] ?? null,
    })
  }

  const fmt = new Date(birth.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  let time = ''
  if (birth.time) {
    const [hh, mm] = birth.time.split(':').map(Number)
    time = `, ${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'a.m.' : 'p.m.'}`
  }
  return {
    birthLine: fmt + time, place: birth.city, hasTime, big, pair, feats, kite, planets, houses, groups: v.groups, changed: v.signChanges,
    summary: v.bigThree.map(b => b.label).join(', '),
  }
}

