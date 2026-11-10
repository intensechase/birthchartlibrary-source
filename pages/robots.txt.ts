import type { GetServerSideProps } from 'next'
import { query } from '@/lib/db'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'

// Dynamic robots.txt (replaces the old static public/robots.txt) so the
// Mediapartners-Google group below can list the current quality-bio slugs
// live from the DB, rather than a static list that goes stale as bios get
// upgraded from template to quality.
//
// Why a whole extra user-agent group instead of one shared Disallow: quality
// and template bios both live at /celebrity-birth-charts/[slug] — there's no
// URL pattern that separates them, so a single Disallow can't target template
// pages without also hitting quality ones. Instead: disallow the whole
// /celebrity-birth-charts/ tree for Mediapartners-Google specifically, then
// Allow back the ~443 quality slugs by name (a far shorter, more
// maintainable list than trying to Disallow ~53,000 template slugs).
//
// Per the robots.txt spec, a crawler with its own matching named group uses
// ONLY that group — it does not also inherit rules from User-agent: *. So
// every general Disallow below is duplicated into the Mediapartners-Google
// group; skipping that would accidentally re-open /api/, /admin, etc. to
// AdSense's crawler.
//
// This does not affect Googlebot, Bingbot, or any other crawler — only the
// Mediapartners-Google user-agent gets the extra restriction. See
// docs/GOOGLE-APPROVAL-CHECKLIST-2026-07-23.md for the full investigation
// this fix is closing out.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let qualitySlugs: string[] = []
  try {
    const rows = await query<{ slug: string }>(
      `SELECT slug FROM celebrities WHERE ${QUALITY_BIO_SQL} ORDER BY slug ASC`
    )
    qualitySlugs = rows.map(r => r.slug)
  } catch {
    // DB unavailable — fail safe by disallowing the entire celebrity tree
    // for Mediapartners-Google rather than serving a broken/empty Allow
    // list that would accidentally open every template page.
    qualitySlugs = []
  }

  const generalRules = [
    'Allow: /',
    'Allow: /api/og',
    'Disallow: /api/',
    'Disallow: /account',
    'Disallow: /admin',
    'Disallow: /daily-horoscope',
    'Disallow: /birth-chart',
    'Disallow: /login',
    'Disallow: /signup',
    'Disallow: /celebrity-birth-charts?*',
    'Disallow: /opengraph-image',
  ]

  const adsenseCelebrityRules = [
    'Disallow: /celebrity-birth-charts/',
    'Allow: /celebrity-birth-charts/category/',
    'Allow: /celebrity-birth-charts/sign/',
    'Allow: /celebrity-birth-charts/compare/',
    ...qualitySlugs.map(slug => `Allow: /celebrity-birth-charts/${slug}`),
  ]

  const lines = [
    'User-agent: *',
    ...generalRules,
    '',
    '# AdSense review crawler — additionally restricted to quality-bio',
    '# celebrity pages only. See docs/GOOGLE-APPROVAL-CHECKLIST-2026-07-23.md',
    'User-agent: Mediapartners-Google',
    ...generalRules,
    ...adsenseCelebrityRules,
    '',
    'Sitemap: https://birthchartlibrary.com/sitemap.xml',
  ]

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  res.write(lines.join('\n'))
  res.end()
  return { props: {} }
}

export default function Robots() { return null }
