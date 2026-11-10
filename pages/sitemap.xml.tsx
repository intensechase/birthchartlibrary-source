import type { GetServerSideProps } from 'next'

// Sitemap index — Phase 1 of the indexing-recovery plan.
//
// We submit ONLY high-signal sitemaps to Google: the main hub/category index,
// and the Tier-A "featured" celebrity sitemap (celebrities with rich,
// hand-written / AI-enriched bio_extended). The paginated /sitemap-celebs/[n]
// route remains live (so any prior Google references still resolve), but it
// is intentionally unlinked here until Tier-A indexes at >80% and we promote
// Tier-B into the index.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://birthchartlibrary.com'

  const sitemaps = [
    `${baseUrl}/sitemap-main.xml`,
    `${baseUrl}/sitemap-celebs-featured.xml`,
    // Matrix B calibrated interpretation pages (Saturn/Sun/Moon only — see
    // sitemap-interpretations.xml.tsx for the no-partials gate). Easy to pull
    // back out of the index if the scaled-content recovery regresses.
    `${baseUrl}/sitemap-interpretations.xml`,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap><loc>${url}</loc></sitemap>`).join('\n')}
</sitemapindex>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function SitemapIndex() { return null }
