import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import { apiHandler } from '@/lib/apiHandler'
import { CONFIG } from '@/lib/config'
import { logAuthEvent } from '@/lib/audit'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password, turnstileToken } = req.body
  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password required' })
  }

  const normalized = email.toLowerCase().trim()

  if (!await rateLimit(`login:${normalized}`, CONFIG.RATE_LIMIT_AUTH_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many login attempts. Please wait before trying again.' })
  }

  if (turnstileToken) {
    const captchaOk = await verifyTurnstile(turnstileToken as string)
    if (!captchaOk) return res.status(403).json({ error: 'Captcha verification failed... please try again.' })
  }

  const user = await queryOne<{ id: string; email: string; password_hash: string | null }>(
    'SELECT id, email, password_hash FROM profiles WHERE email = $1',
    [normalized]
  )

  if (!user || !user.password_hash) {
    await logAuthEvent({ type: 'login_failure', req, email: normalized, metadata: { reason: 'no_user_or_password' } })
    return res.status(401).json({ error: 'Invalid login credentials' })
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    await logAuthEvent({ type: 'login_failure', req, userId: user.id, email: normalized, metadata: { reason: 'bad_password' } })
    return res.status(401).json({ error: 'Invalid login credentials' })
  }

  const token = createToken({ id: user.id, email: user.email })
  setAuthCookie(res, token)

  await logAuthEvent({ type: 'login_success', req, userId: user.id, email: user.email })

  return res.status(200).json({ user: { id: user.id, email: user.email } })
})
