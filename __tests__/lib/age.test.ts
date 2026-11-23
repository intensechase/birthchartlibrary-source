import { isUnderAge } from '@/lib/age'
import { checkChartFields } from '@/lib/save-chart'

const today = new Date(2026, 10, 23) // Nov 23, 2026

describe('isUnderAge', () => {
  it('counts a 13th birthday today as 13', () => expect(isUnderAge('2013-11-23', today)).toBe(false))
  it('is under age the day before the 13th birthday', () => expect(isUnderAge('2013-11-24', today)).toBe(true))
  it('handles a birthday later this year', () => expect(isUnderAge('2013-12-01', today)).toBe(true))
  it('lets adults through', () => expect(isUnderAge('1990-07-04', today)).toBe(false))
  it('treats a future date as under age', () => expect(isUnderAge('2030-01-01', today)).toBe(true))
  it('leaves unreadable dates to the date check', () => expect(isUnderAge('soon', today)).toBe(false))
})

describe('checkChartFields', () => {
  const child = { birthDate: `${new Date().getFullYear() - 5}-01-01`, birthCity: 'Boise', birthLat: 43.6, birthLng: -116.2 }
  it('stops a For me chart under 13', () => expect(checkChartFields({ ...child, isForSelf: true })).toMatch(/13 and older/))
  it('stops it when the field is missing (For me is the default)', () => expect(checkChartFields(child)).toMatch(/13 and older/))
  it('lets a parent make one for someone else', () => expect(checkChartFields({ ...child, isForSelf: false, subjectName: 'Sam' })).toBeNull())
})
