import type { NextApiRequest, NextApiResponse } from 'next'
import { randomBytes } from 'crypto'
import { queryOne } from '@/lib/db'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/request'
import { getSunSign } from '@/lib/sunSign'
import { sendGuestSubscribeConfirmation } from '@/lib/emails'
import { apiHandler } from '@/lib/apiHandler'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (!await rateLimit(`guest-sub:${ip}`, 5, 3600000)) {
    return res.status(429).json({ error: 'Too many requests... try again later.' })
  }

  const { email, birthMonth, birthDay, turnstileToken } = req.body

  if (!email || !birthMonth || !birthDay || !turnstileToken) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const month = parseInt(birthMonth, 10)
  const day = parseInt(birthDay, 10)
  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return res.status(400).json({ error: 'Invalid birth date' })
  }

  const sunSign = getSunSign(month, day)
  if (!sunSign) return res.status(400).json({ error: 'Could not determine sun sign' })

  const valid = await verifyTurnstile(turnstileToken)
  if (!valid) return res.status(403).json({ error: 'Challenge verification failed' })

  try {
    const token = randomBytes(24).toString('base64url')
    const row = await queryOne<{ unsubscribe_token: string; sun_sign: string; is_existing: boolean }>(
      `INSERT INTO guest_subscribers (email, sun_sign, birth_month, birth_day, unsubscribe_token)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
         SET unsubscribed_at = NULL,
             sun_sign = EXCLUDED.sun_sign,
             birth_month = EXCLUDED.birth_month,
             birth_day = EXCLUDED.birth_day
       RETURNING unsubscribe_token, sun_sign,
         (xmax <> 0) AS is_existing`,
      [email.toLowerCase().trim(), sunSign, month, day, token]
    )

    if (!row) throw new Error('No row returned from insert')

    // Send confirmation only on new subscriptions; on re-subscribe just return success silently
    if (!row.is_existing) {
      sendGuestSubscribeConfirmation(email, row.sun_sign, row.unsubscribe_token).catch(() => {})
    }

    return res.status(200).json({ sunSign: row.sun_sign })
  } catch (err) {
    console.error('Guest subscribe error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default apiHandler(handler)
