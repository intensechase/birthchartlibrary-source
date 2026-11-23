import Head from 'next/head'
import Link from 'next/link'
import BigThreeCalculator from '@/components/calculators/BigThreeCalculator'
import { breadcrumbSchema, toolSchema, howToSchema, jsonLd } from '@/lib/schema'
import { redesignOn } from '@/lib/redesign'
import ChartTool, { ToolDoors } from '@/components/redesign/ChartTool'
import { Crumbs, Prose, NextLinks } from '@/components/redesign/Learn'

function LegacySunMoonRisingPage() {
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

// ---------------------------------------------------------------------
// Stage 'tools': the chart form itself; the Big Three lead the result.
// ---------------------------------------------------------------------
const URL = 'https://birthchartlibrary.com/calculators/sun-moon-rising'

const TOOL_HEAD = (
  <>
    <Head>
      <title>Sun, Moon and Rising Calculator: your Big Three free | Birth Chart Library</title>
      <meta name="description" content="Find your Sun, Moon and rising signs free. Enter the birth date, time and place and see your Big Three at the top of your whole birth chart, read plainly." />
      <link rel="canonical" href={URL} />
      <meta property="og:title" content="Sun, Moon and Rising Calculator: your Big Three free" />
      <meta property="og:description" content="Your Sun, Moon and rising signs at the top of your whole birth chart, read plainly." />
      <meta property="og:url" content={URL} />
      <meta name="twitter:card" content="summary" />
    </Head>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
      { name: 'Home', url: 'https://birthchartlibrary.com' },
      { name: 'Calculators', url: 'https://birthchartlibrary.com/calculators' },
      { name: 'Sun, Moon and Rising Calculator', url: URL },
    ])) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(toolSchema({
      name: 'Sun, Moon and Rising Calculator',
      description: 'Free Big Three calculator. Enter the birth date, time and place to find the Sun, Moon and rising signs and see the full birth chart.',
      url: URL,
      keywords: 'big three calculator, sun moon rising calculator, moon sign calculator, rising sign calculator, free birth chart',
    })) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema({
      name: 'How to Find Your Sun, Moon and Rising Signs',
      description: 'Find your Big Three from the birth date, birth time and birth place.',
      totalTime: 'PT2M',
      url: URL,
      steps: [
        { name: 'Enter the birth date', text: 'The date gives the Sun sign and usually the Moon sign.' },
        { name: 'Enter the birth time', text: 'The time gives the rising sign, and settles the Moon on days it changes sign.' },
        { name: 'Pick the birth place', text: 'Type the city and choose it from the list.' },
        { name: 'See the chart', text: 'The Sun, Moon and rising signs lead the chart, with every planet and house below them.' },
      ],
    })) }} />
  </>
)

function BigThreeTool() {
  return (
    <ChartTool
      head={TOOL_HEAD}
      top={<Crumbs items={[{ label: 'Calculators', href: '/calculators' }, { label: 'Sun, Moon and rising' }]} />}
      title="Your Sun, Moon and rising"
      sub="The three signs people mean by your Big Three, at the top of your whole chart. Free, no account."
      submitText="Find my Big Three"
      saveRef="calc-big-three"
      focus="big3"
      after={
        <>
          <Prose id="what" title="What each one needs">
            <p>The Sun sign comes from the date alone. It is the sign most people already know.</p>
            <p>The Moon changes sign about every two and a half days, so the date usually settles it. On a day it changes sign, the birth time decides which one.</p>
            <p>The rising sign needs the time and the place. It changes about every two hours. Without a time you still get the Sun, the Moon and every planet by sign, and the rising sign is left out rather than guessed.</p>
          </Prose>
          <NextLinks title="Read more" links={[
            { href: '/blog/the-big-three-astrology-sun-moon-rising', title: 'The Big Three, explained', sub: 'How the Sun, Moon and rising work together' },
            { href: '/blog/what-your-moon-sign-says-about-your-emotional-life', title: 'Your Moon sign', sub: 'What it says about how you feel things' },
            { href: '/celebrity-birth-charts', title: 'Celebrity birth charts', sub: 'Real charts with sourced birth times' },
          ]} />
          <ToolDoors skip="/calculators/sun-moon-rising" />
        </>
      }
    />
  )
}

export default function SunMoonRisingPage() {
  return redesignOn('tools') ? <BigThreeTool /> : <LegacySunMoonRisingPage />
}
