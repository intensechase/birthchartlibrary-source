import { buildChart } from '@/lib/swisseph/buildChart'
import type { BirthChartData } from '@/lib/swisseph/calculate'

const mockChartData: BirthChartData = {
  planets: [],
  houseCusps: new Array(13).fill(0),
  ascendant: 0,
  midheaven: 0,
  ascendantSign: 'Aries',
  midheavenSign: 'Aries',
}

jest.mock('@/lib/swisseph/calculate', () => ({
  toJulianDay: jest.fn().mockResolvedValue(2451545.0),
  calculateBirthChart: jest.fn().mockResolvedValue({
    planets: [],
    houseCusps: new Array(13).fill(0),
    ascendant: 0,
    midheaven: 0,
    ascendantSign: 'Aries',
    midheavenSign: 'Aries',
  }),
}))

import { toJulianDay, calculateBirthChart } from '@/lib/swisseph/calculate'

describe('buildChart', () => {
  beforeEach(() => jest.clearAllMocks())

  it('resolves timezone from coordinates', async () => {
    // New York City
    const result = await buildChart('1990-06-15', '14:30', 40.7128, -74.0060)
    expect(result.timezone).toBe('America/New_York')
  })

  it('resolves timezone for London', async () => {
    const result = await buildChart('1990-06-15', '14:30', 51.5074, -0.1278)
    expect(result.timezone).toBe('Europe/London')
  })

  it('converts local time to UTC before passing to calculateBirthChart', async () => {
    // Tokyo (UTC+9) — 14:30 local = 05:30 UTC
    await buildChart('1990-06-15', '14:30', 35.6762, 139.6503)

    expect(toJulianDay).toHaveBeenCalledWith(
      1990, 6, 15,
      expect.closeTo(5.5, 1) // 5 hours 30 min UTC
    )
  })

  it('defaults to noon when birth time is not provided', async () => {
    // Reykjavik is UTC+0 year-round (no DST) — noon local = noon UTC
    await buildChart('1990-06-15', null, 64.1355, -21.8954)

    expect(toJulianDay).toHaveBeenCalledWith(
      1990, 6, 15,
      expect.closeTo(12, 0)
    )
  })

  it('returns chartData from calculateBirthChart', async () => {
    const result = await buildChart('1990-06-15', '12:00', 40.7128, -74.0060)
    expect(result.chartData).toEqual(mockChartData)
  })
})
