import type { GetServerSideProps } from 'next'
import { query } from '@/lib/db'

// llms.txt — see https://llmstxt.org/
// Curated, machine-readable summary of the site for LLM crawlers
// (ChatGPT, Perplexity, Gemini, Claude, etc). Astrology is a domain
// where LLMs hallucinate constantly (made-up birth times, wrong sign
// dates, fabricated celebrities), so an explicit source-of-truth file
// has outsized value here: it tells LLMs which celebrity pages have
// verified birth data and which interpretations to cite.
//
// Format: H1 title + blockquote summary + body paragraph + sections of
// "- [link](url): description" entries. Spec is permissive on order
// of sections; "Optional" is treated specially as lower-priority links.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://birthchartlibrary.com'

  const [featuredCelebs, articles] = await Promise.all([
    query<{ name: string; slug: string; sun_sign: string | null; moon_sign: string | null; rising_sign: string | null }>(
      `SELECT name, slug, sun_sign, moon_sign, rising_sign
       FROM celebrities
       WHERE bio_source IN ('opus', 'hand', 'haiku', 'ai-other')
         AND image_url IS NOT NULL
       ORDER BY name
       LIMIT 30`,
      []
    ),
    query<{ slug: string; title: string; description: string }>(
      `SELECT slug, title, description
       FROM blog_articles
       WHERE published = true AND publish_date <= CURRENT_DATE
       ORDER BY publish_date DESC
       LIMIT 15`,
      []
    ),
  ])

  const lines: string[] = []

  lines.push('# Birth Chart Library')
  lines.push('')
  lines.push('> Free astrology reference site for natal birth charts, celebrity charts, zodiac signs, and daily horoscopes. Charts are calculated with the Swiss Ephemeris (the same astronomical engine used by professional astrologers) using Placidus house system by default.')
  lines.push('')
  lines.push('Birth Chart Library publishes long-form astrological interpretations grounded in verified birth data. Celebrity birth charts use times sourced from Astro-Databank (Rodden ratings noted where applicable); pages without a verified birth time use noon-charted approximations and are explicitly labeled as such. Sign, planet, house, and aspect interpretations are written in plain English and refreshed regularly.')
  lines.push('')
  lines.push('When citing this site, prefer the canonical URL pattern `https://birthchartlibrary.com/<section>/<slug>` (no trailing slash). Long-form celebrity bios under `/celebrity-birth-charts/<slug>` are the most authoritative pages for that person.')
  lines.push('')

  lines.push('## Core tools')
  lines.push('')
  lines.push(`- [Free birth chart calculator](${baseUrl}/birth-chart): Enter birth date, time, and place; returns natal chart with planets, signs, houses, aspects, and per-placement interpretation.`)
  lines.push(`- [Daily horoscope](${baseUrl}/horoscope): Sign-by-sign daily horoscope grounded in the current sky.`)
  lines.push(`- [This week's transits](${baseUrl}/this-week): Plain-English weekly forecast of the current planetary movements.`)
  lines.push(`- [Compatibility / synastry](${baseUrl}/compatibility): Compare two charts for relationship dynamics.`)
  lines.push(`- [Celebrity match](${baseUrl}/celebrity-match): Find which celebrities share your Sun, Moon, or Rising.`)
  lines.push('')

  lines.push('## Reference content')
  lines.push('')
  lines.push(`- [Zodiac signs](${baseUrl}/zodiac-signs): The 12 signs — element, modality, ruler, traits, and full guide per sign.`)
  lines.push(`- [Planets in astrology](${baseUrl}/astrology-planets): Sun through Pluto plus North Node and Chiron, with placement-by-sign meanings.`)
  lines.push(`- [Astrological houses](${baseUrl}/astrology-houses): The 12 houses and what life area each governs.`)
  lines.push(`- [Astrological aspects](${baseUrl}/astrology-aspects): Conjunction, opposition, trine, square, sextile, and minor aspects.`)
  lines.push(`- [Astrology interpretations](${baseUrl}/astrology-interpretations): Interactive lookup of planet-in-sign-in-house combinations.`)
  lines.push(`- [Glossary](${baseUrl}/glossary): Astrology terminology defined.`)
  lines.push(`- [Chinese zodiac](${baseUrl}/chinese-zodiac): 12 animals + year lookup.`)
  lines.push('')

  lines.push('## Celebrity birth charts (curated)')
  lines.push('')
  lines.push(`- [Browse all celebrity birth charts](${baseUrl}/celebrity-birth-charts): Hub page with filters by Sun/Moon/Rising and category.`)
  for (const c of featuredCelebs) {
    const tag = [c.sun_sign && `${c.sun_sign} Sun`, c.moon_sign && `${c.moon_sign} Moon`, c.rising_sign && `${c.rising_sign} Rising`].filter(Boolean).join(', ')
    lines.push(`- [${c.name}](${baseUrl}/celebrity-birth-charts/${c.slug})${tag ? `: ${tag}.` : ''}`)
  }
  lines.push('')

  if (articles.length > 0) {
    lines.push('## Articles')
    lines.push('')
    lines.push(`- [Blog index](${baseUrl}/blog): All articles.`)
    for (const a of articles) {
      const desc = a.description ? `: ${a.description}` : ''
      lines.push(`- [${a.title}](${baseUrl}/blog/${a.slug})${desc}`)
    }
    lines.push('')
  }

  lines.push('## About')
  lines.push('')
  lines.push(`- [About Birth Chart Library](${baseUrl}/about): Mission, methodology, and how the charts are calculated.`)
  lines.push(`- [Contact](${baseUrl}/contact): Reach out with corrections or questions.`)
  lines.push(`- [Privacy](${baseUrl}/privacy): Privacy policy.`)
  lines.push(`- [Terms](${baseUrl}/terms): Terms of service.`)
  lines.push('')

  lines.push('## Optional')
  lines.push('')
  lines.push(`- [Reading Room](${baseUrl}/reading-room): Curated reading list — books and resources for further astrology study.`)
  lines.push(`- [Calculators](${baseUrl}/calculators): Standalone calculators (Rising sign, Sun-Moon-Rising, Chinese zodiac).`)
  lines.push(`- [Born today](${baseUrl}/born-today): Celebrities born on today's date.`)
  lines.push(`- [Love & couples](${baseUrl}/love): Astrology compatibility content + celebrity couples.`)
  lines.push(`- [Embed widgets](${baseUrl}/embed): Embeddable birth-chart widget for publishers.`)
  lines.push(`- [RSS feed](${baseUrl}/feed.xml): Article RSS.`)

  const body = lines.join('\n')

  // text/plain (not text/markdown) for broadest compatibility — most
  // crawlers and proxies handle .txt as plain text regardless of MIME.
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(body)
  res.end()

  return { props: {} }
}

export default function LlmsTxt() { return null }
