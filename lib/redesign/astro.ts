// Small astrology constants the redesigned pages share. Safe to import in the
// browser: no interpretation text lives here (that stays in getStaticProps,
// see lib/redesign/celeb-view.ts and the 10/25 chunk lesson).
import type { IconName } from '@/lib/icons/paths'

export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const
export type SignName = (typeof SIGN_NAMES)[number]
export type Element = 'Fire' | 'Earth' | 'Air' | 'Water'
export type Mode = 'Cardinal' | 'Fixed' | 'Mutable'

export const ELEMENT_OF: Record<string, Element> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
}
export const MODE_OF: Record<string, Mode> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
}

// Element colours mark signs only (Icon and colour system board).
export const ELEMENT_CLASS: Record<Element, string> = {
  Fire: 'text-rd-fire', Earth: 'text-rd-earth', Air: 'text-rd-air', Water: 'text-rd-water',
}

// Feature disc colours: only on big standalone discs (hero chips, card heads,
// switcher, sky diagram). Rows use one soft ink.
export const DISC: Record<string, string> = {
  SUN: '#F4C04E', MOON: '#D4DCEB', MERCURY: '#9EE2B5', VENUS: '#F2A7B8', MARS: '#F0705A',
  JUPITER: '#E8A35C', SATURN: '#C2AE93', URANUS: '#4DD6E8', NEPTUNE: '#8C8FF7',
  PLUTO: '#C38BE8', NORTH_NODE: '#C3CBFF', CHIRON: '#D6DC7A', RISING: '#C3CBFF',
}
export const GROUP_COLOR: Record<string, string> = {
  Fire: '#FF8A65', Earth: '#8FCB8F', Air: '#F2D16B', Water: '#5FA8F0',
  Cardinal: '#C3CBFF', Fixed: '#8E9BF0', Mutable: '#5F6CC8', Active: '#C3CBFF', Receptive: '#6E7BD9',
}

// The bodies the page shows, in reading order. Lilith is left out (not in the model).
export const BODY_ORDER = [
  'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN',
  'URANUS', 'NEPTUNE', 'PLUTO', 'NORTH_NODE', 'CHIRON',
] as const
export const TEN = BODY_ORDER.slice(0, 10) as readonly string[]

export const BODY_NAME: Record<string, string> = {
  SUN: 'Sun', MOON: 'Moon', MERCURY: 'Mercury', VENUS: 'Venus', MARS: 'Mars', JUPITER: 'Jupiter',
  SATURN: 'Saturn', URANUS: 'Uranus', NEPTUNE: 'Neptune', PLUTO: 'Pluto',
  NORTH_NODE: 'North Node', CHIRON: 'Chiron', RISING: 'Rising',
}
export const BODY_ICON: Record<string, IconName> = {
  SUN: 'sun', MOON: 'moon', MERCURY: 'mercury', VENUS: 'venus', MARS: 'mars', JUPITER: 'jupiter',
  SATURN: 'saturn', URANUS: 'uranus', NEPTUNE: 'neptune', PLUTO: 'pluto',
  NORTH_NODE: 'north-node', CHIRON: 'chiron', RISING: 'ascendant',
}
// Card keys in links (?card=moon, ?card=north-node)
export const bodySlug = (id: string) => id.toLowerCase().replace('_', '-')

export function signIcon(sign: string): IconName {
  return sign.toLowerCase() as IconName
}

export function ordinal(n: number): string {
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th'
  return n + s
}

// "12°" or, with exact on, "12°27′"
export function degText(signDegree: number, exact: boolean): string {
  const w = Math.floor(signDegree)
  if (!exact) return `${w}°`
  return `${w}°${String(Math.floor((signDegree - w) * 60)).padStart(2, '0')}′`
}

// A short line per body, in the same style as HOUSE_KEYS (planet index cards).
export const BODY_KEYS: Record<string, string> = {
  SUN: 'identity, will, vitality', MOON: 'feelings, needs, home', MERCURY: 'thinking, speech, learning',
  VENUS: 'love, values, pleasure', MARS: 'drive, desire, courage', JUPITER: 'growth, faith, generosity',
  SATURN: 'limits, duty, maturity', URANUS: 'change, freedom, surprise', NEPTUNE: 'dreams, ideals, intuition',
  PLUTO: 'power, depth, rebirth', NORTH_NODE: 'direction, purpose, the unfamiliar', CHIRON: 'old wounds, healing, teaching',
}
export const HOUSE_KEYS = [
  '', 'self, body, first impressions', 'money, values, belongings', 'siblings, speech, short trips',
  'home, family, roots', 'creativity, romance, play', 'work, health, daily routine',
  'partners, marriage, rivals', 'shared money, intimacy, change', 'travel, belief, learning',
  'career, reputation, public life', 'friends, groups, hopes', 'solitude, the hidden, endings',
]

// Birth time tier (owner, 11/19): S to D replaces Rodden letters on the page.
// The Rodden letter still shows, small, inside the explainer.
export const TIER_OF: Record<string, string> = { AA: 'S', A: 'A', B: 'B', C: 'C', DD: 'D' }
