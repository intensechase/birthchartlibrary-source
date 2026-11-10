import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'
import { validateCoordinates } from '@/lib/validate'
import { getClientIp } from '@/lib/request'
import { buildChart } from '@/lib/swisseph/buildChart'
import { buildInterpBundle } from '@/lib/chartInterp'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)

  if (!await rateLimit(`calc:${ip}`, 10, 3600000)) {
    return res.status(429).json({ error: 'Rate limit reached... try again in an hour.' })
  }

  const { birthDate, birthTime, birthLat, birthLng, turnstileToken } = req.body

  if (!birthDate || !turnstileToken) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (typeof birthDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return res.status(400).json({ error: 'Invalid birth date' })
  }

  const coordError = validateCoordinates(birthLat, birthLng)
  if (coordError) return res.status(400).json({ error: coordError })

  const valid = await verifyTurnstile(turnstileToken)
  if (!valid) {
    return res.status(403).json({ error: 'Challenge verification failed' })
  }

  const { chartData, timezone } = await buildChart(birthDate, birthTime, birthLat, birthLng)
  const interp = buildInterpBundle(chartData)

  // No DB write here — this is the guest/no-account path used by the
  // public /birth-chart form. Saving (POST /api/birth-chart, auth
  // required) is a separate, deliberate step the visitor takes after
  // seeing their chart, not a prerequisite for seeing it.
  return res.status(200).json({ chart: chartData, timezone, interp })
})
