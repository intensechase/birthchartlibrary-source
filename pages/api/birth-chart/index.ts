import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { queryOne, queryCount } from '@/lib/db'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'
import { validateCoordinates } from '@/lib/validate'
import { sendChartCreatedEmail } from '@/lib/emails'
import { buildChart } from '@/lib/swisseph/buildChart'
import { apiHandler } from '@/lib/apiHandler'
import { encryptField, encryptNumeric } from '@/lib/crypto'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!await rateLimit(`chart:${user.id}`, 20, 3600000)) {
    return res.status(429).json({ error: 'Too many charts created... please wait and try again.' })
  }

  const { label, birthDate, birthTime: rawBirthTime, birthCity, birthLat, birthLng, turnstileToken, isForSelf, subjectName } = req.body
  const birthTime: string | null = rawBirthTime || null

  if (!birthDate || !birthCity || !turnstileToken) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const coordError = validateCoordinates(birthLat, birthLng)
  if (coordError) return res.status(400).json({ error: coordError })
  if (typeof birthDate !== 'string' || birthDate.length > 20) {
    return res.status(400).json({ error: 'Invalid birth date' })
  }
  if (label && (typeof label !== 'string' || label.length > 200)) {
    return res.status(400).json({ error: 'Label too long' })
  }
  if (subjectName && (typeof subjectName !== 'string' || subjectName.length > 200)) {
    return res.status(400).json({ error: 'Name too long' })
  }
  if (typeof birthCity !== 'string' || birthCity.length > 500) {
    return res.status(400).json({ error: 'Invalid city' })
  }
  if (birthTime && (typeof birthTime !== 'string' || !/^\d{2}:\d{2}$/.test(birthTime))) {
    return res.status(400).json({ error: 'Invalid birth time format' })
  }

  const valid = await verifyTurnstile(turnstileToken)
  if (!valid) {
    return res.status(403).json({ error: 'Challenge verification failed' })
  }

  const { chartData, timezone } = await buildChart(birthDate, birthTime, birthLat, birthLng)

  const primaryCount = await queryCount(
    'SELECT count(*) FROM birth_charts WHERE user_id = $1 AND is_primary = true',
    [user.id]
  )

  const isFirstChart = primaryCount === 0
  const shouldBePrimary = isForSelf !== false && isFirstChart

  // Dual-write: plaintext columns for back-compat during the encryption
  // rollout (migration 0013), encrypted shadow columns for protection.
  // Once backfill completes and the read path is fully on _enc columns,
  // a follow-up migration will drop the plaintext columns and we'll stop
  // writing them. Keeping both for now means no downtime risk if the
  // read path or decrypt key has any issue.
  const chart = await queryOne<Record<string, unknown>>(
    `INSERT INTO birth_charts (user_id, label, birth_date, birth_time, birth_city, birth_lat, birth_lng, timezone, chart_data, is_public, is_primary, subject_name, birth_time_enc, birth_city_enc, birth_lat_enc, birth_lng_enc)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING *`,
    [
      user.id,
      label || (isForSelf !== false ? 'My Chart' : subjectName || 'Chart'),
      birthDate,
      birthTime ?? null,
      birthCity,
      birthLat,
      birthLng,
      timezone,
      JSON.stringify(chartData),
      false,
      shouldBePrimary,
      isForSelf !== false ? null : (subjectName || null),
      encryptField(birthTime ?? null),
      encryptField(birthCity),
      encryptNumeric(birthLat),
      encryptNumeric(birthLng),
    ]
  )

  if (!chart) {
    throw new Error('DB insert returned no row')
  }

  if (shouldBePrimary && user.email) {
    const sunSign = chartData.planets.find((p: { planet: string }) => p.planet === 'SUN')?.sign || 'Unknown'
    const moonSign = chartData.planets.find((p: { planet: string }) => p.planet === 'MOON')?.sign || 'Unknown'
    const risingSign = chartData.ascendantSign || 'Unknown'
    sendChartCreatedEmail(user.email, sunSign, moonSign, risingSign).catch(() => {})
  }

  return res.status(200).json({ chart })
})
