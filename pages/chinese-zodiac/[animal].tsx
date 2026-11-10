import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ANIMALS, ANIMAL_EMOJI, ANIMAL_DESCRIPTIONS, getAnimalElement, getYearsForAnimal, getChineseZodiac } from '@/lib/chinese-zodiac'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

interface Props {
  animal: string
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
  return { props: { animal } }
}

export default function AnimalPage({ animal }: Props) {
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
    </>
  )
}
