// Lightweight constants + pure functions for sign compatibility.
// Split from compatibility.ts so pages that only need helpers (celeb,
// horoscope, sign pages) don't drag the ~100KB raw / 31KB gzip text
// data table into the client bundle.

export const SIGN_ORDER = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const

export function pairKey(a: string, b: string): string {
  const i = SIGN_ORDER.indexOf(a as typeof SIGN_ORDER[number])
  const j = SIGN_ORDER.indexOf(b as typeof SIGN_ORDER[number])
  return i <= j ? `${a}+${b}` : `${b}+${a}`
}

export function getPairSlug(sign1: string, sign2: string): string {
  const i = SIGN_ORDER.indexOf(sign1 as typeof SIGN_ORDER[number])
  const j = SIGN_ORDER.indexOf(sign2 as typeof SIGN_ORDER[number])
  const [a, b] = i <= j ? [sign1, sign2] : [sign2, sign1]
  return `${a.toLowerCase()}-and-${b.toLowerCase()}`
}

export function getElementCombo(el1: string, el2: string): string {
  const order = ['Fire', 'Earth', 'Air', 'Water']
  const i = order.indexOf(el1), j = order.indexOf(el2)
  return i <= j ? `${el1}+${el2}` : `${el2}+${el1}`
}

export function getModalityCombo(m1: string, m2: string): string {
  const order = ['Cardinal', 'Fixed', 'Mutable']
  const i = order.indexOf(m1), j = order.indexOf(m2)
  return i <= j ? `${m1}+${m2}` : `${m2}+${m1}`
}
