import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { checkChartFields, updateChart } from '@/lib/save-chart'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  const user = await getUser({ req, res })
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'PATCH') {
    const { label, is_public, birth } = req.body

    // Correcting the birth details. The name, link and private or public stay.
    if (birth !== undefined) {
      if (!birth || typeof birth !== 'object') return res.status(400).json({ error: 'Invalid value' })
      const row = await queryOne<{ subject_name: string | null }>('SELECT subject_name FROM birth_charts WHERE id = $1 AND user_id = $2', [id, user.id])
      if (!row) return res.status(404).json({ error: 'That chart is not in your account.' })
      const fields = { birthDate: birth.birthDate, birthTime: birth.birthTime, birthCity: birth.birthCity, birthLat: birth.birthLat, birthLng: birth.birthLng, isForSelf: !row.subject_name }
      const bad = checkChartFields(fields)
      if (bad) return res.status(400).json({ error: bad })
      if (!await rateLimit(`chart:${user.id}`, 20, 3600000)) return res.status(429).json({ error: 'Too many changes in a short time. Wait a while and try again.' })
      if (!await updateChart(user.id, id, fields)) return res.status(404).json({ error: 'That chart is not in your account.' })
      return res.status(200).json({ success: true })
    }

    if (is_public !== undefined) {
      if (typeof is_public !== 'boolean') return res.status(400).json({ error: 'Invalid value' })
      await query('UPDATE birth_charts SET is_public = $1 WHERE id = $2 AND user_id = $3', [is_public, id, user.id])
      return res.status(200).json({ success: true })
    }

    if (!label || typeof label !== 'string' || label.length > 200) {
      return res.status(400).json({ error: 'Invalid label' })
    }

    // Someone else's chart goes by their name, so renaming changes that too.
    const name = label.trim()
    if (!name) return res.status(400).json({ error: 'Invalid label' })
    await query('UPDATE birth_charts SET label = $1, subject_name = CASE WHEN subject_name IS NULL THEN NULL ELSE $1 END WHERE id = $2 AND user_id = $3', [name, id, user.id])
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    await query('DELETE FROM birth_charts WHERE id = $1 AND user_id = $2', [id, user.id])
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
})
