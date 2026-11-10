import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Head from 'next/head'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'
import { PLANETS } from '@/lib/interpretations'
import { PLANET_IN_SIGN } from '@/lib/interpretations/planet_in_sign'
import { PLANET_IN_HOUSE } from '@/lib/interpretations/planet_in_house'
import { getElementColor } from '@/lib/zodiac-colors'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { getListableCelebrities } from '@/lib/celebrities'
import { PLANET_BOOKS } from '@/lib/interpretations/planet-books'
import { bookCoverUrl } from '@/lib/book-cover'
import { PLANET_KEYS, SIGN_LIST } from '@/lib/constants'

const PLANET_LOVE_LINK: Partial<Record<string, { href: string; label: string; sub: string }>> = {
  SUN:   { href: '/compatibility', label: 'Sun Sign Compatibility', sub: 'How your Sun sign connects with every other sign' },
  MOON:  { href: '/love/moon-sign-compatibility', label: 'Moon Sign Compatibility', sub: 'The relationship layer Sun signs miss' },
  VENUS: { href: '/love', label: 'Love & Astrology', sub: 'What Venus reveals about how you attract and connect' },
  MARS:  { href: '/love', label: 'Love & Astrology', sub: 'What Mars reveals about desire and pursuit in relationships' },
}

const PLANET_ARTICLES: Record<string, { slug: string; title: string }[]> = {
  SUN: [
    { slug: 'what-is-your-sun-sign-complete-guide', title: 'Your Complete Sun Sign Guide' },
    { slug: 'the-big-three-astrology-sun-moon-rising', title: 'The Big Three Explained: Sun, Moon & Rising' },
    { slug: 'sun-moon-rising-difference', title: 'Sun, Moon & Rising — What\'s the Difference?' },
  ],
  MOON: [
    { slug: 'what-your-moon-sign-says-about-your-emotional-life', title: 'What Your Moon Sign Says About Your Emotional Life' },
    { slug: 'the-big-three-astrology-sun-moon-rising', title: 'The Big Three Explained: Sun, Moon & Rising' },
    { slug: 'moon-sign-compatibility', title: 'Moon Sign Compatibility' },
  ],
  MERCURY: [
    { slug: 'mercury-in-your-birth-chart', title: 'Mercury in Your Birth Chart: How You Think & Communicate' },
    { slug: 'mercury-retrograde-meaning', title: 'What Is Mercury Retrograde?' },
    { slug: 'mercury-retrograde-survival-guide', title: 'Mercury Retrograde Survival Guide' },
  ],
  VENUS: [
    { slug: 'venus-in-your-birth-chart', title: 'Venus in Your Birth Chart: How You Love' },
    { slug: 'venus-in-every-sign', title: 'Venus in Every Sign' },
    { slug: 'venus-retrograde', title: 'Venus Retrograde' },
  ],
  MARS: [
    { slug: 'mars-in-your-birth-chart', title: 'Mars in Your Birth Chart: How You Take Action' },
    { slug: 'mars-in-every-sign', title: 'Mars in Every Sign' },
    { slug: 'mars-retrograde', title: 'Mars Retrograde' },
  ],
  JUPITER: [
    { slug: 'jupiter-in-your-birth-chart', title: 'Jupiter in Your Birth Chart: Luck & Growth' },
    { slug: 'the-jupiter-return', title: 'The Jupiter Return: Your 12-Year Cycle' },
    { slug: 'planetary-dignity-rulership-exaltation', title: 'Planetary Dignity: Rulership & Exaltation' },
  ],
  SATURN: [
    { slug: 'saturn-in-your-birth-chart', title: 'Saturn in Your Birth Chart: Where You Build' },
    { slug: 'saturn-return-explained', title: 'The Saturn Return: Your Astrological Coming of Age' },
    { slug: 'the-saturn-opposition', title: 'The Saturn Opposition: Your Midlife Check-In' },
  ],
  URANUS: [
    { slug: 'outer-planets-uranus-neptune-pluto', title: 'The Outer Planets: Uranus, Neptune & Pluto' },
    { slug: 'retrograde-planet-in-birth-chart', title: 'Retrograde Planets in Your Birth Chart' },
    { slug: 'the-age-of-aquarius', title: 'The Age of Aquarius: What It Actually Means' },
  ],
  NEPTUNE: [
    { slug: 'outer-planets-uranus-neptune-pluto', title: 'The Outer Planets: Uranus, Neptune & Pluto' },
    { slug: 'retrograde-planet-in-birth-chart', title: 'Retrograde Planets in Your Birth Chart' },
    { slug: 'astrology-as-self-discovery-tool', title: 'How to Use Astrology as a Self-Discovery Tool' },
  ],
  PLUTO: [
    { slug: 'pluto-in-your-birth-chart', title: 'Pluto in Your Birth Chart: Transformation & Power' },
    { slug: 'outer-planets-uranus-neptune-pluto', title: 'The Outer Planets: Uranus, Neptune & Pluto' },
    { slug: 'retrograde-planet-in-birth-chart', title: 'Retrograde Planets in Your Birth Chart' },
  ],
  CHIRON: [
    { slug: 'chiron-in-astrology', title: 'Chiron in Your Birth Chart: Your Wound & Wisdom' },
    { slug: 'astrology-as-self-discovery-tool', title: 'How to Use Astrology as a Self-Discovery Tool' },
    { slug: 'how-to-read-your-birth-chart', title: 'How to Read Your Birth Chart (Step by Step)' },
  ],
  NORTH_NODE: [
    { slug: 'north-node-astrology-meaning', title: 'The North Node: Your Soul\'s Growth Direction' },
    { slug: 'how-to-read-your-birth-chart', title: 'How to Read Your Birth Chart (Step by Step)' },
    { slug: 'astrology-as-self-discovery-tool', title: 'How to Use Astrology as a Self-Discovery Tool' },
  ],
}

interface FamousCeleb {
  name: string
  slug: string
  image_url: string | null
  sun_sign: string | null
}

interface PlanetPageProps {
  planet: string
  key_: string
  planetName: string
  title: string
  description: string
  prevKey: string | null
  prevName: string | null
  nextKey: string | null
  nextName: string | null
  famousCelebs: FamousCeleb[]
  celebSignLabel: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<PlanetPageProps> = async (context) => {
  const planet = context.params?.planet as string
  const key = planet.toUpperCase()
  const info = PLANETS[key]
  if (!info) return { notFound: true }

  const idx = (PLANET_KEYS as readonly string[]).indexOf(key)
  const prev = idx > 0 ? PLANET_KEYS[idx - 1] : null
  const next = idx < PLANET_KEYS.length - 1 ? PLANET_KEYS[idx + 1] : null

  // Fetch celebrities — use the sign this planet rules
  const PLANET_RULES: Record<string, string> = {
    SUN: 'Leo', MOON: 'Cancer', MERCURY: 'Gemini', VENUS: 'Taurus', MARS: 'Aries',
    JUPITER: 'Sagittarius', SATURN: 'Capricorn', URANUS: 'Aquarius', NEPTUNE: 'Pisces',
    PLUTO: 'Scorpio', NORTH_NODE: 'Virgo', CHIRON: 'Virgo', LILITH: 'Scorpio',
  }
  const rulingSign = PLANET_RULES[key] || 'Aries'
  const celebSignLabel = key === 'MOON' ? `${rulingSign} Moon` : `${rulingSign} Sun`
  const signCol = key === 'MOON' ? 'moon_sign' : 'sun_sign'
  const famousCelebs = await getListableCelebrities<FamousCeleb>({
    columns: 'name, slug, image_url, sun_sign',
    where: `${signCol} = $1`,
    params: [rulingSign],
    orderBy: 'RANDOM()',
    limit: 12,
  })

  return {
    props: JSON.parse(JSON.stringify({
      planet,
      key_: key,
      planetName: info.name,
      title: `${info.name} in Astrology — Meaning, Signs & Houses | Birth Chart Library`,
      description: `What does ${info.name} mean in your birth chart? Explore ${info.name} through all 12 zodiac signs and all 12 houses.`,
      prevKey: prev ? prev.toLowerCase() : null,
      prevName: prev ? (PLANETS[prev]?.name ?? null) : null,
      nextKey: next ? next.toLowerCase() : null,
      nextName: next ? (PLANETS[next]?.name ?? null) : null,
      famousCelebs,
      celebSignLabel,
    })),
    revalidate: 604800,
  }
}

const PLANET_RULES_SIGN: Record<string, string> = {
  SUN: 'Leo', MOON: 'Cancer', MERCURY: 'Gemini', VENUS: 'Taurus', MARS: 'Aries',
  JUPITER: 'Sagittarius', SATURN: 'Capricorn', URANUS: 'Aquarius', NEPTUNE: 'Pisces',
  PLUTO: 'Scorpio', NORTH_NODE: 'Virgo', CHIRON: 'Virgo', LILITH: 'Scorpio',
}

export default function PlanetDetailPage({ planet, key_, planetName, title, description, prevKey, prevName, nextKey, nextName, famousCelebs, celebSignLabel }: PlanetPageProps) {
  const info = PLANETS[key_]
  if (!info) return null

  const ruledSign = PLANET_RULES_SIGN[key_]
  const shortDesc = info.description.length > 250 ? info.description.slice(0, 250).replace(/\s\S+$/, '') + '...' : info.description
  const faqs = [
    { question: `What does ${planetName} represent in astrology?`, answer: shortDesc },
    { question: `What sign does ${planetName} rule?`, answer: `${planetName} rules ${ruledSign}. This rulership means ${planetName}'s energy is most naturally expressed through ${ruledSign}'s qualities.` },
    { question: `How does ${planetName} affect a birth chart?`, answer: `In a birth chart, ${planetName} shows where and how its archetype operates in your life. The sign ${planetName} is in colors its expression; the house it occupies shows the life area it most influences.` },
  ]

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://birthchartlibrary.com/astrology-planets/${planet}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://birthchartlibrary.com/astrology-planets/${planet}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(planetName)}&subtitle=${encodeURIComponent('Planet in Astrology')}&symbol=${encodeURIComponent(info.symbol)}&label=Astrology+Planet`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', url: 'https://birthchartlibrary.com' }, { name: 'Planets', url: 'https://birthchartlibrary.com/astrology-planets' }, { name: info.name, url: `https://birthchartlibrary.com/astrology-planets/${planet}` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />
      {/* Breadcrumb */}
      <AdminBreadcrumb crumbs={[
        { label: 'Planets', href: '/astrology-planets' },
        { label: info.name },
      ]} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl">{info.symbol}</span>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide">{info.name}</h1>
      </div>

      {/* Main description */}
      <div className="card mb-10">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{info.description}</p>
      </div>

      {/* Mythology & Symbolism */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">{planetName} in Mythology &amp; Symbolism</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.mythology}</p>
      </section>

      {/* As a Transit */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">{planetName} as a Transit</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.asTransit}</p>
      </section>

      {/* Retrograde (conditional) */}
      {info.retrograde && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">{planetName} Retrograde</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.retrograde}</p>
        </section>
      )}

      {/* In each sign */}
      <h2 className="text-xl font-semibold mb-4">{info.name} in the Signs</h2>
      <p className="text-slate-500 text-sm mb-6">
        How {info.name}&apos;s energy is shaped by each zodiac sign.
      </p>
      <div className="space-y-4 mb-12">
        {SIGN_LIST.map(sign => {
          const text = PLANET_IN_SIGN[`${key_}_${sign}`]
          if (!text) return null
          const ec = getElementColor(sign)
          return (
            <div key={sign} className={`card border-l-4 ${ec.border}`}>
              <h3 className="font-medium mb-2">
                {info.name} in{' '}
                <Link href={`/zodiac-signs/${sign.toLowerCase()}`} className={`${ec.text} hover:opacity-80 transition-colors`}>
                  {sign}
                </Link>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
            </div>
          )
        })}
      </div>

      {/* In each house */}
      <h2 className="text-xl font-semibold mb-4">{info.name} in the Houses</h2>
      <p className="text-slate-500 text-sm mb-6">
        How {info.name}&apos;s energy is focused by each house placement.
      </p>
      <div className="space-y-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(house => {
          const text = PLANET_IN_HOUSE[`${key_}_H${house}`]
          if (!text) return null
          return (
            <div key={house} className="card">
              <h3 className="font-medium mb-2">
                {info.name} in the{' '}
                <Link href={`/astrology-houses/${house}`} className="text-slate-600 hover:text-slate-600 transition-colors">
                  {house === 1 ? '1st' : house === 2 ? '2nd' : house === 3 ? '3rd' : `${house}th`} House
                </Link>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
            </div>
          )
        })}
      </div>

      {/* Famous celebrities */}
      {famousCelebs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-2">Famous {celebSignLabel} Celebrities</h2>
          <p className="text-slate-500 text-sm mb-5">
            {planetName} rules {celebSignLabel.split(' ')[0]}. Here are some notable {celebSignLabel.toLowerCase()} charts.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {famousCelebs.map(c => (
              <Link
                key={c.slug}
                href={`/celebrity-birth-charts/${c.slug}`}
                className="card flex items-center gap-3 hover:border-slate-300 transition-colors group"
              >
                {c.image_url && (
                  <Image
                    src={`/api/img/${c.slug}`}
                    alt={c.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                )}
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors truncate">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3 mt-10 mb-4">
        <Link href={`/astrology-interpretations/${planet === 'north_node' ? 'north-node' : planet}`} className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Interpretation Library</p>
          <p className="text-xs text-slate-400 mt-0.5">Every {planetName} placement — all signs &amp; houses</p>
        </Link>
        <Link href="/astrology-aspects" className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Aspects Guide</p>
          <p className="text-xs text-slate-400 mt-0.5">How {planetName} interacts with other planets</p>
        </Link>
        {ruledSign && (
          <Link href={`/zodiac-signs/${ruledSign.toLowerCase()}`} className="card hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{ruledSign} — Ruled Sign</p>
            <p className="text-xs text-slate-400 mt-0.5">{planetName}&apos;s home sign in the zodiac</p>
          </Link>
        )}
      </div>

      {/* Conversion CTA */}
      <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">Where is your {planetName}?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Calculate your free birth chart to find your {planetName} sign, house, and personal interpretation.</p>
        </div>
        <a href="/signup?ref=planet-page" className="btn-primary shrink-0 px-6 py-2.5 text-sm whitespace-nowrap">
          Get My Free Chart
        </a>
      </div>

      {/* Love / compatibility cross-link */}
      {PLANET_LOVE_LINK[key_] && (
        <div className="mt-4">
          <Link href={PLANET_LOVE_LINK[key_]!.href} className="text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            {PLANET_LOVE_LINK[key_]!.label} — {PLANET_LOVE_LINK[key_]!.sub} →
          </Link>
        </div>
      )}

      {/* Recommended Reading */}
      {PLANET_BOOKS[key_] && PLANET_BOOKS[key_].length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-2">Recommended Reading</h2>
          <p className="text-slate-500 text-sm mb-5">
            Books that go deeper on {planetName} — its mythology, transits, and role in your birth chart.
          </p>
          <div className="space-y-3">
            {PLANET_BOOKS[key_].map((book, i) => (
              <a
                key={i}
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="card flex items-start gap-4 hover:border-slate-400 transition-colors group"
              >
                {bookCoverUrl(book.amazonUrl) && (
                  <img
                    src={bookCoverUrl(book.amazonUrl)!}
                    alt={`${book.title} cover`}
                    loading="lazy"
                    className="w-16 h-auto flex-shrink-0 rounded shadow-sm"
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800 group-hover:text-slate-600 transition-colors">{book.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">by {book.author}</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{book.blurb}</p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[10px] text-slate-300 mt-3">
            As an Amazon Associate, Birth Chart Library earns from qualifying purchases.
          </p>
        </div>
      )}

      {/* From the blog */}
      {PLANET_ARTICLES[key_] && (
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">From the blog</h2>
          <div className="space-y-2">
            {PLANET_ARTICLES[key_].map(a => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors hover:underline">
                {a.title} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
        {prevKey ? (
          <Link href={`/astrology-planets/${prevKey}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            &larr; {prevName}
          </Link>
        ) : <span />}
        {nextKey ? (
          <Link href={`/astrology-planets/${nextKey}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            {nextName} &rarr;
          </Link>
        ) : <span />}
      </div>
    </main>
  )
}
