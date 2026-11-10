import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { HOUSES, PLANETS } from '@/lib/interpretations'
import { PLANET_IN_HOUSE } from '@/lib/interpretations/planet_in_house'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { SIGN_LIST, PLANET_KEYS } from '@/lib/constants'

const naturalSigns = SIGN_LIST

function ordinal(n: number): string {
  return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`
}

interface HousePageProps {
  house: string
  num: number
  houseName: string
  title: string
  description: string
  prev: number
  next: number
  prevName: string
  nextName: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Array.from({ length: 12 }, (_, i) => ({ params: { house: String(i + 1) } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<HousePageProps> = async (context) => {
  const house = context.params?.house as string
  const num = parseInt(house, 10)
  if (isNaN(num) || num < 1 || num > 12) return { notFound: true }

  const info = HOUSES[num]
  if (!info) return { notFound: true }

  const prev = num > 1 ? num - 1 : 12
  const next = num < 12 ? num + 1 : 1

  return {
    props: {
      house,
      num,
      houseName: info.name,
      title: `${ordinal(num)} House in Astrology — Meaning & Planets | Birth Chart Library`,
      description: `What does the ${ordinal(num)} House mean in your birth chart? Explore its themes (${info.keywords.join(', ')}) and what each planet means when placed here.`,
      prev,
      next,
      prevName: HOUSES[prev]?.name ?? '',
      nextName: HOUSES[next]?.name ?? '',
    },
  }
}

export default function HouseDetailPage({ house, num, houseName, title, description, prev, next, prevName, nextName }: HousePageProps) {
  const info = HOUSES[num]
  if (!info) return null
  const ec = getElementColor(naturalSigns[num - 1])
  const naturalRuler = naturalSigns[num - 1]

  const shortDesc = info.description.length > 280 ? info.description.slice(0, 280).replace(/\s\S+$/, '') + '...' : info.description
  const faqs = [
    { question: `What does the ${ordinal(num)} House represent in astrology?`, answer: shortDesc },
    { question: `What sign naturally rules the ${ordinal(num)} House?`, answer: `The ${ordinal(num)} House is naturally ruled by ${naturalRuler}, and shares thematic resonance with that sign's core qualities.` },
    { question: `What are the key themes of the ${ordinal(num)} House?`, answer: `The ${ordinal(num)} House governs ${info.keywords.join(', ')}. Planets placed here are filtered through these themes in your natal chart.` },
  ]

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://birthchartlibrary.com/astrology-houses/${house}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://birthchartlibrary.com/astrology-houses/${house}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(houseName)}&subtitle=${encodeURIComponent('House ' + num + ' of the Natal Chart')}&symbol=${encodeURIComponent('🏠')}&label=Astrology+House`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', url: 'https://birthchartlibrary.com' }, { name: 'Houses', url: 'https://birthchartlibrary.com/astrology-houses' }, { name: info.name, url: `https://birthchartlibrary.com/astrology-houses/${house}` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />
      {/* Breadcrumb */}
      <AdminBreadcrumb crumbs={[
        { label: 'Houses', href: '/astrology-houses' },
        { label: info.name },
      ]} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className={`text-4xl font-bold ${ec.text}`}>H{num}</span>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide">{info.name}</h1>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-8">
        {info.keywords.map(k => (
          <span key={k} className={`text-sm px-3 py-1 rounded-full ${ec.bg} border ${ec.border} ${ec.text}`}>{k}</span>
        ))}
      </div>

      {/* Main description */}
      <div className={`card mb-10 border-l-4 ${ec.border}`}>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{info.description}</p>
      </div>

      {/* In Depth */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">The {info.name} in Depth</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.inDepth}</p>
      </section>

      {/* The Axis */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">The {ordinal(num)}/{ordinal(num <= 6 ? num + 6 : num - 6)} House Axis</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.oppositeAxis}</p>
      </section>

      {/* Empty House */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">An Empty {info.name}</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.emptyHouse}</p>
      </section>

      {/* Natural ruler cross-links */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href={`/zodiac-signs/${naturalRuler.toLowerCase()}`}
          className={`card flex items-center gap-2 hover:border-slate-400 transition-colors group px-4 py-3`}
        >
          <SignGlyph sign={naturalRuler} decorative className={`text-lg ${ec.text}`} />
          <div>
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{naturalRuler} — Natural Sign</p>
            <p className="text-xs text-slate-400">The sign that naturally governs this house</p>
          </div>
        </Link>
        <Link
          href="/astrology-interpretations"
          className="card flex items-center gap-2 hover:border-slate-400 transition-colors group px-4 py-3"
        >
          <span className="text-lg">📖</span>
          <div>
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Interpretation Library</p>
            <p className="text-xs text-slate-400">Every planet in every house — look up yours</p>
          </div>
        </Link>
      </div>

      {/* Planets in this house */}
      <h2 className="text-xl font-semibold mb-4">Planets in the {info.name}</h2>
      <p className="text-slate-500 text-sm mb-6">
        What each planet brings when placed in the {ordinal(num)} house of your chart.
      </p>
      <div className="space-y-4">
        {PLANET_KEYS.map(key => {
          const text = PLANET_IN_HOUSE[`${key}_H${num}`]
          const planet = PLANETS[key]
          if (!text || !planet) return null
          return (
            <div key={key} className="card">
              <h3 className="font-medium mb-2">
                <Link href={`/astrology-planets/${key.toLowerCase()}`} className="text-slate-600 hover:text-slate-600 transition-colors">
                  {planet.symbol} {planet.name}
                </Link>
                {' '}in the {info.name}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
            </div>
          )
        })}
      </div>

      {/* Contextual cross-links for relationship houses */}
      {[5, 7, 8].includes(num) && (
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/love" className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Love &amp; Astrology →
            </Link>
            {num === 7 && (
              <Link href="/compatibility" className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Compatibility Guide →
              </Link>
            )}
            <Link href="/calculators/synastry" className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Synastry Calculator →
            </Link>
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link href={`/astrology-houses/${prev}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          &larr; {prevName}
        </Link>
        <Link href={`/astrology-houses/${next}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          {nextName} &rarr;
        </Link>
      </div>
    </main>
  )
}
