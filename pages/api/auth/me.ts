import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const profile = await queryOne<{ email_verified: boolean; is_admin: boolean }>(
    'SELECT email_verified, is_admin FROM profiles WHERE id = $1',
    [user.id]
  )

  return res.status(200).json({
    id: user.id,
    email: user.email,
    email_verified: profile?.email_verified ?? true,
    is_admin: profile?.is_admin ?? false,
  })
})
