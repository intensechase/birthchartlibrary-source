import type { GetServerSideProps } from 'next'

// Interpretation-matrix sitemap — Matrix B CALIBRATED planets ONLY.
//
// CRITICAL: the `interpretations` table pre-fills a full 144-cell "combined" matrix
// for ALL 12 planets, so cell-presence does NOT indicate the calibrated voice —
// a data-completeness query would wrongly green-light all ~288 combo pages, re-exposing
// 9 planets of templated text to Google and risking re-trigger of the scaled-content
// demotion we are recovering from (see docs / project memory: index collapse 2026-06).
//
// The only trustworthy "calibrated" signal is what has shipped:
// scripts/port-matrix-b-<planet>.mjs + lib/interpretations/<planet>.ts.
//
// "No partials": add a planet to CALIBRATED_PLANETS ONLY when its complete 144-cell
// matrix has shipped. All 12 planets are now done. Each planet adds 24 URLs
// (12 sign rows + 12 house columns). Total: 288 URLs.
const CALIBRATED_PLANETS = ['saturn', 'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'uranus', 'neptune', 'pluto', 'north-node', 'chiron']

const SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://birthchartlibrary.com'

  const urls: string[] = []
  for (const planet of CALIBRATED_PLANETS) {
    // Planet-in-sign — complete rows (all 12 houses written)
    for (const sign of SIGNS) urls.push(`${baseUrl}/interpretations/${planet}-in-${sign}`)
    // Planet-in-house — complete columns (all 12 signs written)
    for (let h = 1; h <= 12; h++) urls.push(`${baseUrl}/interpretations/${planet}-in-house-${h}`)
  }

  // Matrix B shipped 2026-06-17 — lastmod tells Bing the content changed and
  // is worth a fresh crawl. Priority raised to 0.8: these are unique calibrated
  // entries, not templated content.
  const MATRIX_B_DATE = '2026-06-17'

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>${MATRIX_B_DATE}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function SitemapInterpretations() { return null }
