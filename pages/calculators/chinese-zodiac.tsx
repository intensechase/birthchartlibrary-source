import Head from 'next/head'
import Link from 'next/link'
import ChineseZodiacCalculator from '@/components/calculators/ChineseZodiacCalculator'
import { breadcrumbSchema, toolSchema, howToSchema, jsonLd } from '@/lib/schema'

export default function ChineseZodiacPage() {
  return (
    <>
      <Head>
        <title>Chinese Zodiac Calculator — Find Your Animal Sign &amp; Element Free | Birth Chart Library</title>
        <meta name="description" content="Discover your Chinese zodiac animal and element based on your birth year. Free calculator with detailed descriptions of all 12 animals and 5 elements." />
        <link rel="canonical" href="https://birthchartlibrary.com/calculators/chinese-zodiac" />
        <meta property="og:title" content="Chinese Zodiac Calculator — Find Your Animal Sign & Element Free" />
        <meta property="og:description" content="Find your Chinese zodiac animal sign and element. Free calculator covering all 12 animals (Rat through Pig) with the 5 elements." />
        <meta property="og:url" content="https://birthchartlibrary.com/calculators/chinese-zodiac" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Calculators', url: 'https://birthchartlibrary.com/calculators' },
        { name: 'Chinese Zodiac Calculator', url: 'https://birthchartlibrary.com/calculators/chinese-zodiac' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(toolSchema({
        name: 'Chinese Zodiac Calculator',
        description: 'Free Chinese zodiac calculator. Enter your birth year to find your animal sign (Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, or Pig) and your element.',
        url: 'https://birthchartlibrary.com/calculators/chinese-zodiac',
        keywords: 'chinese zodiac calculator, what is my chinese zodiac, chinese animal sign, chinese zodiac element, free chinese zodiac',
      })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema({
        name: 'How to Find Your Chinese Zodiac Animal and Element',
        description: 'Calculate your Chinese zodiac animal sign and the element (Wood, Fire, Earth, Metal, or Water) associated with your birth year.',
        totalTime: 'PT1M',
        url: 'https://birthchartlibrary.com/calculators/chinese-zodiac',
        steps: [
          { name: 'Enter your birth date', text: 'Type your full birth date. The Chinese zodiac year does not start on January 1, so the date is needed for births in January or early February.' },
          { name: 'Submit the form', text: 'Click Calculate to determine your Chinese zodiac animal and element.' },
          { name: 'Read your results', text: 'Your animal sign (one of 12) and your element (one of 5) appear together with a short description of their traditional meaning.' },
        ],
      })) }} />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/calculators" className="hover:text-slate-600 dark:hover:text-slate-300">Calculators</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Chinese Zodiac</span>
        </nav>

        <h1 className="font-display text-4xl tracking-wide mb-2">Chinese Zodiac Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          The Chinese zodiac assigns an animal and element to each year in a 60-year cycle. Your animal reveals your personality archetype — your element adds a layer of nuance about how that archetype expresses. Enter your birth year to discover yours.
        </p>

        <ChineseZodiacCalculator />

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Explore further</p>
          <Link href="/chinese-zodiac" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Chinese Zodiac Guide</p>
            <p className="text-xs text-slate-400 mt-0.5">All 12 animals with compatibility, elements, and mythology</p>
          </Link>
          <Link href="/zodiac-signs" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Western Zodiac Signs</p>
            <p className="text-xs text-slate-400 mt-0.5">Explore the 12 signs of Western astrology</p>
          </Link>
          <Link href="/calculators/sun-moon-rising" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">☉ ☽ ↑ Big Three Calculator</p>
            <p className="text-xs text-slate-400 mt-0.5">Find your Western Sun, Moon, and Rising sign</p>
          </Link>
          <Link href="/signup" className="card block hover:border-slate-400 transition-colors group bg-slate-50 dark:bg-slate-800/50">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Get your full Western birth chart — free</p>
            <p className="text-xs text-slate-400 mt-0.5">See all 12 planetary placements in your natal chart with interpretations</p>
          </Link>
        </div>
      </main>
    </>
  )
}
