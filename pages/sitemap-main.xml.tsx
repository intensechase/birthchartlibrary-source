import type { GetServerSideProps } from 'next'
import { query } from '@/lib/db'
import { NOINDEX_THIN, NOINDEX_BLOG_SQL } from '@/lib/thin-pages'

// Tier-A pillar sitemap — Phase 1+2 of the indexing-recovery plan.
//
// Phase 1: scope to Tier A only (was 1,422 URLs, now ~230). The bulk of
// templated combinatorial content was removed from sitemap advertisement
// (still indexable by Bing/DDG via crawl — just no signal to Google).
//
// Phase 2: changefreq + priority calibrated to reality so Google can
// trust the sitemap. Google compares declared changefreq to observed
// lastmod; lying inflates one and the algorithm discounts the whole
// sitemap. Tiers used:
//   daily   — content rotates every day (horoscopes, born-today, home)
//   weekly  — hub pages that gain new featured items (~weekly cadence)
//   monthly — pages with periodic additions (glossary)
//   yearly  — interpretive content that's essentially static after publish
//
// lastmod is only set where we genuinely know the page was updated
// (blog articles from DB, daily-content pages where the rotation is
// the change). For interpretive evergreen content, we omit lastmod
// rather than claim a fresh date — that's the honest signal.
//
// Priority tiering (subjective hint, less weighted by Google than it
// used to be, but still respected by Bing):
//   1.0  — homepage, daily-changing hub
//   0.95 — top-level category indexes
//   0.9  — pillar content that ranks for high-intent queries
//   0.85 — sign/planet/house secondary pillars
//   0.8  — interpretive sub-content (love articles, chinese-zodiac animals)
//   0.7  — blog (varies in quality)
//   0.5  — utility pages (about, embed, celebrity-match)
//   0.3  — legal/feed (privacy, terms, feed.xml)
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://birthchartlibrary.com'

  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'north_node', 'chiron']
  const houses = Array.from({ length: 12 }, (_, i) => String(i + 1))

  const today = new Date().toISOString().split('T')[0]

  // lastmod is included only where the page's *content* actually changes
  // on or before that date. For static interpretive pages, we omit it
  // rather than claim a fresh date that doesn't reflect reality.
  type Url = { url: string; changefreq: string; priority: number; lastmod?: string }

  const urls: Url[] = [
    // Hub + category index pages
    { url: baseUrl, changefreq: 'daily', priority: 1.0, lastmod: today },
    { url: `${baseUrl}/horoscope`, changefreq: 'daily', priority: 1.0, lastmod: today },
    { url: `${baseUrl}/born-today`, changefreq: 'daily', priority: 0.9, lastmod: today },
    { url: `${baseUrl}/celebrity-birth-charts`, changefreq: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/celebrity-birth-charts/rated-birth-times`, changefreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/love/celebrity-couples`, changefreq: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/love`, changefreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/glossary`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/reading-room`, changefreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/zodiac-signs`, changefreq: 'yearly', priority: 0.95 },
    { url: `${baseUrl}/astrology-planets`, changefreq: 'yearly', priority: 0.95 },
    { url: `${baseUrl}/astrology-houses`, changefreq: 'yearly', priority: 0.95 },
    { url: `${baseUrl}/astrology-aspects`, changefreq: 'yearly', priority: 0.9 },
    { url: `${baseUrl}/astrology-interpretations`, changefreq: 'yearly', priority: 0.95 },
    { url: `${baseUrl}/compatibility`, changefreq: 'yearly', priority: 0.95 },
    { url: `${baseUrl}/chinese-zodiac`, changefreq: 'yearly', priority: 0.9 },
    { url: `${baseUrl}/calculators`, changefreq: 'yearly', priority: 0.9 },
    { url: `${baseUrl}/calculators/rising-sign`, changefreq: 'yearly', priority: 0.9 },
    { url: `${baseUrl}/calculators/sun-moon-rising`, changefreq: 'yearly', priority: 0.9 },
    { url: `${baseUrl}/calculators/synastry`, changefreq: 'yearly', priority: 0.9 },
    { url: `${baseUrl}/calculators/chinese-zodiac`, changefreq: 'yearly', priority: 0.85 },
    { url: `${baseUrl}/celebrity-match`, changefreq: 'yearly', priority: 0.8 },
    { url: `${baseUrl}/start`, changefreq: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/embed`, changefreq: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/about`, changefreq: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/method`, changefreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changefreq: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/feed.xml`, changefreq: 'daily', priority: 0.3, lastmod: today },
    { url: `${baseUrl}/privacy`, changefreq: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changefreq: 'yearly', priority: 0.3 },
  ]

  // Per-sign pillars
  // - zodiac-signs: interpretive evergreen (yearly cadence is honest)
  // - horoscope: rotates daily by design
  // - compatibility: interpretive evergreen
  signs.forEach(s => urls.push({ url: `${baseUrl}/zodiac-signs/${s}`, changefreq: 'yearly', priority: 0.9 }))
  if (!NOINDEX_THIN.horoscopeSign) signs.forEach(s => urls.push({ url: `${baseUrl}/horoscope/${s}`, changefreq: 'daily', priority: 0.9, lastmod: today }))
  signs.forEach(s => urls.push({ url: `${baseUrl}/compatibility/${s}`, changefreq: 'yearly', priority: 0.85 }))

  // Planet pillars — interpretive evergreen
  planets.forEach(p => urls.push({ url: `${baseUrl}/astrology-planets/${p}`, changefreq: 'yearly', priority: 0.85 }))

  // House pillars — interpretive evergreen
  houses.forEach(h => urls.push({ url: `${baseUrl}/astrology-houses/${h}`, changefreq: 'yearly', priority: 0.85 }))

  // Aspect pillars — interpretive evergreen
  const aspects = ['conjunction', 'sextile', 'square', 'trine', 'opposition']
  aspects.forEach(a => urls.push({ url: `${baseUrl}/astrology-aspects/${a}`, changefreq: 'yearly', priority: 0.85 }))

  // Chinese-zodiac animal hubs — interpretive evergreen
  const czAnimals = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig']
  czAnimals.forEach(a => urls.push({ url: `${baseUrl}/chinese-zodiac/${a}`, changefreq: 'yearly', priority: 0.8 }))

  // Chinese-zodiac YEAR hubs (1924–2047) — highest-leverage / most AI-cited pages.
  // Mirrors getStaticPaths in pages/chinese-zodiac/year/[year].tsx (124 pages, fallback:false).
  const czYears = Array.from({ length: 124 }, (_, i) => 1924 + i)
  if (!NOINDEX_THIN.chineseZodiacYear) czYears.forEach(y => urls.push({ url: `${baseUrl}/chinese-zodiac/year/${y}`, changefreq: 'yearly', priority: 0.85 }))

  // Celebrity sign hubs — curated Tier-A celebs grouped by Sun sign (indexable,
  // /celebrity-birth-charts/sign/[sign]). Previously omitted from the sitemap.
  signs.forEach(s => urls.push({ url: `${baseUrl}/celebrity-birth-charts/sign/${s}`, changefreq: 'weekly', priority: 0.8 }))

  // Astrology-interpretations planet pillars — interpretive evergreen
  const planetSlugs = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'north-node', 'chiron']
  planetSlugs.forEach(p => urls.push({ url: `${baseUrl}/astrology-interpretations/${p}`, changefreq: 'yearly', priority: 0.8 }))

  // Curated love articles — interpretive after publish. The list is
  // explicit/hand-picked; each entry is Tier A.
  const loveSlugs = [
    'zendaya-and-tom-holland', 'taylor-swift-and-travis-kelce', 'beyonce-and-jay-z', 'jennifer-aniston-and-brad-pitt',
    'kim-kardashian-and-lewis-hamilton', 'kendall-jenner-and-jacob-elordi', 'ariana-grande-and-ethan-slater',
    'goldie-hawn-and-kurt-russell', 'barack-and-michelle-obama', 'selena-gomez-and-benny-blanco',
    'brad-pitt-and-angelina-jolie', 'blake-lively-and-ryan-reynolds', 'princess-diana-and-prince-charles',
    'dolly-parton-and-carl-dean', 'jennifer-lopez-and-ben-affleck', 'kate-and-prince-william',
    'rihanna-and-asap-rocky', 'steph-and-ayesha-curry', 'patrick-and-brittany-mahomes',
    'ryan-gosling-and-eva-mendes', 'prince-harry-and-meghan-markle', 'david-and-victoria-beckham',
    'maya-hawke-and-christian-lee-hutson', 'aja-wilson-and-bam-adebayo', 'kaia-gerber-and-lewis-pullman',
    'madeleine-petsch-and-tyga', 'venus-williams-and-andrea-preti',
    'elizabeth-taylor-and-richard-burton', 'marilyn-monroe-and-joe-dimaggio', 'marilyn-monroe-and-arthur-miller',
    'john-lennon-and-yoko-ono', 'elvis-and-priscilla-presley', 'jfk-and-jackie-kennedy', 'sonny-and-cher',
    'paul-newman-and-joanne-woodward', 'humphrey-bogart-and-lauren-bacall', 'martin-luther-king-and-coretta-scott-king',
    'justin-and-hailey-bieber', 'kim-kardashian-and-kanye-west', 'miley-cyrus-and-liam-hemsworth',
    'ariana-grande-and-pete-davidson', 'cardi-b-and-offset', 'gigi-hadid-and-zayn-malik',
    'khloe-kardashian-and-tristan-thompson', 'emily-blunt-and-john-krasinski', 'george-and-amal-clooney',
    'nicole-kidman-and-keith-urban', 'kylie-jenner-and-timothee-chalamet', 'harry-styles-and-olivia-wilde',
    'joe-jonas-and-sophie-turner', 'serena-williams-and-alexis-ohanian',
    'lebron-and-savannah-james', 'lionel-messi-and-antonela-roccuzzo', 'cristiano-ronaldo-and-georgina-rodriguez',
    'simone-biles-and-jonathan-owens', 'dwyane-wade-and-gabrielle-union',
    'ellen-degeners-and-portia-de-rossi', 'oprah-and-stedman-graham', 'mila-kunis-and-ashton-kutcher',
    'chris-martin-and-dakota-johnson', 'benedict-cumberbatch-and-sophie-hunter', 'gwyneth-paltrow-and-brad-falchuk',
    'justin-timberlake-and-jessica-biel', 'julia-roberts-and-danny-moder', 'kanye-west-and-bianca-censori',
    'blake-shelton-and-gwen-stefani', 'tom-hanks-and-rita-wilson', 'chip-and-joanna-gaines',
    'elton-john-and-david-furnish', 'pink-and-carey-hart', 'kristen-bell-and-dax-shepard',
    'penelope-cruz-and-javier-bardem', 'paul-mccartney-and-linda-mccartney', 'rafael-nadal-and-xisca-perello',
    'roger-federer-and-mirka-federer', 'king-charles-and-camilla', 'shawn-mendes-and-camila-cabello',
    'sabrina-carpenter-and-barry-keoghan', 'bill-clinton-and-hillary-clinton', 'garth-brooks-and-trisha-yearwood',
    'kurt-cobain-and-courtney-love', 'faith-hill-and-tim-mcgraw', 'lucille-ball-and-desi-arnaz',
    'kim-kardashian-and-pete-davidson', 'spencer-tracy-and-katharine-hepburn',
    'chris-pratt-and-katherine-schwarzenegger', 'idris-elba-and-sabrina-dhowre', 'kevin-hart-and-eniko-hart',
    'tina-fey-and-jeff-richmond', 'sarah-jessica-parker-and-matthew-broderick', 'ronald-reagan-and-nancy-reagan',
    'jimmy-carter-and-rosalynn-carter', 'zoe-saldana-and-marco-perego',
    'kourtney-kardashian-and-travis-barker', 'chrissy-teigen-and-john-legend', 'katy-perry-and-orlando-bloom',
    'priyanka-chopra-and-nick-jonas', 'will-smith-and-jada-pinkett-smith', 'tom-brady-and-gisele-bundchen',
    'megan-fox-and-machine-gun-kelly', 'johnny-cash-and-june-carter-cash', 'adele-and-rich-paul',
    'scorpio-in-love', 'libra-in-love', 'sagittarius-in-love', 'virgo-in-love', 'cancer-in-love', 'leo-in-love',
    'aries-in-love', 'taurus-in-love', 'gemini-in-love', 'capricorn-in-love', 'aquarius-in-love', 'pisces-in-love',
    'moon-sign-compatibility', 'red-flags-by-zodiac-sign',
  ]
  loveSlugs.forEach(s => urls.push({ url: `${baseUrl}/love/${s}`, changefreq: 'yearly', priority: 0.8 }))

  // Compatibility pair pages — 78 unique sign pairings (i <= j).
  // High-intent queries ("aries and taurus compatibility") with real
  // prose content; excluded from sitemap until now despite being live.
  const compSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
  for (let i = 0; i < compSigns.length; i++) {
    for (let j = i; j < compSigns.length; j++) {
      urls.push({ url: `${baseUrl}/compatibility/${compSigns[i]}-and-${compSigns[j]}`, changefreq: 'yearly', priority: 0.8 })
    }
  }

  // Born-on pages — one per calendar date (366 including Feb 29).
  // Accessible via fallback:blocking SSR-to-SSG; submitting to sitemap
  // surfaces them for "celebrities born on [date]" search traffic.
  const bornOnMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
  const bornOnDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  for (let m = 0; m < 12 && !NOINDEX_THIN.bornOn; m++) {
    for (let d = 1; d <= bornOnDays[m]; d++) {
      urls.push({ url: `${baseUrl}/born-on/${bornOnMonths[m]}-${d}`, changefreq: 'yearly', priority: 0.6 })
    }
  }

  // Blog — hand-written editorial. Each post can be revised after publish,
  // so use lastmod from publish_date (best signal we have).
  const blogArticles = await query<{ slug: string; publish_date: string }>(
    `SELECT slug, publish_date FROM blog_articles WHERE published = true AND publish_date <= NOW() AND ${NOINDEX_BLOG_SQL} ORDER BY publish_date DESC`
  ).catch(() => [] as { slug: string; publish_date: string }[])
  urls.push({ url: `${baseUrl}/blog`, changefreq: 'weekly', priority: 0.8, lastmod: today })
  blogArticles.forEach(a => urls.push({
    url: `${baseUrl}/blog/${a.slug}`,
    changefreq: 'yearly',
    priority: 0.7,
    lastmod: a.publish_date ? new Date(a.publish_date).toISOString().split('T')[0] : today,
  }))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.url}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>\n    ` : ''}<changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function SitemapMain() { return null }
