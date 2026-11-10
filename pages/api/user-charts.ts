import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { decryptBirthFields } from '@/lib/crypto'

interface ChartRow {
  id: string
  label: string
  subject_name: string | null
  birth_date: string
  birth_time: string | null
  birth_time_enc: string | null
  birth_city: string | null
  birth_city_enc: string | null
  birth_lat: string | null
  birth_lat_enc: string | null
  birth_lng: string | null
  birth_lng_enc: string | null
  is_primary: boolean
}

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const rows = await query<ChartRow>(
    `SELECT id, label, subject_name, birth_date,
            birth_time, birth_time_enc,
            birth_city, birth_city_enc,
            birth_lat, birth_lat_enc,
            birth_lng, birth_lng_enc,
            is_primary
     FROM birth_charts
     WHERE user_id = $1
     ORDER BY is_primary DESC, created_at ASC
     LIMIT 50`,
    [user.id]
  )

  return res.status(200).json(rows.map(r => {
    const dec = decryptBirthFields(r)
    return {
      id: r.id,
      label: r.label,
      subjectName: r.subject_name,
      birthDate: r.birth_date,
      birthTime: dec.birth_time ? dec.birth_time.slice(0, 5) : null,
      birthCity: dec.birth_city ?? '',
      birthLat: dec.birth_lat ?? 0,
      birthLng: dec.birth_lng ?? 0,
      isPrimary: r.is_primary,
    }
  }))
})
