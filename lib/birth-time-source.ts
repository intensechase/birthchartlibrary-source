// Where a celebrity's birth time came from, for display on their page. Ratings are
// Rodden ratings stored from Astro-Databank in metadata.rodden_rating. Wording follows
// Astro-Databank's own definitions: https://www.astro.com/astro-databank/Help:RR
// X and XX are left out because they describe data with no usable time or date.
export const VERIFIED_RATINGS = ['AA', 'A', 'B'] as const
export type VerifiedRating = typeof VERIFIED_RATINGS[number]

export const RATING_MEANINGS: Record<string, string> = {
  AA: 'recorded by the family or state, such as a birth certificate',
  A: 'quoted by the person, family or an associate, from memory',
  B: 'from a biography',
  C: 'no known source, so treat with caution',
  DD: 'conflicting reports, so treat with caution',
}

const ADB_PREFIX = 'https://www.astro.com/astro-databank/'

export interface BirthTimeSource {
  // Null rating means a time is on record but its source hasn't been verified.
  rating: string | null
  meaning: string | null
  url: string | null
}

function parseMetadata(metadata: unknown): Record<string, unknown> {
  let value = metadata
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return {}
    }
  }
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

// Null when there is no birth time: the page already says so, and a rating has
// nothing to describe.
export function getBirthTimeSource(birthTime: string | null | undefined, metadata: unknown): BirthTimeSource | null {
  if (!birthTime) return null
  const meta = parseMetadata(metadata)
  const rating = typeof meta.rodden_rating === 'string' ? meta.rodden_rating.trim().toUpperCase() : ''
  const url = typeof meta.adb_url === 'string' && meta.adb_url.startsWith(ADB_PREFIX) ? meta.adb_url : null
  const meaning = RATING_MEANINGS[rating]
  if (!meaning) return { rating: null, meaning: null, url: null }
  return { rating, meaning, url }
}
