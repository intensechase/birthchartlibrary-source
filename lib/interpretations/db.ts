/**
 * Database-backed interpretation lookups.
 * Falls back to static files if DB returns nothing.
 * Use these async functions in getStaticProps/getServerSideProps.
 */

import { queryOne, query } from '@/lib/db'
import { PLANETS } from './planets'

// 30-minute TTL cache — interpretations change only when admin edits them
const TTL = 30 * 60 * 1000
const cache = new Map<string, { value: unknown; expiresAt: number }>()

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && hit.expiresAt > Date.now()) return hit.value as T
  const value = await fn()
  cache.set(key, { value, expiresAt: Date.now() + TTL })
  return value
}
import { SIGNS } from './signs'
import { HOUSES } from './houses'
import { PLANET_IN_SIGN } from './planet_in_sign'
import { PLANET_IN_HOUSE } from './planet_in_house'
import { getCombinedInterpretation as getStaticCombined } from './index'

interface DbRow {
  description: string
  title?: string | null
  keywords?: string[] | null
}

// ─── Planet info ────────────────────────────────────────────────────────────

export async function dbGetPlanetInfo(planet: string) {
  return cached(`planet:${planet}`, async () => {
    const row = await queryOne<DbRow>(
      "SELECT title, description FROM interpretations WHERE type = 'planet_info' AND planet = $1 LIMIT 1",
      [planet]
    )
    if (row) return { name: row.title || planet, symbol: PLANETS[planet]?.symbol || '', description: row.description }
    return PLANETS[planet] ?? null
  })
}

// ─── Sign info ──────────────────────────────────────────────────────────────

export async function dbGetSignInfo(sign: string) {
  return cached(`sign:${sign}`, async () => {
    const row = await queryOne<DbRow & { sign: string }>(
      "SELECT sign, description, keywords FROM interpretations WHERE type = 'sign_info' AND sign = $1 LIMIT 1",
      [sign]
    )
    if (row) {
      const staticInfo = SIGNS[sign]
      return { ...staticInfo, description: row.description, keywords: row.keywords || staticInfo?.keywords || [] }
    }
    return SIGNS[sign] ?? null
  })
}

// ─── House info ─────────────────────────────────────────────────────────────

export async function dbGetHouseInfo(house: number) {
  return cached(`house:${house}`, async () => {
    const row = await queryOne<DbRow>(
      "SELECT title, description, keywords FROM interpretations WHERE type = 'house_info' AND house = $1 LIMIT 1",
      [house]
    )
    if (row) return { name: row.title || `House ${house}`, description: row.description, keywords: row.keywords || [] }
    return HOUSES[house] ?? null
  })
}

// ─── Planet in sign ─────────────────────────────────────────────────────────

export async function dbGetPlanetInSign(planet: string, sign: string): Promise<string> {
  return cached(`psign:${planet}:${sign}`, async () => {
    const row = await queryOne<DbRow>(
      "SELECT description FROM interpretations WHERE type = 'planet_sign' AND planet = $1 AND sign = $2 LIMIT 1",
      [planet, sign]
    )
    return row?.description || PLANET_IN_SIGN[`${planet}_${sign}`] || ''
  })
}

// ─── Planet in house ────────────────────────────────────────────────────────

export async function dbGetPlanetInHouse(planet: string, house: number): Promise<string> {
  return cached(`phouse:${planet}:${house}`, async () => {
    const row = await queryOne<DbRow>(
      "SELECT description FROM interpretations WHERE type = 'planet_house' AND planet = $1 AND house = $2 LIMIT 1",
      [planet, house]
    )
    return row?.description || PLANET_IN_HOUSE[`${planet}_H${house}`] || ''
  })
}

// ─── Combined (planet + sign + house) ───────────────────────────────────────

export async function dbGetCombinedInterpretation(planet: string, sign: string, house: number): Promise<string> {
  return cached(`combined:${planet}:${sign}:${house}`, async () => {
    const row = await queryOne<DbRow>(
      "SELECT description FROM interpretations WHERE type = 'combined' AND planet = $1 AND sign = $2 AND house = $3 LIMIT 1",
      [planet, sign, house]
    )
    return row?.description || getStaticCombined(planet, sign, house)
  })
}

// ─── Glossary ───────────────────────────────────────────────────────────────

export interface GlossaryTermDB {
  id: number
  term: string
  definition: string
  link: string | null
}

export async function dbGetGlossary(): Promise<GlossaryTermDB[]> {
  return cached('glossary', () =>
    query<GlossaryTermDB>('SELECT id, term, definition, link FROM glossary_terms ORDER BY sort_order ASC, term ASC')
  )
}

// ─── Bulk fetch for chart pages ─────────────────────────────────────────────

export async function dbGetAllInterpretationsForChart(
  planets: { planet: string; sign: string; house: number }[]
): Promise<Record<string, string>> {
  const result: Record<string, string> = {}

  // Fetch all combined interpretations for these placements in one query
  if (planets.length > 0) {
    const conditions = planets.map((_, i) => `(planet = $${i * 3 + 1} AND sign = $${i * 3 + 2} AND house = $${i * 3 + 3})`).join(' OR ')
    const params = planets.flatMap(p => [p.planet, p.sign, p.house])
    const rows = await query<{ planet: string; sign: string; house: number; description: string }>(
      `SELECT planet, sign, house, description FROM interpretations WHERE type = 'combined' AND (${conditions})`,
      params
    )
    for (const row of rows) {
      result[`${row.planet}_${row.sign}_H${row.house}`] = row.description
    }
  }

  // Fill in any gaps from static files. The combined map is incomplete
  // for some (planet, sign, house) triples — especially Whole-Sign house
  // variants where the static authoring covered only the Placidus house.
  // Fall back to sign-only text so the CelebrityChart toggle never drops
  // a planet card when the user flips Placidus ↔ Whole Sign.
  for (const p of planets) {
    const key = `${p.planet}_${p.sign}_H${p.house}`
    if (!result[key]) {
      result[key] = getStaticCombined(p.planet, p.sign, p.house)
    }
    if (!result[key]) {
      result[key] = PLANET_IN_SIGN[`${p.planet}_${p.sign}`] || ''
    }
  }

  return result
}
