import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminIdHandler } from '@/lib/apiHandler'

export default adminIdHandler({
  async patch(req, res, id) {
    const { title, author, description, why_we_recommend, amazon_url, category, featured_month, relevant_signs, relevant_planets, sort_order, active, cover_url } = req.body
    if (!title || !author || !description || !amazon_url) {
      return res.status(400).json({ error: 'Title, author, description, and Amazon URL are required' })
    }
    await query(
      'UPDATE reading_room_books SET title=$1, author=$2, description=$3, why_we_recommend=$4, amazon_url=$5, category=$6, featured_month=$7, relevant_signs=$8, relevant_planets=$9, sort_order=$10, active=$11, cover_url=$12, updated_at=NOW() WHERE id=$13',
      [title, author, description, why_we_recommend || null, amazon_url, category || 'beginner', featured_month || null, relevant_signs || [], relevant_planets || [], sort_order || 0, active !== false, cover_url || null, id]
    )
    return res.status(200).json({ success: true })
  },
  async delete(_, res, id) {
    await query('DELETE FROM reading_room_books WHERE id = $1', [id])
    return res.status(200).json({ success: true })
  },
})
