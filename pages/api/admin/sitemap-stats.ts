import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { adminHandler } from '@/lib/apiHandler'

// Tier breakdown + bio_source breakdown of the celebrities table.
//
// Tier A: bio_source IN ('hand','opus','haiku','ai-other')  → Featured sitemap
// Tier B: bio_source = 'template'                            → NOT in sitemap
// Tier C: bio_source IS NULL AND chart_data IS NOT NULL      → NOT in sitemap
// Tier D: chart_data IS NULL                                 → noindex
export default adminHandler(async (_req: NextApiRequest, res: NextApiResponse) => {
  const sources = await query<{ bio_source: string | null; n: string }>(
    `SELECT bio_source, COUNT(*)::text AS n
       FROM celebrities
      GROUP BY bio_source
      ORDER BY bio_source NULLS LAST`
  ).catch(() => null)

  // Fallback if bio_source column doesn't exist yet (migration 0008 pending)
  if (!sources) {
    const fallback = await query<{ tier: string; n: string }>(
      `SELECT
         CASE
           WHEN bio_locked = true       THEN 'locked'
           WHEN bio_extended IS NOT NULL THEN 'template'
           WHEN chart_data   IS NOT NULL THEN 'chart_only'
           ELSE                                'empty'
         END AS tier,
         COUNT(*)::text AS n
       FROM celebrities GROUP BY tier ORDER BY tier`
    ).catch(() => [] as { tier: string; n: string }[])
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      migration_status: 'pre-0008',
      fallback,
      note: 'Run migration 0008 to enable bio_source tracking',
    })
    return
  }

  const bySource: Record<string, number> = {}
  for (const r of sources) bySource[r.bio_source ?? 'NULL'] = parseInt(r.n)

  const promoted   = (bySource.hand || 0) + (bySource.opus || 0) + (bySource.haiku || 0) + (bySource['ai-other'] || 0)
  const template   = bySource.template || 0
  const chartOnly  = bySource.NULL || 0
  const total      = promoted + template + chartOnly

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    migration_status: 'post-0008',
    total,
    sitemap: {
      featured_count: promoted,
      tier_label: 'A — unique bios (hand + AI-written)',
    },
    by_source: bySource,
    tiers: {
      A_featured: { count: promoted,  in_sitemap: true,  label: 'unique bios' },
      B_template: { count: template,  in_sitemap: false, label: 'template-generated' },
      C_chartonly: { count: chartOnly, in_sitemap: false, label: 'chart only, no bio' },
    },
  })
})
