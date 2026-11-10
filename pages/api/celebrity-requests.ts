import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { apiHandler } from '@/lib/apiHandler'
import { getClientIp } from '@/lib/request'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (!await rateLimit(`celeb-req:${ip}`, 5, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const { name } = req.body
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Name required' })
  }

  await query('INSERT INTO celebrity_requests (name) VALUES ($1)', [name.trim()])
  return res.status(201).json({ success: true })
})
