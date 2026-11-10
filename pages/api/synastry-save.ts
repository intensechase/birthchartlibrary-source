import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { getUser } from '@/lib/auth'
import { query as dbQuery } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

function generateHash(): string {
  return crypto.randomBytes(6).toString('hex')
}

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { personA, personB, chartA, chartB, aspects, score, relationshipType } = req.body

  if (!personA || !personB || !chartA || !chartB || !aspects || !score) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const hash = generateHash()

  // Explicit JSON.stringify for every JSONB column. pg auto-serializes JS
  // objects to JSON but JS arrays to Postgres array literals (`{...}`), which
  // Postgres can't parse as JSON. `aspects` is an array, so without this it
  // throws "invalid input syntax for type json". Stringifying uniformly
  // makes the intent explicit and safe for any value shape.
  await dbQuery(
    `INSERT INTO synastry_readings (hash, user_id, person_a, person_b, chart_a, chart_b, aspects, score, relationship_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      hash,
      user.id,
      JSON.stringify(personA),
      JSON.stringify(personB),
      JSON.stringify(chartA),
      JSON.stringify(chartB),
      JSON.stringify(aspects),
      JSON.stringify(score),
      relationshipType ?? 'romantic',
    ]
  )

  return res.status(200).json({ hash, url: `/synastry/${hash}` })
})
