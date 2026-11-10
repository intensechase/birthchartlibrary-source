import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminIdHandler } from '@/lib/apiHandler'

export default adminIdHandler({
  async patch(req, res, id) {
    const { type, planet, sign, house, aspect_planet, aspect_type, title, description, keywords } = req.body
    if (!type || !description) return res.status(400).json({ error: 'Type and description are required' })
    await query(
      'UPDATE interpretations SET type=$1, planet=$2, sign=$3, house=$4, aspect_planet=$5, aspect_type=$6, title=$7, description=$8, keywords=$9 WHERE id=$10',
      [type, planet || null, sign || null, house || null, aspect_planet || null, aspect_type || null, title || null, description, keywords || null, id]
    )
    return res.status(200).json({ success: true })
  },
  async delete(_, res, id) {
    await query('DELETE FROM interpretations WHERE id = $1', [id])
    return res.status(200).json({ success: true })
  },
})
