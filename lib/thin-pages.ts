// Page types held out of search (noindex,follow + left out of the sitemap)
// while their text is mostly templated. From the 2026-10-15 audit of every
// sitemap URL:
//   - chineseZodiacYear (124 pages): /chinese-zodiac/year/1960 shares ~68% of
//     its sentences with /chinese-zodiac/rat.
//   - horoscopeSign (12 pages): sign pages are ~87% identical to each other.
//   - bornOn (366 pages): median ~230 words, ~22% template sentences.
// Added 2026-11-05: dated archive pages Google could index but that were never in
// a sitemap. Bing's Apr-Nov 2026 pages report shows no clicks for either type.
//   - daily: /daily/2026-02-25 and so on.
//   - celebritySpotlight: /celebrity-spotlight/2026-01-07 and so on.
// Google judges sites partly on their share of thin/duplicated pages, and BCL
// has been rejected by AdSense twice for "low value content". Links stay
// followable, so these pages still pass crawl paths to the rest of the site.
//
// Flip a type to false once its pages carry genuinely unique text.
export const NOINDEX_THIN = {
  chineseZodiacYear: true,
  horoscopeSign: true,
  bornOn: true,
  daily: true,
  celebritySpotlight: true,
  // Added 2026-11-10: weekly forecast pages are generated from planet positions
  // with shared template text, like the daily pages.
  thisWeek: true,
} as const

// Blog series held out of search (noindex,follow, out of the sitemap and off the
// home page). Added 2026-11-10: the 12 "Year of the X" posts run ~250 words and
// repeat the Chinese zodiac animal pages. Remove a prefix once its posts are rewritten.
export const NOINDEX_BLOG_PREFIXES = ['year-of-the-'] as const
export const NOINDEX_BLOG_SQL = `(${NOINDEX_BLOG_PREFIXES.map(p => `slug NOT LIKE '${p}%'`).join(' AND ')})`
export function isNoindexBlogSlug(slug: string): boolean {
  return NOINDEX_BLOG_PREFIXES.some(p => slug.startsWith(p))
}
