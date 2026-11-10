import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/request'
import { apiHandler } from '@/lib/apiHandler'

const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)

  if (!await rateLimit(`auth:${ip}`, MAX_ATTEMPTS, WINDOW_MS)) {
    return res.status(429).json({ error: 'Too many attempts... please wait and try again.' })
  }

  const { token } = req.body

  if (!token) {
    return res.status(400).json({ error: 'Missing captcha token' })
  }

  const success = await verifyTurnstile(token)

  if (!success) {
    return res.status(403).json({ error: 'Captcha verification failed' })
  }

  return res.status(200).json({ success: true })
})
