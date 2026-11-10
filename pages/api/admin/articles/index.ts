import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminHandler } from '@/lib/apiHandler'

export default adminHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { title, slug, description, content, category, read_time, publish_date, published } = req.body
  if (!title || !slug || !content) return res.status(400).json({ error: 'Title, slug, and content are required' })

  await query(
    'INSERT INTO blog_articles (title, slug, description, content, category, read_time, publish_date, published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [title, slug, description, content, category, read_time, publish_date, published]
  )
  return res.status(201).json({ success: true })
})
