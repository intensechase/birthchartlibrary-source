import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'

const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

interface CelebRow {
  name: string
  slug: string
  image_url: string | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
  chart_data: {
    planets?: { planet: string; sign: string }[]
  } | null
}

function extractSign(chartData: CelebRow['chart_data'], planet: string): string | null {
  if (!chartData?.planets) return null
  const p = chartData.planets.find(pp => pp.planet === planet)
  return p?.sign ?? null
}

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { sun, moon, rising, venus, mars, mercury } = req.body as {
    sun?: string; moon?: string; rising?: string
    venus?: string; mars?: string; mercury?: string
  }

  if (!sun || !moon || !rising) {
    return res.status(400).json({ error: 'Sun, Moon, and Rising signs are required' })
  }

  if (![sun, moon, rising].every(s => SIGN_NAMES.includes(s))) {
    return res.status(400).json({ error: 'Invalid sign name' })
  }

  // Fetch celebrities that match at least one of the Big Three
  const rows = await query<CelebRow>(
    `SELECT name, slug, image_url, sun_sign, moon_sign, rising_sign, chart_data
     FROM celebrities
     WHERE (sun_sign = $1 OR moon_sign = $2 OR rising_sign = $3)
       AND image_url IS NOT NULL
       AND ${QUALITY_BIO_SQL}
     ORDER BY name`,
    [sun, moon, rising]
  )

  // Score each celebrity
  const scored = rows.map(row => {
    const matches: string[] = []
    let score = 0

    if (row.sun_sign === sun) { score += 3; matches.push('Sun') }
    if (row.moon_sign === moon) { score += 3; matches.push('Moon') }
    if (row.rising_sign === rising) { score += 3; matches.push('Rising') }

    // Check personal planets from chart_data if user provided them
    if (venus) {
      const celebVenus = extractSign(row.chart_data, 'VENUS')
      if (celebVenus === venus) { score += 2; matches.push('Venus') }
    }
    if (mars) {
      const celebMars = extractSign(row.chart_data, 'MARS')
      if (celebMars === mars) { score += 2; matches.push('Mars') }
    }
    if (mercury) {
      const celebMercury = extractSign(row.chart_data, 'MERCURY')
      if (celebMercury === mercury) { score += 1; matches.push('Mercury') }
    }

    const maxScore = 9 + (venus ? 2 : 0) + (mars ? 2 : 0) + (mercury ? 1 : 0)

    return {
      name: row.name,
      slug: row.slug,
      image_url: row.image_url,
      sun_sign: row.sun_sign,
      moon_sign: row.moon_sign,
      rising_sign: row.rising_sign,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      matches,
    }
  })

  // Sort by score descending, then by number of matches, then alphabetically
  scored.sort((a, b) => b.score - a.score || b.matches.length - a.matches.length || a.name.localeCompare(b.name))

  res.status(200).json({ results: scored.slice(0, 20) })
})
