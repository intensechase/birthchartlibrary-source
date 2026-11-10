import type { NextApiRequest, NextApiResponse } from 'next'
import { queryOne } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const slug = req.query.slug as string
  if (!slug) return res.status(400).json({ error: 'Missing slug' })

  const celeb = await queryOne<{ name: string; birth_date: string; birth_time: string | null; birth_city: string }>(
    'SELECT name, birth_date, birth_time, birth_city FROM celebrities WHERE slug = $1',
    [slug]
  )

  if (!celeb) return res.status(404).json({ error: 'Not found' })

  let lat = 0
  let lng = 0
  try {
    const geo = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(celeb.birth_city)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'birthchartlibrary.com contact@birthchartlibrary.com' } }
    )
    const results = await geo.json()
    if (results[0]) {
      lat = parseFloat(results[0].lat)
      lng = parseFloat(results[0].lon)
    }
  } catch {
    // Geocoding is best-effort — fall back to 0/0 so client can show city only
  }

  return res.status(200).json({
    name: celeb.name,
    birthDate: celeb.birth_date.split('T')[0],
    birthTime: celeb.birth_time || '',
    birthCity: celeb.birth_city,
    birthLat: lat,
    birthLng: lng,
    hasBirthTime: !!celeb.birth_time,
  })
})
