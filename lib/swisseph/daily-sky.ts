import { calculateBirthChart, toJulianDay, type PlanetPosition } from './calculate'

export interface DailySky {
  date: string
  moonSign: string
  sunSign: string
  planets: PlanetPosition[]
  retrogrades: { planet: string; sign: string }[]
}

const PLANET_LABELS: Record<string, string> = {
  SUN: 'Sun', MOON: 'Moon', MERCURY: 'Mercury', VENUS: 'Venus', MARS: 'Mars',
  JUPITER: 'Jupiter', SATURN: 'Saturn', URANUS: 'Uranus', NEPTUNE: 'Neptune',
  PLUTO: 'Pluto', NORTH_NODE: 'North Node', CHIRON: 'Chiron',
}

// In-memory cache: one result per date string, prevents repeated WASM calculations
const cache = new Map<string, DailySky>()
let computing = new Map<string, Promise<DailySky>>()

export async function getDailySky(dateOverride?: string): Promise<DailySky> {
  const now = new Date()
  const year = dateOverride ? parseInt(dateOverride.split('-')[0]) : now.getUTCFullYear()
  const month = dateOverride ? parseInt(dateOverride.split('-')[1]) : now.getUTCMonth() + 1
  const day = dateOverride ? parseInt(dateOverride.split('-')[2]) : now.getUTCDate()
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  // Return cached result if available
  const cached = cache.get(dateKey)
  if (cached) return cached

  // Deduplicate concurrent requests for the same date
  const inflight = computing.get(dateKey)
  if (inflight) return inflight

  const promise = (async () => {
    const jd = await toJulianDay(year, month, day, 0)
    const chart = await calculateBirthChart(jd, 0, 0)

    const moonSign = chart.planets.find(p => p.planet === 'MOON')?.sign || 'Unknown'
    const sunSign = chart.planets.find(p => p.planet === 'SUN')?.sign || 'Unknown'

    const retrogrades = chart.planets
      .filter(p => p.retrograde && p.planet !== 'NORTH_NODE')
      .map(p => ({ planet: PLANET_LABELS[p.planet] || p.planet, sign: p.sign }))

    const result: DailySky = {
      date: dateKey,
      moonSign,
      sunSign,
      planets: chart.planets,
      retrogrades,
    }

    cache.set(dateKey, result)

    // Keep cache from growing unbounded — max 90 days
    if (cache.size > 90) {
      const oldest = cache.keys().next().value
      if (oldest) cache.delete(oldest)
    }

    return result
  })()

  computing.set(dateKey, promise)
  try {
    return await promise
  } finally {
    computing.delete(dateKey)
  }
}
