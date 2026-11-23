import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { CELEBRITY_RANK } from '@/lib/celebrity-rank'
import { SIGN_LIST } from '@/lib/constants'

// People whose signs match the reader's. The Big Three come first (how many are
// shared), then Venus, Mars and Mercury when the reader's chart has them. A rising
// sign counts only for people with a birth time. Nothing is stored.
interface Row {
  name: string; slug: string; sun_sign: string | null; moon_sign: string | null; rising_sign: string | null; birth_time: string | null
  chart_data: { planets?: { planet: string; sign: string }[] } | null
}
const rank = new Map(CELEBRITY_RANK.map((s, i) => [s, i]))
const rankOf = (slug: string) => rank.get(slug) ?? 99999
const isSign = (v: unknown): v is string => typeof v === 'string' && SIGN_LIST.includes(v)

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const b = (req.body ?? {}) as Record<string, unknown>
  if (!isSign(b.sun) || !isSign(b.moon)) return res.status(400).json({ error: 'Pick a Sun sign and a Moon sign.' })
  const rising = isSign(b.rising) ? b.rising : null

  const rows = await query<Row>(
    `SELECT name, slug, sun_sign, moon_sign, rising_sign, birth_time, chart_data
     FROM celebrities
     WHERE (sun_sign = $1 OR moon_sign = $2 OR (rising_sign = $3 AND birth_time IS NOT NULL)) AND ${QUALITY_BIO_SQL}`,
    [b.sun, b.moon, rising],
  )
  const scored = rows.map(r => {
    const big: string[] = [], more: string[] = []
    if (r.sun_sign === b.sun) big.push('Sun')
    if (r.moon_sign === b.moon) big.push('Moon')
    if (rising && r.birth_time && r.rising_sign === rising) big.push('rising')
    const signOf = (id: string) => r.chart_data?.planets?.find(x => x.planet === id)?.sign
    for (const [key, id, label] of [['venus', 'VENUS', 'Venus'], ['mars', 'MARS', 'Mars'], ['mercury', 'MERCURY', 'Mercury']] as const) {
      if (isSign(b[key]) && signOf(id) === b[key]) more.push(label)
    }
    return { name: r.name, slug: r.slug, sun: r.sun_sign ?? '', moon: r.moon_sign ?? '', rising: r.birth_time ? r.rising_sign : null, big: big.length, shares: [...big, ...more] }
  })
  scored.sort((x, y) => y.big - x.big || y.shares.length - x.shares.length || rankOf(x.slug) - rankOf(y.slug))

  // Everyone who shares all three, then two, then one, a page's worth of each.
  const results = [3, 2, 1].flatMap(n => scored.filter(x => x.big === n).slice(0, 12))
  res.status(200).json({ results })
})
