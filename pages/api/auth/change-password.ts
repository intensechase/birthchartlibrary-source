import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, hashPassword, validatePassword, verifyPassword } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { rateLimit } from '@/lib/rate-limit'
import { CONFIG } from '@/lib/config'
import { logAuthEvent } from '@/lib/audit'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (!await rateLimit(`change-pw:${user.id}`, CONFIG.RATE_LIMIT_AUTH_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many attempts. Please wait before trying again.' })
  }

  const { oldPassword, password } = req.body
  if (!oldPassword || typeof oldPassword !== 'string') {
    return res.status(400).json({ error: 'Current password required' })
  }
  if (!password || typeof password !== 'string') return res.status(400).json({ error: 'Password required' })

  const passwordError = validatePassword(password)
  if (passwordError) return res.status(400).json({ error: passwordError })

  const row = await queryOne<{ password_hash: string | null }>(
    'SELECT password_hash FROM profiles WHERE id = $1',
    [user.id]
  )
  if (!row || !row.password_hash) return res.status(403).json({ error: 'Current password is incorrect' })

  const valid = await verifyPassword(oldPassword, row.password_hash)
  if (!valid) return res.status(403).json({ error: 'Current password is incorrect' })

  const password_hash = await hashPassword(password)
  await query('UPDATE profiles SET password_hash = $1 WHERE id = $2', [password_hash, user.id])

  await logAuthEvent({ type: 'password_changed', req, userId: user.id, email: user.email })

  return res.status(200).json({ success: true })
})
