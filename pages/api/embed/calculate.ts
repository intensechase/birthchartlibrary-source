import type { NextApiRequest, NextApiResponse } from 'next'
import { rateLimit } from '@/lib/rate-limit'
import { validateCoordinates } from '@/lib/validate'
import { getClientIp } from '@/lib/request'
import { buildChart } from '@/lib/swisseph/buildChart'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)

  if (!await rateLimit(`embed:${ip}`, 5, 3600000)) {
    return res.status(429).json({ error: 'Rate limit reached... try again in an hour.' })
  }

  const { birthDate, birthTime, birthLat, birthLng } = req.body

  if (!birthDate || typeof birthDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return res.status(400).json({ error: 'Invalid birth date' })
  }

  const coordError = validateCoordinates(birthLat, birthLng)
  if (coordError) return res.status(400).json({ error: coordError })

  const { chartData } = await buildChart(birthDate, birthTime || null, birthLat, birthLng)

  const sunSign = chartData.planets.find(p => p.planet === 'SUN')?.sign ?? null
  const moonSign = chartData.planets.find(p => p.planet === 'MOON')?.sign ?? null
  const risingSign = birthTime ? (chartData.ascendantSign ?? null) : null

  return res.status(200).json({ sunSign, moonSign, risingSign })
})
