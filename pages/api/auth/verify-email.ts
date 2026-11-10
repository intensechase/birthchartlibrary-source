import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { query, queryOne } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { logAuthEvent } from '@/lib/audit'

// POST-only endpoint. Email-client prefetchers (Outlook Safe Links etc.) and
// bots that follow links in messages typically use GET and don't execute JS,
// so requiring POST prevents accidental auto-verification when the user has
// not actually clicked the link from a browser. The verification UI lives at
// /verify-email which posts here onMount.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = typeof req.body?.token === 'string' ? req.body.token : null
  if (!token) return res.status(400).json({ error: 'invalid' })

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const row = await queryOne<{ id: string; email_verification_expires: string }>(
    'SELECT id, email_verification_expires FROM profiles WHERE email_verification_token = $1 AND email_verified = false LIMIT 1',
    [tokenHash]
  )

  if (!row) return res.status(400).json({ error: 'invalid' })

  if (new Date(row.email_verification_expires) < new Date()) {
    return res.status(400).json({ error: 'expired' })
  }

  await query(
    'UPDATE profiles SET email_verified = true, email_verification_token = NULL, email_verification_expires = NULL WHERE id = $1',
    [row.id]
  )

  await logAuthEvent({ type: 'email_verified', req, userId: row.id })

  return res.status(200).json({ success: true })
}

export default apiHandler(handler)
