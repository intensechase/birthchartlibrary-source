// Single source of truth for what counts as a "quality" bio — hand-written
// or AI-authored prose, as opposed to the auto-generated template fallback
// (generateCelebrityBio() in lib/interpretations/biography.ts).
//
// Every page that lists/links celebrities (index, category, sign, born-on)
// must filter on this before rendering a clickable link. Template-bio pages
// are noindexed (pages/celebrity-birth-charts/[slug].tsx), but noindex only
// keeps a page out of Google Search's index — it doesn't stop a crawler
// (including AdSense's own review crawler) from following a link to it.
// See docs/GOOGLE-APPROVAL-CHECKLIST-2026-07-23.md for the full writeup:
// four separate pages independently linked to noindexed template pages
// before this fix, including the celebrity index page itself.
export const QUALITY_BIO_SOURCES = ['opus', 'hand', 'haiku', 'ai-other'] as const

export function hasQualityBio(bioSource: string | null | undefined): boolean {
  return !!bioSource && (QUALITY_BIO_SOURCES as readonly string[]).includes(bioSource)
}

// SQL fragment for inline use in WHERE clauses, e.g.:
//   `WHERE category ILIKE $1 AND ${QUALITY_BIO_SQL}`
// Safe to inline directly — QUALITY_BIO_SOURCES is a fixed internal
// constant, never user input.
// Same-person duplicates that 301 to a canonical slug (next.config.ts). Their
// rows stay because compare/love pages look them up by slug, but they must
// never be listed, linked or put in a sitemap — a link to them is a redirect
// hop, and two pages for one person is duplicate content.
export const MERGED_CELEB_SLUGS = ['charles-iii', 'prince-charles', 'steph-curry'] as const

// Since 2026-11-09 this is also the rule for whether a celebrity page exists at
// all: pages/celebrity-birth-charts/[slug].tsx returns 404 for anyone who fails
// it (see docs/TEMPLATE-CELEB-REMOVAL-PLAN.md). chart_data is part of the
// rule so nothing links to a person whose page can't render a chart.
export const QUALITY_BIO_SQL = `(bio_source IN ('${QUALITY_BIO_SOURCES.join("','")}') AND chart_data IS NOT NULL AND slug NOT IN ('${MERGED_CELEB_SLUGS.join("','")}'))`

// Whether a celebrity row gets a public page. Same test as QUALITY_BIO_SQL.
export function isServedCelebrity(row: { bio_source: string | null; chart_data: unknown }): boolean {
  return row.chart_data != null && hasQualityBio(row.bio_source)
}

import { query } from '@/lib/db'

// Slugs that have a public page, for filtering links built from files
// (celebrity-couples.csv) rather than queries. Cached per server process.
let servedSlugCache: { at: number; slugs: Set<string> } | null = null
export async function getServedCelebritySlugs(): Promise<Set<string>> {
  if (servedSlugCache && Date.now() - servedSlugCache.at < 10 * 60 * 1000) return servedSlugCache.slugs
  const rows = await query<{ slug: string }>(`SELECT slug FROM celebrities WHERE ${QUALITY_BIO_SQL}`)
  servedSlugCache = { at: Date.now(), slugs: new Set(rows.map(r => r.slug)) }
  return servedSlugCache.slugs
}
import { VERIFIED_RATINGS, type VerifiedRating } from '@/lib/birth-time-source'

interface ListableCelebritiesOptions {
  columns: string
  // Extra WHERE condition beyond the image/quality-bio filters below, using
  // $1, $2... placeholders. Omit for "no extra condition."
  where?: string
  params?: unknown[]
  orderBy: string
  limit?: number
  // Most listing pages require a photo; a few (born-on/[date].tsx) split
  // results into with/without-photo groups instead of filtering, so this
  // defaults to true and those pages opt out explicitly.
  requireImage?: boolean
}

// Every page that lists/links celebrities goes through this — the point
// isn't just deduplication, it's making the quality-bio filter impossible
// to forget. Twelve call sites independently wrote this filter by hand
// before this helper existed; one of them (the celebrity index page)
// dropped it, which is what caused the original thin-content exposure in
// the first place. See docs/GOOGLE-APPROVAL-CHECKLIST-2026-07-23.md.
export async function getListableCelebrities<T = Record<string, unknown>>(
  opts: ListableCelebritiesOptions
): Promise<T[]> {
  const conditions = [
    opts.where,
    opts.requireImage === false ? null : 'image_url IS NOT NULL',
    QUALITY_BIO_SQL,
  ].filter(Boolean).join(' AND ')
  const limitClause = opts.limit ? `LIMIT ${opts.limit}` : ''

  return query<T>(
    `SELECT ${opts.columns} FROM celebrities
     WHERE ${conditions}
     ORDER BY ${opts.orderBy}
     ${limitClause}`,
    opts.params ?? []
  )
}

export interface PlacementCeleb {
  name: string
  slug: string
  sun_sign: string | null
  image_url: string | null
}

// chart_data is jsonb, but a few old rows may hold the chart as a JSON string
// inside the jsonb (scripts/enrich-celebrities.ts guards for it), so unwrap that.
const CHART_JSON = `(CASE WHEN jsonb_typeof(chart_data) = 'string' THEN (chart_data #>> '{}')::jsonb ELSE chart_data END)`

// People whose stored chart has this planet in this sign, or in this house.
// House placements need a known birth time. Without one the chart is cast for
// noon, and the Moon moves about 13 degrees a day, so its noon sign can be off
// by up to about 6.5 degrees; such Moons only count when 7+ degrees from either
// edge of the sign.
export function getCelebritiesWithPlacement(
  planetKey: string,
  placement: { sign: string } | { house: number },
  limit = 8
): Promise<PlacementCeleb[]> {
  const isHouse = 'house' in placement
  const match = isHouse
    ? `birth_time IS NOT NULL AND p->>'house' = $2`
    : `p->>'sign' = $2 AND (p->>'planet' <> 'MOON' OR birth_time IS NOT NULL OR (p->>'signDegree')::float BETWEEN 7 AND 23)`
  return getListableCelebrities<PlacementCeleb>({
    columns: 'name, slug, sun_sign, image_url',
    where: `chart_data IS NOT NULL AND EXISTS (
      SELECT 1 FROM jsonb_array_elements(${CHART_JSON}->'planets') p
      WHERE p->>'planet' = $1 AND ${match}
    )`,
    params: [planetKey, isHouse ? String(placement.house) : placement.sign],
    orderBy: 'RANDOM()',
    limit,
  })
}

export interface RatedCeleb {
  name: string
  slug: string
  sun_sign: string | null
  rating: VerifiedRating
}

// Featured charts whose birth time has an AA, A or B rating from Astro-Databank.
export function getRatedCelebrities(): Promise<RatedCeleb[]> {
  return getListableCelebrities<RatedCeleb>({
    columns: "name, slug, sun_sign, metadata::jsonb->>'rodden_rating' AS rating",
    where: "birth_time IS NOT NULL AND chart_data IS NOT NULL AND metadata::jsonb->>'rodden_rating' = ANY($1::text[])",
    params: [[...VERIFIED_RATINGS]],
    orderBy: 'name',
    requireImage: false,
  })
}

export interface ChartCoverage {
  AA: number
  A: number
  B: number
  unverified: number
  noTime: number
  total: number
}

// How the featured charts break down by birth time source. Counted live so the
// method page can't drift from the data.
export async function getChartCoverage(): Promise<ChartCoverage> {
  const rows = await query<{ bucket: string; count: number }>(
    `SELECT CASE
              WHEN birth_time IS NULL THEN 'noTime'
              WHEN metadata::jsonb->>'rodden_rating' = ANY($1::text[]) THEN metadata::jsonb->>'rodden_rating'
              ELSE 'unverified'
            END AS bucket,
            COUNT(*)::int AS count
       FROM celebrities
      WHERE ${QUALITY_BIO_SQL} AND chart_data IS NOT NULL
      GROUP BY 1`,
    [[...VERIFIED_RATINGS]]
  )
  const coverage: ChartCoverage = { AA: 0, A: 0, B: 0, unverified: 0, noTime: 0, total: 0 }
  for (const { bucket, count } of rows) {
    if (bucket in coverage) coverage[bucket as keyof ChartCoverage] = count
    coverage.total += count
  }
  return coverage
}

export interface FeaturedCeleb {
  name: string
  slug: string
  sun_sign: string | null
  image_url: string | null
}

// Hand-picked, in display order: the home page shows the first 8 and the library
// page shows them all. Chosen 2026-11-05 from Bing's Apr-Nov clicks and impressions
// plus widely known names, keeping a mix of categories. Left out on purpose despite
// their traffic: mass murderers and other pages that shouldn't be a site's front door.
export const FEATURED_CELEB_SLUGS = [
  'sandra-bullock', 'tom-hanks', 'taylor-swift', 'michael-jordan',
  'oprah-winfrey', 'marilyn-monroe', 'zendaya', 'elon-musk',
  'hayden-panettiere', 'tom-holland', 'cristiano-ronaldo', 'dolly-parton',
  'beyonce', 'leonardo-dicaprio', 'serena-williams', 'rihanna',
  'princess-diana', 'albert-einstein', 'lana-del-rey', 'prince-harry',
  'gracie-abrams', 'sylvester-stallone', 'shawn-mendes', 'theo-von',
] as const

// Goes through getListableCelebrities, so a page that loses its quality bio drops
// off these lists on the next revalidate instead of leaving a link to a noindexed page.
export function getFeaturedCelebrities(limit?: number): Promise<FeaturedCeleb[]> {
  return getListableCelebrities<FeaturedCeleb>({
    columns: 'name, slug, sun_sign, image_url',
    where: 'slug::text = ANY($1::text[])',
    params: [FEATURED_CELEB_SLUGS.slice(0, limit)],
    orderBy: 'array_position($1::text[], slug::text)',
    requireImage: false,
  })
}
