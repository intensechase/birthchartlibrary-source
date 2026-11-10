import type { BirthChartData } from '@/lib/swisseph/calculate'
import {
  getCombinedInterpretation,
  getPlanetInSign,
  getPlanetInHouse,
  getPlanetInfo,
  getSignInfo,
  getHouseInfo,
} from '@/lib/interpretations'
import { linkGlossaryTerms } from '@/lib/glossary-linker'
import type { Interpretations } from '@/components/chart/PlanetCard'

const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

// Shared by the saved-chart detail page and the guest calculate endpoint —
// previously only lived inline in birth-chart/[id].tsx's getServerSideProps.
export function buildInterpBundle(chartData: BirthChartData): Interpretations {
  const combined: Record<string, string> = {}
  const planetInSign: Record<string, string> = {}
  const planetInHouse: Record<string, string> = {}

  for (const p of chartData.planets) {
    const key = `${p.planet}_${p.sign}_H${p.house}`
    combined[key] = linkGlossaryTerms(getCombinedInterpretation(p.planet, p.sign, p.house))
    planetInSign[`${p.planet}_${p.sign}`] = linkGlossaryTerms(getPlanetInSign(p.planet, p.sign))
    planetInHouse[`${p.planet}_H${p.house}`] = linkGlossaryTerms(getPlanetInHouse(p.planet, p.house))
  }

  const planetsData: Interpretations['planets'] = {}
  for (const p of chartData.planets) {
    const info = getPlanetInfo(p.planet)
    if (info) planetsData[p.planet] = info
  }

  const signsData: Interpretations['signs'] = {}
  for (const s of SIGN_NAMES) {
    const info = getSignInfo(s)
    if (info) signsData[s] = info
  }

  const housesData: Interpretations['houses'] = {}
  for (let i = 1; i <= 12; i++) {
    const info = getHouseInfo(i)
    if (info) housesData[i] = info
  }

  return {
    combined,
    planetInSign,
    planetInHouse,
    planets: planetsData,
    signs: signsData,
    houses: housesData,
  }
}
