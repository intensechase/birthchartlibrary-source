import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminHandler } from '@/lib/apiHandler'

export default adminHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { title, author, description, why_we_recommend, amazon_url, category, featured_month, relevant_signs, relevant_planets, sort_order, cover_url } = req.body
  if (!title || !author || !description || !amazon_url) {
    return res.status(400).json({ error: 'Title, author, description, and Amazon URL are required' })
  }

  await query(
    'INSERT INTO reading_room_books (title, author, description, why_we_recommend, amazon_url, category, featured_month, relevant_signs, relevant_planets, sort_order, cover_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [title, author, description, why_we_recommend || null, amazon_url, category || 'beginner', featured_month || null, relevant_signs || [], relevant_planets || [], sort_order || 0, cover_url || null]
  )
  return res.status(201).json({ success: true })
})
