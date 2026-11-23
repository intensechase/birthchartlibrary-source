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
import SectionStrip from '@/components/redesign/SectionStrip'
import { SIGNS as SIGNS_INFO } from '@/lib/interpretations/signs'
import { redesignOn } from '@/lib/redesign'
import { BODY_ICON, BODY_KEYS, DISC, GROUP_COLOR, ordinal, signIcon } from '@/lib/redesign/astro'
import type { HomePerson } from '@/lib/redesign/home-view'
import { Facts, Fold, LearnHero, NextLinks, People, PrevNext, Prose } from '@/components/redesign/Learn'

const PLANET_LOVE_LINK: Partial<Record<string, { href: string; label: string; sub: string }>> = {
  SUN:   { href: '/compatibility', label: 'Sun Sign Compatibility', sub: 'How your Sun sign connects with every other sign' },
  MOON:  { href: '/love/moon-sign-compatibility', label: 'Moon Sign Compatibility', sub: 'The relationship layer Sun signs miss' },
  VENUS: { href: '/compatibility', label: 'Compatibility', sub: 'What Venus reveals about how you attract and connect' },
  MARS:  { href: '/love/celebrity-couples', label: 'Famous couples', sub: 'What Mars reveals about desire and pursuit in relationships' },
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
  people?: HomePerson[]
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
  let people: HomePerson[] | undefined
  if (redesignOn('hubs')) {
    const { peopleWhere } = await import('@/lib/redesign/people')
    try { people = await peopleWhere(`${signCol} = $1`, [rulingSign]) } catch { people = [] }
  }
  const famousCelebs = people ? [] : await getListableCelebrities<FamousCeleb>({
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
      ...(people ? { people } : {}),
    })),
    revalidate: 604800,
  }
}

const PLANET_RULES_SIGN: Record<string, string> = {
  SUN: 'Leo', MOON: 'Cancer', MERCURY: 'Gemini', VENUS: 'Taurus', MARS: 'Aries',
  JUPITER: 'Sagittarius', SATURN: 'Capricorn', URANUS: 'Aquarius', NEPTUNE: 'Pisces',
  PLUTO: 'Scorpio', NORTH_NODE: 'Virgo', CHIRON: 'Virgo', LILITH: 'Scorpio',
}

export default function PlanetDetailPage({ planet, key_, planetName, title, description, prevKey, prevName, nextKey, nextName, famousCelebs, celebSignLabel, people }: PlanetPageProps) {
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
    <>
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
      {people ? (() => {
        const the = ['SUN', 'MOON', 'NORTH_NODE'].includes(key_) ? `The ${planetName}` : planetName
        const keys = (BODY_KEYS[key_] ?? '').split(', ')
        const classical = !['NORTH_NODE', 'CHIRON'].includes(key_)
        const ruledIdx = SIGN_LIST.indexOf(ruledSign)
        const books = PLANET_BOOKS[key_] ?? []
        const loveLink = PLANET_LOVE_LINK[key_]
        return (
          <main className="rdp"><div className="lrn">
            <LearnHero crumbs={[{ label: 'Planets', href: '/astrology-planets' }, { label: planetName }]} disc={{ color: DISC[key_] ?? DISC.RISING, icon: BODY_ICON[key_] }} kicker={classical ? 'Astrology planet' : 'Chart point'} title={the}>
              <p>{the} stands for {keys.slice(0, -1).join(', ')} and {keys[keys.length - 1]}.</p>
            </LearnHero>

            {classical && ruledIdx >= 0 ? (
              <Facts items={[
                { label: 'Rules', value: ruledSign, href: `/zodiac-signs/${ruledSign.toLowerCase()}` },
                { label: 'Natural house', value: `The ${ordinal(ruledIdx + 1)} house`, href: `/astrology-houses/${ruledIdx + 1}` },
              ]} />
            ) : null}

            <Prose title={`About ${the.replace(/^The /, 'the ')}`} text={info.description} />
            <Prose title="In mythology" text={info.mythology} />
            <Prose title="As a transit" text={info.asTransit} />
            {info.retrograde ? <Prose title={`${planetName} retrograde`} text={info.retrograde} /> : null}

            <section className="lsec" id="signs">
              <h2>{planetName} in the signs</h2>
              <p className="lede">How each sign shapes {the.replace(/^The /, 'the ')}. Open one to read it.</p>
              {SIGN_LIST.map(sign => {
                const text = PLANET_IN_SIGN[`${key_}_${sign}`]
                if (!text) return null
                const el = SIGNS_INFO[sign]?.element ?? 'Fire'
                return (
                  <Fold key={sign} title={`${planetName} in ${sign}`} disc={{ color: GROUP_COLOR[el], icon: signIcon(sign) }}>
                    {text.split(/\n\s*\n/).map((t, i) => <p key={i}>{t.trim()}</p>)}
                    <Link className="go" href={`/zodiac-signs/${sign.toLowerCase()}`}>All about {sign}</Link>
                  </Fold>
                )
              })}
            </section>

            <section className="lsec" id="houses">
              <h2>{planetName} in the houses</h2>
              <p className="lede">Where in life {the.replace(/^The /, 'the ')} does its work.</p>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => {
                const text = PLANET_IN_HOUSE[`${key_}_H${h}`]
                if (!text) return null
                return (
                  <Fold key={h} title={`${planetName} in the ${ordinal(h)} house`} disc={{ color: '#C9CFEA', text: String(h) }}>
                    {text.split(/\n\s*\n/).map((t, i) => <p key={i}>{t.trim()}</p>)}
                    <Link className="go" href={`/astrology-houses/${h}`}>All about the {ordinal(h)} house</Link>
                  </Fold>
                )
              })}
            </section>

            {/* No people for the Node and Chiron: they rule no sign, so there is no honest list. */}
            {classical ? <People title={`Famous ${celebSignLabel}s`} lede={`${the} rules ${celebSignLabel.split(' ')[0]}.`} people={people} more={key_ === 'MOON' ? undefined : { href: `/celebrity-birth-charts/sign/${celebSignLabel.split(' ')[0].toLowerCase()}`, label: `All ${celebSignLabel.split(' ')[0]} charts` }} /> : null}

            {books.length > 0 ? (
              <section className="lsec">
                <h2>Books about {the.replace(/^The /, 'the ')}</h2>
                <div className="books">
                  {books.map(book => (
                    <a key={book.amazonUrl} className="bk" href={book.amazonUrl} target="_blank" rel="noopener noreferrer nofollow">
                      {bookCoverUrl(book.amazonUrl) ? <img src={bookCoverUrl(book.amazonUrl)!} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} /> : null}
                      <span><b>{book.title}</b><small>by {book.author}</small><span className="bl">{book.blurb}</span></span>
                    </a>
                  ))}
                </div>
                <p className="disclose">As an Amazon Associate, Birth Chart Library earns from qualifying purchases.</p>
              </section>
            ) : null}

            <NextLinks title="From the blog" links={(PLANET_ARTICLES[key_] ?? []).map(a => ({ href: `/blog/${a.slug}`, title: a.title.replace(' \u2014 ', ': ') }))} />

            <NextLinks links={[
              { href: '/birth-chart?ref=planet-page', title: `Where is your ${planetName}?`, sub: `Your free chart shows its sign, house and what it means for you.` },
              { href: `/astrology-interpretations/${planet === 'north_node' ? 'north-node' : planet}`, title: 'Interpretation library', sub: `Every ${planetName} placement in one place.` },
              { href: '/astrology-aspects', title: 'The aspects', sub: `How ${the.replace(/^The /, 'the ')} talks to the other planets.` },
              ...(loveLink ? [{ href: loveLink.href, title: loveLink.label.replace(' & ', ' and ').replace('Sun Sign Compatibility', 'Sign compatibility').replace('Moon Sign Compatibility', 'Moon sign compatibility'), sub: loveLink.sub + '.' }] : []),
            ]} />

            <PrevNext prev={prevKey && prevName ? { href: `/astrology-planets/${prevKey}`, label: prevName } : null} next={nextKey && nextName ? { href: `/astrology-planets/${nextKey}`, label: nextName } : null} />
          </div></main>
        )
      })() : (
      <main className="max-w-3xl mx-auto px-4 py-12">
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

      <SectionStrip label={`${planetName} on this page`} sections={[
        { id: 'mythology', label: 'Mythology' },
        { id: 'transit', label: 'Transits' },
        ...(info.retrograde ? [{ id: 'retrograde', label: 'Retrograde' }] : []),
        { id: 'signs', label: 'Signs' },
        { id: 'houses', label: 'Houses' },
        ...(famousCelebs.length > 0 ? [{ id: 'famous', label: 'Famous charts' }] : []),
        ...(PLANET_BOOKS[key_]?.length ? [{ id: 'reading', label: 'Reading' }] : []),
      ]} />

      {/* Mythology & Symbolism */}
      <section className="mb-10">
        <h2 id="mythology" className="text-xl font-semibold mb-3">{planetName} in mythology and symbolism</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.mythology}</p>
      </section>

      {/* As a Transit */}
      <section className="mb-10">
        <h2 id="transit" className="text-xl font-semibold mb-3">{planetName} as a transit</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.asTransit}</p>
      </section>

      {/* Retrograde (conditional) */}
      {info.retrograde && (
        <section className="mb-10">
          <h2 id="retrograde" className="text-xl font-semibold mb-3">{planetName} retrograde</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.retrograde}</p>
        </section>
      )}

      {/* In each sign */}
      <h2 id="signs" className="text-xl font-semibold mb-4">{info.name} in the signs</h2>
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
      <h2 id="houses" className="text-xl font-semibold mb-4">{info.name} in the houses</h2>
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
                  {house === 1 ? '1st' : house === 2 ? '2nd' : house === 3 ? '3rd' : `${house}th`} house
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
          <h2 id="famous" className="text-xl font-semibold mb-2">Famous {celebSignLabel}s</h2>
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
          <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Interpretation library</p>
          <p className="text-xs text-slate-400 mt-0.5">Every {planetName} placement — all signs &amp; houses</p>
        </Link>
        <Link href="/astrology-aspects" className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Aspects guide</p>
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
          Get my free chart
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
          <h2 id="reading" className="text-xl font-semibold mb-2">Recommended reading</h2>
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
      )}
    </>
  )
}
