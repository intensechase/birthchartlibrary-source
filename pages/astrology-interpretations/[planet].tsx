import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { PLANETS } from '@/lib/interpretations'
import { PLANET_IN_SIGN } from '@/lib/interpretations/planet_in_sign'
import { PLANET_IN_HOUSE } from '@/lib/interpretations/planet_in_house'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { PLANET_KEYS, PLANET_SLUGS, SLUG_TO_PLANET_KEY, SIGN_LIST } from '@/lib/constants'

const SLUG_TO_KEY = SLUG_TO_PLANET_KEY

interface Props {
  slug: string
  planetKey: string
  planetName: string
  planetSymbol: string
  planetDescription: string
  prevSlug: string | null
  prevName: string | null
  nextSlug: string | null
  nextName: string | null
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.values(PLANET_SLUGS).map(slug => ({ params: { planet: slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.planet as string
  const planetKey = SLUG_TO_KEY[slug]
  if (!planetKey) return { notFound: true }

  const info = PLANETS[planetKey]
  if (!info) return { notFound: true }

  const idx = (PLANET_KEYS as readonly string[]).indexOf(planetKey)
  const prev = idx > 0 ? PLANET_KEYS[idx - 1] : null
  const next = idx < PLANET_KEYS.length - 1 ? PLANET_KEYS[idx + 1] : null

  return {
    props: {
      slug,
      planetKey,
      planetName: info.name,
      planetSymbol: info.symbol,
      planetDescription: info.description,
      prevSlug: prev ? PLANET_SLUGS[prev] : null,
      prevName: prev ? PLANETS[prev]?.name ?? null : null,
      nextSlug: next ? PLANET_SLUGS[next] : null,
      nextName: next ? PLANETS[next]?.name ?? null : null,
    },
    revalidate: 604800,
  }
}

function ordinal(n: number) {
  return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`
}

export default function PlanetInterpretationsPage({ slug, planetKey, planetName, planetSymbol, planetDescription, prevSlug, prevName, nextSlug, nextName }: Props) {
  const interpSlug = slug // e.g. "sun", "north-node"

  const planetFaqs = [
    {
      question: `What does ${planetName} represent in astrology?`,
      answer: planetDescription.slice(0, 450).trim(),
    },
    {
      question: `How does ${planetName} placement affect a birth chart?`,
      answer: `${planetName}'s expression shifts depending on which zodiac sign and house it occupies. Each of the 24 placements (12 signs, 12 houses) produces a distinct interpretation that shapes how ${planetName}'s themes show up in a person's life.`,
    },
  ]

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Head>
        <title>{`${planetName} Interpretations — Sign & House Placements`}</title>
        <meta name="description" content={`Read detailed ${planetName} interpretations for all 12 zodiac signs and all 12 houses. Understand what ${planetName} means in every placement of your birth chart.`} />
        <meta property="og:title" content={`${planetName} Interpretations — Sign & House Placements`} />
        <meta property="og:description" content={`Read detailed ${planetName} interpretations for all 12 zodiac signs and all 12 houses. Understand what ${planetName} means in every placement of your birth chart.`} />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(planetName + ' Interpretations')}&subtitle=In+Every+Sign+%26+House&symbol=${encodeURIComponent(planetSymbol)}&label=Birth+Chart+Library`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Interpretations', url: 'https://birthchartlibrary.com/astrology-interpretations' },
        { name: planetName, url: `https://birthchartlibrary.com/astrology-interpretations/${slug}` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(planetFaqs)) }} />

      {/* Breadcrumb */}
      <AdminBreadcrumb crumbs={[
        { label: 'Interpretations', href: '/astrology-interpretations' },
        { label: planetName },
      ]} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <span className="text-5xl">{planetSymbol}</span>
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide">{planetName} Interpretations</h1>
          <p className="text-slate-400 text-sm mt-1">All 24 placements... 12 signs and 12 houses</p>
        </div>
      </div>

      <div className="card mt-6 mb-10">
        <p className="text-slate-600 text-sm leading-relaxed">
          {planetDescription}
        </p>
        <p className="text-slate-500 text-sm leading-relaxed mt-3">
          {planetName}&apos;s expression varies by sign and by house. Select any placement below to read the full interpretation.
        </p>
        <Link href={`/astrology-planets/${slug === 'north-node' ? 'north_node' : slug}`} className="inline-block mt-3 text-xs text-slate-500 hover:text-slate-800 transition-colors">
          Learn more about {planetName} &rarr;
        </Link>
      </div>

      {/* In each sign */}
      <h2 className="text-xl font-semibold mb-4">{planetName} in the Signs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        {SIGN_LIST.map(sign => {
          const hasText = !!PLANET_IN_SIGN[`${planetKey}_${sign}`]
          if (!hasText) return null
          const ec = getElementColor(sign)
          return (
            <Link
              key={sign}
              href={`/interpretations/${interpSlug}-in-${sign.toLowerCase()}`}
              className={`card border-l-4 ${ec.border} hover:border-slate-400 transition-colors group`}
            >
              <div className="flex items-center gap-2">
                <SignGlyph sign={sign} decorative className="text-lg" />
                <span className="font-medium text-sm group-hover:text-slate-600 transition-colors">
                  {planetName} in {sign}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* In each house */}
      <h2 className="text-xl font-semibold mb-4">{planetName} in the Houses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(house => {
          const hasText = !!PLANET_IN_HOUSE[`${planetKey}_H${house}`]
          if (!hasText) return null
          return (
            <Link
              key={house}
              href={`/interpretations/${interpSlug}-in-house-${house}`}
              className="card hover:border-slate-400 transition-colors group"
            >
              <span className="font-medium text-sm group-hover:text-slate-600 transition-colors">
                {planetName} in the {ordinal(house)} House
              </span>
            </Link>
          )
        })}
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between pt-6 border-t border-slate-200">
        {prevSlug ? (
          <Link href={`/astrology-interpretations/${prevSlug}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            &larr; {prevName}
          </Link>
        ) : <span />}
        {nextSlug ? (
          <Link href={`/astrology-interpretations/${nextSlug}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            {nextName} &rarr;
          </Link>
        ) : <span />}
      </div>
    </main>
  )
}
