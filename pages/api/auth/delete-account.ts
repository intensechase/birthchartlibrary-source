import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, verifyPassword, clearAuthCookie } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { logAuthEvent } from '@/lib/audit'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { password } = req.body || {}
  if (!password) return res.status(400).json({ error: 'Password required to delete account' })

  const profile = await queryOne<{ password_hash: string | null }>(
    'SELECT password_hash FROM profiles WHERE id = $1',
    [user.id]
  )

  if (!profile?.password_hash) return res.status(403).json({ error: 'Cannot verify password' })

  const valid = await verifyPassword(password, profile.password_hash)
  if (!valid) return res.status(403).json({ error: 'Incorrect password' })

  // Log first while the profile row still exists. The ON DELETE SET NULL
  // on the FK will null user_id after the delete, but email + ip + UA
  // are stored directly on the audit row and survive.
  await logAuthEvent({ type: 'account_deleted', req, userId: user.id, email: user.email })

  // CASCADE will delete birth_charts too
  await query('DELETE FROM profiles WHERE id = $1', [user.id])

  clearAuthCookie(res)
  return res.status(200).json({ success: true })
}

export default apiHandler(handler)
