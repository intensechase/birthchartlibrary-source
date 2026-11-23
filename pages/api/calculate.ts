import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'
import { validateCoordinates } from '@/lib/validate'
import { getClientIp } from '@/lib/request'
import { buildChart } from '@/lib/swisseph/buildChart'
import { buildInterpBundle } from '@/lib/chartInterp'
import { apiHandler } from '@/lib/apiHandler'
import { redesignOn } from '@/lib/redesign'
import { UNDER_AGE_MESSAGE, isUnderAge } from '@/lib/age'

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

  // No name sent = the reader's own chart.
  const forSomeone = typeof req.body.subjectName === 'string' && req.body.subjectName.trim()
  if (!forSomeone && isUnderAge(birthDate)) return res.status(400).json({ error: UNDER_AGE_MESSAGE })

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
  // Stage 'mine': the same reading the celebrity pages use, built here so the
  // interpretation library never ships to the browser.
  let view = null
  let teaser = null
  if (redesignOn('mine')) {
    const subjectName = typeof req.body.subjectName === 'string' && req.body.subjectName.trim() ? req.body.subjectName.trim().slice(0, 60) : null
    const birthCity = typeof req.body.birthCity === 'string' ? req.body.birthCity.slice(0, 200) : ''
    const { buildMineView } = await import('@/lib/redesign/mine-view')
    view = await buildMineView({ chart: chartData, birthDate, birthTime: birthTime || null, birthCity, subjectName, lat: birthLat, lng: birthLng })
    // The opening of the full reading; the rest needs an account and is not sent.
    const { buildReading } = await import('@/lib/reading/build')
    const { teaserOf } = await import('@/lib/reading/teaser')
    teaser = teaserOf(buildReading(view, { date: birthDate, time: birthTime || null, city: birthCity }, subjectName))
  }
  return res.status(200).json({ chart: chartData, timezone, interp, view, teaser })
})
