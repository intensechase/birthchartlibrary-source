import { getBirthTimeSource } from '@/lib/birth-time-source'

const ADB = 'https://www.astro.com/astro-databank/Einstein,_Albert'

describe('getBirthTimeSource', () => {
  it('shows nothing when there is no birth time, even with a rating', () => {
    expect(getBirthTimeSource(null, { rodden_rating: 'AA', adb_url: ADB })).toBeNull()
  })

  it('returns the rating, meaning and link for a rated time', () => {
    expect(getBirthTimeSource('11:30:00', { rodden_rating: 'AA', adb_url: ADB })).toEqual({
      rating: 'AA',
      meaning: 'recorded by the family or state, such as a birth certificate',
      url: ADB,
    })
  })

  it('reads metadata stored as a JSON string', () => {
    expect(getBirthTimeSource('11:30:00', JSON.stringify({ rodden_rating: 'B', adb_url: ADB }))?.rating).toBe('B')
  })

  it('marks a time with no rating as unverified', () => {
    const unverified = { rating: null, meaning: null, url: null }
    expect(getBirthTimeSource('05:17:00', null)).toEqual(unverified)
    expect(getBirthTimeSource('05:17:00', {})).toEqual(unverified)
    expect(getBirthTimeSource('05:17:00', 'not json')).toEqual(unverified)
  })

  it('does not present unknown or timeless ratings as a source', () => {
    expect(getBirthTimeSource('05:17:00', { rodden_rating: 'X', adb_url: ADB })?.rating).toBeNull()
    expect(getBirthTimeSource('05:17:00', { rodden_rating: 'great', adb_url: ADB })?.url).toBeNull()
  })

  it('drops a link that does not point at Astro-Databank', () => {
    expect(getBirthTimeSource('05:17:00', { rodden_rating: 'A', adb_url: 'https://evil.example/x' })).toEqual({
      rating: 'A',
      meaning: 'quoted by the person, family or an associate, from memory',
      url: null,
    })
  })
})
