import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ANIMALS, ANIMAL_CHAR, compatTiles, ANIMAL_EMOJI, ANIMAL_DESCRIPTIONS, CZ_ELEMENT_COLOR, czYearsSql, getAnimalElement, getYearsForAnimal, getChineseZodiac } from '@/lib/chinese-zodiac'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { redesignOn } from '@/lib/redesign'
import type { HomePerson } from '@/lib/redesign/home-view'
import { Facts, Fold, LearnHero, NextLinks, People, PrevNext, Prose, TileGrid } from '@/components/redesign/Learn'

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

interface Props {
  animal: string
  people?: HomePerson[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ANIMALS.map(a => ({ params: { animal: a.toLowerCase() } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const animal = context.params?.animal as string
  const name = capitalize(animal)
  if (!ANIMAL_DESCRIPTIONS[name]) {
    return { notFound: true }
  }
  if (redesignOn('hubs')) {
    // Famous people born in any of this animal's years, by the real New Year dates.
    const { peopleWhere } = await import('@/lib/redesign/people')
    let people: HomePerson[] = []
    try { people = await peopleWhere(czYearsSql(getYearsForAnimal(name)), []) } catch { people = [] }
    return { props: { animal, people } }
  }
  return { props: { animal } }
}

export default function AnimalPage({ animal, people }: Props) {
  const name = capitalize(animal)
  const info = ANIMAL_DESCRIPTIONS[name]

  const years = getYearsForAnimal(name)
  const idx = ANIMALS.indexOf(name as typeof ANIMALS[number])
  const prevAnimal = ANIMALS[(idx - 1 + 12) % 12]
  const nextAnimal = ANIMALS[(idx + 1) % 12]

  const faqs = [
    { question: `What are ${name} personality traits in Chinese astrology?`, answer: `The ${name} is known for being ${info.traits.toLowerCase()}. Key strengths include ${info.strengths.toLowerCase()}. Growth areas include ${info.challenges.toLowerCase()}.` },
    { question: `Who is compatible with the ${name}?`, answer: info.compatibility },
    { question: `What years are ${name} years?`, answer: `${name} years repeat on a 12-year cycle. Recent and upcoming ${name} years include: ${years.filter(y => y >= 1960 && y <= 2043).join(', ')}.` },
    { question: `What is the ${name} in the Chinese zodiac?`, answer: info.description.replace(/\.\.\./g, '.') },
  ]

  return (
    <>
      <Head>
        <title>{`Year of the ${name} — Chinese Zodiac Personality & Traits`}</title>
        <meta name="description" content={`Everything about the ${name} in the Chinese zodiac: personality traits, strengths, challenges, compatibility, element variations, and which years are ${name} years.`} />
        <meta property="og:title" content={`Year of the ${name} — Chinese Zodiac Personality & Traits`} />
        <meta property="og:description" content={`Everything about the ${name} in the Chinese zodiac: personality traits, strengths, challenges, compatibility, element variations, and which years are ${name} years.`} />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent('Year of the ' + name)}&subtitle=Chinese+Zodiac+Sign&symbol=${encodeURIComponent(ANIMAL_EMOJI[name] || '🐉')}&label=Chinese+Zodiac`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Chinese Zodiac', url: 'https://birthchartlibrary.com/chinese-zodiac' },
        { name: `The ${name}`, url: `https://birthchartlibrary.com/chinese-zodiac/${animal}` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />
      {people ? (
        <main className="rdp"><div className="lrn">
          <LearnHero
            crumbs={[{ label: 'Chinese zodiac', href: '/chinese-zodiac' }, { label: name }]}
            disc={{ color: '#C3CBFF', text: ANIMAL_CHAR[name] }}
            kicker="Chinese zodiac"
            title={`The ${name}`}
          >
            <p>People born in {name} years tend to be {info.traits.toLowerCase()}. The {name} comes around every twelve years, each time with a different element.</p>
          </LearnHero>

          <Facts items={[
            { label: 'Strengths', value: info.strengths },
            { label: 'Challenges', value: info.challenges },
            ...compatTiles(info.compatibility),
          ]} />

          <Prose title={`About the ${name}`} text={info.description} />

          <section className="lsec">
            <h2>{name} years</h2>
            <p className="lede">Each year starts at Chinese New Year, in late January or February.</p>
            <TileGrid items={years.map(y => { const { element } = getChineseZodiac(y); return { href: `/chinese-zodiac/year/${y}`, label: String(y), sub: element, dot: CZ_ELEMENT_COLOR[element] } })} />
          </section>

          <section className="lsec">
            <h2>The {name} by element</h2>
            <p className="lede">The element of your birth year changes how the {name} shows up. Open one to read it.</p>
            {(['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const).map(element => (
              <Fold key={element} title={`${element} ${name}`} disc={{ color: CZ_ELEMENT_COLOR[element], text: ANIMAL_CHAR[name] }}>
                {getAnimalElement(name, element).split(/\n\s*\n/).map(t => t.trim()).filter(Boolean).map((t, i) => <p key={i}>{t}</p>)}
              </Fold>
            ))}
          </section>

          <People title={`Famous ${name}s`} lede={`Born in a ${name} year.`} people={people} />

          <NextLinks links={[
            { href: '/calculators/chinese-zodiac', title: 'Find your animal', sub: 'Your animal and element from any birth date.' },
            { href: '/chinese-zodiac', title: 'All twelve animals', sub: 'The full cycle, Rat to Pig.' },
            { href: '/birth-chart', title: 'Your Western birth chart', sub: 'Sun, Moon and rising from your birth time, free.' },
            { href: '/compatibility', title: 'Sign compatibility', sub: 'How the twelve Western signs get along.' },
          ]} />

          <PrevNext
            prev={{ href: `/chinese-zodiac/${prevAnimal.toLowerCase()}`, label: `The ${prevAnimal}` }}
            next={{ href: `/chinese-zodiac/${nextAnimal.toLowerCase()}`, label: `The ${nextAnimal}` }}
          />
        </div></main>
      ) : (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Chinese Zodiac', href: '/chinese-zodiac' },
          { label: name },
        ]} />

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-6xl">{ANIMAL_EMOJI[name]}</span>
          <div>
            <h1 className="font-display text-4xl tracking-wide">The {name}</h1>
            <p className="text-slate-500 text-sm mt-1">{info.traits}</p>
          </div>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="card">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Strengths</p>
            <p className="text-slate-700 text-sm">{info.strengths}</p>
          </div>
          <div className="card">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Challenges</p>
            <p className="text-slate-700 text-sm">{info.challenges}</p>
          </div>
          <div className="card col-span-2">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Compatibility</p>
            <p className="text-slate-700 text-sm">{info.compatibility}</p>
          </div>
        </div>

        {/* Description */}
        <div className="card mb-8">
          <p className="text-slate-700 leading-relaxed">{info.description}</p>
        </div>

        {/* Years */}
        <h2 className="font-display text-2xl tracking-wide mb-4">{name} Years</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
          {years.map(year => {
            const { element } = getChineseZodiac(year)
            return (
              <Link
                key={year}
                href={`/chinese-zodiac/year/${year}`}
                className="card py-2 text-center hover:border-slate-400 transition-colors"
              >
                <p className="font-semibold">{year}</p>
                <p className="text-xs text-slate-400">{element}</p>
              </Link>
            )
          })}
        </div>

        {/* Element variations */}
        <h2 className="font-display text-2xl tracking-wide mb-4">{name} by Element</h2>
        <div className="space-y-3 mb-8">
          {(['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const).map(element => (
            <div key={element} className="card">
              <h3 className="font-semibold mb-1">{element} {name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{getAnimalElement(name, element)}</p>
            </div>
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          <Link href={`/chinese-zodiac/${prevAnimal.toLowerCase()}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            ← {ANIMAL_EMOJI[prevAnimal]} {prevAnimal}
          </Link>
          <Link href={`/chinese-zodiac/${nextAnimal.toLowerCase()}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            {ANIMAL_EMOJI[nextAnimal]} {nextAnimal} →
          </Link>
        </div>
      </main>
      )}
    </>
  )
}

