import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { apiHandler } from '@/lib/apiHandler'
import { VERIFIED_RATINGS } from '@/lib/birth-time-source'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { CELEBRITY_RANK } from '@/lib/celebrity-rank'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  if (!await rateLimit(`celebrities:${ip}`, 60, 60 * 1000)) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  const { category, sun, moon, rising } = req.query
  // Only people with a public page are listed (tier=all was removed 2026-11-09:
  // template-bio pages now 404, docs/TEMPLATE-CELEB-REMOVAL-PLAN.md).
  const conditions: string[] = ['sun_sign IS NOT NULL', QUALITY_BIO_SQL]
  const params: unknown[] = []
  let i = 1

  if (category && category !== 'All') {
    conditions.push(`LOWER(category) = LOWER($${i++})`)
    params.push(category)
  }
  if (sun) {
    const signs = (Array.isArray(sun) ? sun : sun.split(',')).filter(Boolean)
    if (signs.length > 0) {
      conditions.push(`sun_sign = ANY($${i++}::text[])`)
      params.push(signs)
    }
  }
  if (moon) {
    const signs = (Array.isArray(moon) ? moon : moon.split(',')).filter(Boolean)
    if (signs.length > 0) {
      conditions.push(`moon_sign = ANY($${i++}::text[])`)
      params.push(signs)
    }
  }
  if (rising) {
    const signs = (Array.isArray(rising) ? rising : rising.split(',')).filter(Boolean)
    if (signs.length > 0) {
      conditions.push(`rising_sign = ANY($${i++}::text[])`)
      params.push(signs)
    }
  }

  const rating = req.query.rating as string
  if ((VERIFIED_RATINGS as readonly string[]).includes(rating)) {
    conditions.push(`birth_time IS NOT NULL AND chart_data IS NOT NULL AND metadata::jsonb->>'rodden_rating' = $${i++}`)
    params.push(rating)
  }

  // Name search — case-insensitive substring match. Capped at 64 chars to
  // bound the LIKE param length; ignored when blank or whitespace-only.
  const qRaw = (req.query.q as string) || ''
  const q = qRaw.trim().slice(0, 64)
  if (q) {
    conditions.push(`name ILIKE $${i++}`)
    params.push(`%${q}%`)
  }

  const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 12, 1), 100)
  const offset = Math.max(parseInt(req.query.offset as string) || 0, 0)

  const where = conditions.join(' AND ')
  // Best-known charts first, then other featured charts, then everyone else by name.
  // name and id keep the order stable, so "Load more" can't repeat or skip a row.
  const [rows, countRows] = await Promise.all([
    query(
      `SELECT id, name, slug, birth_date, birth_city, category, sun_sign, moon_sign, rising_sign,
              image_url IS NOT NULL AS has_image
       FROM celebrities
       LEFT JOIN unnest($${i++}::text[]) WITH ORDINALITY AS r(rank_slug, rank_pos) ON r.rank_slug = slug::text
       WHERE ${where}
       ORDER BY r.rank_pos NULLS LAST, (${QUALITY_BIO_SQL}) IS TRUE DESC, name, id
       LIMIT $${i++} OFFSET $${i++}`,
      [...params, CELEBRITY_RANK, limit, offset]
    ),
    query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM celebrities WHERE ${where}`,
      params
    ),
  ])

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.json({ rows, total: countRows[0]?.count ?? 0 })
})
