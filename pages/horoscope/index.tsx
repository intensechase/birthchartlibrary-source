import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getDailySky } from '@/lib/swisseph/daily-sky'
import { getTransitHouse, TRANSIT_HOUSE_MEANING } from '@/lib/interpretations/horoscope'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'
import { SIGN_LIST } from '@/lib/constants'

interface Props {
  dateStr: string
  moonSign: string
  signPreviews: { sign: string; focus: string }[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sky = await getDailySky()
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  const signPreviews = SIGN_LIST.map(sign => {
    const house = getTransitHouse(sign, sky.moonSign)
    const meaning = TRANSIT_HOUSE_MEANING[house]
    return { sign, focus: meaning?.focus || '' }
  })

  return {
    props: { dateStr, moonSign: sky.moonSign, signPreviews },
    revalidate: 21600,
  }
}

export default function HoroscopeHub({ dateStr, moonSign, signPreviews }: Props) {
  const moonEc = getElementColor(moonSign)

  return (
    <>
      <Head>
        <title>Daily Horoscopes for Every Zodiac Sign | Birth Chart Library</title>
        <meta name="description" content={`Free daily horoscopes for all 12 zodiac signs. Today's Moon is in ${moonSign}. Read your personalized forecast based on your Sun sign.`} />
        <link rel="canonical" href="https://birthchartlibrary.com/horoscope" key="canonical" />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Home', url: 'https://birthchartlibrary.com' },
          { name: 'Horoscopes', url: 'https://birthchartlibrary.com/horoscope' },
        ])) }} />

        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Daily Horoscopes</h1>
          <p className="text-slate-500 mb-3">{dateStr}</p>
          <span className={`inline-block text-xs px-3 py-1 rounded-full ${moonEc.bg} ${moonEc.text}`}>
            ☽ Moon in {moonSign}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {signPreviews.map(({ sign, focus }) => {
            const ec = getElementColor(sign)
            return (
              <Link
                key={sign}
                href={`/horoscope/${sign.toLowerCase()}`}
                className={`card hover:border-slate-400 transition-colors group border-l-4 ${ec.border} p-5`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <SignGlyph sign={sign} decorative className="text-2xl text-slate-900 dark:text-white" />
                  <div>
                    <p className="font-semibold group-hover:text-slate-600 transition-colors">{sign}</p>
                    <p className="text-xs text-slate-400">Today&apos;s focus: {focus}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Read your horoscope &rarr;</p>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 mb-3">
            Want a horoscope personalized to your exact birth chart?
          </p>
          <Link href="/signup" className="btn-primary text-sm">
            Create Your Free Chart
          </Link>
        </div>
      </main>
    </>
  )
}
