import Link from 'next/link'
import type { RatedCeleb } from '@/lib/celebrities'
import { RATING_MEANINGS, VERIFIED_RATINGS } from '@/lib/birth-time-source'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'

const HEADINGS: Record<string, string> = {
  AA: 'AA: from a birth record',
  A: 'A: quoted from memory',
  B: 'B: from a biography',
}

export default function RatedChartsContent({ celebs }: { celebs: RatedCeleb[] }) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-xs text-slate-400 mb-6">
        <Link href="/celebrity-birth-charts" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Celebrity Charts</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-800 dark:text-slate-200">Rated Birth Times</span>
      </nav>

      <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-3">Celebrity Charts With a Rated Birth Time</h1>
      <div className="max-w-2xl space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
        <p>
          A Rising sign and house placements are only as good as the birth time behind them. Four minutes can change a degree on the
          Ascendant, and many published times are rounded, remembered or simply repeated. These {celebs.length} featured charts
          use a time that Astro-Databank has sourced and rated, and each page links to its entry there.
        </p>
        <p>
          The rating says where the time came from. It doesn&apos;t say anything about what the chart means.{' '}
          <Link href="/method" className="underline hover:text-slate-800 dark:hover:text-slate-100 transition-colors">See how we check our charts</Link>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {VERIFIED_RATINGS.map(rating => (
          <a key={rating} href={`#rating-${rating.toLowerCase()}`} className="text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
            {rating} ({celebs.filter(c => c.rating === rating).length})
          </a>
        ))}
      </div>

      {VERIFIED_RATINGS.map(rating => {
        const group = celebs.filter(c => c.rating === rating)
        if (group.length === 0) return null
        return (
          <section key={rating} id={`rating-${rating.toLowerCase()}`} className="mb-12 scroll-mt-20">
            <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-1">{HEADINGS[rating]}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {group.length} charts. Astro-Databank&apos;s meaning: {RATING_MEANINGS[rating]}.
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {group.map(c => (
                <li key={c.slug} className="min-w-0">
                  <Link
                    href={`/celebrity-birth-charts/${c.slug}`}
                    className="flex items-center gap-2 h-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    {c.sun_sign && (
                      <span className={`shrink-0 ${getElementColor(c.sun_sign).text}`}>
                        <SignGlyph sign={c.sun_sign} decorative />
                      </span>
                    )}
                    <span className="min-w-0">{c.name.replace(/\s*\([^)]*\)/g, '').trim()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
