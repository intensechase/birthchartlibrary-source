import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { query, queryOne, parseJsonb } from '@/lib/db'
import { getFeaturedCelebrities, getListableCelebrities, type FeaturedCeleb } from '@/lib/celebrities'
import { getDailySky } from '@/lib/swisseph/daily-sky'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { MOON_REFLECTIONS, MOON_WEATHER } from '@/lib/interpretations/daily'
import { websiteSchema, jsonLd } from '@/lib/schema'
import GuestHoroscopeSignup from '@/components/GuestHoroscopeSignup'
import PlanetOrbit from '@/components/PlanetOrbit'
import NatalChartWheel, { PLANET_PATHS, toneOf } from '@/components/NatalChartWheel'
import Scallop from '@/components/Scallop'
import FeaturedCelebs, { cleanCelebName } from '@/components/FeaturedCelebs'
import { SIGN_LIST } from '@/lib/constants'
import { NOINDEX_BLOG_SQL } from '@/lib/thin-pages'

const SKY_PLANETS = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO']
// The chart drawn in the hero. Its page is one of the detailed profiles.
const HERO_SLUG = 'tom-hanks'

interface CelebRow {
  name: string
  slug: string
  sun_sign: string | null
  category: string | null
  image_url: string | null
}

interface PlanetPos {
  planet: string
  sign: string
  signDegree: number
  retrograde: boolean
}

interface BlogTeaser {
  slug: string
  title: string
  description: string
  category: string
  readTime: string
}

interface HeroChart {
  name: string
  slug: string
  hasBirthTime: boolean
  chart: BirthChartData
}

interface HomeProps {
  todayCeleb: CelebRow | null
  moonSign: string
  planets: PlanetPos[]
  dateStr: string
  todayISO: string
  latestArticles: BlogTeaser[]
  featuredCelebs: FeaturedCeleb[]
  hero: HeroChart | null
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const now = new Date()
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()

  const today = now.toISOString().split('T')[0]
  const [todayCelebs, sky, articleRows, featuredCelebs, heroRow] = await Promise.all([
    getListableCelebrities<CelebRow>({
      columns: 'name, slug, sun_sign, category, image_url',
      where: 'EXTRACT(MONTH FROM birth_date) = $1 AND EXTRACT(DAY FROM birth_date) = $2',
      params: [month, day],
      orderBy: 'name',
      limit: 1,
      requireImage: false,
    }),
    getDailySky(),
    query<{ slug: string; title: string; description: string; category: string; read_time: string }>(
      `SELECT slug, title, description, category, read_time
       FROM blog_articles
       WHERE published = true AND publish_date <= $1 AND ${NOINDEX_BLOG_SQL}
       ORDER BY publish_date DESC
       LIMIT 3`,
      [today]
    ),
    getFeaturedCelebrities(8),
    queryOne<{ name: string; slug: string; birth_time: string | null; chart_data: unknown }>(
      'SELECT name, slug, birth_time, chart_data FROM celebrities WHERE slug = $1',
      [HERO_SLUG]
    ).catch(() => null),
  ])
  const latestArticles: BlogTeaser[] = articleRows.map(a => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    readTime: a.read_time,
  }))

  const heroChart = heroRow ? parseJsonb<BirthChartData | null>(heroRow.chart_data) : null
  const hero: HeroChart | null = heroRow && heroChart
    ? {
        name: heroRow.name,
        slug: heroRow.slug,
        hasBirthTime: !!heroRow.birth_time,
        // Only what the wheel draws.
        chart: {
          planets: heroChart.planets.map(p => ({ planet: p.planet, sign: p.sign, signDegree: p.signDegree, house: p.house, retrograde: p.retrograde, longitude: p.longitude })),
          houseCusps: heroChart.houseCusps,
          ascendant: heroChart.ascendant,
          midheaven: heroChart.midheaven,
          ascendantSign: heroChart.ascendantSign,
          midheavenSign: heroChart.midheavenSign,
        } as BirthChartData,
      }
    : null

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const todayISO = `${now.getUTCFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return {
    props: JSON.parse(JSON.stringify({
      todayCeleb: todayCelebs[0] ?? null,
      moonSign: sky.moonSign,
      planets: sky.planets,
      dateStr,
      todayISO,
      latestArticles,
      featuredCelebs,
      hero,
    })),
    revalidate: 21600,
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  basics: 'Basics',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  tools: 'Tools',
}

const INK = 'text-slate-800 dark:text-slate-100'
const MUTED = 'text-slate-500 dark:text-slate-400'
const ACCENT_LINK = 'font-bold text-[var(--accent)] hover:underline'
const NAVY = 'bg-[#14203F] dark:bg-[#0E1730]'
const cleanName = cleanCelebName

function GlyphIcon({ path, size = 15, color }: { path: string; size?: number; color: string }) {
  return (
    <svg viewBox="-13 -13 26 26" width={size} height={size} aria-hidden="true">
      <path d={path} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HomePage({ todayCeleb, moonSign, planets, dateStr, todayISO, latestArticles, featuredCelebs, hero }: InferGetStaticPropsType<typeof getStaticProps>) {
  const skyPlanets = SKY_PLANETS.flatMap(id => planets.find(p => p.planet === id) ?? [])
  const router = useRouter()
  const [showUnsubscribed, setShowUnsubscribed] = useState(false)

  useEffect(() => {
    if (router.query.unsubscribed === '1') {
      setShowUnsubscribed(true)
      router.replace('/', undefined, { shallow: true })
    }
  }, [router.query])

  const heroSun = hero?.chart.planets.find(p => p.planet === 'SUN')?.sign
  const heroMoon = hero?.chart.planets.find(p => p.planet === 'MOON')?.sign
  const heroFirst = hero ? cleanName(hero.name) : ''
  const moonTone = SIGN_LIST.includes(moonSign) ? `var(--w-${toneOf(moonSign)})` : 'var(--gold)'

  return (
    <>
      <Head>
        <title>Birth Chart Library — Free Birth Chart & Natal Chart</title>
        <meta name="description" content="Calculate your birth chart, explore 550+ researched celebrity natal charts, and get a personalized daily horoscope — free, with 1,700+ chart interpretations." />
        <meta property="og:title" content="Birth Chart Library — Every Chart Tells a Story" />
        <meta property="og:description" content="Your cosmic blueprint — calculated, interpreted, and updated every day. 550+ celebrity charts, 1,700+ interpretations, free daily horoscope." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://birthchartlibrary.com" />
        <meta property="og:site_name" content="Birth Chart Library" />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Birth Chart Library" />
        <meta name="twitter:description" content="Your cosmic blueprint... explained in plain English." />
        <meta name="twitter:image" content="https://birthchartlibrary.com/api/og" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema()) }} />

      {/* Hero */}
      <section className="bg-[var(--band)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-11">
          {showUnsubscribed && (
            <div className="mb-6 flex items-center justify-between gap-3 bg-[var(--surface)] rounded-xl px-5 py-3 text-sm">
              <span>You&apos;ve been unsubscribed from daily horoscope emails.</span>
              <button onClick={() => setShowUnsubscribed(false)} aria-label="Dismiss" className={`${MUTED} text-lg leading-none`}>×</button>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-7">
            <div className="flex-[1_1_420px] min-w-0">
              <h1 className="text-[clamp(3rem,7.4vw,5.25rem)] leading-[1.02] mb-4">Every chart tells a story.</h1>
              <p className="text-lg sm:text-xl max-w-[28em] mb-7">
                Your cosmic blueprint: calculated, interpreted, and updated every day.
              </p>
              <div className="flex flex-wrap gap-3.5 mb-5">
                <Link href="/birth-chart?ref=home-hero" className="btn-primary px-6 py-3 text-base">
                  Read My Chart
                </Link>
                <Link href="/celebrity-birth-charts" className="btn-outline px-6 py-3 text-base">
                  Browse the Library
                </Link>
              </div>
              <p className={`text-sm ${MUTED}`}>
                550+ celebrity charts &middot; 1,700+ interpretations &middot; Free forever
              </p>
            </div>
            <figure className="flex-[1_1_400px] min-w-0 text-center">
              {hero ? (
                <>
                  <Link href={`/celebrity-birth-charts/${hero.slug}`} className="block max-w-[540px] mx-auto [&_.chart-wheel]:bg-transparent" aria-label={`${heroFirst}'s birth chart`}>
                    <NatalChartWheel chartData={hero.chart} hasBirthTime={hero.hasBirthTime} />
                  </Link>
                  <figcaption className={`mt-1.5 text-sm font-bold ${MUTED}`}>
                    <Link href={`/celebrity-birth-charts/${hero.slug}`} className="hover:underline">
                      {heroFirst}&apos;s chart{heroSun && heroMoon ? `: ${heroSun} Sun, ${heroMoon} Moon` : ''}. See how it reads.
                    </Link>
                  </figcaption>
                </>
              ) : (
                <div className="w-64 h-64 sm:w-96 sm:h-96 mx-auto">
                  <PlanetOrbit className="w-full h-full" />
                </div>
              )}
            </figure>
          </div>
        </div>
      </section>
      <Scallop id="hero-scallops" top="var(--band)" className={NAVY} />

      {/* Today's Sky */}
      <section className={`${NAVY} text-[#D5DBEC]`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6">
            <div>
              <p className="text-[13px] font-bold tracking-[.1em] uppercase text-[#B4BEDA] mb-1">{dateStr}</p>
              <h2 className="!text-[#F2E6C8] text-4xl sm:text-[44px]">Today&apos;s Sky</h2>
            </div>
            <Link href={`/daily/${todayISO}`} className="font-bold text-[#F4BE3C] hover:underline">
              Full sky →
            </Link>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(290px,100%),1fr))] gap-5 mb-6">
            <div className="bg-[#26376A] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full border-[3px] border-[#0A0E1E] inline-flex items-center justify-center shrink-0" style={{ background: moonTone }} aria-hidden="true">
                  <span className="w-[26px] h-[26px] rounded-full bg-[#FFF9EA] inline-flex items-center justify-center">
                    <GlyphIcon path={PLANET_PATHS.MOON} size={18} color="#1A1622" />
                  </span>
                </span>
                <h3 className="!font-body !text-[#F2E6C8] text-xl font-black">Moon in {moonSign}</h3>
              </div>
              <p>{MOON_WEATHER[moonSign]}</p>
            </div>
            <div className="bg-[#FFF9EA] text-[#1A1622] border-[3px] border-[#0A0E1E] rounded-2xl shadow-[0_5px_0_#0A0E1E] p-6">
              <p className="text-[13px] font-bold tracking-[.1em] uppercase text-[#B23A10] mb-2.5">Reflection</p>
              <p className="font-display font-extrabold text-2xl sm:text-[27px] leading-[1.25] text-[#1A1622]">{MOON_REFLECTIONS[moonSign]}</p>
            </div>
          </div>

          <ul className="flex flex-wrap gap-2 mb-5" aria-label="Planet positions today">
            {skyPlanets.map(p => (
              <li key={p.planet} className="inline-flex items-center gap-1.5 px-3 py-[3px] rounded-full bg-[#1D2C54] text-sm text-[#F2E6C8]">
                {PLANET_PATHS[p.planet] && <GlyphIcon path={PLANET_PATHS[p.planet]} color="#F4BE3C" />}
                <span className="sr-only">{p.planet.charAt(0) + p.planet.slice(1).toLowerCase()} in</span>
                {p.sign}{p.retrograde && <span title="Retrograde"> ℞</span>}
              </li>
            ))}
          </ul>

          {todayCeleb && (
            <Link href={`/celebrity-birth-charts/${todayCeleb.slug}`} className="inline-flex items-center gap-3 group">
              {todayCeleb.image_url && (
                <Image src={`/api/img/${todayCeleb.slug}`} alt="" width={44} height={44} className="w-11 h-11 rounded-full object-cover object-top border-[3px] border-[#F2E6C8]" />
              )}
              <span>
                Born today: <span className="font-black text-[#F2E6C8] group-hover:underline">{cleanName(todayCeleb.name)}</span>
                {todayCeleb.sun_sign && <>, {todayCeleb.sun_sign}</>}
              </span>
            </Link>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3.5 mt-7 pt-6 border-t-2 border-[#3B4C7D]">
            <div className="flex-[1_1_380px] min-w-0">
              <p className="text-[#F2E6C8] font-black text-[19px] mb-0.5">See what today&apos;s sky means for your chart</p>
              <p>Your personalized horoscope, updated every day based on your exact placements.</p>
            </div>
            <Link href="/birth-chart?ref=home-sky" className="btn-primary px-6 py-3 whitespace-nowrap">
              Get My Free Chart
            </Link>
          </div>
        </div>
      </section>

      <main>
        {/* What's in the library */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-3xl sm:text-[38px] mb-5">What&apos;s in the library</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-[22px]">
            {[
              { href: '/birth-chart?ref=home-library', title: 'Your Chart', text: 'Sun, Moon, Rising, and every placement, interpreted in plain English.', bg: 'bg-[#E8591D]' },
              { href: '/celebrity-birth-charts', title: 'Celebrity Charts', text: '550+ famous people, each with a written reading, searchable by sign, category, and placement.', bg: 'bg-[#F2B632]' },
              { href: '/start', title: 'Learn Astrology', text: 'Planets, houses, aspects, and signs, explained from the ground up.', bg: 'bg-[#2B8FD0]' },
            ].map(card => (
              <Link
                key={card.href}
                href={card.href}
                className={`${card.bg} flex flex-col gap-1.5 p-6 border-[3px] border-[var(--outline)] rounded-2xl shadow-[0_5px_0_var(--outline)] text-[#1A1622] hover:translate-y-0.5 hover:shadow-[0_3px_0_var(--outline)] transition-transform`}
              >
                <span className="font-black text-[22px]">{card.title} →</span>
                <span>{card.text}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular celebrity charts: plain server-rendered links (see FeaturedCelebs) */}
        {featuredCelebs.length > 0 && (
          <section className="bg-[var(--band)] border-y-[3px] border-[var(--outline)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-[52px]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-7">
                <h2 className="text-3xl sm:text-[38px]">Popular Celebrity Charts</h2>
                <Link href="/celebrity-birth-charts" className={ACCENT_LINK}>View the library →</Link>
              </div>
              <FeaturedCelebs celebs={featuredCelebs} />
            </div>
          </section>
        )}

        {/* From the Blog */}
        {latestArticles.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-[52px] pb-14">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-3.5">
              <h2 className="text-3xl sm:text-[38px]">From the Blog</h2>
              <Link href="/blog" className={ACCENT_LINK}>View all articles →</Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-x-8">
              {latestArticles.map(a => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="block py-4 border-t-2 border-slate-300 dark:border-slate-600 group">
                  <span className="block text-[13px] font-bold text-[var(--accent)] mb-1.5">
                    {CATEGORY_LABELS[a.category] || a.category} · {a.readTime}
                  </span>
                  <span className={`block font-black text-[19px] leading-snug mb-1.5 ${INK} group-hover:underline`}>{a.title}</span>
                  <span className="block text-[15px] line-clamp-3">{a.description}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Pull quote + email signup */}
        <section className="bg-[#F2B632] dark:bg-[#F4BE3C] border-t-[3px] border-[var(--outline)] text-[#1A1622]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-[52px] pb-14 flex flex-col items-center gap-6 text-center">
            <p className="font-display font-extrabold max-w-[18em] text-[clamp(1.9rem,4.4vw,2.75rem)] leading-[1.15] text-[#1A1622]">
              Astrology doesn&apos;t predict your future. It describes your nature.
            </p>
            <p className="font-bold">Get your daily cosmic briefing, personalized to your chart.</p>
            <div className="w-full max-w-md text-left">
              <GuestHoroscopeSignup />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
