// Builds everything the redesigned celebrity page shows, from stored chart data.
// SERVER ONLY: call from getStaticProps. It imports the interpretation library,
// which must never reach the browser bundle (10/25 chunk lesson).
//
// Text policy (structure notes, Issue 16): text unique to this chart (planet in
// sign, planet in house, rising, aspect pair) is included in full; generic text
// shared by every page (what the Sun is, what a trine is, sign and house basics)
// is cut to its first ~70 words with a link to its full page. Every word that
// ships is in the HTML (build list SEO guardrail).
import { PLANETS, SIGNS as SIGN_INFO, HOUSES, getPlanetInSign, getPlanetInHouse } from '@/lib/interpretations'
import { ANGLE_GENERAL, ASC_IN_SIGN, MC_IN_SIGN } from '@/lib/interpretations/angles'
import { ASPECTS, ASPECT_ORDER, natalOrb } from '@/lib/interpretations/aspects'
import { query } from '@/lib/db'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { formatBirthTime } from '@/lib/format-birth'
import type { IconName } from '@/lib/icons/paths'
import {
  SIGN_NAMES, ELEMENT_OF, MODE_OF, DISC, GROUP_COLOR, BODY_ORDER, TEN, BODY_NAME, BODY_ICON,
  bodySlug, signIcon, ordinal, HOUSE_KEYS, TIER_OF,
} from './astro'
import {
  type Dignity, RULER, MODERN_RULER, coRuler, EXALT, DIGNITY_LABEL, DIGNITY_MEANING, OUTER_DIGNITY, GROUP_TEXT,
  NUM_KEYWORD, NUM_MEANING, YEAR_THEME, NUM_WHAT, TERM_TEXT, PHASES,
} from './texts'

// ---------- view types (plain JSON, passed as props) ----------
// alt: with no birth time, the other sign this body held on the birth day (it changed sign that day).
export interface VBody { id: string; sign: string; deg: number; lon: number; house: number | null; retro: boolean; dignity: Dignity | null; alt?: { sign: string; when: 'earlier' | 'later' } }
export interface VLink { href: string; label: string }
export interface VPart { head: string; icon?: IconName; sign?: string; text: string; more?: VLink; dig?: boolean }
export interface VChip { label: string; small?: string; icons?: IconName[]; card?: string; href?: string; tone?: 'dominant' | 'lacking' | 'plain' }
export interface VDisc { color: string; icon?: IconName; mark?: string; text?: string }
export interface VCard {
  key: string; title: string; line?: string; disc: VDisc
  switcher?: 'planets' | 'Elements' | 'Modalities' | 'Polarity' | 'numbers'
  chips: VChip[]; parts: VPart[]
  dignity?: { cells: { label: string; value: string; on: boolean }[] }
  ring?: string
  people?: { title: string; list: { name: string; slug: string }[] }
}
export interface VAspect { key: string; a: string; b: string; type: string; orb: number }
export interface VGroup { name: 'Elements' | 'Modalities' | 'Polarity'; members: { m: string; n: number; status: 'dominant' | 'lacking' | '' }[] }
export interface VNumber { key: string; name: string; value: number; keyword: string }
export interface VTile { label: string; value: string; card: string }
export interface VTier { tier: string; rodden: string | null; meaning: string | null; url: string | null }
export interface CelebView {
  name: string
  hasTime: boolean
  asc: number | null
  mc: number | null
  cusps: number[] | null // index 1 to 12
  risingSign: string | null
  bodies: VBody[]
  aspects: VAspect[]
  groups: VGroup[]
  numbers: VNumber[]
  tiles: VTile[]
  bigThree: { card: string; label: string; sign: string; disc: VDisc }[]
  // Untimed charts: bodies that changed sign during the birth day (noon sign shown, either is possible).
  said?: Record<string, string> // a visitor's own chart: one line per Big Three card
  signChanges: { id: string; name: string; noon: string; alt: string; when: 'earlier' | 'later' }[]
  tier: VTier | null
  cards: Record<string, VCard>
  noAds: boolean
}

interface InChart {
  planets: { planet: string; sign: string; signDegree: number; house: number; retrograde: boolean; longitude: number }[]
  houseCusps?: number[]
  ascendantSign: string
  midheavenSign: string
  ascendant: number
  midheaven: number
}

// ---------- small helpers ----------
const WORD = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
const signOfLon = (lon: number) => SIGN_NAMES[Math.floor((((lon % 360) + 360) % 360) / 30)]
const list = (a: string[]) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a[0] ?? '')
const the = (id: string) => (id === 'SUN' || id === 'MOON' ? 'the ' + BODY_NAME[id] : BODY_NAME[id])
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const possessive = (name: string) => (name.endsWith('s') ? name + '’' : name + '’s')

// First whole sentences reaching ~70 words: the short version of shared text.
// "the Sun", "the North Node", but plain "Venus", "Chiron".
const theName = (id: string) => (['SUN', 'MOON', 'NORTH_NODE'].includes(id) ? 'the ' : '') + BODY_NAME[id]

function lead(text: string, min = 70): string {
  const first = text.replace(/\r\n/g, '\n').split(/\n\s*\n/)[0].trim()
  const sentences = first.split(/(?<=[.!?])\s+(?=[A-Z])/)
  let out = '', words = 0
  for (const s of sentences) {
    out += (out ? ' ' : '') + s
    words += s.split(/\s+/).length
    if (words >= min) break
  }
  return out
}

function dignityOf(id: string, sign: string): Dignity | null {
  const ex = EXALT[id]
  if (!ex) return null
  const homes = SIGN_NAMES.filter(s => RULER[s] === id)
  const opp = (s: string) => SIGN_NAMES[(SIGN_NAMES.indexOf(s as never) + 6) % 12]
  if (homes.includes(sign as never)) return 'rulership'
  if (ex === sign) return 'exaltation'
  if (homes.map(opp).includes(sign as never)) return 'detriment'
  if (opp(ex) === sign) return 'fall'
  return 'peregrine'
}

const ROLE: Record<string, string> = {
  SUN: 'identity and purpose', MOON: 'feelings and needs', MERCURY: 'mind and voice', VENUS: 'love and taste',
  MARS: 'drive and nerve', JUPITER: 'growth and faith', SATURN: 'discipline and limits', URANUS: 'change and freedom',
  NEPTUNE: 'dreams and ideals', PLUTO: 'power and rebirth',
}
const NATURE_LINE: Record<string, string> = {
  harmonious: 'The two cooperate easily, so their themes support each other.',
  challenging: 'The angle sets them against each other, a friction that pushes for growth and action.',
  neutral: 'The two fuse, so their themes act as one, for better or worse.',
}
const NATURE_SAY: Record<string, string> = { harmonious: 'Easy aspect', challenging: 'Hard aspect', neutral: 'Blending aspect' }

// Numerology (Pythagorean letter values)
const digits = (n: number) => String(n).split('').reduce((a, b) => a + Number(b), 0)
function reduce(n: number): number { while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = digits(n); return n }
const letterValue = (c: string) => ((c.charCodeAt(0) - 65) % 9) + 1
const lettersOf = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z ]/g, '')

// Both signs of a body that changed sign that day, in the order it held them.
export const either = (b: VBody) => (!b.alt ? b.sign : b.alt.when === 'earlier' ? `${b.alt.sign} or ${b.sign}` : `${b.sign} or ${b.alt.sign}`)

// ---------- the builder ----------
export async function buildCelebView(opts: {
  name: string; slug: string; birthDate: string; birthTime: string | null; birthCity: string
  birthName: string | null; chart: InChart
  tierSource: { rating: string | null; meaning: string | null; url: string | null } | null
  frontPageSkip: boolean
  lat?: number | null; lng?: number | null
  // A visitor's own chart: card text says "your" instead of a name, no time grade.
  you?: boolean
}): Promise<CelebView> {
  const { name, slug, chart } = opts
  const hasTime = !!opts.birthTime
  const N = opts.you ? 'your' : possessive(name)
  const NS = cap(N)  // at the start of a sentence
  const cards: Record<string, VCard> = {}

  const bodies: VBody[] = BODY_ORDER.flatMap(id => {
    const p = chart.planets.find(x => x.planet === id)
    if (!p) return []
    return [{ id, sign: p.sign, deg: p.signDegree, lon: p.longitude, house: hasTime ? p.house : null, retro: p.retrograde, dignity: dignityOf(id, p.sign) }]
  })
  // No birth time: the chart is drawn at noon. A body that changed sign between
  // local midnight and midnight could be in either sign, so say so (11/19 audit:
  // 146 pages showed such a Moon or Sun as certain).
  if (!hasTime && opts.lat != null && opts.lng != null) {
    try {
      const { buildChart } = await import('@/lib/swisseph/buildChart')
      const day = opts.birthDate.slice(0, 10)
      const [a, z] = await Promise.all([buildChart(day, '00:00', opts.lat, opts.lng), buildChart(day, '23:59', opts.lat, opts.lng)])
      for (const b of bodies) {
        const s0 = a.chartData.planets.find(p => p.planet === b.id)?.sign
        const s1 = z.chartData.planets.find(p => p.planet === b.id)?.sign
        if (!s0 || !s1 || s0 === s1) continue
        if (b.sign === s0) b.alt = { sign: s1, when: 'later' }
        else if (b.sign === s1) b.alt = { sign: s0, when: 'earlier' }
      }
    } catch { /* leave as is; the note stays general */ }
  }
  const byId = Object.fromEntries(bodies.map(b => [b.id, b]))
  const ten = bodies.filter(b => TEN.includes(b.id))
  const cusps = hasTime && chart.houseCusps && chart.houseCusps.length >= 12
    ? [0, ...chart.houseCusps.slice(chart.houseCusps.length === 13 ? 1 : 0, (chart.houseCusps.length === 13 ? 1 : 0) + 12)]
    : null
  const risingSign = hasTime ? chart.ascendantSign : null

  // ---- aspects (ten planets, the site's own orbs) ----
  const aspects: VAspect[] = []
  for (let i = 0; i < ten.length; i++) for (let j = i + 1; j < ten.length; j++) {
    let d = Math.abs(ten[i].lon - ten[j].lon); if (d > 180) d = 360 - d
    for (const t of ASPECT_ORDER) {
      const A = ASPECTS[t], orb = Math.abs(d - A.degree)
      if (orb <= natalOrb(t, ten[i].id, ten[j].id)) aspects.push({ key: `${bodySlug(ten[i].id)}-${t}-${bodySlug(ten[j].id)}`, a: ten[i].id, b: ten[j].id, type: t, orb: Math.round(orb * 100) / 100 })
    }
  }
  const aspectChips = (id: string): VChip[] => aspects.filter(x => x.a === id || x.b === id).map(x => {
    const o = x.a === id ? x.b : x.a
    return { label: `${cap(x.type)} ${BODY_NAME[o]}`, small: `${Math.round(x.orb * 10) / 10}°`, icons: [x.type as IconName, BODY_ICON[o]], card: x.key }
  })

  // ---- people who share a placement (3 each, written profiles only) ----
  async function sharing(col: 'sun_sign' | 'moon_sign' | 'rising_sign', sign: string | null) {
    if (!sign) return []
    try {
      return await query<{ name: string; slug: string }>(
        `SELECT name, slug FROM celebrities WHERE ${col} = $1 AND slug != $2 AND image_url IS NOT NULL AND ${QUALITY_BIO_SQL}
         ${col === 'rising_sign' ? 'AND birth_time IS NOT NULL' : ''} ORDER BY RANDOM() LIMIT 3`, [sign, slug])
    } catch { return [] }
  }
  const [sunPeople, moonPeople, risingPeople] = await Promise.all([
    sharing('sun_sign', byId.SUN?.sign ?? null), sharing('moon_sign', byId.MOON?.sign ?? null), sharing('rising_sign', risingSign),
  ])

  // ---- planet cards ----
  for (const b of bodies) {
    const id = b.id, P = PLANETS[id], slugP = bodySlug(id)
    const chips: VChip[] = []
    const ruler = MODERN_RULER[b.sign]
    if (ruler && ruler !== id && byId[ruler]) chips.push({ small: 'Ruler', label: BODY_NAME[ruler] + (hasTime ? ` ${ordinal(byId[ruler].house!)}` : ''), icons: [BODY_ICON[ruler]], card: bodySlug(ruler) })
    if (cusps) for (let h = 1; h <= 12; h++) {
      const hs = signOfLon(cusps[h])
      if (MODERN_RULER[hs] === id) chips.push({ small: 'Rules', label: `${ordinal(h)} house`, card: `house-${h}` })
      else if (coRuler(hs) === id) chips.push({ small: 'Co-rules', label: `${ordinal(h)} house`, card: `house-${h}` })
    }
    chips.push(...aspectChips(id))

    const parts: VPart[] = []
    if (P?.description) parts.push({ head: `What ${theName(id)} is`, icon: BODY_ICON[id], text: lead(P.description), more: { href: `/astrology-planets/${slugP}`, label: `All about ${theName(id)}` } })
    const inSign = getPlanetInSign(id, b.sign)
    if (inSign) parts.push({ head: `${BODY_NAME[id]} in ${b.sign}`, sign: b.sign, text: inSign, more: { href: `/interpretations/${slugP}-in-${b.sign.toLowerCase()}`, label: `${BODY_NAME[id]} in ${b.sign} in other charts` } })
    let dignity: VCard['dignity']
    if (b.dignity) {
      const homes = SIGN_NAMES.filter(s => RULER[s] === id)
      const opp = (s: string) => SIGN_NAMES[(SIGN_NAMES.indexOf(s as never) + 6) % 12]
      const ex = EXALT[id], T = cap(the(id))
      const say: Record<Dignity, string> = {
        rulership: `${b.sign} is one of ${the(id)}’s own signs, so it works here fully as itself, with nothing in its way.`,
        exaltation: `${T} is exalted in ${b.sign}, an honored guest. Its best qualities come through easily here.`,
        detriment: `${b.sign} sits opposite ${the(id)}’s home in ${list(homes.filter(h => opp(h) === b.sign))}. It has to work against the grain to act like itself.`,
        fall: `${b.sign} is ${the(id)}’s fall, the sign opposite its exaltation in ${ex}. It is least at ease here and works harder to feel settled.`,
        peregrine: `${T} has no special standing in ${b.sign}: not at home, not exalted, not in detriment or fall. It acts on its own terms and leans on the planets around it.`,
      }
      parts.push({ head: `${DIGNITY_LABEL[b.dignity]} in ${b.sign}`, text: `${say[b.dignity]} ${DIGNITY_MEANING[b.dignity]}`, dig: true })
      dignity = { cells: [
        { label: 'Rulership', value: list(homes), on: b.dignity === 'rulership' },
        { label: 'Exaltation', value: ex, on: b.dignity === 'exaltation' },
        { label: 'Detriment', value: list(homes.map(opp)), on: b.dignity === 'detriment' },
        { label: 'Fall', value: opp(ex), on: b.dignity === 'fall' },
      ] }
    } else if (['URANUS', 'NEPTUNE', 'PLUTO'].includes(id)) {
      parts.push({ head: `Dignity in ${b.sign}`, text: OUTER_DIGNITY })
    }
    if (b.house) {
      const inHouse = getPlanetInHouse(id, b.house)
      if (inHouse) parts.push({ head: `${BODY_NAME[id]} in the ${ordinal(b.house)} house`, icon: BODY_ICON[id], text: inHouse, more: { href: `/interpretations/${slugP}-in-house-${b.house}`, label: `${BODY_NAME[id]} in the ${ordinal(b.house)} house in other charts` } })
    }
    const people = id === 'SUN' ? sunPeople : id === 'MOON' ? moonPeople : []
    cards[slugP] = {
      key: slugP, title: `${BODY_NAME[id]} in ${either(b)}`,
      line: b.alt
        ? `${b.sign} ${Math.floor(b.deg)}° at noon; ${b.alt.when === 'later' ? `entered ${b.alt.sign} later that day` : `was in ${b.alt.sign} earlier that day`}, so without a birth time either is possible`
        : [`${b.sign} ${Math.floor(b.deg)}°`, b.house ? `${ordinal(b.house)} house` : '', b.retro ? 'retrograde' : ''].filter(Boolean).join(', '),
      disc: { color: DISC[id], icon: BODY_ICON[id] }, switcher: 'planets', chips, parts, dignity,
      people: people.length ? { title: `Also ${BODY_NAME[id]} in ${b.sign}`, list: people } : undefined,
    }
  }

  // ---- angles ----
  if (risingSign) {
    const r = MODERN_RULER[risingSign], tr = coRuler(risingSign)
    cards.rising = {
      key: 'rising', title: `${risingSign} rising`, line: `Ascendant ${Math.floor(chart.ascendant % 30)}° ${risingSign}`,
      disc: { color: DISC.RISING, icon: 'ascendant' }, switcher: 'planets',
      chips: byId[r] ? [{ small: 'Chart ruler', label: `${BODY_NAME[r]} ${ordinal(byId[r].house!)}`, icons: [BODY_ICON[r]], card: bodySlug(r) }] : [],
      parts: [
        { head: 'What the rising sign is', icon: 'ascendant', text: lead(ANGLE_GENERAL.ASC) },
        ...(ASC_IN_SIGN[risingSign] ? [{ head: `${risingSign} rising`, sign: risingSign, text: ASC_IN_SIGN[risingSign] }] : []),
      ],
      people: risingPeople.length ? { title: `Also ${risingSign} rising`, list: risingPeople } : undefined,
    }
    const mcSign = chart.midheavenSign
    cards.midheaven = {
      key: 'midheaven', title: `Midheaven in ${mcSign}`, line: 'The top of the chart: career and public life',
      disc: { color: DISC.RISING, icon: 'midheaven' }, chips: [],
      parts: [
        { head: 'What the Midheaven is', icon: 'midheaven', text: lead(ANGLE_GENERAL.MC) },
        ...(MC_IN_SIGN[mcSign] ? [{ head: `Midheaven in ${mcSign}`, sign: mcSign, text: MC_IN_SIGN[mcSign] }] : []),
      ],
    }
    cards['chart-ruler'] = {
      key: 'chart-ruler', title: 'Chart ruler', disc: { color: DISC.RISING, icon: BODY_ICON[r] }, chips: byId[r] ? [{ label: BODY_NAME[r], icons: [BODY_ICON[r]], card: bodySlug(r) }] : [],
      parts: [{ head: 'What it is', text: TERM_TEXT.chartRuler }, ...(byId[r] ? [{ head: `In ${N} chart`, text: `${risingSign} rises, so ${the(r)} rules the chart. ${NS} ${BODY_NAME[r]} is in ${byId[r].sign} in the ${ordinal(byId[r].house!)} house.` + (tr && byId[tr] ? ` In traditional astrology ${the(tr)} rules ${risingSign}, and ${N} ${BODY_NAME[tr]} is in ${byId[tr].sign} in the ${ordinal(byId[tr].house!)} house.` : '') }] : [])],
    }
  }

  // ---- sign cards (every sign that holds a planet or starts a house) ----
  const usedSigns = new Set<string>(bodies.map(b => b.sign))
  if (cusps) for (let h = 1; h <= 12; h++) usedSigns.add(signOfLon(cusps[h]))
  for (const s of usedSigns) {
    const info = SIGN_INFO[s], el = ELEMENT_OF[s], inSign = bodies.filter(b => b.sign === s)
    const starts = cusps ? Array.from({ length: 12 }, (_, i) => i + 1).filter(h => signOfLon(cusps[h]) === s) : []
    const facts: string[] = []
    if (inSign.length) facts.push(`${cap(list(inSign.map(b => the(b.id))))} ${inSign.length === 1 ? 'is' : 'are'} in ${s}.`)
    if (risingSign === s) facts.push(`${s} is ${N} rising sign.`)
    if (starts.length) facts.push(`${s} starts the ${list(starts.map(ordinal))} house${starts.length > 1 ? 's' : ''}.`)
    cards[s.toLowerCase()] = {
      key: s.toLowerCase(), title: s, line: `${el}, ${MODE_OF[s].toLowerCase()}, ruled by ${BODY_NAME[MODERN_RULER[s]]}` + (coRuler(s) ? ` (traditionally ${BODY_NAME[coRuler(s)!]})` : ''),
      disc: { color: GROUP_COLOR[el], icon: signIcon(s) },
      chips: inSign.map(b => ({ label: BODY_NAME[b.id], icons: [BODY_ICON[b.id]], card: bodySlug(b.id) })),
      parts: [
        ...(info ? [{ head: `What ${s} is`, sign: s, text: lead(info.description), more: { href: `/zodiac-signs/${s.toLowerCase()}`, label: `All about ${s}` } }] : []),
        ...(facts.length ? [{ head: `In ${N} chart`, text: facts.join(' ') }] : []),
      ],
    }
  }

  // ---- house cards ----
  if (cusps) for (let h = 1; h <= 12; h++) {
    const s = signOfLon(cusps[h]), H = HOUSES[h], inside = ten.filter(b => b.house === h).concat(bodies.filter(b => !TEN.includes(b.id) && b.house === h))
    const r = MODERN_RULER[s], rb = byId[r], tr = coRuler(s)
    let mine = `${NS} ${ordinal(h)} house begins at ${s} ${Math.floor(cusps[h] % 30)}°, so ${the(r)} rules it.`
    if (rb) mine += ` ${NS} ${BODY_NAME[r]} sits in ${rb.sign} in the ${ordinal(rb.house!)} house, which ties the two areas of life together.`
    if (tr && byId[tr]) mine += ` Its traditional ruler, ${BODY_NAME[tr]}, is in ${byId[tr].sign} in the ${ordinal(byId[tr].house!)} house.`
    mine += inside.length ? ` Inside the house: ${list(inside.map(b => the(b.id)))}.` : ''
    cards[`house-${h}`] = {
      key: `house-${h}`, title: `The ${ordinal(h)} house`, line: HOUSE_KEYS[h], disc: { color: '#C9CFEA', text: String(h) },
      chips: [{ label: s, icons: [signIcon(s)], card: s.toLowerCase() }, ...inside.map(b => ({ label: BODY_NAME[b.id], icons: [BODY_ICON[b.id]], card: bodySlug(b.id) }))],
      parts: [
        ...(H ? [{ head: `What the ${ordinal(h)} house is`, text: lead(H.description), more: { href: `/astrology-houses/${h}`, label: `All about the ${ordinal(h)} house` } }] : []),
        { head: `In ${N} chart`, text: mine },
        ...(!inside.length && H?.emptyHouse ? [{ head: 'An empty house', text: lead(H.emptyHouse, 40) }] : []),
      ],
    }
  }

  // ---- aspect cards ----
  for (const x of aspects) {
    const A = ASPECTS[x.type], an = BODY_NAME[x.a], bn = BODY_NAME[x.b]
    const pair = A.planetPairs.find(p => { const s = p.planets.split(/[–—-]/); return (s[0] === an && s[1] === bn) || (s[0] === bn && s[1] === an) })
    const pairText = pair ? pair.interpretation
      : `${cap(the(x.a))} carries ${ROLE[x.a]}; ${the(x.b)} carries ${ROLE[x.b]}. In ${N} chart a ${x.type} joins them. ${NATURE_LINE[A.nature]}`
    cards[x.key] = {
      key: x.key, title: `${an} ${x.type} ${bn}`, line: `${NATURE_SAY[A.nature]}, orb ${Math.round(x.orb * 10) / 10}°`,
      disc: { color: DISC.RISING, icon: x.type as IconName },
      chips: [{ label: an, icons: [BODY_ICON[x.a]], card: bodySlug(x.a) }, { label: bn, icons: [BODY_ICON[x.b]], card: bodySlug(x.b) }],
      parts: [
        { head: `What a ${x.type} is`, icon: x.type as IconName, text: lead(A.summary + ' ' + A.description), more: { href: `/astrology-aspects/${x.type}`, label: `All about the ${x.type}` } },
        { head: `${an} and ${bn}`, icon: BODY_ICON[x.a], text: pairText },
      ],
    }
  }

  // ---- elements, modalities, polarity ----
  const GROUP_DEF: { name: VGroup['name']; noun: string; members: string[]; of: (s: string) => string }[] = [
    { name: 'Elements', noun: 'element', members: ['Fire', 'Earth', 'Air', 'Water'], of: s => ELEMENT_OF[s] },
    { name: 'Modalities', noun: 'mode', members: ['Cardinal', 'Fixed', 'Mutable'], of: s => MODE_OF[s] },
    { name: 'Polarity', noun: 'side', members: ['Active', 'Receptive'], of: s => (['Fire', 'Air'].includes(ELEMENT_OF[s]) ? 'Active' : 'Receptive') },
  ]
  const groups: VGroup[] = GROUP_DEF.map(g => {
    const counts = g.members.map(m => ten.filter(b => g.of(b.sign) === m).length), max = Math.max(...counts)
    return { name: g.name, members: g.members.map((m, i) => ({ m, n: counts[i], status: counts[i] === 0 ? 'lacking' : counts[i] === max ? 'dominant' : '' })) }
  })
  GROUP_DEF.forEach((g, gi) => g.members.forEach(m => {
    const ps = ten.filter(b => g.of(b.sign) === m), n = ps.length, st = groups[gi].members.find(x => x.m === m)!.status
    const bySign = Array.from(new Set(ps.map(b => b.sign))).map(s => `${list(ps.filter(b => b.sign === s).map(b => the(b.id)))} in ${s}`)
    let t: string
    if (!n) t = `None of ${N} ten planets are in ${m} signs. Astrologers read a missing ${g.noun} as something a person looks for in other people, or works at on purpose, rather than something that comes without trying.`
    else {
      t = `${WORD[n]} of ${N} ten planets ${n === 1 ? 'is' : 'are'} in ${m} signs: ${list(bySign)}.`
      if (g.name === 'Polarity') t += st === 'dominant' ? ` So the chart tilts ${m.toLowerCase()}: ${m === 'Active' ? 'more outgoing, quicker to engage and express.' : 'more inward, steadier and slower to show its hand.'}` : ' The other side carries more of the chart.'
      else if (st === 'dominant') t += ` That makes ${m} the strongest ${g.noun} in the chart, the one that colors most of it.`
      else if (n === 1) t += ` With only one planet here, ${m} is one of the quieter notes in the chart, but that one planet carries all of it.`
      else t += ' That is a middle share, present without running the show.'
    }
    const also: string[] = []
    if (risingSign && g.of(risingSign) === m) also.push(`the rising sign, ${risingSign}`)
    bodies.filter(b => !TEN.includes(b.id) && g.of(b.sign) === m).forEach(b => also.push(`${theName(b.id)} in ${b.sign}`))
    if (also.length) t += ` Also here: ${list(also)}.`
    cards[m.toLowerCase()] = {
      key: m.toLowerCase(), title: m, line: `${WORD[n]} of 10 planets`, disc: { color: GROUP_COLOR[m], mark: m }, switcher: g.name,
      chips: [...(st ? [{ label: st === 'lacking' ? 'Lacking' : 'Dominant', tone: st } as VChip] : []), ...ps.map(b => ({ label: BODY_NAME[b.id], small: b.sign, icons: [BODY_ICON[b.id]], card: bodySlug(b.id) }))],
      ring: m,
      parts: [
        { head: `What ${m} is`, text: GROUP_TEXT[m][0] },
        { head: `The ${m} signs`, text: GROUP_TEXT[m][1] },
        { head: `In ${N} chart`, text: t },
      ],
    }
  }))

  // ---- numerology ----
  const [Y, M, D] = opts.birthDate.slice(0, 10).split('-').map(Number)
  const thisYear = new Date().getUTCFullYear()
  const numbers: VNumber[] = []
  const addNum = (key: string, label: string, value: number, from: string, how: string) => {
    numbers.push({ key, name: label, value, keyword: NUM_KEYWORD[value] ?? '' })
    let mean = NUM_MEANING[value] ?? ''
    if (key === 'personal-year') mean = `For ${opts.you ? 'you' : name}, ${thisYear} is ${YEAR_THEME[value] ?? 'a turning point'}. ${mean}`
    cards[key] = {
      key, title: `${label} ${value}`, line: from, disc: { color: DISC.RISING, text: String(value) }, switcher: 'numbers', chips: [],
      parts: [
        { head: `What the ${label.toLowerCase()} number is`, text: NUM_WHAT[key] },
        { head: 'How it is worked out', text: how },
        { head: `The number ${value}`, text: mean },
      ],
    }
  }
  if (Y && M && D) {
    const rm = reduce(M), rd = reduce(D), ry = reduce(digits(Y)), lp = reduce(rm + rd + ry)
    addNum('life-path', 'Life Path', lp, 'From the birth date',
      `The birth date is reduced part by part: the month ${M} gives ${rm}, the day ${D} gives ${rd}, and the year ${Y} adds up to ${digits(Y)}, which gives ${ry}. Together, ${rm} + ${rd} + ${ry} = ${rm + rd + ry}${rm + rd + ry !== lp ? `, which reduces to ${lp}` : ''}.`)
  }
  const birthName = opts.birthName?.trim()
  if (birthName && /[A-Za-z]/.test(birthName)) {
    const L = lettersOf(birthName), letters = L.replace(/ /g, '').split('')
    const total = letters.reduce((a, c) => a + letterValue(c), 0)
    addNum('destiny', 'Destiny', reduce(total), 'From the full birth name',
      `The birth name is ${birthName}. Each letter has a value from 1 to 9 (A is 1, B is 2, through I is 9, then J starts again at 1). All ${letters.length} letters add up to ${total}, which reduces to ${reduce(total)}.`)
    const vowels = letters.filter(c => 'AEIOU'.includes(c)), vt = vowels.reduce((a, c) => a + letterValue(c), 0)
    if (vowels.length) addNum('soul-urge', 'Soul Urge', reduce(vt), 'From the vowels in the birth name',
      `The vowels in ${birthName} (${vowels.join(', ')}) add up to ${vt}, which reduces to ${reduce(vt)}. Y is counted as a consonant here.`)
    const parts = L.split(' ').filter(Boolean).map(w => reduce(w.split('').filter(c => !'AEIOU'.includes(c)).reduce((a, c) => a + letterValue(c), 0)))
    const ps = reduce(parts.reduce((a, b) => a + b, 0))
    addNum('personality', 'Personality', ps, 'From the consonants in the birth name',
      `Each name is reduced first: the consonants give ${parts.join(', ')}, and ${parts.join(' + ')} = ${parts.reduce((a, b) => a + b, 0)}${parts.reduce((a, b) => a + b, 0) !== ps ? `, which reduces to ${ps}` : ''}.`)
  }
  if (M && D) {
    const ty = reduce(digits(thisYear)), py = reduce(reduce(M) + reduce(D) + ty)
    addNum('personal-year', 'Personal Year', py, `For ${thisYear}`,
      `The birth month ${M} and day ${D} reduce to ${reduce(M)} and ${reduce(D)}. The year ${thisYear} reduces to ${ty}. Together, ${reduce(M)} + ${reduce(D)} + ${ty} = ${reduce(M) + reduce(D) + ty}${reduce(M) + reduce(D) + ty !== py ? `, which reduces to ${py}` : ''}.`)
  }

  // ---- at a glance tiles + term cards ----
  const tiles: VTile[] = []
  const sun = byId.SUN, moon = byId.MOON
  if (hasTime && sun?.house) {
    const day = sun.house >= 7
    const when = opts.birthTime ? formatBirthTime(opts.birthTime) : ''
    tiles.push({ label: 'Born', value: day ? 'Day chart' : 'Night chart', card: 'day-night' })
    cards['day-night'] = {
      key: 'day-night', title: day ? 'Day chart' : 'Night chart', disc: { color: day ? DISC.SUN : DISC.MOON, icon: day ? 'sun' : 'moon' }, chips: [],
      parts: [{ head: 'What it is', text: day ? TERM_TEXT.day : TERM_TEXT.night }, { head: `In ${N} chart`, text: `At ${when} in ${opts.birthCity} the Sun was ${day ? 'above' : 'below'} the horizon, in the ${ordinal(sun.house)} house.` }],
    }
  }
  if (sun && moon) {
    const el = (((moon.lon - sun.lon) % 360) + 360) % 360
    const ph = PHASES.find(p => el < p[0]) ?? PHASES[PHASES.length - 1]
    tiles.push({ label: 'Moon phase', value: ph[1], card: 'moon-phase' })
    cards['moon-phase'] = {
      key: 'moon-phase', title: `${ph[1]} Moon`, disc: { color: DISC.MOON, icon: 'moon' }, chips: [],
      parts: [{ head: 'What it is', text: TERM_TEXT.phase }, { head: `In ${N} chart`, text: `The Moon was about ${Math.round(el)}° ahead of the Sun. ${ph[2]}${hasTime ? '' : ' Without a birth time this is the phase at noon; the Moon moves about 13° a day.'}` }],
    }
  }
  const stel = SIGN_NAMES.map(s => ({ s, ps: ten.filter(b => b.sign === s) })).filter(x => x.ps.length >= 3)
  if (stel.length) {
    tiles.push({ label: 'Stellium', value: stel.map(x => `${WORD[x.ps.length]} in ${x.s}`).join(', '), card: 'stellium' })
    cards.stellium = {
      key: 'stellium', title: 'Stellium', disc: { color: GROUP_COLOR[ELEMENT_OF[stel[0].s]], icon: signIcon(stel[0].s) },
      chips: stel.flatMap(x => x.ps.map(b => ({ label: BODY_NAME[b.id], small: x.s, icons: [BODY_ICON[b.id]], card: bodySlug(b.id) }))),
      parts: [{ head: 'What it is', text: TERM_TEXT.stellium }, { head: `In ${N} chart`, text: stel.map(x => `${WORD[x.ps.length]} planets in ${x.s}: ${list(x.ps.map(b => the(b.id)))}.`).join(' ') }],
    }
  }
  const dom = groups[0].members.filter(m => m.status === 'dominant').map(m => m.m)
  if (dom.length) tiles.push({ label: 'Strongest element', value: dom.join(' and '), card: dom[0].toLowerCase() })
  if (cards.midheaven) tiles.push({ label: 'Midheaven', value: chart.midheavenSign, card: 'midheaven' })
  const retro = ten.filter(b => b.retro)
  tiles.push({ label: 'Retrograde', value: retro.length ? list(retro.map(b => BODY_NAME[b.id])) : 'None', card: 'retrograde' })
  cards.retrograde = {
    key: 'retrograde', title: 'Retrograde planets', disc: { color: DISC.RISING, icon: 'mercury' },
    chips: retro.map(b => ({ label: BODY_NAME[b.id], icons: [BODY_ICON[b.id]], card: bodySlug(b.id) })),
    parts: [{ head: 'What it is', text: TERM_TEXT.retro }, { head: `In ${N} chart`, text: retro.length ? `${cap(list(retro.map(b => the(b.id))))} ${retro.length === 1 ? 'was' : 'were'} retrograde at birth.` : `None of ${N} ten planets were retrograde at birth, so every one of them was moving forward.` }],
  }

  // ---- birth time tier ----
  let tier: VTier | null = null
  if (!hasTime) {
    tier = { tier: 'No time', rodden: null, meaning: null, url: null }
    cards['birth-time'] = {
      key: 'birth-time', title: 'No birth time on record', disc: { color: DISC.RISING, text: '?' }, chips: [],
      parts: [{ head: 'What that changes', text: TERM_TEXT.noTime }],
    }
  } else {
    const r = opts.tierSource?.rating ?? null
    tier = { tier: r ? TIER_OF[r] ?? 'Unrated' : 'Unrated', rodden: r, meaning: opts.tierSource?.meaning ?? null, url: opts.tierSource?.url ?? null }
    const tierLine = 'Birth times are graded S to D. S comes from a birth certificate or other official record; A is quoted by the person or someone close to them; B comes from a biography; C has no known source; D means reports conflict. Times graded C or D should be read with caution.'
    cards['birth-time'] = {
      key: 'birth-time', title: r ? `Birth time grade ${tier.tier}` : 'Birth time, not yet graded', disc: { color: DISC.RISING, text: r ? tier.tier : '?' }, chips: [],
      parts: [
        { head: 'How times are graded', text: tierLine },
        { head: `${NS} time`, text: `${opts.you ? 'You were' : name + ' was'} born at ${formatBirthTime(opts.birthTime!)}. ${r ? `The source is ${tier.meaning}.` : 'The source of this time has not been checked yet.'}` },
      ],
    }
  }

  // A visitor's own time is theirs to know; it carries no grade.
  if (opts.you && hasTime) { tier = null; delete cards['birth-time'] }

  // ---- hero chips ----
  const bigThree: CelebView['bigThree'] = []
  if (sun) bigThree.push({ card: 'sun', label: `${either(sun)} Sun`, sign: either(sun), disc: { color: DISC.SUN, icon: 'sun' } })
  if (moon) bigThree.push({ card: 'moon', label: `${either(moon)} Moon`, sign: either(moon), disc: { color: DISC.MOON, icon: 'moon' } })
  const signChanges = bodies.filter(b => b.alt).map(b => ({ id: b.id, name: BODY_NAME[b.id], noon: b.sign, alt: b.alt!.sign, when: b.alt!.when }))
  if (risingSign) bigThree.push({ card: 'rising', label: `${risingSign} rising`, sign: risingSign, disc: { color: DISC.RISING, icon: 'ascendant' } })

  return {
    name, hasTime, asc: hasTime ? chart.ascendant : null, mc: hasTime ? chart.midheaven : null, cusps, risingSign,
    bodies, aspects, groups, numbers, tiles, bigThree, signChanges, tier, cards, noAds: opts.frontPageSkip,
  }
}
