// Signs
export const SIGN_LIST = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

export const SIGN_LIST_LOWER = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
]

// Planets — uppercase internal keys (matches chart data)
export const PLANET_KEYS = [
  'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS',
  'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO',
  'NORTH_NODE', 'CHIRON',
] as const

export type PlanetKey = typeof PLANET_KEYS[number]

// Human-readable labels keyed by PLANET_KEYS values
export const PLANET_LABELS: Record<string, string> = {
  SUN: 'Sun',
  MOON: 'Moon',
  MERCURY: 'Mercury',
  VENUS: 'Venus',
  MARS: 'Mars',
  JUPITER: 'Jupiter',
  SATURN: 'Saturn',
  URANUS: 'Uranus',
  NEPTUNE: 'Neptune',
  PLUTO: 'Pluto',
  NORTH_NODE: 'North Node',
  CHIRON: 'Chiron',
}

// Display-name array (matches PLANET_KEYS order) — used in admin forms
export const PLANET_LIST = PLANET_KEYS.map(k => PLANET_LABELS[k])

// Lowercase names for Reading Room (excludes North Node / Chiron)
export const PLANET_LIST_LOWER = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
]

// URL slugs (matches PLANET_KEYS order) — 'north-node' not 'north_node'
export const PLANET_SLUG_LIST = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'north-node', 'chiron',
]

// Key → slug map (SUN → 'sun', NORTH_NODE → 'north-node')
export const PLANET_SLUGS: Record<string, string> = {
  SUN: 'sun', MOON: 'moon', MERCURY: 'mercury', VENUS: 'venus', MARS: 'mars',
  JUPITER: 'jupiter', SATURN: 'saturn', URANUS: 'uranus', NEPTUNE: 'neptune',
  PLUTO: 'pluto', NORTH_NODE: 'north-node', CHIRON: 'chiron',
}

// Slug → key map ('north-node' → 'NORTH_NODE')
export const SLUG_TO_PLANET_KEY: Record<string, string> = {
  sun: 'SUN', moon: 'MOON', mercury: 'MERCURY', venus: 'VENUS', mars: 'MARS',
  jupiter: 'JUPITER', saturn: 'SATURN', uranus: 'URANUS', neptune: 'NEPTUNE',
  pluto: 'PLUTO', 'north-node': 'NORTH_NODE', chiron: 'CHIRON',
}

// Astrological glyphs for planets
export const PLANET_SYMBOLS: Record<string, string> = {
  SUN: '☉', MOON: '☽', MERCURY: '☿', VENUS: '♀', MARS: '♂',
  JUPITER: '♃', SATURN: '♄', URANUS: '♅', NEPTUNE: '♆', PLUTO: '♇',
}

// Interpretation admin
export const INTERPRETATION_TYPES = [
  'planet_info', 'sign_info', 'house_info', 'planet_sign', 'planet_house',
  'combined', 'dignity', 'element', 'modality', 'transit', 'retrograde',
]

// Celebrity filter categories (leading 'All' is intentional for the filter UI)
export const CELEBRITY_CATEGORIES = [
  'All', 'Musician', 'Actor', 'Athlete', 'Politician',
  'Business', 'Entertainer', 'Writer', 'Scientist',
]

// Reading Room book categories
export const BOOK_CATEGORIES = ['beginner', 'intermediate', 'advanced', 'tools']

// Reading Room featured months
export const READING_ROOM_MONTHS = [
  { value: '', label: 'None (permanent shelf)' },
  { value: '01', label: 'January — New Year / Beginner Guide' },
  { value: '02', label: 'February — Love / Synastry' },
  { value: '03', label: 'March — Self-Development' },
  { value: '04', label: 'April — Eclipses / Lunar Nodes' },
  { value: '05', label: 'May — Body / Wellness' },
  { value: '06', label: 'June — Communication / Mercury' },
  { value: '07', label: 'July — Moon / Emotional Life' },
  { value: '08', label: 'August — Sun / Creativity' },
  { value: '09', label: 'September — Chart Reading Skills' },
  { value: '10', label: 'October — Shadow Work / Pluto' },
  { value: '11', label: 'November — Philosophy / Jupiter' },
  { value: '12', label: 'December — Transits / Year Ahead' },
]
