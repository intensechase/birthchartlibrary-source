// Planetary dignities: rulership, exaltation, detriment, fall
// Based on traditional astrology rulerships

type Dignity = 'rulership' | 'exaltation' | 'detriment' | 'fall' | null

const RULERSHIPS: Record<string, string[]> = {
  SUN: ['Leo'],
  MOON: ['Cancer'],
  MERCURY: ['Gemini', 'Virgo'],
  VENUS: ['Taurus', 'Libra'],
  MARS: ['Aries', 'Scorpio'],
  JUPITER: ['Sagittarius', 'Pisces'],
  SATURN: ['Capricorn', 'Aquarius'],
  URANUS: ['Aquarius'],
  NEPTUNE: ['Pisces'],
  PLUTO: ['Scorpio'],
  CHIRON: [],
  NORTH_NODE: [],
}

const EXALTATIONS: Record<string, string> = {
  SUN: 'Aries',
  MOON: 'Taurus',
  MERCURY: 'Virgo',
  VENUS: 'Pisces',
  MARS: 'Capricorn',
  JUPITER: 'Cancer',
  SATURN: 'Libra',
}

const DETRIMENTS: Record<string, string[]> = {
  SUN: ['Aquarius'],
  MOON: ['Capricorn'],
  MERCURY: ['Sagittarius', 'Pisces'],
  VENUS: ['Aries', 'Scorpio'],
  MARS: ['Taurus', 'Libra'],
  JUPITER: ['Gemini', 'Virgo'],
  SATURN: ['Cancer', 'Leo'],
  URANUS: ['Leo'],
  NEPTUNE: ['Virgo'],
  PLUTO: ['Taurus'],
  CHIRON: [],
  NORTH_NODE: [],
}

const FALLS: Record<string, string> = {
  SUN: 'Libra',
  MOON: 'Scorpio',
  MERCURY: 'Pisces',
  VENUS: 'Virgo',
  MARS: 'Cancer',
  JUPITER: 'Capricorn',
  SATURN: 'Aries',
}

export function getDignity(planet: string, sign: string): Dignity {
  if (RULERSHIPS[planet]?.includes(sign)) return 'rulership'
  if (EXALTATIONS[planet] === sign) return 'exaltation'
  if (DETRIMENTS[planet]?.includes(sign)) return 'detriment'
  if (FALLS[planet] === sign) return 'fall'
  return null
}

export const DIGNITY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  rulership: { label: 'Domicile', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  exaltation: { label: 'Exalted', color: 'text-amber-700', bg: 'bg-amber-50' },
  detriment: { label: 'Detriment', color: 'text-rose-700', bg: 'bg-rose-50' },
  fall: { label: 'Fall', color: 'text-slate-600', bg: 'bg-slate-100' },
}
