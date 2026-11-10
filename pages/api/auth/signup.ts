import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import * as Sentry from '@sentry/nextjs'
const uuidv4 = () => crypto.randomUUID()
import { hashPassword, createToken, setAuthCookie, validatePassword, generateToken } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { sendWelcomeEmail, sendEmailVerification } from '@/lib/emails'
import { rateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import { apiHandler } from '@/lib/apiHandler'
import { env } from '@/lib/env'
import { CONFIG } from '@/lib/config'
import { logAuthEvent } from '@/lib/audit'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password, turnstileToken, signup_source, signup_ref } = req.body
  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password required' })
  }

  const normalized = email.toLowerCase().trim()

  if (!await rateLimit(`signup:${normalized}`, CONFIG.RATE_LIMIT_SENSITIVE_MAX, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many signup attempts. Please wait before trying again.' })
  }

  if (turnstileToken) {
    const captchaOk = await verifyTurnstile(turnstileToken as string)
    if (!captchaOk) return res.status(403).json({ error: 'Captcha verification failed... please try again.' })
  }

  const passwordError = validatePassword(password)
  if (passwordError) return res.status(400).json({ error: passwordError })

  const existing = await queryOne<{ id: string }>('SELECT id FROM profiles WHERE email = $1', [normalized])
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' })

  const id = uuidv4()
  const password_hash = await hashPassword(password)
  const { token: verificationToken, tokenHash: verificationHash, expires: verificationExpires } =
    generateToken(CONFIG.EMAIL_CHANGE_TOKEN_EXPIRY_MS)

  const { id: userId } = (await queryOne<{ id: string }>(
    `INSERT INTO profiles (id, email, password_hash, email_verified, email_verification_token, email_verification_expires, signup_source, signup_ref, created_at)
     VALUES ($1, $2, $3, false, $4, $5, $6, $7, NOW()) RETURNING id`,
    [id, normalized, password_hash, verificationHash, verificationExpires.toISOString(), signup_source || 'direct', signup_ref || null]
  ))!

  const authToken = createToken({ id: userId, email: normalized })
  setAuthCookie(res, authToken)

  await logAuthEvent({ type: 'signup', req, userId, email: normalized, metadata: { signup_source: signup_source || 'direct', signup_ref: signup_ref || null } })

  // Best-effort emails — don't block signup, but surface failures to Sentry.
  // User is already logged in and can resend verification from their account.
  const verifyUrl = `${env.appUrl}/verify-email?token=${verificationToken}`
  sendWelcomeEmail(normalized).catch(err => {
    console.error('Welcome email failed:', err)
    Sentry.captureException(err, { tags: { email: 'welcome', user_id: userId } })
  })
  sendEmailVerification(normalized, verifyUrl).catch(err => {
    console.error('Verification email failed:', err)
    Sentry.captureException(err, { tags: { email: 'verification', user_id: userId } })
  })

  return res.status(201).json({ user: { id: userId, email: normalized } })
})
