import type { NextApiRequest, NextApiResponse } from 'next'
import { clearAuthCookie, getUser } from '@/lib/auth'
import { apiHandler } from '@/lib/apiHandler'
import { logAuthEvent } from '@/lib/audit'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await getUser({ req, res })
  clearAuthCookie(res)
  if (user) await logAuthEvent({ type: 'signout', req, userId: user.id, email: user.email })
  return res.redirect(302, '/')
})
