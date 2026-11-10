// sweph-wasm bundles its own ephemeris data — no .se1 files needed locally.
// Initialize once and reuse the instance (singleton).

import { SWEPH_WASM_DATA_URL } from './wasm-data'
import { SEAS_18_DATA, SEAS_12_DATA } from './ephe-data'
import { SEAS_00_DATA } from './ephe-data-00'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let swe: any = null

async function getSwe() {
  if (!swe) {
    const SwissEPH = (await import('sweph-wasm')).default
    // WASM binary is inlined at build time as a data: URL — no filesystem access needed.
    swe = await SwissEPH.init(SWEPH_WASM_DATA_URL)
    // Write seas_18.se1 into the WASM virtual FS root — SE searches '.' first.
    // Avoids any fetch/filesystem access; data is inlined at build time.
    swe.wasm.FS.writeFile('seas_18.se1', SEAS_18_DATA)
    swe.wasm.FS.writeFile('seas_12.se1', SEAS_12_DATA)
    swe.wasm.FS.writeFile('seas_00.se1', SEAS_00_DATA)
  }
  return swe
}

export const PLANET_IDS: Record<string, number> = {
  SUN:        0,
  MOON:       1,
  MERCURY:    2,
  VENUS:      3,
  MARS:       4,
  JUPITER:    5,
  SATURN:     6,
  URANUS:     7,
  NEPTUNE:    8,
  PLUTO:      9,
  NORTH_NODE: 11, // SE_TRUE_NODE
  CHIRON:     15, // requires seas_18.se1, served from /public/ephe/
  LILITH:     13, // SE_MEAN_APOG — Black Moon Lilith (mean)
}

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const

export type Sign = typeof SIGNS[number]
export type PlanetName = keyof typeof PLANET_IDS

export interface PlanetPosition {
  planet: PlanetName
  longitude: number   // 0–360 ecliptic longitude
  sign: Sign
  signDegree: number  // degrees within the sign (0–30)
  house: number       // 1–12
  retrograde: boolean
}

export interface BirthChartData {
  planets: PlanetPosition[]
  houseCusps: number[]   // index 1–12 are the 12 house cusps
  ascendant: number
  midheaven: number
  ascendantSign: Sign
  midheavenSign: Sign
  vertex?: number
  vertexSign?: Sign
  partOfFortune?: number
  partOfFortuneSign?: Sign
}

function longitudeToSign(longitude: number): { sign: Sign; degree: number } {
  const signIndex = Math.floor(longitude / 30) % 12
  return { sign: SIGNS[signIndex], degree: longitude % 30 }
}

function houseForLongitude(longitude: number, cusps: number[]): number {
  // cusps[1]–cusps[12] are the 12 house cusp longitudes
  for (let i = 1; i <= 12; i++) {
    const current = cusps[i]
    const next = cusps[i === 12 ? 1 : i + 1]
    if (current < next) {
      if (longitude >= current && longitude < next) return i
    } else {
      // Boundary crosses 0° Aries
      if (longitude >= current || longitude < next) return i
    }
  }
  return 1
}

export async function calculateBirthChart(
  julianDay: number,
  latitude: number,
  longitude: number
): Promise<BirthChartData> {
  const s = await getSwe()

  // Placidus ('P') fails above ~66° latitude — fall back to Whole Sign ('W')
  let housesResult: { cusps: number[]; ascmc: number[] }
  try {
    housesResult = s.swe_houses(julianDay, latitude, longitude, 'P')
  } catch {
    housesResult = s.swe_houses(julianDay, latitude, longitude, 'W')
  }
  const cusps: number[] = housesResult.cusps   // 1-indexed
  const ascendant: number = housesResult.ascmc[0]
  const midheaven: number = housesResult.ascmc[1]
  const vertex: number = housesResult.ascmc[3]

  // SEFLG_MOSEPH (4) = built-in Moshier ephemeris, no .se1 files needed
  // SEFLG_SPEED  (256) = include speed/retrograde data
  const flags = 4 | 256

  const planetResults = await Promise.all(
    Object.entries(PLANET_IDS).map(async ([name, id]) => {
      try {
        // Returns [longitude, latitude, distance, lonSpeed, latSpeed, distSpeed]
        const result: number[] = s.swe_calc_ut(julianDay, id, flags)
        const lon = result[0]
        if (!isFinite(lon)) return null
        const retrograde = result[3] < 0
        const { sign, degree } = longitudeToSign(lon)
        if (!sign) return null
        const house = houseForLongitude(lon, cusps)
        return {
          planet: name as PlanetName,
          longitude: lon,
          sign,
          signDegree: degree,
          house,
          retrograde,
        }
      } catch {
        return null
      }
    })
  )
  const planets: PlanetPosition[] = planetResults.filter((p): p is PlanetPosition => p !== null)

  const sunLon = planets.find(p => p.planet === 'SUN')?.longitude ?? 0
  const moonLon = planets.find(p => p.planet === 'MOON')?.longitude ?? 0
  const partOfFortune = (ascendant + moonLon - sunLon + 360) % 360

  return {
    planets,
    houseCusps: cusps,
    ascendant,
    midheaven,
    ascendantSign: longitudeToSign(ascendant).sign,
    midheavenSign: longitudeToSign(midheaven).sign,
    vertex,
    vertexSign: longitudeToSign(vertex).sign,
    partOfFortune,
    partOfFortuneSign: longitudeToSign(partOfFortune).sign,
  }
}

export function toJulianDay(
  year: number,
  month: number,
  day: number,
  utcHour: number // decimal, e.g. 14.5 = 14:30
): Promise<number> {
  return getSwe().then((s: { swe_julday: (y: number, m: number, d: number, h: number, g: number) => number }) =>
    s.swe_julday(year, month, day, utcHour, 1) // 1 = SE_GREG_CAL
  )
}
