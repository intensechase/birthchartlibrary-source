import { houseForLongitude, type BirthChartData, type PlanetName } from './calculate'
import { OVERLAY_TEXT } from './overlay-text'

// House overlays: where one person's planets fall among the other person's
// houses. Needs the HOUSE OWNER's birth time (houses move about one sign every
// two hours); the planet owner's time barely matters except for the Moon, so an
// untimed Moon is left out. Only placements with written text are returned.
export interface HouseOverlay {
  planet: PlanetName
  from: 'a' | 'b'     // whose planet
  house: number       // house in the OTHER person's chart
  text: string
}

const ORDER: PlanetName[] = ['VENUS', 'MARS', 'SUN', 'MOON', 'MERCURY', 'JUPITER', 'SATURN']

function oneWay(from: 'a' | 'b', planets: BirthChartData, houses: BirthChartData, planetTimed: boolean): HouseOverlay[] {
  if (!Array.isArray(houses.houseCusps) || houses.houseCusps.length < 13) return []
  const out: HouseOverlay[] = []
  for (const name of ORDER) {
    if (name === 'MOON' && !planetTimed) continue
    const p = planets.planets.find(x => x.planet === name)
    if (!p) continue
    const house = houseForLongitude(p.longitude, houses.houseCusps)
    const text = OVERLAY_TEXT[name]?.[String(house)]
    if (text) out.push({ planet: name, from, house, text })
  }
  return out
}

export function computeHouseOverlays(
  chartA: BirthChartData, chartB: BirthChartData,
  opts: { timeKnownA: boolean; timeKnownB: boolean },
): HouseOverlay[] {
  return [
    ...(opts.timeKnownB ? oneWay('a', chartA, chartB, opts.timeKnownA) : []),
    ...(opts.timeKnownA ? oneWay('b', chartB, chartA, opts.timeKnownB) : []),
  ]
}
