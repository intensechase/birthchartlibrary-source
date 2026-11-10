import Link from 'next/link'
import Head from 'next/head'
import { HOUSES } from '@/lib/interpretations'
import { getElementColor } from '@/lib/zodiac-colors'

const naturalSigns = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

export default function AstrologyHousesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Head>
        <title>Astrology Houses — What Each of the 12 Houses Means</title>
        <meta name="description" content="Explore all 12 astrological houses — the domains of life they govern, their natural sign rulers, and what planets in each house mean for your birth chart." />
      </Head>

      <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Astrology Houses</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-2xl">
        The twelve houses divide your birth chart into domains of life experience — from identity and money to career and spirituality. Where your planets fall by house shows where their energy plays out in your day-to-day life.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
          const house = HOUSES[num]
          if (!house) return null
          const ec = getElementColor(naturalSigns[num - 1])
          return (
            <Link
              key={num}
              href={`/astrology-houses/${num}`}
              className={`card hover:border-slate-400 transition-colors group border-l-4 ${ec.border}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-2xl font-bold ${ec.text}`}>H{num}</span>
                <p className="font-semibold group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{house.name}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {house.keywords.slice(0, 4).map(k => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">{k}</span>
                ))}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{house.description}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
