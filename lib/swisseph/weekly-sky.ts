// Calculates planetary positions for the start and end of a week
// to identify sign changes, retrogrades, and major aspects.

import { calculateBirthChart, toJulianDay, type PlanetPosition } from './calculate'

export interface WeeklyEvent {
  type: 'sign_change' | 'retrograde_start' | 'retrograde_end' | 'notable'
  planet: string
  description: string
}

export interface WeeklySky {
  weekStart: string
  weekEnd: string
  startPositions: PlanetPosition[]
  endPositions: PlanetPosition[]
  events: WeeklyEvent[]
  moonSigns: string[]
}

const PLANET_LABELS: Record<string, string> = {
  SUN: 'Sun', MOON: 'Moon', MERCURY: 'Mercury', VENUS: 'Venus', MARS: 'Mars',
  JUPITER: 'Jupiter', SATURN: 'Saturn', URANUS: 'Uranus', NEPTUNE: 'Neptune',
  PLUTO: 'Pluto', NORTH_NODE: 'North Node', CHIRON: 'Chiron',
}

// In-memory cache: one result per week key, prevents repeated WASM calculations
const cache = new Map<string, WeeklySky>()
let computing = new Map<string, Promise<WeeklySky>>()

export async function getWeeklySky(mondayDate: Date): Promise<WeeklySky> {
  const startYear = mondayDate.getUTCFullYear()
  const startMonth = mondayDate.getUTCMonth() + 1
  const startDay = mondayDate.getUTCDate()
  const weekKey = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`

  // Return cached result if available
  const cached = cache.get(weekKey)
  if (cached) return cached

  // Deduplicate concurrent requests for the same week
  const inflight = computing.get(weekKey)
  if (inflight) return inflight

  const promise = (async () => {
    const sunday = new Date(mondayDate)
    sunday.setUTCDate(sunday.getUTCDate() + 6)
    const endYear = sunday.getUTCFullYear()
    const endMonth = sunday.getUTCMonth() + 1
    const endDay = sunday.getUTCDate()

    // Calculate positions for Monday and Sunday
    const jdStart = await toJulianDay(startYear, startMonth, startDay, 0)
    const jdEnd = await toJulianDay(endYear, endMonth, endDay, 0)

    const startChart = await calculateBirthChart(jdStart, 0, 0)
    const endChart = await calculateBirthChart(jdEnd, 0, 0)

    const events: WeeklyEvent[] = []

    // Detect sign changes (planet moves to a new sign during the week)
    for (const startP of startChart.planets) {
      if (startP.planet === 'MOON' || startP.planet === 'NORTH_NODE') continue
      const endP = endChart.planets.find(p => p.planet === startP.planet)
      if (!endP) continue

      if (startP.sign !== endP.sign) {
        events.push({
          type: 'sign_change',
          planet: startP.planet,
          description: `${PLANET_LABELS[startP.planet]} moves from ${startP.sign} into ${endP.sign} this week... shifting the energy from ${startP.sign}'s themes to ${endP.sign}'s. Pay attention to the areas of life governed by ${PLANET_LABELS[startP.planet]}... a new chapter begins.`,
        })
      }
    }

    // Detect retrograde changes
    for (const startP of startChart.planets) {
      if (startP.planet === 'NORTH_NODE') continue
      const endP = endChart.planets.find(p => p.planet === startP.planet)
      if (!endP) continue

      if (!startP.retrograde && endP.retrograde) {
        events.push({
          type: 'retrograde_start',
          planet: startP.planet,
          description: `${PLANET_LABELS[startP.planet]} stations retrograde this week in ${endP.sign}. The themes governed by ${PLANET_LABELS[startP.planet]} slow down and turn inward... this is a time for review and reflection rather than pushing forward.`,
        })
      } else if (startP.retrograde && !endP.retrograde) {
        events.push({
          type: 'retrograde_end',
          planet: startP.planet,
          description: `${PLANET_LABELS[startP.planet]} stations direct this week in ${startP.sign}. After weeks of turning inward, ${PLANET_LABELS[startP.planet]}'s energy begins to move forward again... what you've been revisiting is ready to be acted on.`,
        })
      }
    }

    // Track Moon signs through the week (calculate every 2 days)
    const moonSigns: string[] = []
    for (let i = 0; i <= 6; i += 2) {
      const d = new Date(mondayDate)
      d.setUTCDate(d.getUTCDate() + i)
      const jd = await toJulianDay(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), 12)
      const chart = await calculateBirthChart(jd, 0, 0)
      const moonSign = chart.planets.find(p => p.planet === 'MOON')?.sign
      if (moonSign && !moonSigns.includes(moonSign)) moonSigns.push(moonSign)
    }

    const weekStart = weekKey
    const weekEnd = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`

    const result: WeeklySky = {
      weekStart,
      weekEnd,
      startPositions: startChart.planets,
      endPositions: endChart.planets,
      events,
      moonSigns,
    }

    cache.set(weekKey, result)

    // Keep cache small — max 12 weeks
    if (cache.size > 12) {
      const oldest = cache.keys().next().value
      if (oldest) cache.delete(oldest)
    }

    return result
  })()

  computing.set(weekKey, promise)
  try {
    return await promise
  } finally {
    computing.delete(weekKey)
  }
}

// Get the Monday of the week containing a given date
export function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d
}
