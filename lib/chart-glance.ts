import type { BirthChartData } from '@/lib/swisseph/calculate'
import { getPlanetInfo } from '@/lib/interpretations'

// "At a glance" facts, worked out from chart_data on each build rather than
// read from the stored chart_summary, which predates the October recomputes.
// Counts use the ten planets (Sun to Pluto); nodes and Chiron are left out.
export interface Glance {
  midheaven: string | null
  dominantElement: string
  dominantModality: string
  signStelliums: { sign: string; planets: string[] }[]
  houseStelliums: { house: number; planets: string[] }[]
  retrogrades: string[]
}

const TEN_PLANETS = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO']
const ELEMENT_OF: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire', Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air', Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
}
const MODALITY_OF: Record<string, string> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
}

// Ties are shown together ("Fire and Water") rather than picking one.
function topOf(counts: Record<string, number>) {
  const max = Math.max(...Object.values(counts))
  return Object.keys(counts).filter(k => counts[k] === max).join(' and ')
}

function groupBy<K extends string | number>(items: { key: K; name: string }[]) {
  const map = new Map<K, string[]>()
  for (const { key, name } of items) map.set(key, [...(map.get(key) ?? []), name])
  return [...map].filter(([, names]) => names.length >= 3)
}

export function buildGlance(chart: BirthChartData, hasBirthTime: boolean): Glance {
  const ten = TEN_PLANETS.flatMap(id => chart.planets.find(p => p.planet === id) ?? [])
  const label = (id: string) => getPlanetInfo(id)?.name ?? id
  const elements: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  const modalities: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  for (const p of ten) {
    if (ELEMENT_OF[p.sign]) elements[ELEMENT_OF[p.sign]]++
    if (MODALITY_OF[p.sign]) modalities[MODALITY_OF[p.sign]]++
  }
  if (hasBirthTime && ELEMENT_OF[chart.ascendantSign]) elements[ELEMENT_OF[chart.ascendantSign]]++
  return {
    midheaven: hasBirthTime ? chart.midheavenSign : null,
    dominantElement: topOf(elements),
    dominantModality: topOf(modalities),
    signStelliums: groupBy(ten.map(p => ({ key: p.sign, name: label(p.planet) }))).map(([sign, planets]) => ({ sign, planets })),
    houseStelliums: hasBirthTime
      ? groupBy(ten.map(p => ({ key: p.house, name: label(p.planet) }))).map(([house, planets]) => ({ house, planets })).sort((a, b) => a.house - b.house)
      : [],
    retrogrades: ten.filter(p => p.retrograde).map(p => label(p.planet)),
  }
}
