import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { queryCount } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const user = await getUser({ req, res })
  if (!user) return res.status(200).json({ loggedIn: false, hasChart: false })
  const count = await queryCount('SELECT count(*) FROM birth_charts WHERE user_id = $1 AND is_primary = true', [user.id])
  return res.status(200).json({ loggedIn: true, hasChart: count > 0 })
})
