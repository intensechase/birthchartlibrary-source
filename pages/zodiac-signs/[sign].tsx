import { useEffect } from 'react'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getListableCelebrities } from '@/lib/celebrities'
import { SIGNS } from '@/lib/interpretations'
import { PLANET_IN_SIGN } from '@/lib/interpretations/planet_in_sign'
import { getPairSlug } from '@/lib/interpretations/compatibility-helpers'
import { SIGN_BOOKS } from '@/lib/interpretations/sign-books'
import { bookCoverUrl } from '@/lib/book-cover'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import GuestHoroscopeSignup from '@/components/GuestHoroscopeSignup'
import { SIGN_LIST, PLANET_KEYS, PLANET_LABELS } from '@/lib/constants'
import { SignGlyph } from '@/components/Glyph'
import { PLANET_PATHS, toneOf } from '@/components/NatalChartWheel'
import { CelebFace, cleanCelebName } from '@/components/FeaturedCelebs'
import Scallop from '@/components/Scallop'

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

interface FamousCeleb {
  name: string
  slug: string
  image_url: string | null
  category: string | null
}

interface SignPageProps {
  sign: string
  name: string
  title: string
  description: string
  famousCelebs: FamousCeleb[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<SignPageProps> = async (context) => {
  const sign = context.params?.sign as string
  const name = capitalize(sign)
  const info = SIGNS[name]
  if (!info) return { notFound: true }

  const famousCelebs = await getListableCelebrities<FamousCeleb>({
    columns: 'name, slug, image_url, category',
    where: 'sun_sign = $1',
    params: [name],
    orderBy: 'name',
    limit: 24,
  })

  return {
    props: {
      sign,
      name,
      title: `${name} Zodiac Sign — Traits, Element, Ruling Planet | Birth Chart Library`,
      description: `Everything about ${name}: a ${info.element} sign ruled by ${info.ruledBy}. Explore ${name}'s personality traits, strengths, challenges, and what each planet means in ${name}.`,
      famousCelebs,
    },
    revalidate: 604800,
  }
}

const SIGN_DATES: Record<string, string> = {
  Aries: 'March 21 – April 19', Taurus: 'April 20 – May 20', Gemini: 'May 21 – June 20',
  Cancer: 'June 21 – July 22', Leo: 'July 23 – August 22', Virgo: 'August 23 – September 22',
  Libra: 'September 23 – October 22', Scorpio: 'October 23 – November 21',
  Sagittarius: 'November 22 – December 21', Capricorn: 'December 22 – January 19',
  Aquarius: 'January 20 – February 18', Pisces: 'February 19 – March 20',
}

const INK = 'text-slate-800 dark:text-slate-100'
const MUTED = 'text-slate-500 dark:text-slate-400'
const RULE = 'border-slate-300 dark:border-slate-600'
const ACCENT_LINK = 'font-bold text-[var(--accent)] hover:underline'
const H2 = 'text-[28px] sm:text-[34px] leading-tight mb-3'
const ASIDE_H = `text-[13px] font-black uppercase tracking-[0.08em] ${MUTED} mb-3`
const CHIP = `inline-flex items-center min-h-9 px-3.5 rounded-full bg-[var(--surface)] border-2 border-[var(--outline)] dark:border-slate-100 text-sm font-bold ${INK}`
const ordinal = (n: number) => (n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`)

function PlanetIcon({ planet }: { planet: string }) {
  const path = PLANET_PATHS[planet]
  if (!path) return null
  return (
    <svg viewBox="-13 -13 26 26" width="20" height="20" aria-hidden="true" className="shrink-0">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SignDetailPage({ sign, name, title, description, famousCelebs }: SignPageProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).pintrk) {
      (window as any).pintrk('track', 'viewcategory', {
        event_id: `bcl-sign-${name}-${Date.now()}`,
        product_category: name,
      })
    }
  }, [name])

  const info = SIGNS[name]
  if (!info) return null
  const idx = SIGN_LIST.indexOf(name)
  const prevSign = SIGN_LIST[(idx - 1 + 12) % 12]
  const nextSign = SIGN_LIST[(idx + 1) % 12]
  const ruler = info.ruledBy.split(' (')[0]

  const faqs = [
    { question: `What dates are ${name}?`, answer: `${name} runs approximately from ${SIGN_DATES[name]}.` },
    { question: `What element is ${name}?`, answer: `${name} is a ${info.element} sign. ${info.element} signs are associated with ${info.element === 'Fire' ? 'passion, drive, and spontaneous energy' : info.element === 'Earth' ? 'practicality, stability, and material focus' : info.element === 'Air' ? 'intellect, communication, and social connection' : 'emotion, intuition, and deep feeling'}.` },
    { question: `What planet rules ${name}?`, answer: `${name} is ruled by ${info.ruledBy}. This planetary rulership shapes ${name}'s core themes and how this energy expresses itself in a birth chart.` },
    { question: `What are ${name}'s key personality traits?`, answer: `${name} is associated with ${info.keywords.join(', ')}. As a ${info.modality} ${info.element} sign, ${name} brings a ${info.modality.toLowerCase()} quality to these themes.` },
  ]

  const elementArticle: Record<string, { slug: string; title: string }> = {
    Fire: { slug: 'fire-signs-aries-leo-sagittarius', title: 'Fire Signs: Aries, Leo & Sagittarius' },
    Earth: { slug: 'earth-signs-taurus-virgo-capricorn', title: 'Earth Signs: Taurus, Virgo & Capricorn' },
    Air: { slug: 'air-signs-gemini-libra-aquarius', title: 'Air Signs: Gemini, Libra & Aquarius' },
    Water: { slug: 'water-signs-cancer-scorpio-pisces', title: 'Water Signs: Cancer, Scorpio & Pisces' },
  }
  const seasonArticle: Partial<Record<string, { slug: string; title: string }>> = {
    Aries: { slug: 'aries-season-2026-what-to-expect', title: 'Aries Season 2026: What to Expect' },
    Taurus: { slug: 'taurus-season-2026-what-to-expect', title: 'Taurus Season 2026: What to Expect' },
    Gemini: { slug: 'gemini-season-2026', title: 'Gemini Season 2026: What to Expect' },
    Cancer: { slug: 'cancer-season-2026', title: 'Cancer Season 2026: What to Expect' },
    Leo: { slug: 'leo-season-2026', title: 'Leo Season 2026: What to Expect' },
  }
  const articles = [
    { slug: `${sign}-the-complete-guide`, title: `${name}: The Complete Guide` },
    elementArticle[info.element],
    seasonArticle[name] ?? { slug: 'zodiac-compatibility-which-signs-go-together', title: 'Zodiac Compatibility — Which Signs Go Together?' },
  ].filter(Boolean) as { slug: string; title: string }[]

  const explore = [
    { href: `/horoscope/${sign}`, label: `${name} horoscope` },
    { href: `/love/${sign}-in-love`, label: `${name} in love` },
    { href: `/compatibility/${sign}`, label: `${name} compatibility guide` },
    { href: `/astrology-planets/${ruler.toLowerCase()}`, label: `${ruler}, ${name}'s ruling planet` },
    { href: `/astrology-houses/${idx + 1}`, label: `The ${ordinal(idx + 1)} house, ${name}'s natural home` },
    { href: '/astrology-interpretations', label: 'Interpretation library' },
    { href: '/astrology-aspects', label: 'Aspects guide' },
    { href: '/celebrity-match', label: 'Celebrity match' },
  ]

  const books = SIGN_BOOKS[name] ?? []

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://birthchartlibrary.com/zodiac-signs/${sign}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://birthchartlibrary.com/zodiac-signs/${sign}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(name)}&subtitle=${encodeURIComponent(info.element + ' Sign · ' + info.ruledBy)}&symbol=${encodeURIComponent(info.symbol)}&label=Zodiac+Sign`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', url: 'https://birthchartlibrary.com' }, { name: 'Zodiac Signs', url: 'https://birthchartlibrary.com/zodiac-signs' }, { name, url: `https://birthchartlibrary.com/zodiac-signs/${sign}` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />

      {/* Hero band */}
      <section className="bg-[var(--band)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-9">
          <AdminBreadcrumb className="mb-5 !text-sm" crumbs={[{ label: 'Zodiac Signs', href: '/zodiac-signs' }, { label: name }]} />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
            <span
              aria-hidden="true"
              className="ml-1 w-[112px] h-[112px] sm:w-[136px] sm:h-[136px] rounded-full border-[4px] border-[#1A1622] inline-flex items-center justify-center shrink-0 shadow-[0_5px_0_var(--outline)]"
              style={{ background: `var(--w-${toneOf(name)})` }}
            >
              <span className="w-[74%] h-[74%] rounded-full bg-[#FFF9EA] inline-flex items-center justify-center text-[56px] sm:text-[68px] leading-none text-[#1A1622]">
                <SignGlyph sign={name} decorative />
              </span>
            </span>
            <div className="flex-[1_1_420px] min-w-0">
              <h1 className="text-[clamp(2.6rem,6.6vw,4.5rem)] leading-[1.02] mb-1.5">{name}</h1>
              <p className={`text-[17px] ${INK} mb-4`}>{SIGN_DATES[name]}</p>
              <div className="flex flex-wrap gap-2 mb-3.5">
                <span className={CHIP}>{info.element}</span>
                <span className={CHIP}>{info.modality}</span>
                <Link href={`/astrology-planets/${ruler.toLowerCase()}`} className={`${CHIP} hover:bg-[var(--gold)] hover:text-[#1A1622] transition-colors`}>Ruled by {info.ruledBy}</Link>
              </div>
              <p className={`text-[15px] ${INK}`}>
                {info.keywords.map((k, i) => (
                  <span key={k}>{i > 0 && <span className={MUTED} aria-hidden="true"> · </span>}{k}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Scallop id="hero-scallops" top="var(--band)" className="bg-[var(--background)]" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-14">
        <div className="flex flex-wrap gap-x-14 gap-y-12">
          {/* Reading column */}
          <article className={`flex-[1_1_520px] min-w-0 max-w-[42em] ${INK}`}>
            <p className="text-[20px] sm:text-[22px] leading-[1.55] mb-10">{info.description}</p>

            <section className="mb-10">
              <h2 className={H2}>{name} in mythology</h2>
              <p className="text-[17px] leading-relaxed">{info.mythology}</p>
            </section>

            <section className="mb-10">
              <h2 className={H2}>{name} in love and relationships</h2>
              <p className="text-[17px] leading-relaxed mb-3">{info.inLove}</p>
              <Link href={`/love/${sign}-in-love`} className={ACCENT_LINK}>Read the full {name} in love guide →</Link>
            </section>

            <section className="mb-12">
              <h2 className={H2}>{name} shadow and growth</h2>
              <p className="text-[17px] leading-relaxed">{info.shadow}</p>
            </section>

            <section>
              <h2 className={H2}>Planets in {name}</h2>
              <p className={`mb-4 ${MUTED}`}>How each planet expresses itself when placed in {name}.</p>
              <ul className={`border-t-2 ${RULE}`}>
                {PLANET_KEYS.map(planet => {
                  const text = PLANET_IN_SIGN[`${planet}_${name}`]
                  if (!text) return null
                  return (
                    <li key={planet} className={`py-5 border-b-2 ${RULE}`}>
                      <h3 className="flex items-center gap-2.5 font-black text-[19px] mb-1.5">
                        <PlanetIcon planet={planet} />
                        {PLANET_LABELS[planet]} in {name}
                      </h3>
                      <p className="text-[16px] leading-relaxed">{text}</p>
                    </li>
                  )
                })}
              </ul>
            </section>
          </article>

          {/* Side column */}
          <aside className="flex-[1_1_280px] min-w-0 flex flex-col gap-10">
            {famousCelebs.length > 0 && (
              <section>
                <h2 className={ASIDE_H}>Famous {name} Suns</h2>
                <ul className="flex flex-col gap-4">
                  {famousCelebs.map(c => (
                    <li key={c.slug}>
                      <Link href={`/celebrity-birth-charts/${c.slug}`} className={`flex items-center gap-4 pl-1.5 ${INK} group`}>
                        <CelebFace slug={c.slug} sign={name} hasImage={!!c.image_url} size={52} />
                        <span className="min-w-0 leading-snug">
                          <span className="block font-black group-hover:underline">{cleanCelebName(c.name)}</span>
                          {c.category && <span className={`block text-sm ${MUTED}`}>{c.category}</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/celebrity-birth-charts/sign/${sign}`} className={`inline-block mt-5 ${ACCENT_LINK}`}>All {name} celebrity charts →</Link>
              </section>
            )}

            <section>
              <h2 className={ASIDE_H}>{name} compatibility</h2>
              <ul className="grid grid-cols-2 gap-x-4">
                {SIGN_LIST.filter(s => s !== name).map(partner => (
                  <li key={partner}>
                    <Link href={`/compatibility/${getPairSlug(name, partner)}`} className={`flex items-center gap-2 min-h-10 border-b ${RULE} ${INK} hover:underline`}>
                      <span className="w-5 text-center" aria-hidden="true"><SignGlyph sign={partner} decorative /></span>
                      {partner}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-[var(--band)] px-[22px] py-5">
              <h2 className={ASIDE_H}>Explore {name}</h2>
              <ul className="flex flex-col gap-2.5">
                {explore.map(e => (
                  <li key={e.href}><Link href={e.href} className={ACCENT_LINK}>{e.label} →</Link></li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {books.length > 0 && (
          <section className="mt-16">
            <h2 className={H2}>Recommended reading for {name}</h2>
            <p className={`mb-5 ${MUTED}`}>Books that resonate with {name} energy and help you explore this sign more deeply.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-8">
              {books.map((book, i) => (
                <a
                  key={i}
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`flex items-start gap-4 py-5 border-t-2 ${RULE} ${INK} group`}
                >
                  {bookCoverUrl(book.amazonUrl) && (
                    <img
                      src={bookCoverUrl(book.amazonUrl)!}
                      alt={`${book.title} cover`}
                      loading="lazy"
                      className="w-16 h-auto flex-shrink-0 rounded border-2 border-[var(--outline)]"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block font-black group-hover:underline">{book.title}</span>
                    <span className={`block text-sm ${MUTED}`}>by {book.author}</span>
                    <span className="block text-[15px] leading-relaxed mt-2">{book.blurb}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className={`text-xs mt-3 ${MUTED}`}>As an Amazon Associate, Birth Chart Library earns from qualifying purchases.</p>
          </section>
        )}

        <section className="mt-14">
          <h2 className={H2}>From the blog</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-8">
            {articles.map(a => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className={`block py-4 border-t-2 ${RULE} font-black text-[18px] leading-snug ${INK} hover:underline`}>
                {a.title} →
              </Link>
            ))}
          </div>
        </section>

        <nav aria-label="Other signs" className={`flex justify-between gap-4 mt-12 pt-6 border-t-2 ${RULE}`}>
          <Link href={`/zodiac-signs/${prevSign.toLowerCase()}`} className={ACCENT_LINK}>&larr; {prevSign}</Link>
          <Link href="/zodiac-signs" className={`${MUTED} hover:underline`}>All signs</Link>
          <Link href={`/zodiac-signs/${nextSign.toLowerCase()}`} className={ACCENT_LINK}>{nextSign} &rarr;</Link>
        </nav>
      </main>

      {/* Email signup */}
      <section className="bg-[#F2B632] dark:bg-[#F4BE3C] border-t-[3px] border-[var(--outline)] text-[#1A1622]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-14 flex flex-col items-center gap-5 text-center">
          <p className="font-display font-extrabold max-w-[18em] text-[clamp(1.7rem,4vw,2.4rem)] leading-[1.15] text-[#1A1622]">
            Your Sun sign is where your chart starts, not where it ends.
          </p>
          <p className="font-bold">Get a daily horoscope based on your whole chart, not just your {name} Sun.</p>
          <div className="w-full max-w-md text-left">
            <GuestHoroscopeSignup />
          </div>
        </div>
      </section>
    </>
  )
}
