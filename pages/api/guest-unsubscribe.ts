import type { NextApiRequest, NextApiResponse } from 'next'
import { queryOne } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.query.token as string

  if (!token || typeof token !== 'string' || token.length > 64) {
    return res.status(400).send('Invalid unsubscribe link.')
  }

  const row = await queryOne<{ email: string; unsubscribed_at: string | null }>(
    'SELECT email, unsubscribed_at FROM guest_subscribers WHERE unsubscribe_token = $1',
    [token]
  )

  if (!row) {
    return res.status(404).send('Unsubscribe link not found.')
  }

  if (!row.unsubscribed_at) {
    await queryOne(
      'UPDATE guest_subscribers SET unsubscribed_at = now() WHERE unsubscribe_token = $1',
      [token]
    )
  }

  res.redirect(302, '/unsubscribed')
})
