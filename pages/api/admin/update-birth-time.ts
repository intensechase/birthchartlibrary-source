import type { NextApiRequest, NextApiResponse } from 'next'
import { adminHandler } from '@/lib/apiHandler'
import { queryOne } from '@/lib/db'
import { safeRevalidate } from '@/lib/revalidate'

export default adminHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id, birth_time, rodden_rating, source_note } = req.body as {
    id: string
    birth_time: string
    rodden_rating?: string
    source_note?: string
  }

  if (!id || !birth_time) return res.status(400).json({ error: 'id and birth_time required' })

  // Validate HH:MM format
  if (!/^\d{1,2}:\d{2}$/.test(birth_time)) {
    return res.status(400).json({ error: 'birth_time must be HH:MM format' })
  }
  const [h, m] = birth_time.split(':').map(Number)
  if (h > 23 || m > 59) return res.status(400).json({ error: 'Invalid time' })

  const normalizedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

  const meta: Record<string, string> = {}
  if (rodden_rating) meta.rodden_rating = rodden_rating
  if (source_note) meta.source_note = source_note

  const row = await queryOne<{ slug: string | null }>(
    `UPDATE celebrities
     SET birth_time = $1,
         source = $2,
         metadata = COALESCE(metadata, '{}'::jsonb) || $3::jsonb
     WHERE id = $4
     RETURNING slug`,
    [normalizedTime, source_note || 'Manual entry', JSON.stringify(meta), id]
  )

  if (row?.slug) {
    await safeRevalidate(res, `/celebrity-birth-charts/${row.slug}`)
  }

  res.json({ ok: true })
})
