import type { NextApiRequest, NextApiResponse } from 'next'

// OAuth callback — placeholder for future Google OAuth integration
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.redirect(302, '/login')
}
