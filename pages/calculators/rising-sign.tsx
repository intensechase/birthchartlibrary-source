import Head from 'next/head'
import Link from 'next/link'
import RisingSignCalculator from '@/components/calculators/RisingSignCalculator'
import { breadcrumbSchema, toolSchema, howToSchema, jsonLd } from '@/lib/schema'
import { redesignOn } from '@/lib/redesign'
import ChartTool, { ToolDoors } from '@/components/redesign/ChartTool'
import { Crumbs, Prose, NextLinks } from '@/components/redesign/Learn'

function LegacyRisingSignPage() {
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
          <span className="text-slate-600 dark:text-slate-300">Rising sign</span>
        </nav>

        <h1 className="font-display text-4xl tracking-wide mb-2">Rising sign calculator</h1>
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

// ---------------------------------------------------------------------
// Stage 'tools': the chart form itself. The answer is the whole chart, with
// the rising sign in the Big Three at the top.
// ---------------------------------------------------------------------
const URL = 'https://birthchartlibrary.com/calculators/rising-sign'

const TOOL_HEAD = (
  <>
    <Head>
      <title>Rising Sign Calculator: find your ascendant free | Birth Chart Library</title>
      <meta name="description" content="Find your rising sign free. Enter the birth date, time and place and see the sign that was coming up in the east when you were born, with the whole chart around it." />
      <link rel="canonical" href={URL} />
      <meta property="og:title" content="Rising Sign Calculator: find your ascendant free" />
      <meta property="og:description" content="The sign that was coming up in the east when you were born, with the whole chart around it, read plainly." />
      <meta property="og:url" content={URL} />
      <meta name="twitter:card" content="summary" />
    </Head>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
      { name: 'Home', url: 'https://birthchartlibrary.com' },
      { name: 'Calculators', url: 'https://birthchartlibrary.com/calculators' },
      { name: 'Rising Sign Calculator', url: URL },
    ])) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(toolSchema({
      name: 'Rising Sign Calculator',
      description: 'Free rising sign (ascendant) calculator. Enter the birth date, time and place to find the rising sign and see the full birth chart.',
      url: URL,
      keywords: 'rising sign calculator, ascendant calculator, free rising sign, what is my rising sign',
    })) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema({
      name: 'How to Find Your Rising Sign',
      description: 'Find your rising sign (ascendant) from the birth date, birth time and birth place.',
      totalTime: 'PT2M',
      url: URL,
      steps: [
        { name: 'Enter the birth date', text: 'Pick the date of birth.' },
        { name: 'Enter the birth time', text: 'The rising sign changes about every two hours, so the time matters. A birth certificate is the best source.' },
        { name: 'Pick the birth place', text: 'Type the city and choose it from the list. The rising sign depends on where the birth happened as well as when.' },
        { name: 'See the chart', text: 'The rising sign shows in the Big Three at the top of the chart, with every planet and house below it.' },
      ],
    })) }} />
  </>
)

function RisingTool() {
  return (
    <ChartTool
      head={TOOL_HEAD}
      top={<Crumbs items={[{ label: 'Calculators', href: '/calculators' }, { label: 'Rising sign' }]} />}
      title="Find your rising sign"
      sub="The sign that was coming up in the east when you were born. Enter the birth time and place and you get it, with the whole chart around it. Free, no account."
      submitText="Find my rising sign"
      saveRef="calc-rising"
      focus="rising"
      after={
        <>
          <Prose id="what" title="What the rising sign is">
            <p>The rising sign, or ascendant, is the sign on the eastern horizon at the moment of birth. The Earth turns all twelve signs past that horizon once a day, so a new one rises about every two hours. That is why the birth time matters more here than anywhere else in the chart.</p>
            <p>It also sets the houses. The rising sign begins the 1st house and the signs follow in order around the chart, so the same time that gives the rising sign places every planet in a house.</p>
            <p>No birth time? You still get the Sun, the Moon and every planet by sign. The rising sign and houses are left out rather than guessed.</p>
          </Prose>
          <NextLinks title="Read more" links={[
            { href: '/blog/what-your-rising-sign-means', title: 'Your rising sign, explained', sub: 'What it means in each of the twelve signs' },
            { href: '/astrology-houses/1', title: 'The 1st house', sub: 'The house the rising sign begins' },
            { href: '/celebrity-birth-charts', title: 'Celebrity birth charts', sub: 'Real charts with sourced birth times' },
          ]} />
          <ToolDoors skip="/calculators/rising-sign" />
        </>
      }
    />
  )
}

export default function RisingSignPage() {
  return redesignOn('tools') ? <RisingTool /> : <LegacyRisingSignPage />
}
