import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, generateToken } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { sendEmailVerification } from '@/lib/emails'
import { rateLimit } from '@/lib/rate-limit'
import { apiHandler } from '@/lib/apiHandler'
import { env } from '@/lib/env'
import { CONFIG } from '@/lib/config'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (!await rateLimit(`resend-verify:${user.id}`, 3, CONFIG.RATE_LIMIT_AUTH_WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' })
  }

  const profile = await queryOne<{ email_verified: boolean }>(
    'SELECT email_verified FROM profiles WHERE id = $1',
    [user.id]
  )

  if (!profile || profile.email_verified) {
    return res.status(400).json({ error: 'Email is already verified.' })
  }

  const { token, tokenHash, expires } = generateToken(CONFIG.EMAIL_CHANGE_TOKEN_EXPIRY_MS)

  await query(
    'UPDATE profiles SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3',
    [tokenHash, expires.toISOString(), user.id]
  )

  const verifyUrl = `${env.appUrl}/verify-email?token=${token}`
  await sendEmailVerification(user.email, verifyUrl)

  return res.status(200).json({ success: true, message: 'Verification email sent.' })
})
