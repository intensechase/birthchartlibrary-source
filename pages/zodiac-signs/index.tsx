import Link from 'next/link'
import Head from 'next/head'
import { SIGNS } from '@/lib/interpretations'
import { getElementColor, SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'

export default function ZodiacSignsPage() {
  const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://birthchartlibrary.com' },
    { name: 'Zodiac Signs', url: 'https://birthchartlibrary.com/zodiac-signs' },
  ])
  // CollectionPage schema with ItemList of the 12 signs — helps Google
  // understand this hub indexes 12 sub-pillars (the per-sign pages).
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Zodiac Signs — Complete Guide to All 12 Signs',
    description: 'Explore all 12 zodiac signs: elements, modalities, ruling planets, and what they reveal about personality, strengths, growth, and compatibility.',
    url: 'https://birthchartlibrary.com/zodiac-signs',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: 12,
      itemListElement: signNames.map((name, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
        url: `https://birthchartlibrary.com/zodiac-signs/${name.toLowerCase()}`,
      })),
    },
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Head>
        <title>Zodiac Signs — Complete Guide to All 12 Signs</title>
        <meta name="description" content="Explore all 12 zodiac signs: elements, modalities, ruling planets, and what they reveal about personality, strengths, growth, and compatibility." />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og/topic?title=Zodiac+Signs&subtitle=Complete+Guide+to+All+12+Signs&symbol=♈&label=Birth+Chart+Library" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collectionPageSchema) }} />
      </Head>

      <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Zodiac Signs</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-2xl">
        The twelve signs of the zodiac each carry a distinct energy that colors how planets express themselves in your chart. Understanding the signs is the first step toward reading any birth chart.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {signNames.map(name => {
          const sign = SIGNS[name]
          if (!sign) return null
          const ec = getElementColor(name)
          return (
            <Link
              key={name}
              href={`/zodiac-signs/${name.toLowerCase()}`}
              className={`card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group border-l-4 ${ec.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl text-slate-900 dark:text-white">{sign.symbol}</span>
                <div>
                  <p className="font-semibold text-lg group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{name}</p>
                  <p className="text-xs text-slate-400"><span className={ec.text}>{sign.element}</span> · {sign.modality} · {sign.ruledBy}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sign.keywords.slice(0, 4).map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">{k}</span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
