// Auto-links mentions of astrology terms in article content to relevant pages.
// Tactful: max 5 links per article, only first occurrence, longest match first.

const LINKS: Record<string, string> = {
  // Signs (only link the sign name, not every mention)
  'Aries': '/zodiac-signs/aries',
  'Taurus': '/zodiac-signs/taurus',
  'Gemini': '/zodiac-signs/gemini',
  'Cancer': '/zodiac-signs/cancer',
  'Leo': '/zodiac-signs/leo',
  'Virgo': '/zodiac-signs/virgo',
  'Libra': '/zodiac-signs/libra',
  'Scorpio': '/zodiac-signs/scorpio',
  'Sagittarius': '/zodiac-signs/sagittarius',
  'Capricorn': '/zodiac-signs/capricorn',
  'Aquarius': '/zodiac-signs/aquarius',
  'Pisces': '/zodiac-signs/pisces',
  // Concepts (high value links)
  'birth chart': '/birth-chart',
  'rising sign': '/calculators/rising-sign',
  'Big Three': '/calculators/sun-moon-rising',
  'Chinese zodiac': '/chinese-zodiac',
  'Mercury retrograde': '/blog/mercury-retrograde-meaning',
  'stellium': '/blog/stellium-meaning-astrology',
  'Saturn return': '/glossary#saturn-return',
  'solar return': '/glossary#solar-return',
  'synastry': '/glossary#synastry',
  'transit': '/glossary#transit',
  'conjunction': '/glossary#conjunction',
  'opposition': '/glossary#opposition',
  'glossary': '/glossary',
}

const MAX_LINKS = 5

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// What has been linked so far in one article. Plain-text articles are linked a
// paragraph at a time, so they pass one state through every call; without it
// the first-mention rule and the MAX_LINKS cap started over in each paragraph.
export interface AutoLinkState {
  linked: Set<string>
  count: number
}

export function newAutoLinkState(): AutoLinkState {
  return { linked: new Set(), count: 0 }
}

/**
 * Auto-links up to MAX_LINKS terms in the text. First occurrence only.
 * Returns HTML string. Skips the article's own topic to avoid self-linking.
 * Optional extraLinks map adds dynamic links (e.g., celebrity names).
 * Pass the same state to every call for one article.
 */
export function autoLinkContent(
  text: string,
  skipTerms: string[] = [],
  extraLinks?: Record<string, string>,
  state: AutoLinkState = newAutoLinkState()
): string {
  const allLinks = extraLinks ? { ...LINKS, ...extraLinks } : LINKS
  const { linked } = state
  let result = text

  const skipLower = skipTerms.map(s => s.toLowerCase())
  const terms = Object.keys(allLinks)
    .filter(t => !skipLower.includes(t.toLowerCase()))
    .sort((a, b) => b.length - a.length)

  for (const term of terms) {
    if (state.count >= MAX_LINKS) break
    if (linked.has(term)) continue

    const regex = new RegExp(`(?<![\\w/"-])${escapeRegex(term)}(?![\\w])(?![^<]*</a>)`)

    if (regex.test(result)) {
      const href = allLinks[term]
      // Only allow internal links (prevent XSS if map is ever modified)
      if (!href.startsWith('/')) continue
      result = result.replace(regex, `<a href="${href}" class="text-slate-600 underline decoration-slate-300 hover:decoration-slate-600 transition-colors">$&</a>`)
      linked.add(term)
      state.count++
    }
  }

  return result
}
