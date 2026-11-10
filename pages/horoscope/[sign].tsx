import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { getDailySky } from '@/lib/swisseph/daily-sky'
import { SIGNS } from '@/lib/interpretations'
import { MOON_WEATHER, SUN_SEASON, RETROGRADE_DESCRIPTIONS, MOON_REFLECTIONS } from '@/lib/interpretations/daily'
import { getTransitHouse, TRANSIT_HOUSE_MEANING } from '@/lib/interpretations/horoscope'
import { getElementColor, SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { getPairSlug } from '@/lib/interpretations/compatibility-helpers'
import GuestHoroscopeSignup from '@/components/GuestHoroscopeSignup'
import { SIGN_LIST } from '@/lib/constants'
import { NOINDEX_THIN } from '@/lib/thin-pages'

interface Props {
  sign: string
  dateStr: string
  todayISO: string
  moonSign: string
  sunSign: string
  transitHouse: number
  transitFocus: string
  transitAdvice: string
  retrogrades: { planet: string; sign: string }[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: SIGN_LIST.map(s => ({ params: { sign: s.toLowerCase() } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const signSlug = params?.sign as string
  const sign = signSlug.charAt(0).toUpperCase() + signSlug.slice(1)
  if (!SIGN_LIST.includes(sign)) return { notFound: true }

  const sky = await getDailySky()
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const todayISO = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`

  const transitHouse = getTransitHouse(sign, sky.moonSign)
  const meaning = TRANSIT_HOUSE_MEANING[transitHouse]

  return {
    props: {
      sign,
      dateStr,
      todayISO,
      moonSign: sky.moonSign,
      sunSign: sky.sunSign,
      transitHouse,
      transitFocus: meaning?.focus || '',
      transitAdvice: meaning?.advice || '',
      retrogrades: sky.retrogrades,
    },
    revalidate: 3600,
  }
}

export default function SignHoroscopePage({ sign, dateStr, todayISO, moonSign, sunSign, transitHouse, transitFocus, transitAdvice, retrogrades }: Props) {
  const info = SIGNS[sign]
  if (!info) return null

  const ec = getElementColor(sign)
  const moonEc = getElementColor(moonSign)
  const idx = SIGN_LIST.indexOf(sign)

  const title = `${sign} Horoscope Today — ${dateStr}`
  const description = `Free ${sign} daily horoscope for ${dateStr}. Today's Moon in ${moonSign} activates your ${transitFocus.toLowerCase()} sector. ${transitAdvice.split('.')[0]}.`

  return (
    <>
      <Head>
        <title>{`${title} | Birth Chart Library`}</title>
        {NOINDEX_THIN.horoscopeSign && <meta name="robots" content="noindex,follow" />}
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://birthchartlibrary.com/horoscope/${sign.toLowerCase()}`} key="canonical" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(sign + ' Horoscope')}&subtitle=${encodeURIComponent(dateStr)}&symbol=${encodeURIComponent(SIGN_SYMBOLS[sign] || '✦')}&label=Daily+Horoscope`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Home', url: 'https://birthchartlibrary.com' },
          { name: 'Horoscopes', url: 'https://birthchartlibrary.com/horoscope' },
          { name: `${sign} Horoscope`, url: `https://birthchartlibrary.com/horoscope/${sign.toLowerCase()}` },
        ])) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema([
          { question: `What is the ${sign} horoscope for today?`, answer: `Today's Moon in ${moonSign} activates your ${transitFocus.toLowerCase()} sector. ${transitAdvice}` },
          { question: `What does the Moon in ${moonSign} mean for ${sign}?`, answer: `${MOON_WEATHER[moonSign]} For ${sign} specifically, the Moon's transit through ${moonSign} focuses energy on your ${transitFocus.toLowerCase()} — ${TRANSIT_HOUSE_MEANING[transitHouse]?.advice ?? ''}` },
          { question: `What is ${sunSign} season and how does it affect ${sign}?`, answer: SUN_SEASON[sunSign] + ` For ${sign}, this seasonal energy ${info.element === 'Fire' && ['Aries', 'Leo', 'Sagittarius'].includes(sunSign) ? 'resonates naturally with your fiery nature' : info.element === 'Earth' && ['Taurus', 'Virgo', 'Capricorn'].includes(sunSign) ? 'aligns with your grounded, practical instincts' : info.element === 'Air' && ['Gemini', 'Libra', 'Aquarius'].includes(sunSign) ? 'amplifies your mental and social energy' : info.element === 'Water' && ['Cancer', 'Scorpio', 'Pisces'].includes(sunSign) ? 'deepens your already rich emotional world' : 'offers a complementary energy to draw from'}.` },
          { question: `What are ${sign}'s key personality traits?`, answer: `${sign} is a ${info.element} sign ruled by ${info.ruledBy}. Core traits include: ${info.keywords?.join(', ') ?? info.description?.split('.')[0] ?? `passion, loyalty, and a strong sense of identity`}. The ${info.element} element gives ${sign} a naturally ${info.element === 'Fire' ? 'energetic and enthusiastic' : info.element === 'Earth' ? 'grounded and practical' : info.element === 'Air' ? 'curious and communicative' : 'intuitive and emotionally perceptive'} quality.` },
        ])) }} />

        {/* Breadcrumb */}
        <AdminBreadcrumb crumbs={[
          { label: 'Horoscopes', href: '/horoscope' },
          { label: sign },
        ]} />

        {/* Header */}
        <div className="text-center mb-8">
          <SignGlyph sign={sign} className="text-6xl block mb-3 text-slate-900 dark:text-white" decorative />
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">{sign} Horoscope Today</h1>
          <p className="text-slate-500">{dateStr}</p>
          <div className="flex justify-center gap-2 mt-3">
            <span className={`text-xs px-2.5 py-1 rounded-full ${ec.bg} ${ec.text}`}>{info.element}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Ruled by {info.ruledBy}</span>
          </div>
        </div>

        {/* Today's Focus */}
        <div className={`card mb-8 border-l-4 ${ec.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full ${moonEc.bg} ${moonEc.text}`}>
              ☽ Moon in {moonSign}
            </span>
            <span className="text-xs text-slate-400">→</span>
            <span className="text-xs font-medium text-slate-600">
              Your {transitFocus}
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed">{transitAdvice}</p>
        </div>

        {/* Daily Reflection */}
        <div className={`bg-gradient-to-br ${ec.gradient} border ${ec.border} rounded-xl p-6 mb-8`}>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Daily Reflection for {sign}</p>
          <p className="text-slate-700 text-lg italic leading-relaxed">&ldquo;{MOON_REFLECTIONS[moonSign]}&rdquo;</p>
        </div>

        {/* Moon Weather */}
        <div className="card mb-8">
          <h2 className="font-semibold mb-3">Today&apos;s Moon</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{MOON_WEATHER[moonSign]}</p>
        </div>

        {/* Sun Season */}
        <div className="card mb-8">
          <h2 className="font-semibold mb-3">{sunSign} Season</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{SUN_SEASON[sunSign]}</p>
        </div>

        {/* Retrogrades */}
        {retrogrades.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold mb-3">Current Retrogrades</h2>
            <div className="space-y-3">
              {retrogrades.map(r => {
                const rec = getElementColor(r.sign)
                return (
                  <div key={r.planet} className={`card border-l-4 ${rec.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-semibold text-sm ${rec.text}`}>{r.planet}</span>
                      <span className="text-xs text-slate-400">retrograde in {r.sign}</span>
                      <span className="text-amber-500 text-xs">℞</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{RETROGRADE_DESCRIPTIONS[r.planet] || ''}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Sign Selector */}
        <div className="mb-8">
          <h2 className="font-semibold mb-4">Other Signs</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {SIGN_LIST.map(s => {
              const sec = getElementColor(s)
              const isCurrent = s === sign
              return (
                <Link
                  key={s}
                  href={`/horoscope/${s.toLowerCase()}`}
                  className={`text-center py-3 rounded-xl transition-colors ${
                    isCurrent
                      ? `${sec.bg} ${sec.text} font-medium`
                      : 'card hover:border-slate-400'
                  }`}
                >
                  <SignGlyph sign={s} className="text-xl block text-slate-900 dark:text-white" decorative />
                  <span className="text-[10px]">{s}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Guest email signup */}
        <div className="mb-8">
          <GuestHoroscopeSignup />
        </div>

        {/* Related Links */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link href={`/zodiac-signs/${sign.toLowerCase()}`} className="card hover:border-slate-400 transition-colors group p-4">
            <p className="font-medium text-sm group-hover:text-slate-600">About {sign}</p>
            <p className="text-xs text-slate-400 mt-0.5">Traits, element, and ruling planet</p>
          </Link>
          <Link href={`/compatibility/${getPairSlug(sign, SIGN_LIST[(idx + 6) % 12])}`} className="card hover:border-slate-400 transition-colors group p-4">
            <p className="font-medium text-sm group-hover:text-slate-600">{sign} Compatibility</p>
            <p className="text-xs text-slate-400 mt-0.5">How {sign} connects with other signs</p>
          </Link>
          <Link href="/birth-chart" className="card hover:border-slate-400 transition-colors group p-4">
            <p className="font-medium text-sm group-hover:text-slate-600">Get Your Birth Chart</p>
            <p className="text-xs text-slate-400 mt-0.5">Free personalized chart with full interpretation</p>
          </Link>
          <Link href={`/celebrity-birth-charts/sign/${sign.toLowerCase()}`} className="card hover:border-slate-400 transition-colors group p-4">
            <p className="font-medium text-sm group-hover:text-slate-600">Famous {sign} Celebrities</p>
            <p className="text-xs text-slate-400 mt-0.5">See who shares your Sun sign</p>
          </Link>
          <Link href={`/love/${sign.toLowerCase()}-in-love`} className="card hover:border-slate-400 transition-colors group p-4">
            <p className="font-medium text-sm group-hover:text-slate-600">{sign} in Love</p>
            <p className="text-xs text-slate-400 mt-0.5">What {sign} brings, needs, and looks like in relationships</p>
          </Link>
        </div>
      </main>
    </>
  )
}
