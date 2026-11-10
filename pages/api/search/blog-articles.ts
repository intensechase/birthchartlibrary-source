import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const q = req.query.q as string
  if (!q || q.length < 2 || q.length > 100) return res.status(200).json([])
  const today = new Date().toISOString().split('T')[0]
  const results = await query(
    `SELECT title, slug FROM blog_articles
     WHERE published = true AND publish_date <= $2 AND title ILIKE $1
     ORDER BY publish_date DESC LIMIT 8`,
    [`%${q}%`, today]
  )
  return res.status(200).json(results)
})
