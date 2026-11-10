import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

// Matches the CHECK constraint on profiles.email_cadence_days.
const MIN_CADENCE = 1
const MAX_CADENCE = 30

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { enabled, cadenceDays } = req.body || {}

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'enabled must be a boolean' })
  }

  // cadenceDays is optional — if omitted, only the toggle is updated.
  if (cadenceDays !== undefined) {
    if (!Number.isInteger(cadenceDays) || cadenceDays < MIN_CADENCE || cadenceDays > MAX_CADENCE) {
      return res.status(400).json({ error: `cadenceDays must be an integer ${MIN_CADENCE}–${MAX_CADENCE}` })
    }
    await query(
      'UPDATE profiles SET daily_email = $1, email_cadence_days = $2 WHERE id = $3',
      [enabled, cadenceDays, user.id]
    )
  } else {
    await query('UPDATE profiles SET daily_email = $1 WHERE id = $2', [enabled, user.id])
  }

  return res.status(200).json({ success: true })
})
