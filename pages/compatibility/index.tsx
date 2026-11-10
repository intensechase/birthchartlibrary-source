import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import { SIGN_ORDER, getPairSlug, getElementCombo } from '@/lib/interpretations/compatibility-helpers'
import { SIGNS } from '@/lib/interpretations/signs'
import { getElementColor, SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'

const SCORE_COLOR: Record<string, string> = {
  high: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-red-100 text-red-800',
}

interface Props {
  // Only 10 unique element combos exist — precomputing here keeps the
  // heavy compatibility data table off the client bundle (TODO P8).
  scoreClassByCombo: Record<string, string>
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { ELEMENT_COMPAT } = await import('@/lib/interpretations/compatibility')
  const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water']
  const scoreClassByCombo: Record<string, string> = {}
  for (const a of ELEMENTS) {
    for (const b of ELEMENTS) {
      const combo = getElementCombo(a, b)
      if (scoreClassByCombo[combo]) continue
      const score = ELEMENT_COMPAT[combo]?.score ?? 50
      scoreClassByCombo[combo] =
        score >= 75 ? SCORE_COLOR.high
        : score >= 55 ? SCORE_COLOR.medium
        : SCORE_COLOR.low
    }
  }
  return { props: { scoreClassByCombo }, revalidate: 2592000 }
}

export default function CompatibilityPage({ scoreClassByCombo }: Props) {
  const router = useRouter()
  const [sign1, setSign1] = useState('')
  const [sign2, setSign2] = useState('')

  function handleGo() {
    if (!sign1 || !sign2) return
    router.push(`/compatibility/${getPairSlug(sign1, sign2)}`)
  }

  return (
    <>
      <Head>
        <title>Zodiac Sign Compatibility Guide | Birth Chart Library</title>
        <meta name="description" content="Explore compatibility between all 78 zodiac sign pairings. Find out how your sign connects with every other sign in love, communication, and growth." />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og/topic?title=Zodiac+Compatibility&subtitle=All+78+Sign+Pairings&symbol=♥&label=Birth+Chart+Library" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Home', url: 'https://birthchartlibrary.com' },
          { name: 'Compatibility', url: 'https://birthchartlibrary.com/compatibility' },
        ])) }} />

        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Zodiac Compatibility</h1>
        <p className="text-slate-500 mb-8 max-w-2xl">
          Select two signs to explore how they connect ... or browse the grid below to find any pairing. Compatibility is more than Sun signs, but the Sun sign pairing reveals the fundamental dynamic between two people.
        </p>

        {/* Sign picker */}
        <div className="card mb-10">
          <p className="text-sm font-medium text-slate-700 mb-3">Check your compatibility</p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">Your Sign</label>
              <select value={sign1} onChange={e => setSign1(e.target.value)} className="input w-full text-sm">
                <option value="">Select...</option>
                {SIGN_ORDER.map(s => <option key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</option>)}
              </select>
            </div>
            <span className="text-slate-300 pb-2 text-lg">&amp;</span>
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">Their Sign</label>
              <select value={sign2} onChange={e => setSign2(e.target.value)} className="input w-full text-sm">
                <option value="">Select...</option>
                {SIGN_ORDER.map(s => <option key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</option>)}
              </select>
            </div>
            <button onClick={handleGo} disabled={!sign1 || !sign2} className="btn-primary text-sm px-6 py-2">
              Go
            </button>
          </div>
        </div>

        {/* Grid */}
        <h2 className="text-xl font-semibold mb-4">All 78 Pairings</h2>
        <p className="text-slate-500 text-sm mb-6">
          <span className={`inline-block w-3 h-3 rounded-full bg-emerald-200 mr-1`} /> High natural compatibility
          <span className={`inline-block w-3 h-3 rounded-full bg-amber-200 mr-1 ml-3`} /> Moderate ... growth through effort
          <span className={`inline-block w-3 h-3 rounded-full bg-red-200 mr-1 ml-3`} /> Challenging ... transformative potential
        </p>

        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr>
                <th className="p-1" />
                {SIGN_ORDER.map(s => (
                  <th key={s} className="p-1 text-center font-medium text-slate-500 whitespace-nowrap">
                    <SignGlyph sign={s} className="block text-base text-slate-900 dark:text-white" />
                    <span className="hidden sm:block">{s.slice(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIGN_ORDER.map((row, ri) => {
                const rowInfo = SIGNS[row]
                return (
                  <tr key={row}>
                    <td className="p-1 font-medium text-slate-500 whitespace-nowrap text-right pr-2">
                      <SignGlyph sign={row} className="text-base mr-1 text-slate-900 dark:text-white" />
                      <span className="hidden sm:inline">{row.slice(0, 3)}</span>
                    </td>
                    {SIGN_ORDER.map((col, ci) => {
                      if (ci < ri) return <td key={col} className="p-1" />
                      const colInfo = SIGNS[col]
                      const sc = scoreClassByCombo[getElementCombo(rowInfo?.element || 'Fire', colInfo?.element || 'Fire')] ?? SCORE_COLOR.medium
                      return (
                        <td key={col} className="p-0.5">
                          <Link
                            href={`/compatibility/${getPairSlug(row, col)}`}
                            className={`block w-full aspect-square rounded flex items-center justify-center text-[10px] font-medium hover:opacity-80 transition-opacity ${sc}`}
                            title={`${row} & ${col}`}
                          >
                            <SignGlyph sign={row} decorative /><SignGlyph sign={col} decorative />
                          </Link>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Love cross-link */}
        <Link href="/love" className="card flex items-center gap-4 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group mt-12 mb-6 border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/10">
          <span className="text-2xl flex-shrink-0">♥</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Love &amp; Astrology</p>
            <p className="text-xs text-slate-400 mt-0.5">Celebrity couple deep-dives, sign-in-love profiles, red flags by sign, and more</p>
          </div>
          <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 text-sm">Explore →</span>
        </Link>

        {/* Browse by sign — hub pages */}
        <h2 className="text-xl font-semibold mt-4 mb-4">Browse by Sign</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SIGN_ORDER.map(sign => {
            const ec = getElementColor(sign)
            return (
              <Link
                key={sign}
                href={`/compatibility/${sign.toLowerCase()}`}
                className="card hover:border-slate-400 transition-colors group flex items-center gap-3"
              >
                <SignGlyph sign={sign} decorative className="text-2xl flex-shrink-0 text-slate-900 dark:text-white" />
                <div>
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{sign}</p>
                  <p className="text-xs text-slate-400">All 12 matches →</p>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}
