import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminHandler } from '@/lib/apiHandler'

export default adminHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const type = req.query.type as string
    if (!type) return res.status(400).json({ error: 'Type filter is required' })

    const rows = await query(
      'SELECT id, type, planet, sign, house, title, description FROM interpretations WHERE type = $1 ORDER BY planet ASC, sign ASC, house ASC LIMIT 50',
      [type]
    )
    return res.status(200).json(rows)
  }

  if (req.method === 'POST') {
    const { type, planet, sign, house, aspect_planet, aspect_type, title, description, keywords } = req.body
    if (!type || !description) return res.status(400).json({ error: 'Type and description are required' })

    await query(
      'INSERT INTO interpretations (id, type, planet, sign, house, aspect_planet, aspect_type, title, description, keywords) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [type, planet || null, sign || null, house || null, aspect_planet || null, aspect_type || null, title || null, description, keywords || null]
    )
    return res.status(201).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
})
