import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ANIMAL_EMOJI, ANIMAL_DESCRIPTIONS, getAnimalElement, getChineseZodiac, formatCNYStart, formatCNYEnd } from '@/lib/chinese-zodiac'
import { getListableCelebrities } from '@/lib/celebrities'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { NOINDEX_THIN } from '@/lib/thin-pages'

interface Celebrity {
  name: string
  slug: string
  image_url: string | null
}

interface Props {
  year: number
  animal: string
  element: string
  traits: string
  strengths: string
  challenges: string
  compatibility: string
  description: string
  elementDesc: string
  cnyStart: string | null
  cnyEnd: string | null
  prevYear: number | null
  nextYear: number | null
  prevAnimal: string | null
  prevElement: string | null
  nextAnimal: string | null
  nextElement: string | null
  celebrities: Celebrity[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Array.from({ length: 124 }, (_, i) => ({
    params: { year: String(1924 + i) },
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const yearStr = context.params?.year as string
  const y = parseInt(yearStr)
  if (isNaN(y) || y < 1924 || y > 2047) {
    return { notFound: true }
  }

  const { animal, element } = getChineseZodiac(y)
  const info = ANIMAL_DESCRIPTIONS[animal]
  const elementDesc = getAnimalElement(animal, element)

  const prevYear = y > 1924 ? y - 1 : null
  const nextYear = y < 2047 ? y + 1 : null
  const prev = prevYear ? getChineseZodiac(prevYear) : null
  const next = nextYear ? getChineseZodiac(nextYear) : null

  let celebrities: Celebrity[] = []
  try {
    celebrities = await getListableCelebrities<Celebrity>({
      columns: 'name, slug, image_url',
      where: 'EXTRACT(YEAR FROM birth_date)::int = $1',
      params: [y],
      orderBy: 'name',
      limit: 12,
    })
  } catch {
    celebrities = []
  }

  return {
    props: {
      year: y,
      animal,
      element,
      traits: info.traits,
      strengths: info.strengths,
      challenges: info.challenges,
      compatibility: info.compatibility,
      description: info.description,
      elementDesc,
      cnyStart: formatCNYStart(y),
      cnyEnd: formatCNYEnd(y),
      prevYear,
      nextYear,
      prevAnimal: prev?.animal ?? null,
      prevElement: prev?.element ?? null,
      nextAnimal: next?.animal ?? null,
      nextElement: next?.element ?? null,
      celebrities,
    },
  }
}

export default function YearPage({
  year: y, animal, element, traits, strengths, challenges, compatibility, description, elementDesc,
  cnyStart, cnyEnd, prevYear, nextYear, prevAnimal, prevElement, nextAnimal, nextElement, celebrities,
}: Props) {
  const faqs = [
    { question: `What Chinese zodiac animal is ${y}?`, answer: `${y} is the Year of the ${element} ${animal} in the Chinese zodiac.${cnyStart ? ` The Chinese New Year began on ${cnyStart}.` : ''}` },
    { question: `What are the traits of the ${element} ${animal}?`, answer: elementDesc.replace(/\n+/g, ' ').trim() },
    { question: `When does the ${y} Chinese zodiac year start and end?`, answer: cnyStart && cnyEnd ? `The ${element} ${animal} year began on ${cnyStart} and ran through ${cnyEnd}. People born before ${cnyStart} in ${y} belong to the prior zodiac year.` : `${y} is the Year of the ${element} ${animal}.` },
    ...(celebrities.length > 0 ? [{ question: `Who are famous people born in ${y}?`, answer: `Notable people born in ${y} include ${celebrities.slice(0, 6).map(c => c.name).join(', ')}.` }] : []),
  ]

  return (
    <>
      <Head>
        <title>{`${y} Chinese Zodiac — Year of the ${element} ${animal}: Traits & Compatibility`}</title>
        {NOINDEX_THIN.chineseZodiacYear && <meta name="robots" content="noindex,follow" />}
        <meta name="description" content={`${y} is the Year of the ${element} ${animal}${cnyStart ? ` (Chinese New Year: ${cnyStart})` : ''}. Personality traits, compatibility, and famous ${element} ${animal}s born this year.`} />
        <meta property="og:title" content={`${y} Chinese Zodiac — Year of the ${element} ${animal}`} />
        <meta property="og:description" content={`${y} is the Year of the ${element} ${animal}${cnyStart ? ` (Chinese New Year: ${cnyStart})` : ''}. Personality traits, compatibility, and famous ${element} ${animal}s.`} />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(y + ': Year of the ' + element + ' ' + animal)}&subtitle=Chinese+Zodiac&symbol=${encodeURIComponent(ANIMAL_EMOJI[animal] || '🐉')}&label=Chinese+Zodiac`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Chinese Zodiac', url: 'https://birthchartlibrary.com/chinese-zodiac' },
        { name: `The ${animal}`, url: `https://birthchartlibrary.com/chinese-zodiac/${animal.toLowerCase()}` },
        { name: String(y), url: `https://birthchartlibrary.com/chinese-zodiac/year/${y}` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Chinese Zodiac', href: '/chinese-zodiac' },
          { label: animal, href: `/chinese-zodiac/${animal.toLowerCase()}` },
          { label: String(y) },
        ]} />

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl block mb-3">{ANIMAL_EMOJI[animal]}</span>
          <h1 className="font-display text-4xl tracking-wide mb-2">{y}: Year of the {element} {animal}</h1>
          <p className="text-slate-500">Chinese Zodiac</p>
        </div>

        {/* Born-in intro — direct answer to search intent; unique per year via CNY date + element */}
        <p className="text-slate-600 text-sm leading-relaxed mb-8 text-center max-w-lg mx-auto">
          {cnyStart ? (
            <>If you were born in {y} on or after <strong>{cnyStart}</strong>, your Chinese zodiac sign is the <strong>{element} {animal}</strong>.
            {' '}People born before {cnyStart} in {y} belong to the prior zodiac year.
            {' '}{element} {animal}s tend to be {traits.toLowerCase()}.</>
          ) : (
            <>If you were born in {y}, your Chinese zodiac sign is the <strong>{element} {animal}</strong> —
            {' '}the {element} expression of the {animal} that recurs once in every 60&#8209;year cycle.
            {' '}{element} {animal}s tend to be {traits.toLowerCase()}.</>
          )}
        </p>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="card text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Animal</p>
            <p className="font-semibold">{ANIMAL_EMOJI[animal]} {animal}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Element</p>
            <p className="font-semibold">{element}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Traits</p>
            <p className="text-slate-700 text-sm">{traits}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Compatibility</p>
            <p className="text-slate-700 text-sm">{compatibility}</p>
          </div>
        </div>

        {/* Animal description */}
        <div className="card mb-6">
          <h2 className="font-semibold mb-2">The {animal}</h2>
          <p className="text-slate-700 leading-relaxed text-sm">{description}</p>
        </div>

        {/* Element description */}
        <div className="card mb-8">
          <h2 className="font-semibold mb-2">The {element} {animal}</h2>
          <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{elementDesc}</p>
        </div>

        {/* CNY date boundary */}
        {cnyStart && (
          <div className="card mb-8">
            <h2 className="font-semibold mb-2">When does this year start?</h2>
            <p className="text-slate-700 leading-relaxed text-sm">
              The Chinese New Year began on <strong>{cnyStart}</strong>
              {cnyEnd ? <>, and this zodiac year ran through <strong>{cnyEnd}</strong></> : null}.
              {prevAnimal && prevElement && (
                <> If you were born before {cnyStart}, your Chinese zodiac sign is the {prevElement} {prevAnimal} — not the {element} {animal}.</>
              )}
            </p>
          </div>
        )}

        {/* Famous people born this year */}
        {celebrities.length > 0 && (
          <div className="card mb-8">
            <h2 className="font-semibold mb-3">Famous people born in {y}</h2>
            <p className="text-slate-500 text-sm mb-4">All carry the {element} {animal} signature in their Chinese zodiac.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {celebrities.map(c => (
                <Link
                  key={c.slug}
                  href={`/celebrity-birth-charts/${c.slug}`}
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {c.image_url && (
                    <Image
                      src={c.image_url}
                      alt={c.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <span className="truncate">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 mb-8">
          <Link href={`/chinese-zodiac/${animal.toLowerCase()}`} className="btn-outline text-sm">
            More about the {animal}
          </Link>
          <Link href="/calculators/chinese-zodiac" className="btn-outline text-sm">
            Calculate another year
          </Link>
        </div>

        {/* CTA */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center mb-8">
          <p className="font-display text-xl tracking-wide mb-2">Discover what the rest of your chart reveals</p>
          <p className="text-slate-500 text-sm mb-4">Your Chinese zodiac is just the beginning... generate your full Western birth chart for a complete picture.</p>
          <Link href="/signup" className="btn-primary">Create Your Free Chart</Link>
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          {prevAnimal && prevYear && prevElement ? (
            <Link href={`/chinese-zodiac/year/${prevYear}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              ← {prevYear}: {ANIMAL_EMOJI[prevAnimal]} {prevElement} {prevAnimal}
            </Link>
          ) : <span />}
          {nextAnimal && nextYear && nextElement ? (
            <Link href={`/chinese-zodiac/year/${nextYear}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              {nextYear}: {ANIMAL_EMOJI[nextAnimal]} {nextElement} {nextAnimal} →
            </Link>
          ) : <span />}
        </div>
      </main>
    </>
  )
}
