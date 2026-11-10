import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'PATCH') {
    const { label, is_public } = req.body

    if (is_public !== undefined) {
      if (typeof is_public !== 'boolean') return res.status(400).json({ error: 'Invalid value' })
      await query('UPDATE birth_charts SET is_public = $1 WHERE id = $2 AND user_id = $3', [is_public, id, user.id])
      return res.status(200).json({ success: true })
    }

    if (!label || typeof label !== 'string' || label.length > 200) {
      return res.status(400).json({ error: 'Invalid label' })
    }

    await query('UPDATE birth_charts SET label = $1 WHERE id = $2 AND user_id = $3', [label, id, user.id])
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    await query('DELETE FROM birth_charts WHERE id = $1 AND user_id = $2', [id, user.id])
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
})
