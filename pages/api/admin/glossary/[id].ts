import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminIdHandler } from '@/lib/apiHandler'

export default adminIdHandler({
  async patch(req, res, id) {
    const { term, definition, link, sort_order } = req.body
    if (!term || !definition) return res.status(400).json({ error: 'Term and definition are required' })
    await query(
      'UPDATE glossary_terms SET term=$1, definition=$2, link=$3, sort_order=$4, updated_at=NOW() WHERE id=$5',
      [term, definition, link || null, sort_order || 0, id]
    )
    return res.status(200).json({ success: true })
  },
  async delete(_, res, id) {
    await query('DELETE FROM glossary_terms WHERE id = $1', [id])
    return res.status(200).json({ success: true })
  },
})
