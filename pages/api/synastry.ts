import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'
import { validateCoordinates } from '@/lib/validate'
import { getClientIp } from '@/lib/request'
import { calculateBirthChart, toJulianDay } from '@/lib/swisseph/calculate'
import { computeSynastryAspects, synastryScore, type RelationshipType } from '@/lib/swisseph/synastry'
import { apiHandler } from '@/lib/apiHandler'
import tzlookup from 'tz-lookup'
import { fromZonedTime } from 'date-fns-tz'

interface PersonInput {
  birthDate: string
  birthTime?: string
  birthLat: number
  birthLng: number
  name?: string
}

async function calcChart(person: PersonInput) {
  const timezone = tzlookup(person.birthLat, person.birthLng)
  if (!timezone) throw new Error('Could not determine timezone')

  // Normalize time: strip seconds if already present ("HH:MM:SS" → "HH:MM")
  const normalizedTime = person.birthTime?.slice(0, 5)
  const localStr = normalizedTime
    ? `${person.birthDate}T${normalizedTime}:00`
    : `${person.birthDate}T12:00:00`

  const utc = fromZonedTime(localStr, timezone)
  const jd = await toJulianDay(
    utc.getUTCFullYear(),
    utc.getUTCMonth() + 1,
    utc.getUTCDate(),
    utc.getUTCHours() + utc.getUTCMinutes() / 60
  )
  return calculateBirthChart(jd, person.birthLat, person.birthLng)
}

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (!await rateLimit(`synastry:${ip}`, 10, 3600000)) {
    return res.status(429).json({ error: 'Rate limit reached... try again in an hour.' })
  }

  const { personA, personB, turnstileToken, relationshipType } = req.body
  const VALID_TYPES: RelationshipType[] = ['romantic', 'friendship', 'work', 'family', 'siblings', 'rivals']
  const relType: RelationshipType = VALID_TYPES.includes(relationshipType) ? relationshipType : 'romantic'

  if (!personA?.birthDate || !personB?.birthDate || !turnstileToken) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  for (const person of [personA, personB] as PersonInput[]) {
    if (typeof person.birthDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(person.birthDate)) {
      return res.status(400).json({ error: 'Invalid birth date' })
    }
    const coordError = validateCoordinates(person.birthLat, person.birthLng)
    if (coordError) return res.status(400).json({ error: coordError })
  }

  const valid = await verifyTurnstile(turnstileToken)
  if (!valid) return res.status(403).json({ error: 'Challenge verification failed' })

  const [chartA, chartB] = await Promise.all([
    calcChart(personA),
    calcChart(personB),
  ])

  const aspects = computeSynastryAspects(chartA, chartB, relType)
  const score = synastryScore(aspects)

  return res.status(200).json({
    chartA,
    chartB,
    aspects,
    score,
    relationshipType: relType,
  })
})
