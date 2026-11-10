import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const q = req.query.q as string
  if (!q || q.length < 2 || q.length > 100) return res.status(200).json([])
  const results = await query(
    `SELECT name, slug, image_url, sun_sign, moon_sign, rising_sign FROM celebrities WHERE name ILIKE $1 AND ${QUALITY_BIO_SQL} LIMIT 8`,
    [`%${q}%`]
  )
  return res.status(200).json(results)
})
