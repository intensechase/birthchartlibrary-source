import type { BirthChartData, PlanetName } from './calculate'

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition'
export type RelationshipType = 'romantic' | 'friendship' | 'work' | 'family' | 'siblings' | 'rivals'

export interface SynastryAspect {
  planet1: PlanetName   // Person A
  planet2: PlanetName   // Person B
  aspectType: AspectType
  orb: number           // degrees from exact
  isHarmonic: boolean   // conjunction/trine/sextile = true, square/opposition = false
  interpretation: string
}

const ASPECTS: { type: AspectType; angle: number; orb: number; harmonic: boolean }[] = [
  { type: 'conjunction',  angle: 0,   orb: 8, harmonic: true  },
  { type: 'sextile',      angle: 60,  orb: 4, harmonic: true  },
  { type: 'square',       angle: 90,  orb: 6, harmonic: false },
  { type: 'trine',        angle: 120, orb: 6, harmonic: true  },
  { type: 'opposition',   angle: 180, orb: 8, harmonic: false },
]

// Planets included in synastry (skip generational outer planets + nodes)
const SYNASTRY_PLANETS: PlanetName[] = [
  'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN',
]

// Planet weights per relationship type — higher = more important in sorting
const RELATIONSHIP_WEIGHTS: Record<RelationshipType, Partial<Record<PlanetName, number>>> = {
  romantic:   { VENUS: 2.5, MARS: 2.0, MOON: 2.0, SUN: 1.5, SATURN: 1.0, MERCURY: 0.8, JUPITER: 0.7 },
  friendship: { MERCURY: 2.5, MOON: 2.0, VENUS: 1.8, JUPITER: 1.8, SUN: 1.5, SATURN: 1.0, MARS: 0.8 },
  work:       { SATURN: 2.5, MERCURY: 2.0, SUN: 2.0, MARS: 1.5, JUPITER: 1.3, MOON: 0.8, VENUS: 0.7 },
  family:     { MOON: 2.5, SATURN: 2.0, SUN: 1.8, MERCURY: 1.0, MARS: 0.8, VENUS: 0.7, JUPITER: 0.7 },
  siblings:   { MERCURY: 2.5, MOON: 2.0, MARS: 1.8, SUN: 1.5, SATURN: 1.2, JUPITER: 1.0, VENUS: 0.8 },
  rivals:     { MARS: 2.5, SATURN: 1.8, SUN: 1.8, MERCURY: 1.0, MOON: 0.7, VENUS: 0.5, JUPITER: 0.5 },
}

function pairWeight(p1: PlanetName, p2: PlanetName, type: RelationshipType): number {
  const w = RELATIONSHIP_WEIGHTS[type]
  return (w[p1] ?? 1.0) * (w[p2] ?? 1.0)
}

type InterpMap = Partial<Record<AspectType, string>>
type PairInterps = { conjunction: string; harmony: string; tension: string }

const INTERPS: Record<string, PairInterps> = {
  'SUN-MOON': {
    conjunction: "A deeply personal bond where one partner's identity naturally meets the other's emotional needs. This aspect is common in lasting partnerships.",
    harmony:    "A natural flow between identity and emotion... one feels understood, the other feels appreciated. Warmth and comfort come easily.",
    tension:    "A push-pull between self-expression and emotional needs. Growth comes from learning to honor both without one eclipsing the other.",
  },
  'VENUS-MARS': {
    conjunction: "Raw magnetic attraction. Venus draws what Mars pursues, creating intense chemistry and a natural give-and-take between desire and affection.",
    harmony:    "Easy, flowing attraction... desire and affection speak the same language. Physical and romantic chemistry comes naturally.",
    tension:    "Strong attraction with friction. The pull is real, but so is the clash. Passionate highs and frustrated lows are both on offer.",
  },
  'SUN-VENUS': {
    conjunction: "One person's core identity resonates deeply with the other's values and sense of beauty. Genuine admiration flows both ways.",
    harmony:    "Genuine liking... each sees the best in the other. Warmth, appreciation, and a natural desire to make the other feel good.",
    tension:    "Values and identity pull in different directions. Attraction is there but a persistent sense of being slightly misaligned.",
  },
  'MOON-VENUS': {
    conjunction: "Emotional needs and love languages speak the same dialect. A deeply comforting connection where each person feels cherished.",
    harmony:    "Warmth and emotional generosity flow freely. Affection feels consistent and natural, never forced or calculated.",
    tension:    "What feels like love to one may not register as love to the other. Love languages need conscious translation.",
  },
  'SUN-SUN': {
    conjunction: "Same solar energy creates instant recognition and mutual understanding of core drives. Two people who fundamentally get each other.",
    harmony:    "Compatible life purposes and self-expression styles. These two naturally support each other's goals and ambitions.",
    tension:    "Differing expressions of self create ego friction, but the tension also pushes both toward self-awareness and growth.",
  },
  'MOON-MOON': {
    conjunction: "Same emotional wavelength... these two feel things in similar ways and provide instinctive comfort without having to explain themselves.",
    harmony:    "Emotional rhythms that complement rather than clash. Each person's needs are understood and generally met.",
    tension:    "Different emotional processing styles create misunderstanding. What soothes one can inadvertently unsettle the other.",
  },
  'SUN-MARS': {
    conjunction: "One person's will directly activates the other's drive. High energy and motivation between them, though egos can collide.",
    harmony:    "Supportive and energizing. Mars activates the Sun's goals; the Sun gives Mars direction and purpose.",
    tension:    "Power struggles and frustrated ambition. The drive is there but creates competition, irritability, or friction.",
  },
  'MOON-MARS': {
    conjunction: "Emotional needs meet raw drive. Passionate connection but also emotional volatility... the feelings run hot in both directions.",
    harmony:    "Mars protects and activates Moon's needs; Moon provides a safe container for Mars's energy. Protective and warm.",
    tension:    "Mars can inadvertently wound Moon's feelings. Bluntness meets sensitivity in ways that require patience.",
  },
  'VENUS-VENUS': {
    conjunction: "Similar tastes, values, and ways of expressing love. A natural aesthetic and emotional harmony.",
    harmony:    "These two appreciate similar things and show affection in ways the other recognizes and receives well.",
    tension:    "Different values and love styles create a persistent disconnect despite genuine affection.",
  },
  'MARS-MARS': {
    conjunction: "Two people who move at the same pace and share similar drives. Highly activating... for better or worse.",
    harmony:    "Compatible energy levels and drives. These two don't step on each other's ambitions.",
    tension:    "Competing drives create frustration. Both want to lead and pursue in ways that generate friction or open conflict.",
  },
  'SUN-JUPITER': {
    conjunction: "One person expands the other's world. An optimistic, growth-oriented connection that tends to bring out the best.",
    harmony:    "Generous, uplifting, and inspiring. Jupiter makes the Sun feel valued; the Sun gives Jupiter's gifts a place to shine.",
    tension:    "Excess and overreach. Good intentions can become overwhelming — too much of a good thing.",
  },
  'MOON-JUPITER': {
    conjunction: "Warmth and emotional generosity. Jupiter expands Moon's capacity for feeling nurtured and belonging.",
    harmony:    "A warm, optimistic emotional connection. Each person makes the other feel emotionally supported and cared for.",
    tension:    "Jupiter's expansiveness can overwhelm Moon's need for security, or Moon's needs can feel like too much for Jupiter.",
  },
  'SUN-SATURN': {
    conjunction: "Saturn tests and structures the Sun's expression. Deep commitment is possible, though one partner may feel held back.",
    harmony:    "Saturn provides stability and structure for the Sun's self-expression. Long-term commitment and reliability.",
    tension:    "Saturn can dampen the Sun's spirit, creating a dynamic where one person feels consistently limited or criticized.",
  },
  'MOON-SATURN': {
    conjunction: "Serious emotional commitment. Saturn takes Moon's needs seriously, though the dynamic can feel heavy.",
    harmony:    "Emotional reliability. Saturn offers what Moon needs most: consistency, structure, and long-term security.",
    tension:    "Emotional coolness or criticism. Moon can feel unseen; Saturn can feel emotionally burdened by the relationship.",
  },
  'VENUS-JUPITER': {
    conjunction: "Abundant affection and generosity. One of the most pleasant aspects in synastry... warmth and mutual enjoyment come easily.",
    harmony:    "Easy pleasure and joy. These two make each other feel good with minimal effort. Shared enjoyment and social warmth.",
    tension:    "Indulgence and excess. The enjoyment is real but can tip into overextension or unrealistic expectations.",
  },
  'MARS-JUPITER': {
    conjunction: "Drive meets opportunity. This pairing generates ambition, enthusiasm, and a sense that anything is possible together.",
    harmony:    "Energizing and expansive. Mars's action is supported by Jupiter's optimism and sense of possibility.",
    tension:    "Recklessness. Energy and optimism together without grounding can lead to overcommitment or burnout.",
  },
  'VENUS-SATURN': {
    conjunction: "Serious affection. Saturn commits to Venus with dedication, though the relationship can feel weighty or dutiful.",
    harmony:    "Long-term love built on loyalty. Saturn honors Venus with consistency; Venus softens Saturn's seriousness.",
    tension:    "Saturn can restrict Venus's expression of love, making the relationship feel more obligatory than joyful.",
  },
  'MERCURY-MERCURY': {
    conjunction: "Same mental frequency. These two think alike, talk easily, and understand each other's logic and humor instinctively.",
    harmony:    "Easy communication and mental rapport. Ideas flow naturally and conversations feel effortless.",
    tension:    "Different thinking and communication styles create misunderstanding. What one says is not always what the other hears.",
  },
  'MERCURY-SUN': {
    conjunction: "The Sun person's identity is deeply engaged by Mercury's thinking. Conversations spark self-discovery in both directions.",
    harmony:    "Stimulating mental connection. Mercury understands the Sun's core self; the Sun gives Mercury's ideas direction.",
    tension:    "Communication friction. Mercury's style may not resonate with the Sun person's expression, creating recurring misunderstanding.",
  },
  'MERCURY-MOON': {
    conjunction: "Mind meets emotion. Mercury articulates what Moon feels, creating a connection where both thinking and feeling are honored.",
    harmony:    "Thoughtful emotional expression. Mercury helps Moon process feelings; Moon gives Mercury's words emotional depth.",
    tension:    "Logic and emotion talk past each other. Mercury may seem detached; Moon may seem irrational. Bridging these takes work.",
  },
  'MERCURY-VENUS': {
    conjunction: "Intellectual appreciation meets beauty and values. These two enjoy talking about what they love and love what they talk about.",
    harmony:    "Easy aesthetic and intellectual rapport. Conversation is pleasurable, and tastes tend to align.",
    tension:    "Communication style clashes with values. What one person says and how the other hears it consistently misses the mark.",
  },
  'MERCURY-MARS': {
    conjunction: "Mental drive and direct communication. Ideas become action quickly, though debates can turn combative.",
    harmony:    "Mercury sharpens Mars's direction; Mars gives Mercury's ideas the push to become real.",
    tension:    "Heated debates and sharp words. The mental stimulation is real, but so is the potential for cutting remarks.",
  },
}

function getInterpretation(p1: PlanetName, p2: PlanetName, aspectType: AspectType): string {
  const key1 = `${p1}-${p2}`
  const key2 = `${p2}-${p1}`
  const interp = INTERPS[key1] || INTERPS[key2]

  if (!interp) {
    const harmonic = ['conjunction', 'trine', 'sextile'].includes(aspectType)
    if (aspectType === 'conjunction') return `${p1.charAt(0) + p1.slice(1).toLowerCase()} and ${p2.charAt(0) + p2.slice(1).toLowerCase()} merge their energies in a significant point of contact.`
    return harmonic
      ? `A flowing connection between these two energies that tends to support each other naturally.`
      : `A dynamic tension between these two energies that calls for conscious navigation.`
  }

  if (aspectType === 'conjunction') return interp.conjunction
  const isHarmonic = ['trine', 'sextile'].includes(aspectType)
  return isHarmonic ? interp.harmony : interp.tension
}

function angularDiff(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2) % 360
  if (diff > 180) diff = 360 - diff
  return diff
}

export function computeSynastryAspects(
  chartA: BirthChartData,
  chartB: BirthChartData,
  relationshipType: RelationshipType = 'romantic'
): SynastryAspect[] {
  const aspects: SynastryAspect[] = []

  const planetsA = chartA.planets.filter(p => SYNASTRY_PLANETS.includes(p.planet))
  const planetsB = chartB.planets.filter(p => SYNASTRY_PLANETS.includes(p.planet))

  for (const pA of planetsA) {
    for (const pB of planetsB) {
      const diff = angularDiff(pA.longitude, pB.longitude)
      for (const aspect of ASPECTS) {
        const orb = Math.abs(diff - aspect.angle)
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: pA.planet,
            planet2: pB.planet,
            aspectType: aspect.type,
            orb: Math.round(orb * 10) / 10,
            isHarmonic: aspect.harmonic,
            interpretation: getInterpretation(pA.planet, pB.planet, aspect.type),
          })
          break // only one aspect per planet pair
        }
      }
    }
  }

  // Sort by relationship-type-weighted importance, then by orb tightness
  aspects.sort((a, b) => {
    const wA = pairWeight(a.planet1, a.planet2, relationshipType)
    const wB = pairWeight(b.planet1, b.planet2, relationshipType)
    if (wB !== wA) return wB - wA
    return a.orb - b.orb
  })

  return aspects
}

export function synastryScore(aspects: SynastryAspect[]): { label: string; score: number } {
  if (!aspects.length) return { label: 'Neutral', score: 50 }
  const harmonic = aspects.filter(a => a.isHarmonic).length
  const score = Math.round((harmonic / aspects.length) * 100)
  const label =
    score >= 70 ? 'Very Harmonious' :
    score >= 55 ? 'Harmonious' :
    score >= 45 ? 'Mixed' :
    score >= 30 ? 'Challenging' : 'Very Challenging'
  return { label, score }
}

export const ASPECT_SYMBOLS: Record<AspectType, string> = {
  conjunction: '☌',
  sextile:     '⚹',
  square:      '□',
  trine:       '△',
  opposition:  '☍',
}

export const PLANET_SYMBOLS: Partial<Record<PlanetName, string>> = {
  SUN:     '☉',
  MOON:    '☽',
  MERCURY: '☿',
  VENUS:   '♀',
  MARS:    '♂',
  JUPITER: '♃',
  SATURN:  '♄',
}
