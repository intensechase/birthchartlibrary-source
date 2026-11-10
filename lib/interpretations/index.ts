// Interpretation library index
// All lookups flow through this file.
// Individual planet files are generated — do not edit manually.

import { PLANETS } from './planets'
import { SIGNS } from './signs'
import { HOUSES } from './houses'
import { PLANET_IN_SIGN } from './planet_in_sign'
import { PLANET_IN_HOUSE } from './planet_in_house'
import { SUN } from './sun'
import { MOON } from './moon'
import { MERCURY } from './mercury'
import { VENUS } from './venus'
import { MARS } from './mars'
import { JUPITER } from './jupiter'
import { SATURN } from './saturn'
import { URANUS } from './uranus'
import { NEPTUNE } from './neptune'
import { PLUTO } from './pluto'
import { NORTH_NODE } from './north_node'
import { CHIRON } from './chiron'

const COMBINED: Record<string, Record<string, string>> = {
  SUN,
  MOON,
  MERCURY,
  VENUS,
  MARS,
  JUPITER,
  SATURN,
  URANUS,
  NEPTUNE,
  PLUTO,
  NORTH_NODE,
  CHIRON,
}

// ─── Tier 1: Tooltips ────────────────────────────────────────────────────────

export function getPlanetInfo(planet: string) {
  return PLANETS[planet] ?? null
}

export function getSignInfo(sign: string) {
  return SIGNS[sign] ?? null
}

export function getHouseInfo(house: number) {
  return HOUSES[house] ?? null
}

// ─── Tier 2: Separate readings ───────────────────────────────────────────────

export function getPlanetInSign(planet: string, sign: string): string {
  return PLANET_IN_SIGN[`${planet}_${sign}`] ?? ''
}

export function getPlanetInHouse(planet: string, house: number): string {
  return PLANET_IN_HOUSE[`${planet}_H${house}`] ?? ''
}

// ─── Tier 3: Combined reading ────────────────────────────────────────────────

export function getCombinedInterpretation(planet: string, sign: string, house: number): string {
  return COMBINED[planet]?.[`${sign}_H${house}`] ?? ''
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { PLANETS, SIGNS, HOUSES }
