import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminHandler } from '@/lib/apiHandler'

export default adminHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { term, definition, link, sort_order } = req.body
  if (!term || !definition) return res.status(400).json({ error: 'Term and definition are required' })

  await query(
    'INSERT INTO glossary_terms (term, definition, link, sort_order) VALUES ($1, $2, $3, $4)',
    [term, definition, link || null, sort_order || 0]
  )
  return res.status(201).json({ success: true })
})
