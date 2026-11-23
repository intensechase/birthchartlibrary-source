import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'
import { apiHandler } from '@/lib/apiHandler'
import { checkChartFields, saveChart } from '@/lib/save-chart'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!await rateLimit(`chart:${user.id}`, 20, 3600000)) {
    return res.status(429).json({ error: 'Too many charts created... please wait and try again.' })
  }

  const { turnstileToken } = req.body
  if (!turnstileToken) return res.status(400).json({ error: 'Missing required fields' })
  const fieldError = checkChartFields(req.body)
  if (fieldError) return res.status(400).json({ error: fieldError })

  const valid = await verifyTurnstile(turnstileToken)
  if (!valid) {
    return res.status(403).json({ error: 'Challenge verification failed' })
  }

  const id = await saveChart(user, req.body)
  // Only the id is used by the client; don't echo stored (encrypted) fields.
  return res.status(200).json({ chart: { id } })
})
