import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/apiHandler'
import { CNY_DATES } from '@/lib/chinese-zodiac'
import { peopleWhere } from '@/lib/redesign/people'

// People born in one Chinese year (new year to the day before the next), for
// the Chinese zodiac year finder. Same people and order as the year page.
// Read only; the year is the only input and must be a year with both dates.
export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const y = Number(req.query.year)
  const s = CNY_DATES[y], e = CNY_DATES[y + 1]
  if (!Number.isInteger(y) || !s || !e) return res.status(400).json({ error: 'That year is out of range.' })
  const people = await peopleWhere('birth_date >= make_date($1, $2, $3) AND birth_date < make_date($4, $5, $6)', [y, s[0], s[1], y + 1, e[0], e[1]], 6)
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  return res.status(200).json({ year: y, people })
})
