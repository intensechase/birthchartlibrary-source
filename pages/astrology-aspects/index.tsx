import Link from 'next/link'
import Head from 'next/head'
import { ASPECTS, ASPECT_ORDER } from '@/lib/interpretations/aspects'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'

const NATURE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  harmonious: { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-800' },
  challenging: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-400', border: 'border-red-300 dark:border-red-800' },
  neutral: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600' },
}

export default function AstrologyAspectsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Head>
        <title>Astrology Aspects — Conjunctions, Squares, Trines & More</title>
        <meta name="description" content="The five major astrology aspects — conjunction, sextile, square, trine, opposition. How planets interact in your birth chart and what their angles mean." />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Aspects', url: 'https://birthchartlibrary.com/astrology-aspects' },
      ])) }} />

      <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Astrology Aspects</h1>
      <p className="text-slate-500 mb-4 max-w-2xl">
        Aspects are the angles between planets in your birth chart. They describe how different parts of your personality interact ... whether they cooperate, clash, or merge into something new.
      </p>
      <p className="text-slate-500 mb-10 max-w-2xl">
        There are five major aspects in Western astrology. Each one creates a distinct relationship between two planets, shaping how their energies combine in your life.
      </p>

      {/* Aspect overview table */}
      <div className="card mb-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              <th className="text-left py-2 pr-4 font-medium text-slate-800 dark:text-slate-200">Aspect</th>
              <th className="text-center py-2 px-4 font-medium text-slate-800 dark:text-slate-200">Symbol</th>
              <th className="text-center py-2 px-4 font-medium text-slate-800 dark:text-slate-200">Angle</th>
              <th className="text-center py-2 px-4 font-medium text-slate-800 dark:text-slate-200">Orb</th>
              <th className="text-center py-2 pl-4 font-medium text-slate-800 dark:text-slate-200">Nature</th>
            </tr>
          </thead>
          <tbody>
            {ASPECT_ORDER.map(key => {
              const a = ASPECTS[key]
              const colors = NATURE_COLORS[a.nature]
              return (
                <tr key={key} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <td className="py-2.5 pr-4">
                    <Link href={`/astrology-aspects/${a.slug}`} className="font-medium text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                      {a.name}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-center text-lg dark:text-slate-200">{a.symbol}</td>
                  <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">{a.degree}°</td>
                  <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">±{a.orb}°</td>
                  <td className="py-2.5 pl-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text}`}>
                      {a.nature}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Aspect cards */}
      <div className="space-y-6">
        {ASPECT_ORDER.map(key => {
          const a = ASPECTS[key]
          const colors = NATURE_COLORS[a.nature]
          return (
            <Link
              key={key}
              href={`/astrology-aspects/${a.slug}`}
              className={`card block hover:border-slate-400 transition-colors group border-l-4 ${colors.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{a.symbol}</span>
                <div>
                  <p className="font-semibold text-lg dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{a.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{a.degree}° · {a.nature}</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">{a.summary}</p>
              <div className="flex flex-wrap gap-2">
                {a.keywords.map(kw => (
                  <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{kw}</span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Understanding aspects section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Understanding Aspects in Your Chart</h2>
        <div className="card">
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              When you look at a birth chart, the lines drawn between planets represent aspects. Each line shows that two planets are in a geometric relationship ... they are communicating, for better or worse. The nature of that communication depends on the angle between them.
            </p>
            <p>
              <strong className="text-slate-800 dark:text-slate-100">Harmonious aspects</strong> (trines and sextiles) create flow and cooperation. The planets involved work together naturally, producing talents and ease in the areas of life they govern.
            </p>
            <p>
              <strong className="text-slate-800 dark:text-slate-100">Challenging aspects</strong> (squares and oppositions) create tension and friction. The planets involved are at cross-purposes, generating internal conflict that ultimately drives growth and achievement.
            </p>
            <p>
              <strong className="text-slate-800 dark:text-slate-100">The conjunction</strong> is neither harmonious nor challenging by default ... it merges two planetary energies into one, and the result depends entirely on which planets are involved.
            </p>
            <p>
              A well-rounded chart typically has a mix of all aspect types. Harmonious aspects alone can produce comfort without motivation. Challenging aspects alone can produce drive without rest. The most dynamic, interesting lives tend to come from charts that contain both.
            </p>
          </div>
        </div>
      </div>

      {/* Orb explanation */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">What Are Orbs?</h2>
        <div className="card">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Aspects are rarely exact to the degree. An <strong className="text-slate-800 dark:text-slate-100">orb</strong> is the margin of error allowed when determining whether an aspect is active. A trine is technically 120°, but if two planets are 117° apart, they are still considered in a trine if the orb allows 3° of variance. Tighter orbs (closer to exact) produce stronger, more noticeable aspects. Wider orbs produce subtler effects. The orbs listed on this page are standard values used by most Western astrologers, though different traditions may use slightly different ranges.
          </p>
        </div>
      </div>
    </main>
  )
}
