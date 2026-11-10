import { calculateBirthChart, toJulianDay, SIGNS, type BirthChartData, type PlanetPosition } from './calculate'

export interface Transit {
  transitPlanet: string
  transitSign: string
  transitHouse: number
  natalPlanet: string
  natalSign: string
  natalHouse: number
  aspect: string
  orb: number
  speed: 'fast' | 'medium' | 'slow'
}

export interface DailyTransits {
  date: string
  todayPositions: PlanetPosition[]
  todayAscendantSign: string
  moonSign: string
  transits: {
    today: Transit[]
    week: Transit[]
    season: Transit[]
  }
}

const ASPECT_DEFINITIONS: { name: string; angle: number; orb: number }[] = [
  { name: 'conjunct', angle: 0, orb: 8 },
  { name: 'opposite', angle: 180, orb: 8 },
  { name: 'square', angle: 90, orb: 7 },
  { name: 'trine', angle: 120, orb: 7 },
  { name: 'sextile', angle: 60, orb: 5 },
]

// Fast = Moon (changes daily). Medium = Mercury, Venus, Mars, Sun. Slow = Jupiter outward.
const PLANET_SPEED: Record<string, 'fast' | 'medium' | 'slow'> = {
  SUN: 'medium',
  MOON: 'fast',
  MERCURY: 'medium',
  VENUS: 'medium',
  MARS: 'medium',
  JUPITER: 'slow',
  SATURN: 'slow',
  URANUS: 'slow',
  NEPTUNE: 'slow',
  PLUTO: 'slow',
  NORTH_NODE: 'slow',
  CHIRON: 'slow',
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

function findAspect(transitLon: number, natalLon: number): { name: string; orb: number } | null {
  for (const asp of ASPECT_DEFINITIONS) {
    const diff = angleDiff(transitLon, natalLon)
    const orb = Math.abs(diff - asp.angle)
    if (orb <= asp.orb) {
      return { name: asp.name, orb: Math.round(orb * 10) / 10 }
    }
  }
  return null
}

function houseForTransit(transitLon: number, natalCusps: number[]): number {
  for (let i = 1; i <= 12; i++) {
    const current = natalCusps[i]
    const next = natalCusps[i === 12 ? 1 : i + 1]
    if (current < next) {
      if (transitLon >= current && transitLon < next) return i
    } else {
      if (transitLon >= current || transitLon < next) return i
    }
  }
  return 1
}

export async function calculateDailyTransits(
  natalChart: BirthChartData,
  dateOffset: number = 0 // -1 = yesterday, 0 = today, 1 = tomorrow
): Promise<DailyTransits> {
  const target = new Date()
  target.setUTCDate(target.getUTCDate() + dateOffset)
  const year = target.getUTCFullYear()
  const month = target.getUTCMonth() + 1
  const day = target.getUTCDate()

  // Use midnight UTC as the fixed reference point for each day
  const jd = await toJulianDay(year, month, day, 0)
  // Use 0,0 for lat/lng since we just need planetary longitudes, not houses
  const todayChart = await calculateBirthChart(jd, 0, 0)

  const allTransits: Transit[] = []

  for (const transit of todayChart.planets) {
    const speed = PLANET_SPEED[transit.planet] || 'slow'

    for (const natal of natalChart.planets) {
      // Skip Moon-to-Moon (too brief to matter)
      if (transit.planet === 'MOON' && natal.planet === 'MOON') continue

      const aspect = findAspect(transit.longitude, natal.longitude)
      if (!aspect) continue

      const transitHouse = houseForTransit(transit.longitude, natalChart.houseCusps)

      allTransits.push({
        transitPlanet: transit.planet,
        transitSign: transit.sign,
        transitHouse,
        natalPlanet: natal.planet,
        natalSign: natal.sign,
        natalHouse: natal.house,
        aspect: aspect.name,
        orb: aspect.orb,
        speed,
      })
    }
  }

  // Sort by orb (tightest aspects first)
  allTransits.sort((a, b) => a.orb - b.orb)

  // Split into timeframe categories
  const today = allTransits
    .filter(t => t.speed === 'fast')
    .slice(0, 3)

  const week = allTransits
    .filter(t => t.speed === 'medium')
    .slice(0, 3)

  const season = allTransits
    .filter(t => t.speed === 'slow')
    .slice(0, 2)

  const moonPos = todayChart.planets.find(p => p.planet === 'MOON')

  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    todayPositions: todayChart.planets,
    todayAscendantSign: todayChart.ascendantSign,
    moonSign: moonPos?.sign || 'Unknown',
    transits: { today, week, season },
  }
}
