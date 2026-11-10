import type { NextApiRequest, NextApiResponse } from 'next'
import { generateToken } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/emails'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'
import { apiHandler } from '@/lib/apiHandler'
import { CONFIG } from '@/lib/config'
import { logAuthEvent } from '@/lib/audit'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email required' })

  if (!await rateLimit(`forgot:${email.toLowerCase()}`, CONFIG.RATE_LIMIT_SENSITIVE_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' })
  }

  const user = await queryOne<{ id: string }>(
    'SELECT id FROM profiles WHERE email = $1',
    [email.toLowerCase()]
  )

  // Always return success to prevent email enumeration
  if (!user) return res.status(200).json({ success: true })

  const { token, tokenHash, expires } = generateToken(CONFIG.RESET_TOKEN_EXPIRY_MS)

  await query(
    'UPDATE profiles SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [tokenHash, expires.toISOString(), user.id]
  )

  const resetUrl = `${env.appUrl}/reset-password?token=${token}`
  await sendPasswordResetEmail(email.toLowerCase(), resetUrl)

  await logAuthEvent({ type: 'password_reset_requested', req, userId: user.id, email: email.toLowerCase() })

  return res.status(200).json({ success: true })
})
