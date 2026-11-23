// Sign compatibility rating, as a tier list: S is the best, then A, B, C, D.
// One scale for every place a sign pairing is rated (compatibility hubs and
// pair pages, famous couples, /api/compatibility) so they always agree.
// Cutoffs are the old word labels, renamed one to one:
//   S = Excellent (80+), A = High (70+), B = Good (55+), C = Moderate (45+), D = Challenging.

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D'

export function compatTier(score: number): Tier {
  if (score >= 80) return 'S'
  if (score >= 70) return 'A'
  if (score >= 55) return 'B'
  if (score >= 45) return 'C'
  return 'D'
}

// What a reader sees on a badge or tile: "S tier".
export const tierLabel = (score: number) => `${compatTier(score)} tier`

// Legacy (Tailwind) text color per tier.
export const TIER_TEXT: Record<Tier, string> = {
  S: 'text-emerald-600',
  A: 'text-emerald-500',
  B: 'text-sky-600',
  C: 'text-amber-600',
  D: 'text-red-500',
}
