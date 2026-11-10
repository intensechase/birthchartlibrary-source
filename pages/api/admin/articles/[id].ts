import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminIdHandler } from '@/lib/apiHandler'

export default adminIdHandler({
  async patch(req, res, id) {
    const { title, slug, description, content, category, read_time, publish_date, published } = req.body
    if (!title || !slug || !content) return res.status(400).json({ error: 'Title, slug, and content are required' })
    await query(
      'UPDATE blog_articles SET title=$1, slug=$2, description=$3, content=$4, category=$5, read_time=$6, publish_date=$7, published=$8, updated_at=NOW() WHERE id=$9',
      [title, slug, description, content, category, read_time, publish_date, published, id]
    )
    return res.status(200).json({ success: true })
  },
  async delete(_, res, id) {
    await query('DELETE FROM blog_articles WHERE id = $1', [id])
    return res.status(200).json({ success: true })
  },
})
