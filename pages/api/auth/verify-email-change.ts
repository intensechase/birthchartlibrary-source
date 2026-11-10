import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { query, queryOne } from '@/lib/db'
import { env } from '@/lib/env'
import { logAuthEvent } from '@/lib/audit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { token } = req.query
  if (!token || typeof token !== 'string') {
    return res.redirect(`${env.appUrl}/account?emailError=invalid`)
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const row = await queryOne<{ id: string; pending_email: string; email_change_expires: string }>(
    'SELECT id, pending_email, email_change_expires FROM profiles WHERE email_change_token = $1 LIMIT 1',
    [tokenHash]
  )

  if (!row) return res.redirect(`${env.appUrl}/account?emailError=invalid`)

  const expires = new Date(row.email_change_expires)
  if (expires < new Date()) {
    await query(
      'UPDATE profiles SET pending_email = NULL, email_change_token = NULL, email_change_expires = NULL WHERE id = $1',
      [row.id]
    )
    return res.redirect(`${env.appUrl}/account?emailError=expired`)
  }

  const conflict = await queryOne<{ id: string }>(
    'SELECT id FROM profiles WHERE email = $1 AND id != $2',
    [row.pending_email, row.id]
  )
  if (conflict) {
    await query(
      'UPDATE profiles SET pending_email = NULL, email_change_token = NULL, email_change_expires = NULL WHERE id = $1',
      [row.id]
    )
    return res.redirect(`${env.appUrl}/account?emailError=taken`)
  }

  await query(
    'UPDATE profiles SET email = $1, pending_email = NULL, email_change_token = NULL, email_change_expires = NULL WHERE id = $2',
    [row.pending_email, row.id]
  )

  await logAuthEvent({ type: 'email_change_completed', req, userId: row.id, email: row.pending_email })

  return res.redirect(`${env.appUrl}/account?emailChanged=1`)
}
