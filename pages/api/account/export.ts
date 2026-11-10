import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { decryptBirthFields } from '@/lib/crypto'

interface ChartRow {
  label: string
  subject_name: string | null
  birth_date: string
  birth_time: string | null
  birth_time_enc: string | null
  birth_city: string | null
  birth_city_enc: string | null
  birth_lat: number | string | null
  birth_lat_enc: string | null
  birth_lng: number | string | null
  birth_lng_enc: string | null
  timezone: string
  chart_data: unknown
  is_primary: boolean
  created_at: string
}

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  // Selects both plaintext and _enc columns so we can dual-source during
  // the encryption rollout. The decryptBirthFields helper prefers _enc
  // and falls back to plaintext for not-yet-backfilled rows.
  const rows = await query<ChartRow>(
    `SELECT label, subject_name, birth_date,
            birth_time, birth_time_enc,
            birth_city, birth_city_enc,
            birth_lat, birth_lat_enc,
            birth_lng, birth_lng_enc,
            timezone, chart_data, is_primary, created_at
       FROM birth_charts WHERE user_id = $1 ORDER BY created_at DESC`,
    [user.id]
  )

  // Return decrypted plaintext to the user — this is their own data,
  // delivered to their authenticated session, and the export is the
  // canonical way to get it out of the system. Strip the _enc columns
  // from the response.
  const charts = rows.map(row => {
    const dec = decryptBirthFields(row)
    return {
      label: row.label,
      subject_name: row.subject_name,
      birth_date: row.birth_date,
      birth_time: dec.birth_time,
      birth_city: dec.birth_city,
      birth_lat: dec.birth_lat,
      birth_lng: dec.birth_lng,
      timezone: row.timezone,
      chart_data: row.chart_data,
      is_primary: row.is_primary,
      created_at: row.created_at,
    }
  })

  return res.status(200).json(charts)
})
