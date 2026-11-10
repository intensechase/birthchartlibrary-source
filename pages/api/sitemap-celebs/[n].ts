import type { NextApiRequest, NextApiResponse } from 'next'

// Legacy paginated celebrity sitemap (replaced 2026-05-16 by
// /sitemap-celebs-featured.xml). It listed every celebrity row, including the
// template-bio pages that now 404 (docs/TEMPLATE-CELEB-REMOVAL-PLAN.md), so it
// answers 410 Gone for any shard Google still remembers.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  res.status(410).end()
}
