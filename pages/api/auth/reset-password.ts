import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { hashPassword, createToken, setAuthCookie, validatePassword } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { apiHandler } from '@/lib/apiHandler'
import { CONFIG } from '@/lib/config'
import { getClientIp } from '@/lib/request'
import { logAuthEvent } from '@/lib/audit'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: 'Token and password required' })

  // Per-token bucket caps brute-force on a SINGLE token (e.g. attacker tries
  // many passwords against one stolen token). Per-IP bucket caps the
  // "iterate through many tokens" pattern an attacker would use to bypass
  // the per-token limit. Both must pass.
  if (!await rateLimit(`reset:${token}`, CONFIG.RATE_LIMIT_AUTH_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many attempts. Please request a new reset link.' })
  }
  const ip = getClientIp(req)
  if (!await rateLimit(`reset-ip:${ip}`, CONFIG.RATE_LIMIT_AUTH_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many attempts. Please wait and try again.' })
  }

  const passwordError = validatePassword(password)
  if (passwordError) return res.status(400).json({ error: passwordError })

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const user = await queryOne<{ id: string; email: string }>(
    'SELECT id, email FROM profiles WHERE reset_token = $1 AND reset_token_expires > NOW()',
    [tokenHash]
  )

  if (!user) return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' })

  // Now that we know the email, also rate-limit per-email so an attacker who
  // somehow obtained valid tokens for the same email can't iterate through
  // them. Per-email bucket persists across token regenerations.
  if (!await rateLimit(`reset-email:${user.email}`, CONFIG.RATE_LIMIT_AUTH_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many attempts on this account. Please wait and try again.' })
  }

  const password_hash = await hashPassword(password)

  await query(
    'UPDATE profiles SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [password_hash, user.id]
  )

  const authToken = createToken({ id: user.id, email: user.email })
  setAuthCookie(res, authToken)

  await logAuthEvent({ type: 'password_reset_completed', req, userId: user.id, email: user.email })

  return res.status(200).json({ success: true })
})
