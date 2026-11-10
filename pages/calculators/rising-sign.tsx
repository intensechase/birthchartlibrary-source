import Head from 'next/head'
import Link from 'next/link'
import RisingSignCalculator from '@/components/calculators/RisingSignCalculator'
import { breadcrumbSchema, toolSchema, howToSchema, jsonLd } from '@/lib/schema'

export default function RisingSignPage() {
  return (
    <>
      <Head>
        <title>Rising Sign Calculator — Find Your Ascendant Free | Birth Chart Library</title>
        <meta name="description" content="Calculate your rising sign (Ascendant) for free. Enter your birth date, time, and city to discover the zodiac sign rising when you were born and what it means for your personality." />
        <link rel="canonical" href="https://birthchartlibrary.com/calculators/rising-sign" />
        <meta property="og:title" content="Rising Sign Calculator — Find Your Ascendant Free" />
        <meta property="og:description" content="Calculate your rising sign for free. Discover the zodiac sign rising on the horizon at your birth and how it shapes your personality and first impression." />
        <meta property="og:url" content="https://birthchartlibrary.com/calculators/rising-sign" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Calculators', url: 'https://birthchartlibrary.com/calculators' },
        { name: 'Rising Sign Calculator', url: 'https://birthchartlibrary.com/calculators/rising-sign' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(toolSchema({
        name: 'Rising Sign Calculator',
        description: 'Free rising sign (Ascendant) calculator. Enter your birth date, time, and place to find your Ascendant sign and its meaning.',
        url: 'https://birthchartlibrary.com/calculators/rising-sign',
        keywords: 'rising sign calculator, ascendant calculator, free rising sign, what is my rising sign',
      })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema({
        name: 'How to Find Your Rising Sign',
        description: 'Calculate your rising sign (Ascendant) by entering your birth date, exact birth time, and birth city.',
        totalTime: 'PT2M',
        url: 'https://birthchartlibrary.com/calculators/rising-sign',
        steps: [
          { name: 'Enter your birth date', text: 'Type your birth date in month, day, and year format. The date determines which zodiac sign was rising on your birthday.' },
          { name: 'Enter your exact birth time', text: 'The rising sign changes every two hours, so an accurate birth time is essential. Check your birth certificate if uncertain.' },
          { name: 'Enter your birth city', text: 'The Ascendant depends on the geographic location at the moment of birth. Type your birth city and select it from the suggestions.' },
          { name: 'View your rising sign', text: 'Click Calculate to see your rising sign and a description of how it shapes your appearance, first impressions, and outer personality.' },
        ],
      })) }} />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/calculators" className="hover:text-slate-600 dark:hover:text-slate-300">Calculators</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Rising Sign</span>
        </nav>

        <h1 className="font-display text-4xl tracking-wide mb-2">Rising Sign Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Your rising sign (Ascendant) is the zodiac sign that was rising on the eastern horizon at the exact moment you were born. It shapes how the world sees you... your first impression, your social mask, and the lens through which your entire chart is expressed.
        </p>

        <RisingSignCalculator />

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Learn more</p>
          <Link href="/blog/what-your-rising-sign-means" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Your Rising Sign: The Complete Guide</p>
            <p className="text-xs text-slate-400 mt-0.5">What your Ascendant means and how every Rising sign expresses</p>
          </Link>
          <Link href="/blog/the-big-three-astrology-sun-moon-rising" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">The Big Three: Sun, Moon &amp; Rising Explained</p>
            <p className="text-xs text-slate-400 mt-0.5">How your three core placements work together</p>
          </Link>
          <Link href="/calculators/sun-moon-rising" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">☉ ☽ ↑ Big Three Calculator</p>
            <p className="text-xs text-slate-400 mt-0.5">Find your Sun, Moon, and Rising sign together</p>
          </Link>
          <Link href="/signup" className="card block hover:border-slate-400 transition-colors group bg-slate-50 dark:bg-slate-800/50">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Get your full birth chart — free</p>
            <p className="text-xs text-slate-400 mt-0.5">Create an account to see all 12 planetary placements with personalized interpretations</p>
          </Link>
        </div>
      </main>
    </>
  )
}
