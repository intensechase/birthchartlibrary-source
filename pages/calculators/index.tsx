import Head from 'next/head'
import Link from 'next/link'

export default function CalculatorsPage() {
  return (
    <>
      <Head>
        <title>Free Astrology Calculators | Birth Chart Library</title>
        <meta name="description" content="Free astrology calculators. Find your rising sign, calculate your Sun Moon and Rising signs, discover your Chinese zodiac, and more. No account needed." />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl tracking-wide mb-2">Astrology Calculators</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Free tools to explore your chart... no account needed.</p>

        <div className="space-y-4">
          <Link href="/calculators/rising-sign" className="card block hover:border-slate-400 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-3xl">↑</span>
              <div>
                <h2 className="font-display text-xl tracking-wide group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Rising Sign Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Find your Ascendant... the sign that was rising when you were born. Requires birth time.</p>
              </div>
            </div>
          </Link>

          <Link href="/calculators/sun-moon-rising" className="card block hover:border-slate-400 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-3xl">☉</span>
              <div>
                <h2 className="font-display text-xl tracking-wide group-hover:text-slate-600 transition-colors">Sun, Moon & Rising Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Calculate your Big Three... the foundation of your astrological identity.</p>
              </div>
            </div>
          </Link>

          <Link href="/calculators/chinese-zodiac" className="card block hover:border-slate-400 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐉</span>
              <div>
                <h2 className="font-display text-xl tracking-wide group-hover:text-slate-600 transition-colors">Chinese Zodiac Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Find your Chinese zodiac animal and element based on your birth year.</p>
              </div>
            </div>
          </Link>

          <Link href="/calculators/synastry" className="card block hover:border-slate-400 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-3xl">♥</span>
              <div>
                <h2 className="font-display text-xl tracking-wide group-hover:text-slate-600 transition-colors">Synastry Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Compare two birth charts to see how your planets interact... aspects, compatibility, and growth edges.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
          <p className="font-display text-xl tracking-wide mb-2">Want the full picture?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Discover what the rest of your chart reveals... create a free account to save your chart and unlock your personalized daily horoscope.</p>
          <Link href="/signup" className="btn-primary">Create Your Free Chart</Link>
        </div>
      </main>
    </>
  )
}
