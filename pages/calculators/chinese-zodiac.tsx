import Head from 'next/head'
import Link from 'next/link'
import ChineseZodiacCalculator from '@/components/calculators/ChineseZodiacCalculator'
import { breadcrumbSchema, toolSchema, howToSchema, jsonLd } from '@/lib/schema'
import { useEffect, useState } from 'react'
import { redesignOn } from '@/lib/redesign'
import { Crumbs, Prose, NextLinks } from '@/components/redesign/Learn'
import { YEAR_RANGE, chineseYearOf, getChineseZodiac, formatCNYStart, formatCNYEnd, ANIMAL_CHAR, CZ_ELEMENT_COLOR, ANIMAL_DESCRIPTIONS } from '@/lib/chinese-zodiac'
import { Disc } from '@/components/redesign/Disc'
import { PersonCard } from '@/components/redesign/HomePage'
import type { HomePerson } from '@/lib/redesign/home-view'

function LegacyChineseZodiacPage() {
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
          <span className="text-slate-600 dark:text-slate-300">Chinese zodiac</span>
        </nav>

        <h1 className="font-display text-4xl tracking-wide mb-2">Chinese zodiac calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          The Chinese zodiac assigns an animal and element to each year in a 60-year cycle. Your animal reveals your personality archetype — your element adds a layer of nuance about how that archetype expresses. Enter your birth year to discover yours.
        </p>

        <ChineseZodiacCalculator />

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Explore further</p>
          <Link href="/chinese-zodiac" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Chinese zodiac guide</p>
            <p className="text-xs text-slate-400 mt-0.5">All 12 animals with compatibility, elements, and mythology</p>
          </Link>
          <Link href="/zodiac-signs" className="card block hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Western zodiac signs</p>
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

// ---------------------------------------------------------------------
// Stage 'tools': a year finder. The full birth date matters because the
// Chinese year starts at the new moon of late January or February, not on
// January 1, so an early year birth belongs to the year before.
// ---------------------------------------------------------------------
const URL = 'https://birthchartlibrary.com/calculators/chinese-zodiac'
const FIRST = YEAR_RANGE[0]
// The last table year has no end date (no next new year listed), so stop one short.
const LAST = YEAR_RANGE[YEAR_RANGE.length - 2]

// Chinese year for a birth date, or null outside the years the site covers.
function czYearOf(date: string): number | null {
  const cy = chineseYearOf(date)
  return cy !== null && cy >= FIRST && cy <= LAST ? cy : null
}

const TOOL_HEAD = (
  <>
    <Head>
      <title>Chinese Zodiac Calculator: find your animal and element | Birth Chart Library</title>
      <meta name="description" content={`Find your Chinese zodiac animal and element from your birth date, with the exact dates your Chinese year began and ended. Covers births from ${FIRST} to ${LAST + 1}.`} />
      <link rel="canonical" href={URL} />
      <meta property="og:title" content="Chinese Zodiac Calculator: find your animal and element" />
      <meta property="og:description" content="Your animal and element from your birth date, with the exact dates your Chinese year began and ended." />
      <meta property="og:url" content={URL} />
      <meta name="twitter:card" content="summary" />
    </Head>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
      { name: 'Home', url: 'https://birthchartlibrary.com' },
      { name: 'Calculators', url: 'https://birthchartlibrary.com/calculators' },
      { name: 'Chinese Zodiac Calculator', url: URL },
    ])) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(toolSchema({
      name: 'Chinese Zodiac Calculator',
      description: 'Free Chinese zodiac calculator. Enter a birth date to find the animal sign and element, using the date the Chinese year actually began.',
      url: URL,
      keywords: 'chinese zodiac calculator, what is my chinese zodiac, chinese animal sign, chinese zodiac element, free chinese zodiac',
    })) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema({
      name: 'How to Find Your Chinese Zodiac Animal and Element',
      description: 'Find your Chinese zodiac animal and element from your birth date.',
      totalTime: 'PT1M',
      url: URL,
      steps: [
        { name: 'Enter the birth date', text: 'The full date matters. The Chinese year begins in late January or February, so an early year birth belongs to the year before.' },
        { name: 'Read the result', text: 'You get the animal, the element and the dates that Chinese year began and ended, with a link to read about it.' },
      ],
    })) }} />
  </>
)

function CzTool() {
  const [date, setDate] = useState('')
  const [shown, setShown] = useState<string | null>(null)
  const cy = shown ? czYearOf(shown) : null
  const z = cy ? getChineseZodiac(cy) : null
  // People born that Chinese year, fetched once the answer is shown.
  const [people, setPeople] = useState<HomePerson[]>([])
  useEffect(() => {
    setPeople([])
    if (!cy) return
    let live = true
    fetch(`/api/cz-year-people?year=${cy}`).then(r => (r.ok ? r.json() : null)).then(d => { if (live && d?.people) setPeople(d.people) }).catch(() => {})
    return () => { live = false }
  }, [cy])

  return (
    <>
      {TOOL_HEAD}
      <div className="rdp"><div className="wrap mine">
        <Crumbs items={[{ label: 'Calculators', href: '/calculators' }, { label: 'Chinese zodiac' }]} />
        <h1>Find your Chinese zodiac</h1>
        <p className="sub">Your animal and element come from the Chinese year you were born in. That year starts in late January or February, not on January 1, so the full date matters.</p>
        <form className="mform" onSubmit={e => { e.preventDefault(); setShown(date) }}>
          <label className="field">
            <span>Birth date</span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={`${FIRST}-01-01`} max={`${LAST + 1}-12-31`} required />
          </label>
          <button type="submit" className="btn wide" disabled={!date}>Find my year</button>
        </form>

        {shown && (!cy || !z) ? (
          <p className="err" role="alert" style={{ marginTop: 16 }}>This finder covers births from {formatCNYStart(FIRST)} to {formatCNYEnd(LAST)}.</p>
        ) : null}

        {cy && z ? (
          <section className="ans" aria-live="polite" aria-label="Your Chinese zodiac">
            <p className="ak">Your Chinese zodiac</p>
            <div className="ag">
              <Link className="ai" href={`/chinese-zodiac/year/${cy}`}>
                <Disc disc={{ color: CZ_ELEMENT_COLOR[z.element] ?? '#C3CBFF', text: ANIMAL_CHAR[z.animal] }} size={64} />
                <span className="at">
                  <b>{z.element} {z.animal}<small>{cy}</small></b>
                  <span>{ANIMAL_DESCRIPTIONS[z.animal]?.traits}. Your Chinese year ran from {formatCNYStart(cy)} to {formatCNYEnd(cy)}.</span>
                  <em>Read about the {cy} {z.element} {z.animal} year</em>
                </span>
              </Link>
            </div>
            {people.length ? (
              <>
                <p className="ak" style={{ marginTop: 18 }}>Also born in the {cy} {z.animal} year</p>
                <div className="pgrid three">{people.map(p => <PersonCard key={p.slug} p={p} />)}</div>
              </>
            ) : null}
            <p className="an"><Link href={`/chinese-zodiac/${z.animal.toLowerCase()}`}>The {z.animal} in every element, and its best matches</Link></p>
          </section>
        ) : null}

        <Prose id="how" title="How the Chinese year works">
          <p>Each year has one of twelve animals, in a fixed order starting with the Rat, and one of five elements: Wood, Fire, Earth, Metal and Water. Each element holds for two years in a row, so the same animal and element pair comes back every sixty years.</p>
          <p>The year begins at Chinese New Year, on a new moon that falls between January 21 and February 20. A birth on January 10 always belongs to the year before. A birth in early February depends on the year.</p>
        </Prose>
        <NextLinks links={[
          { href: '/chinese-zodiac', title: 'The Chinese zodiac', sub: 'All twelve animals and five elements' },
          { href: '/calculators/sun-moon-rising', title: 'Sun, Moon and rising', sub: 'Your Western Big Three, from your birth time' },
        ]} />
      </div></div>
    </>
  )
}

export default function ChineseZodiacPage() {
  return redesignOn('tools') ? <CzTool /> : <LegacyChineseZodiacPage />
}
