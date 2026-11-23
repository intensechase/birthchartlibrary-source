// Synastry score, version 2 (2026-11-20). For entertainment: a summary of how
// two charts touch, never a prediction.
//
// Two numbers, both shown as a percentile against real pairs of charts:
//   Ease  = do the contacts help or hinder? Traditional doctrine only, so every
//           rule below cites Lilly, Christian Astrology (1647), via
//           docs/reference/lilly/abstracts. The tier (S best, D last) comes from Ease.
//   Spark = how strongly the charts touch at all, good or bad. Includes the
//           points Lilly never had (outer planets, North Node, Ascendant), which
//           add intensity but no good or bad sign.
//
// Phase 1 measurement (5,000 random celebrity pairs) is why this replaced the
// old "harmonious aspects / all aspects" ratio: 24% of random pairs rated the
// top label, and conjunction handling alone flipped 47% of labels.

import type { BirthChartData, PlanetName } from './calculate'
import type { RelationshipType } from './synastry'
import { CALIBRATION } from './synastry-calibration'

export type SynTier = 'S' | 'A' | 'B' | 'C' | 'D'

export interface Contact {
  a: string            // point in chart A (planet key or ASC)
  b: string            // point in chart B
  aspect: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition'
  orb: number
  polarity: number     // -1..1, 0 when doctrine is silent (Spark only)
  strength: number     // importance x tightness
}

export interface SynastryScoreV2 {
  version: 2
  ease: number         // percentile 0-100
  spark: number        // percentile 0-100
  tier: SynTier
  label: string        // "S tier", kept as `label` for older callers
  score: number        // = ease, kept for older callers
  helps: Contact[]     // strongest positive contributions
  strains: Contact[]   // strongest negative contributions
}

// ── Doctrine (Lilly) ─────────────────────────────────────────────────────────

const CLASSICAL = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'] as const
type Classical = typeof CLASSICAL[number]
const isClassical = (p: string): p is Classical => (CLASSICAL as readonly string[]).includes(p)

// B I ch XIX p.105-107: sextile and trine are "arguments of Love, Unity and
// Friendship", the trine stronger; square "imperfect emnity", opposition
// "perfect hatred". The conjunction depends on the planets (below).
const ASPECT_POLARITY = { trine: 1, sextile: 0.7, square: -0.7, opposition: -1 } as const
const ASPECT_ANGLE = { conjunction: 0, sextile: 60, square: 90, trine: 120, opposition: 180 } as const

// Orbs, B I ch XIX p.107: a contact holds within half of each planet's orb
// added together ("moiety"). Not Lilly: outer planets, node and Ascendant use
// small fixed moieties, our choice.
const MOIETY: Record<string, number> = {
  SUN: 8.5, MOON: 6.25, MERCURY: 3.5, VENUS: 4, MARS: 3.75, JUPITER: 6, SATURN: 5,
  URANUS: 2.5, NEPTUNE: 2.5, PLUTO: 2.5, NORTH_NODE: 1.5, ASC: 4,
}

// Friendships between two nativities, B III ch CLI p.636-639: "Jupiter hath onely
// Mars for his Enemy. Mars hath onely Venus for his Friend; yet Venus loves him
// not... Sun hath onely Jupiter and Venus for Friends, all the other Planets his
// Enemies. Venus hath onely Saturn her enemy, all the other her friends. Mercury
// hath Saturn, Jupiter, Venus for friend, all the rest enemies. Moon hath
// Saturn, Jupiter, Venus for friends, all the other enemies." Saturn's friends
// are Jupiter, Sun, Moon; his enemies "Venus more than Mars". +1 friend, -1 enemy.
const VIEW: Record<Classical, Partial<Record<Classical, number>>> = {
  SATURN:  { JUPITER: 1, SUN: 1, MOON: 1, VENUS: -1, MARS: -0.7 },
  JUPITER: { SUN: 1, MOON: 1, MERCURY: 1, VENUS: 1, SATURN: 1, MARS: -1 },
  MARS:    { VENUS: 1, SUN: -1, MOON: -1, MERCURY: -1, JUPITER: -1, SATURN: -1 },
  SUN:     { JUPITER: 1, VENUS: 1, MOON: -1, MERCURY: -1, MARS: -1, SATURN: -1 },
  VENUS:   { SUN: 1, MOON: 1, MERCURY: 1, JUPITER: 1, MARS: 0, SATURN: -1 },
  MERCURY: { SATURN: 1, JUPITER: 1, VENUS: 1, SUN: -1, MOON: -1, MARS: -1 },
  MOON:    { SATURN: 1, JUPITER: 1, VENUS: 1, SUN: -1, MERCURY: -1, MARS: -1 },
}
// Jupiter "the greater Fortune", Venus the lesser; Saturn "the greater
// Infortune", Mars the lesser (abstracts/planets.md).
const FORTUNE = new Set<string>(['JUPITER', 'VENUS'])
const INFORTUNE = new Set<string>(['SATURN', 'MARS'])
const LIGHT = new Set<string>(['SUN', 'MOON'])
const has = (a: string, b: string, x: string, y: string) => (a === x && b === y) || (a === y && b === x)

// One planet sitting on the other's (a cross-chart conjunction). Lilly calls
// this planets "in each others places", ch CLI; the rules are taken in order.
export function conjunctionPolarity(a: Classical, b: Classical, t: RelationshipType = 'romantic'): number {
  // "The most assured means... Sun in the one, the Moon in the other in the same
  // place... a very good Signe of unity and concord" (ch CXXXVI p.596-598, marriage).
  if (has(a, b, 'SUN', 'MOON')) return t === 'romantic' ? 1 : 0.3
  // "One hath Venus, where the other hath the Moon, a sure friendship" (CLI):
  // a Fortune on a Fortune or a Light.
  if (a !== b && (FORTUNE.has(a) || FORTUNE.has(b)) && (FORTUNE.has(a) || LIGHT.has(a)) && (FORTUNE.has(b) || LIGHT.has(b))) return 1
  // "Sun or Moon, or Mercury and Moon, or the Sun and Mercury... the good will
  // stands not so firme and sound" (CLI).
  if (has(a, b, 'MOON', 'MERCURY') || has(a, b, 'SUN', 'MERCURY')) return 0.3
  // "If the Infortunes agree... friends... and yet not very faithfull" (CLI).
  if (has(a, b, 'SATURN', 'MARS')) return -0.3
  // "Saturn, Jupiter, Venus and Mars... in each others place, there will be
  // dissention mixed with a kind of friendship" (CLI): Venus and Mars, Jupiter
  // and Saturn and the like are all spark, no sign either way.
  if (a !== b && [a, b].every(p => FORTUNE.has(p) || INFORTUNE.has(p))) return 0
  // Same planet: "likenesse is the Mother of affection" (CLI); for two
  // Infortunes that likeness stays mixed.
  if (a === b) return INFORTUNE.has(a) ? 0 : 0.5
  // "All the rest of the Planets hate Mars, especially Sun" (CLI).
  if (has(a, b, 'SUN', 'MARS')) return -1
  // "Sun in the place of any Planet... friendship for Honesty, Glory and
  // Goodnesse, Jupiter for Utility, Venus for Pleasure, Moon according to the
  // conveniency of her Nature" (CLI).
  if (a === 'SUN' || b === 'SUN') return 0.5
  if (a === 'MOON' || b === 'MOON') return 0.25 + ((VIEW[a][b] ?? 0) + (VIEW[b][a] ?? 0)) / 4
  // Everything else (Mercury with Mars or Saturn): the friendship table.
  return ((VIEW[a][b] ?? 0) + (VIEW[b][a] ?? 0)) / 2
}

// Aspect polarity with the CXXXVI and CLI adjustments.
function aspectPolarity(a: Classical, b: Classical, asp: 'sextile' | 'square' | 'trine' | 'opposition', t: RelationshipType): number {
  let p: number = ASPECT_POLARITY[asp]
  const fortune = FORTUNE.has(a) || FORTUNE.has(b)
  const infortune = INFORTUNE.has(a) || INFORTUNE.has(b)
  // "As the evill aspect of the Fortunes hurt but little, so the benevolent
  // aspects of the Infortunes for the most part tends to ill" (ch CXXXVI p.596-598). Lilly
  // states it for one chart's significators, so we apply it at half strength.
  if (fortune && !infortune) p *= p < 0 ? 0.75 : 1
  if (infortune && !fortune) p *= p > 0 ? 0.75 : 1
  if (asp === 'opposition') {
    // "Perpetuall enmity where Saturn and Mars are opposite" (CLI).
    if (has(a, b, 'SATURN', 'MARS')) p *= 1.5
    // "If Sun or Mars is in opposition to Mercury or Moon... they injure one another" (CLI).
    else if ((a === 'SUN' || a === 'MARS' || b === 'SUN' || b === 'MARS') && (a === 'MERCURY' || a === 'MOON' || b === 'MERCURY' || b === 'MOON')) p *= 1.25
  }
  // Significators of marriage, Sun and Moon or Venus and Mars: "in Sextile or
  // Trine... shew Unity: contrary aspects... portend no concord" (ch CXXXVIII p.599-603).
  if (t === 'romantic' && (has(a, b, 'SUN', 'MOON') || has(a, b, 'VENUS', 'MARS'))) p *= 1.3
  return p
}

// Exaltations, abstracts/planets.md (B I).
const EXALT: Record<string, Classical> = {
  Aries: 'SUN', Taurus: 'MOON', Virgo: 'MERCURY', Pisces: 'VENUS', Capricorn: 'MARS', Cancer: 'JUPITER', Libra: 'SATURN',
}
const SIGN_LIST = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
// Weight of each of the two rising sign tests below, about one strong contact.
const ASC_TEST_WEIGHT = 2

// Reception, B I ch XIX: planets in each other's signs bring things to pass "to
// the content of both parties", even by a hard aspect. Traditional rulers.
const RULER: Record<string, Classical> = {
  Aries: 'MARS', Taurus: 'VENUS', Gemini: 'MERCURY', Cancer: 'MOON', Leo: 'SUN', Virgo: 'MERCURY',
  Libra: 'VENUS', Scorpio: 'MARS', Sagittarius: 'JUPITER', Capricorn: 'SATURN', Aquarius: 'SATURN', Pisces: 'JUPITER',
}

// ── Importance per relationship type (existing site weights) ─────────────────

const WEIGHTS: Record<RelationshipType, Record<string, number>> = {
  romantic:   { VENUS: 2.5, MARS: 2.0, MOON: 2.0, SUN: 1.5, SATURN: 1.0, MERCURY: 0.8, JUPITER: 0.7 },
  friendship: { MERCURY: 2.5, MOON: 2.0, VENUS: 1.8, JUPITER: 1.8, SUN: 1.5, SATURN: 1.0, MARS: 0.8 },
  work:       { SATURN: 2.5, MERCURY: 2.0, SUN: 2.0, MARS: 1.5, JUPITER: 1.3, MOON: 0.8, VENUS: 0.7 },
  family:     { MOON: 2.5, SATURN: 2.0, SUN: 1.8, MERCURY: 1.0, MARS: 0.8, VENUS: 0.7, JUPITER: 0.7 },
  siblings:   { MERCURY: 2.5, MOON: 2.0, MARS: 1.8, SUN: 1.5, SATURN: 1.2, JUPITER: 1.0, VENUS: 0.8 },
  rivals:     { MARS: 2.5, SATURN: 1.8, SUN: 1.8, MERCURY: 1.0, MOON: 0.7, VENUS: 0.5, JUPITER: 0.5 },
}
const EXTRA_WEIGHT: Record<string, number> = { ASC: 1.8, URANUS: 0.6, NEPTUNE: 0.6, PLUTO: 0.6, NORTH_NODE: 0.8 }
const weightOf = (p: string, t: RelationshipType) => WEIGHTS[t][p] ?? EXTRA_WEIGHT[p] ?? 1

const OUTER = new Set(['URANUS', 'NEPTUNE', 'PLUTO', 'NORTH_NODE'])
// Ease shrinks toward neutral by this much weight x tightness, so a pair with
// very few contacts can't read as perfect.
const SHRINK = 2

interface Point { key: string; lon: number; sign: string }

function points(c: BirthChartData, timeKnown: boolean): Point[] {
  const keys = new Set<string>([...CLASSICAL, 'URANUS', 'NEPTUNE', 'PLUTO', 'NORTH_NODE'])
  const pts: Point[] = c.planets.filter(p => keys.has(p.planet)).map(p => ({ key: p.planet, lon: p.longitude, sign: p.sign }))
  // The Ascendant moves about a degree every four minutes: only with a real time.
  if (timeKnown && Number.isFinite(c.ascendant)) pts.push({ key: 'ASC', lon: c.ascendant, sign: c.ascendantSign })
  return pts
}

const angDiff = (x: number, y: number) => { const d = Math.abs(x - y) % 360; return d > 180 ? 360 - d : d }

export interface ScoreOpts { relationshipType?: RelationshipType; timeKnownA?: boolean; timeKnownB?: boolean }

export function rawScore(chartA: BirthChartData, chartB: BirthChartData, opts: ScoreOpts = {}) {
  const t = opts.relationshipType ?? 'romantic'
  const tkA = opts.timeKnownA ?? true
  const tkB = opts.timeKnownB ?? true
  const pa = points(chartA, tkA)
  const pb = points(chartB, tkB)
  const contacts: Contact[] = []
  let easeNum = 0, easeDen = 0, spark = 0

  for (const x of pa) for (const y of pb) {
    // Generational: two outer points barely differ between people the same age.
    if (OUTER.has(x.key) && OUTER.has(y.key)) continue
    const allowed = (MOIETY[x.key] ?? 2) + (MOIETY[y.key] ?? 2)
    const d = angDiff(x.lon, y.lon)
    for (const asp of ['conjunction', 'sextile', 'square', 'trine', 'opposition'] as const) {
      const orb = Math.abs(d - ASPECT_ANGLE[asp])
      if (orb > allowed) continue
      let tight = 1 - orb / allowed
      // Without a birth time the Moon can be about 6 degrees off (it moves ~13
      // a day), so its contacts count half.
      if ((x.key === 'MOON' && !tkA) || (y.key === 'MOON' && !tkB)) tight *= 0.5
      const strength = weightOf(x.key, t) * weightOf(y.key, t) * tight
      let polarity = 0
      if (isClassical(x.key) && isClassical(y.key)) {
        polarity = asp === 'conjunction' ? conjunctionPolarity(x.key, y.key, t) : aspectPolarity(x.key, y.key, asp, t)
        const mutual = RULER[x.sign] === y.key && RULER[y.sign] === x.key
        if (mutual && polarity < 0) polarity *= 0.3
        easeNum += polarity * strength
        easeDen += strength
      }
      spark += strength
      contacts.push({ a: x.key, b: y.key, aspect: asp, orb: Math.round(orb * 10) / 10, polarity, strength })
      break
    }
  }
  // The two rising sign tests need both birth times.
  if (tkA && tkB && Number.isFinite(chartA.ascendant) && Number.isFinite(chartB.ascendant)) {
    const asc = ascTests(chartA, chartB)
    easeNum += asc * ASC_TEST_WEIGHT
    easeDen += asc !== 0 ? ASC_TEST_WEIGHT : 0
  }
  const ease = easeNum / (easeDen + SHRINK) // -1..1
  return { ease, spark, contacts }
}

// Ch CLI p.636-639, both rising signs. Returns -1.5..1.
export function ascTests(chartA: BirthChartData, chartB: BirthChartData): number {
  let v = 0
  // 1. Rising sign rulers: "First, when he is the same Planet; secondly, when he
  // is received of the other by House or Exaltation; thirdly, when he is in
  // conjunction with the Lord of the ascendant of the other; fourthly, when he is
  // in Sextile or Trine of the other: In whole Nativities there is not a
  // concurrance of one of these, the Friendship of those two will not continue long."
  const ra = RULER[chartA.ascendantSign], rb = RULER[chartB.ascendantSign]
  const pa = chartA.planets.find(p => p.planet === ra), pb = chartB.planets.find(p => p.planet === rb)
  if (ra && rb && pa && pb) {
    const received = RULER[pa.sign] === rb || EXALT[pa.sign] === rb || RULER[pb.sign] === ra || EXALT[pb.sign] === ra
    const allowed = MOIETY[ra] + MOIETY[rb]
    const d = angDiff(pa.longitude, pb.longitude)
    const joined = [0, 60, 120].some(g => Math.abs(d - g) <= allowed)
    v += ra === rb || received || joined ? 1 : -0.5
  }
  // 2. "They never agree in whose Figure that Signe which is the Horoscope of the
  // one is the Signe of the 12th, 6th or 8th houses" (CLI; again in ch CXXXVIII
  // p.599-603). Lilly counts by sign, so we count whole signs from each rising sign.
  const ia = SIGN_LIST.indexOf(chartA.ascendantSign), ib = SIGN_LIST.indexOf(chartB.ascendantSign)
  if (ia >= 0 && ib >= 0) {
    const houseOf = (x: number, from: number) => ((x - from + 12) % 12) + 1
    if ([6, 8, 12].includes(houseOf(ia, ib)) || [6, 8, 12].includes(houseOf(ib, ia))) v -= 1
  }
  return v
}

// Percentile of v within sorted quantile breakpoints q (101 values, q[i] = i-th percentile).
function percentile(q: readonly number[], v: number): number {
  if (v <= q[0]) return 0
  if (v >= q[q.length - 1]) return 100
  let lo = 0, hi = q.length - 1
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (q[m] <= v) lo = m; else hi = m }
  const f = q[hi] === q[lo] ? 0 : (v - q[lo]) / (q[hi] - q[lo])
  return Math.round(lo + f)
}

// Tier shares chosen 2026-11-20: S top 5%, A next 15%, B middle 40%, C 25%, D 15%.
export function synTier(easePct: number): SynTier {
  return easePct >= 95 ? 'S' : easePct >= 80 ? 'A' : easePct >= 40 ? 'B' : easePct >= 15 ? 'C' : 'D'
}

export function scoreSynastry(chartA: BirthChartData, chartB: BirthChartData, opts: ScoreOpts = {}): SynastryScoreV2 {
  const t = opts.relationshipType ?? 'romantic'
  const r = rawScore(chartA, chartB, opts)
  const cal = CALIBRATION[t] ?? CALIBRATION.romantic
  const ease = percentile(cal.ease, r.ease)
  const spark = percentile(cal.spark, r.spark)
  const tier = synTier(ease)
  const byImpact = (c: Contact) => Math.abs(c.polarity) * c.strength
  return {
    version: 2, ease, spark, tier, label: `${tier} tier`, score: ease,
    helps: r.contacts.filter(c => c.polarity > 0).sort((x, y) => byImpact(y) - byImpact(x)).slice(0, 4),
    strains: r.contacts.filter(c => c.polarity < 0).sort((x, y) => byImpact(y) - byImpact(x)).slice(0, 3),
  }
}

export const POINT_NAME: Record<string, string> = {
  SUN: 'Sun', MOON: 'Moon', MERCURY: 'Mercury', VENUS: 'Venus', MARS: 'Mars', JUPITER: 'Jupiter', SATURN: 'Saturn',
  URANUS: 'Uranus', NEPTUNE: 'Neptune', PLUTO: 'Pluto', NORTH_NODE: 'North Node', ASC: 'Ascendant',
}

export type { PlanetName }
