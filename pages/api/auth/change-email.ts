import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, generateToken } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { sendEmailChangeVerification } from '@/lib/emails'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'
import { apiHandler } from '@/lib/apiHandler'
import { CONFIG } from '@/lib/config'
import { logAuthEvent } from '@/lib/audit'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (!await rateLimit(`email-change:${user.id}`, CONFIG.RATE_LIMIT_SENSITIVE_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' })
  }

  const { email } = req.body
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email required' })

  const normalized = email.toLowerCase().trim()
  if (normalized === user.email) return res.status(400).json({ error: 'That is already your email address.' })

  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM profiles WHERE email = $1 AND id != $2',
    [normalized, user.id]
  )
  if (existing) return res.status(409).json({ error: 'Email already in use' })

  const { token, tokenHash, expires } = generateToken(CONFIG.EMAIL_CHANGE_TOKEN_EXPIRY_MS)

  await query(
    'UPDATE profiles SET pending_email = $1, email_change_token = $2, email_change_expires = $3 WHERE id = $4',
    [normalized, tokenHash, expires.toISOString(), user.id]
  )

  const verifyUrl = `${env.appUrl}/api/auth/verify-email-change?token=${token}`
  await sendEmailChangeVerification(normalized, verifyUrl)

  await logAuthEvent({ type: 'email_change_requested', req, userId: user.id, email: user.email, metadata: { new_email: normalized } })

  return res.status(200).json({ success: true, message: 'Check your new email address for a confirmation link.' })
})
