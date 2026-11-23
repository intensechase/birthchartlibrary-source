import { ascTests, conjunctionPolarity, rawScore, scoreSynastry, synTier } from '@/lib/swisseph/synastry-score'
import type { BirthChartData, PlanetName, Sign } from '@/lib/swisseph/calculate'

const SIGNS: Sign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

// A chart holding only the given planets at the given longitudes.
function chart(p: Partial<Record<PlanetName, number>>, asc = 0): BirthChartData {
  return {
    planets: Object.entries(p).map(([planet, lon]) => ({
      planet: planet as PlanetName, longitude: lon!, sign: SIGNS[Math.floor(lon! / 30)], signDegree: lon! % 30, house: 1, retrograde: false,
    })),
    houseCusps: new Array(13).fill(0), ascendant: asc, midheaven: 0, ascendantSign: SIGNS[Math.floor(asc / 30)], midheavenSign: 'Aries',
  }
}
// Ease for one contact between planet a in chart A and planet b in chart B, b placed `gap` degrees after a.
const easeOf = (a: PlanetName, b: PlanetName, gap: number) => rawScore(chart({ [a]: 10 }), chart({ [b]: 10 + gap }), { timeKnownA: false, timeKnownB: false }).ease

describe('synastry score v2 doctrine (Lilly)', () => {
  it('rates a Fortune conjunction above an Infortune conjunction', () => {
    expect(easeOf('VENUS', 'JUPITER', 0)).toBeGreaterThan(0)
    expect(easeOf('MARS', 'SATURN', 0)).toBeLessThan(0)
  })

  it('counts the trine above the sextile and the opposition below the square', () => {
    expect(easeOf('SUN', 'MOON', 120)).toBeGreaterThan(easeOf('SUN', 'MOON', 60))
    expect(easeOf('SUN', 'MOON', 180)).toBeLessThan(easeOf('SUN', 'MOON', 90))
  })

  it('counts a tight aspect more than a wide one', () => {
    expect(easeOf('VENUS', 'MARS', 120)).toBeGreaterThan(easeOf('VENUS', 'MARS', 126))
  })

  it('softens a hard aspect in mutual reception', () => {
    // Venus in Aries (Mars' sign) square Mars in Cancer: no reception.
    const plain = rawScore(chart({ VENUS: 10 }), chart({ MARS: 100 }), { timeKnownA: false, timeKnownB: false }).ease
    // Venus in Aries opposite Mars in Libra (Venus' sign): mutual reception.
    const received = rawScore(chart({ VENUS: 10 }), chart({ MARS: 190 }), { timeKnownA: false, timeKnownB: false }).ease
    expect(received).toBeGreaterThan(plain)
  })

  it('gives outer planets intensity but no good or bad sign', () => {
    const r = rawScore(chart({ VENUS: 10 }), chart({ PLUTO: 10 }), { timeKnownA: false, timeKnownB: false })
    expect(r.ease).toBe(0)
    expect(r.spark).toBeGreaterThan(0)
  })

  it('uses the Ascendant only when the birth time is known', () => {
    const a = chart({ VENUS: 10 }), b = chart({}, 10)
    expect(rawScore(a, b, { timeKnownA: true, timeKnownB: true }).contacts).toHaveLength(1)
    expect(rawScore(a, b, { timeKnownA: true, timeKnownB: false }).contacts).toHaveLength(0)
  })

  it('follows ch CLI for planets in each other\'s places', () => {
    expect(conjunctionPolarity('VENUS', 'MOON')).toBe(1)           // "a sure friendship"
    expect(conjunctionPolarity('VENUS', 'MARS')).toBe(0)           // dissension mixed with friendship
    expect(conjunctionPolarity('SATURN', 'MARS')).toBeLessThan(0)  // "not very faithfull"
    expect(conjunctionPolarity('SUN', 'MARS')).toBe(-1)            // "especially Sun"
    expect(conjunctionPolarity('MARS', 'MARS')).toBe(0)
    expect(conjunctionPolarity('MERCURY', 'MERCURY')).toBe(0.5)    // "likenesse"
  })

  it('weights Sun on Moon for romance only (ch CXXXVI)', () => {
    expect(conjunctionPolarity('SUN', 'MOON', 'romantic')).toBe(1)
    expect(conjunctionPolarity('SUN', 'MOON', 'work')).toBeLessThan(1)
  })

  it('lets a Fortune\'s square hurt less than an Infortune\'s (ch CXXXVI)', () => {
    expect(easeOf('JUPITER', 'MERCURY', 90)).toBeGreaterThan(easeOf('SATURN', 'MERCURY', 90))
    expect(easeOf('JUPITER', 'MERCURY', 120)).toBeGreaterThan(easeOf('SATURN', 'MERCURY', 120))
  })

  it('makes Saturn opposite Mars the hardest opposition (ch CLI)', () => {
    expect(easeOf('SATURN', 'MARS', 180)).toBeLessThan(easeOf('SATURN', 'MERCURY', 180))
  })

  it('applies the rising sign tests only with both times', () => {
    // Aries rising both (same ruler Mars, passes test 1), vs Aries and Virgo rising (Virgo is Aries' 6th).
    const same = ascTests(chart({ MARS: 10 }, 5), chart({ MARS: 200 }, 5))
    const sixth = ascTests(chart({ MARS: 10 }, 5), chart({ MERCURY: 300 }, 155))
    expect(same).toBe(1)
    expect(sixth).toBeLessThan(0)
    const a = chart({ MARS: 10 }, 5), b = chart({ MERCURY: 300 }, 155)
    expect(rawScore(a, b, { timeKnownA: true, timeKnownB: false }).ease).toBe(0)
  })

  it('maps percentiles to the agreed tier shares', () => {
    expect([99, 95, 94, 80, 79, 40, 39, 15, 14, 0].map(synTier).join('')).toBe('SSAABBCCDD')
  })

  it('returns percentiles and an "X tier" label', () => {
    const s = scoreSynastry(chart({ SUN: 10, MOON: 50, VENUS: 70 }), chart({ SUN: 130, MOON: 170, MARS: 190 }))
    expect(s.ease).toBeGreaterThanOrEqual(0)
    expect(s.ease).toBeLessThanOrEqual(100)
    expect(s.label).toBe(`${s.tier} tier`)
    expect(s.score).toBe(s.ease)
  })
})
