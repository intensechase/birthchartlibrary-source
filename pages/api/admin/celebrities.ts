import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminHandler } from '@/lib/apiHandler'
import { safeRevalidate } from '@/lib/revalidate'

export default adminHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, slug, birth_date, birth_time, birth_city, birth_lat, birth_lng, timezone, chart_data, category, bio } = req.body
  if (!name || !slug || !birth_date) return res.status(400).json({ error: 'Name, slug, and birth date are required' })

  await query(
    'INSERT INTO celebrities (name, slug, birth_date, birth_time, birth_city, birth_lat, birth_lng, timezone, chart_data, category, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [name, slug, birth_date, birth_time, birth_city, birth_lat, birth_lng, timezone, JSON.stringify(chart_data), category, bio]
  )

  await safeRevalidate(res, [
    `/celebrity-birth-charts/${slug}`,
    '/celebrity-birth-charts',
  ])

  return res.status(201).json({ success: true })
})
