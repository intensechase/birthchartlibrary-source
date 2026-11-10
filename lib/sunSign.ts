// Returns the sun sign for a given birth month (1–12) and day (1–31).
// Cutoffs are the standard astrological dates (vary ±1 day by year, but close enough for email personalization).

const RANGES: [number, number, string][] = [
  [1, 20, 'Aquarius'],
  [2, 19, 'Pisces'],
  [3, 21, 'Aries'],
  [4, 20, 'Taurus'],
  [5, 21, 'Gemini'],
  [6, 21, 'Cancer'],
  [7, 23, 'Leo'],
  [8, 23, 'Virgo'],
  [9, 23, 'Libra'],
  [10, 23, 'Scorpio'],
  [11, 22, 'Sagittarius'],
  [12, 22, 'Capricorn'],
]

// Signs that start before the cutoff day of the listed month
const PRIOR_SIGN: Record<number, string> = {
  1: 'Capricorn',
  2: 'Aquarius',
  3: 'Pisces',
  4: 'Aries',
  5: 'Taurus',
  6: 'Gemini',
  7: 'Cancer',
  8: 'Leo',
  9: 'Virgo',
  10: 'Libra',
  11: 'Scorpio',
  12: 'Sagittarius',
}

export function getSunSign(month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const [, cutoff, sign] = RANGES[month - 1]
  return day >= cutoff ? sign : PRIOR_SIGN[month]
}
