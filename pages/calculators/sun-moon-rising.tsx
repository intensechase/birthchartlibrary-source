import Head from 'next/head'
import Link from 'next/link'
import BigThreeCalculator from '@/components/calculators/BigThreeCalculator'
import { breadcrumbSchema, toolSchema, howToSchema, jsonLd } from '@/lib/schema'

export default function SunMoonRisingPage() {
  return (
    <>
      <Head>
        <title>Sun, Moon &amp; Rising Calculator — Find Your Big Three Free | Birth Chart Library</title>
        <meta name="description" content="Calculate your Sun sign, Moon sign, and Rising sign for free. Enter your birth details to discover your Big Three — the foundation of your astrological identity." />
        <link rel="canonical" href="https://birthchartlibrary.com/calculators/sun-moon-rising" />
        <meta property="og:title" content="Sun, Moon & Rising Calculator — Find Your Big Three Free" />
        <meta property="og:description" content="Find your Sun, Moon, and Rising sign (the Big Three) with our free calculator. Understand the three most important placements in your birth chart." />
        <meta property="og:url" content="https://birthchartlibrary.com/calculators/sun-moon-rising" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Calculators', url: 'https://birthchartlibrary.com/calculators' },
        { name: 'Sun Moon Rising Calculator', url: 'https://birthchartlibrary.com/calculators/sun-moon-rising' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(toolSchema({
        name: 'Sun Moon Rising Calculator — The Big Three',
        description: 'Free calculator to find your Sun sign, Moon sign, and Rising sign (Ascendant) from your birth date, time, and place.',
        url: 'https://birthchartlibrary.com/calculators/sun-moon-rising',
        keywords: 'sun moon rising calculator, big three astrology, what is my moon sign, what is my rising sign, free astrology calculator',
      })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema({
        name: 'How to Find Your Sun, Moon, and Rising Signs',
        description: 'Calculate the three core placements of your birth chart — your Sun sign, Moon sign, and Rising sign (Ascendant) — from your birth date, time, and city.',
        totalTime: 'PT2M',
        url: 'https://birthchartlibrary.com/calculators/sun-moon-rising',
        steps: [
          { name: 'Enter your birth date', text: 'Provide your birth date in month, day, and year. The Sun sign is determined by the date alone, while the Moon and Rising require time and place.' },
          { name: 'Enter your exact birth time', text: 'The Moon changes signs every 2 to 3 days and the Rising sign changes every two hours. Use your birth certificate when possible.' },
          { name: 'Enter your birth city', text: 'Type your birth city and select it from the autocomplete results. The Rising sign depends on your geographic location at birth.' },
          { name: 'View your Big Three', text: 'Click Calculate to see your Sun, Moon, and Rising signs together with a short description of what each represents.' },
        ],
      })) }} />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/calculators" className="hover:text-slate-600 dark:hover:text-slate-300">Calculators</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Sun, Moon &amp; Rising</span>
        </nav>

        <h1 className="font-display text-4xl tracking-wide mb-2">Sun, Moon &amp; Rising Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Your Big Three — Sun, Moon, and Rising — form the foundation of who you are astrologically. Your Sun is your core identity, your Moon is your emotional nature, and your Rising is how the world sees you. Together they tell a story no single sign can capture.
        </p>

        <BigThreeCalculator />

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Learn more</p>
          <Link href="/blog/the-big-three-astrology-sun-moon-rising" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">The Big Three in Astrology: Sun, Moon &amp; Rising Explained</p>
            <p className="text-xs text-slate-400 mt-0.5">What each placement means and how they work together</p>
          </Link>
          <Link href="/blog/what-your-moon-sign-says-about-your-emotional-life" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Your Moon Sign: The Complete Guide</p>
            <p className="text-xs text-slate-400 mt-0.5">What your Moon sign reveals about your emotional nature</p>
          </Link>
          <Link href="/blog/what-your-rising-sign-means" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Your Rising Sign: The Complete Guide</p>
            <p className="text-xs text-slate-400 mt-0.5">How your Ascendant shapes your personality and first impression</p>
          </Link>
          <Link href="/signup" className="card block hover:border-slate-400 transition-colors group bg-slate-50 dark:bg-slate-800/50">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Get your full birth chart — free</p>
            <p className="text-xs text-slate-400 mt-0.5">All 12 planetary placements with personalized interpretations and daily transits</p>
          </Link>
        </div>
      </main>
    </>
  )
}
