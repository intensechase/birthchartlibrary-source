import type { GetServerSideProps } from 'next'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { query } from '@/lib/db'

// Tier-A celebrity sitemap: pages with a unique, human-quality bio.
// Filters on bio_source IN ('hand','opus','haiku','ai-other') when the
// column exists; falls back to bio_locked = true if migration 0008 has
// not yet been applied.
//
// Template-generated bio_extended (the 53K formulaic bios that Google
// rejected as "Crawled - currently not indexed") are intentionally NOT
// promoted here. They remain indexable; we just don't tell Google to
// prioritize them.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://birthchartlibrary.com'

  type Row = { slug: string; lastmod: string | null }
  let rows: Row[] = []

  // Primary query: bio_source-based (requires migration 0008)
  try {
    rows = await query<Row>(
      `SELECT slug, COALESCE(updated_at, created_at)::text AS lastmod
         FROM celebrities
        WHERE ${QUALITY_BIO_SQL}
          AND chart_data IS NOT NULL
        ORDER BY COALESCE(updated_at, created_at) DESC NULLS LAST
        LIMIT 5000`
    )
  } catch {
    // Fallback 1: bio_locked-based (migration 0008 not applied yet)
    try {
      rows = await query<Row>(
        `SELECT slug, COALESCE(updated_at, created_at)::text AS lastmod
           FROM celebrities
          WHERE bio_locked = true
            AND chart_data IS NOT NULL
          ORDER BY COALESCE(updated_at, created_at) DESC NULLS LAST
          LIMIT 5000`
      )
    } catch {
      // Fallback 2: updated_at also missing (migration 0007 not applied)
      rows = await query<Row>(
        `SELECT slug, created_at::text AS lastmod
           FROM celebrities
          WHERE bio_locked = true
            AND chart_data IS NOT NULL
          ORDER BY created_at DESC NULLS LAST
          LIMIT 5000`
      ).catch(() => [] as Row[])
    }
  }

  const now_iso = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.map(r => `  <url>
    <loc>${baseUrl}/celebrity-birth-charts/${r.slug}</loc>
    <lastmod>${r.lastmod ? new Date(r.lastmod).toISOString().split('T')[0] : now_iso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function SitemapCelebsFeatured() { return null }
