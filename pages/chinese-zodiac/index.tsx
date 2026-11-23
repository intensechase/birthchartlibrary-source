import Head from 'next/head'
import Link from 'next/link'
import { ANIMALS, ANIMAL_CHAR, ANIMAL_EMOJI, ANIMAL_DESCRIPTIONS, CZ_ELEMENT_COLOR, getChineseZodiac } from '@/lib/chinese-zodiac'
import { breadcrumbSchema, itemListSchema, jsonLd } from '@/lib/schema'
import { redesignOn } from '@/lib/redesign'
import { Disc } from '@/components/redesign/Disc'
import { LearnHero, NextLinks, TileGrid } from '@/components/redesign/Learn'

export default function ChineseZodiacPage() {
  // Recent and upcoming years for quick reference
  const recentYears = Array.from({ length: 20 }, (_, i) => 2015 + i)

  return (
    <>
      <Head>
        <title>Chinese Zodiac — All 12 Animals, Elements & Year Calculator</title>
        <meta name="description" content="Explore the Chinese zodiac: all 12 animals, 5 elements, and what your birth year reveals about your personality. Find your Chinese zodiac animal and element." />
        <link rel="canonical" href="https://birthchartlibrary.com/chinese-zodiac" />
        <meta property="og:title" content="Chinese Zodiac — All 12 Animals, Elements & Year Calculator" />
        <meta property="og:description" content="Explore the Chinese zodiac: all 12 animals, 5 elements, and what your birth year reveals about your personality. Find your Chinese zodiac animal and element." />
        <meta property="og:url" content="https://birthchartlibrary.com/chinese-zodiac" />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og/topic?title=Chinese+Zodiac&subtitle=All+12+Animals+%26+Elements&symbol=🐉&label=Birth+Chart+Library" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Chinese Zodiac', url: 'https://birthchartlibrary.com/chinese-zodiac' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemListSchema(
        ANIMALS.map(a => ({ name: `The ${a}`, url: `https://birthchartlibrary.com/chinese-zodiac/${a.toLowerCase()}` }))
      )) }} />
      {redesignOn('hubs') ? (
        <main className="rdp"><div className="lrn">
          <LearnHero kicker="Learn" title="Chinese zodiac">
            <p>The Chinese zodiac gives each year one of twelve animals and one of five elements, in a cycle that repeats every sixty years. Your animal is the core of your personality in this system; your element adds the shading.</p>
          </LearnHero>

          <section className="lsec">
            <h2>The twelve animals</h2>
            <ul className="popgrid">
              {ANIMALS.map(a => (
                <li key={a}>
                  <Link href={`/chinese-zodiac/${a.toLowerCase()}`}>
                    <Disc disc={{ color: '#C3CBFF', text: ANIMAL_CHAR[a] }} size={44} />
                    <span><b>{a}</b><small>{ANIMAL_DESCRIPTIONS[a].traits}</small></span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="lsec">
            <h2>Years at a glance</h2>
            <p className="lede">Each year starts at Chinese New Year, in late January or February.</p>
            <TileGrid items={recentYears.map(y => { const { animal, element } = getChineseZodiac(y); return { href: `/chinese-zodiac/year/${y}`, label: String(y), sub: `${element} ${animal}`, dot: CZ_ELEMENT_COLOR[element] } })} />
          </section>

          <NextLinks links={[
            { href: '/calculators/chinese-zodiac', title: 'Find your animal', sub: 'Your animal and element from any birth date.' },
            { href: '/birth-chart', title: 'Your Western birth chart', sub: 'Sun, Moon and rising from your birth time, free.' },
          ]} />
        </div></main>
      ) : (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl tracking-wide mb-2">Chinese zodiac</h1>
        <p className="text-slate-500 mb-10 max-w-2xl">
          The Chinese zodiac assigns one of 12 animals and one of 5 elements to each year in a 60-year cycle. Your animal reveals your core personality archetype... your element adds nuance and depth.
        </p>

        {/* Calculator link */}
        <div className="card mb-10 text-center">
          <p className="text-slate-600 mb-3">Know your birth year? Find your animal and element instantly.</p>
          <Link href="/calculators/chinese-zodiac" className="btn-primary">Chinese zodiac calculator</Link>
        </div>

        {/* 12 Animals */}
        <h2 className="font-display text-2xl tracking-wide mb-4">The 12 Animals</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {ANIMALS.map(animal => {
            const info = ANIMAL_DESCRIPTIONS[animal]
            return (
              <Link
                key={animal}
                href={`/chinese-zodiac/${animal.toLowerCase()}`}
                className="card hover:border-slate-400 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{ANIMAL_EMOJI[animal]}</span>
                  <div>
                    <p className="font-semibold text-lg group-hover:text-slate-600 transition-colors">{animal}</p>
                    <p className="text-xs text-slate-400">{info.traits}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Recent years quick reference */}
        <h2 className="font-display text-2xl tracking-wide mb-4">Years at a Glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-12">
          {recentYears.map(year => {
            const { animal, element } = getChineseZodiac(year)
            return (
              <Link
                key={year}
                href={`/chinese-zodiac/year/${year}`}
                className="card py-3 text-center hover:border-slate-400 transition-colors group"
              >
                <p className="font-display text-xl tracking-wide group-hover:text-slate-600 transition-colors">{year}</p>
                <p className="text-sm text-slate-500">{ANIMAL_EMOJI[animal]} {element} {animal}</p>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <p className="font-display text-xl tracking-wide mb-2">Discover what the rest of your chart reveals</p>
          <p className="text-slate-500 text-sm mb-4">Your Chinese zodiac is just the beginning... generate your full Western birth chart for a complete picture.</p>
          <Link href="/signup" className="btn-primary">Create your free chart</Link>
        </div>
      </main>
      )}
    </>
  )
}
