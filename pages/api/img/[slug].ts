import type { NextApiRequest, NextApiResponse } from 'next'
import { queryOne } from '@/lib/db'
import { s3Download, s3Upload, s3Exists } from '@/lib/objectStorage'

/**
 * GET /api/img/{slug}
 * Serves celebrity images from S3, falling back to Wikimedia.
 * First request fetches from Wikimedia → stores in S3 → serves to user.
 * Subsequent requests serve directly from S3.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const slug = req.query.slug as string
  if (!slug) return res.status(400).end()

  const s3Key = `celebrities/${slug}.jpg`

  try {
    // 1. Look up the image URL first. Clearing image_url in the DB (e.g. a
    //    photo deleted from Commons over copyright) must stop the S3 copy too.
    const celeb = await queryOne<{ image_url: string | null }>(
      'SELECT image_url FROM celebrities WHERE slug = $1',
      [slug]
    )

    if (!celeb?.image_url) return res.status(404).json({ error: 'Not found' })

    // 2. Try S3
    const cached = await s3Download(s3Key)
    if (cached) {
      res.setHeader('Content-Type', 'image/jpeg')
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      return res.send(cached)
    }

    // 3. Fetch from Wikimedia (10s timeout)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    let response: Response
    try {
      response = await fetch(celeb.image_url, {
        headers: { 'User-Agent': 'BirthChartLibrary/1.0 (https://birthchartlibrary.com)' },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) return res.status(502).json({ error: 'Failed to fetch image' })

    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // 4. Store in S3 (non-blocking)
    s3Upload(s3Key, buffer, contentType).catch(err =>
      console.error(`S3 celebrity image upload failed: ${err.message}`)
    )

    // 5. Serve
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    return res.send(buffer)
  } catch (err) {
    console.error(`Image proxy error for ${slug}:`, err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
