import Head from 'next/head'
import Link from 'next/link'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'

const SIGNS = [
  { name: 'Aries', dates: 'Mar 21 – Apr 19', slug: 'aries' },
  { name: 'Taurus', dates: 'Apr 20 – May 20', slug: 'taurus' },
  { name: 'Gemini', dates: 'May 21 – Jun 20', slug: 'gemini' },
  { name: 'Cancer', dates: 'Jun 21 – Jul 22', slug: 'cancer' },
  { name: 'Leo', dates: 'Jul 23 – Aug 22', slug: 'leo' },
  { name: 'Virgo', dates: 'Aug 23 – Sep 22', slug: 'virgo' },
  { name: 'Libra', dates: 'Sep 23 – Oct 22', slug: 'libra' },
  { name: 'Scorpio', dates: 'Oct 23 – Nov 21', slug: 'scorpio' },
  { name: 'Sagittarius', dates: 'Nov 22 – Dec 21', slug: 'sagittarius' },
  { name: 'Capricorn', dates: 'Dec 22 – Jan 19', slug: 'capricorn' },
  { name: 'Aquarius', dates: 'Jan 20 – Feb 18', slug: 'aquarius' },
  { name: 'Pisces', dates: 'Feb 19 – Mar 20', slug: 'pisces' },
]

export default function StartPage() {
  return (
    <>
      <Head>
        <title>Start Here — Your Astrology Journey | Birth Chart Library</title>
        <meta name="description" content="New to astrology? Start here. Find your zodiac sign, learn what it means, and create your free birth chart." />
        <link rel="canonical" key="canonical" href="https://birthchartlibrary.com/start" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Step 1 */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Step 1 of 3</p>
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide mb-3">What&apos;s your sign?</h1>
          <p className="text-slate-500">Find your Sun sign below based on your birthday. This is where your astrology journey begins.</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-12">
          {SIGNS.map(sign => {
            const ec = getElementColor(sign.name)
            return (
              <Link
                key={sign.slug}
                href={`/zodiac-signs/${sign.slug}`}
                className={`card flex flex-col items-center text-center p-4 hover:border-slate-400 transition-all group`}
              >
                <SignGlyph sign={sign.name} decorative className={`text-2xl mb-1 w-12 h-12 rounded-full ${ec.bg} ${ec.text} flex items-center justify-center`} />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{sign.name}</span>
                <span className="text-[10px] text-slate-400">{sign.dates}</span>
              </Link>
            )
          })}
        </div>

        {/* Step 2 */}
        <div className="border-t border-slate-200 pt-10 mb-10">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Step 2</p>
            <h2 className="font-display text-2xl tracking-wide mb-2">Go beyond your Sun sign</h2>
            <p className="text-slate-500 text-sm">Your Sun sign is just the beginning. A full birth chart reveals your Moon sign (emotions), Rising sign (how others see you), and 10 more planetary placements.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/calculators/rising-sign" className="card p-5 hover:border-slate-400 transition-colors group text-center">
              <p className="text-xl mb-2">↑</p>
              <p className="font-medium text-sm group-hover:text-slate-900 transition-colors">Find Your Rising Sign</p>
              <p className="text-xs text-slate-400 mt-1">Requires birth time</p>
            </Link>
            <Link href="/calculators/sun-moon-rising" className="card p-5 hover:border-slate-400 transition-colors group text-center">
              <p className="text-xl mb-2">☉ ☽ ↑</p>
              <p className="font-medium text-sm group-hover:text-slate-900 transition-colors">Your Big Three</p>
              <p className="text-xs text-slate-400 mt-1">Sun + Moon + Rising</p>
            </Link>
            <Link href="/calculators/chinese-zodiac" className="card p-5 hover:border-slate-400 transition-colors group text-center">
              <p className="text-xl mb-2">🐉</p>
              <p className="font-medium text-sm group-hover:text-slate-900 transition-colors">Chinese Zodiac</p>
              <p className="text-xs text-slate-400 mt-1">Year-based animal sign</p>
            </Link>
          </div>
        </div>

        {/* Step 3 */}
        <div className="border-t border-slate-200 pt-10 mb-10">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Step 3</p>
            <h2 className="font-display text-2xl tracking-wide mb-2">Create your full birth chart</h2>
            <p className="text-slate-500 text-sm">A complete natal chart maps all 12 planetary positions at the exact moment you were born. It&apos;s free, personalized, and includes full interpretations.</p>
          </div>
          <div className="text-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3 inline-block">
              Create Your Free Chart
            </Link>
            <p className="text-xs text-slate-400 mt-3">Free forever... no subscription required.</p>
          </div>
        </div>

        {/* Explore more */}
        <div className="border-t border-slate-200 pt-10">
          <h2 className="text-lg font-semibold mb-4 text-center">Keep exploring</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/blog/what-is-a-birth-chart" className="card p-4 hover:border-slate-400 transition-colors group">
              <p className="font-medium text-sm group-hover:text-slate-900 transition-colors">What Is a Birth Chart?</p>
              <p className="text-xs text-slate-400 mt-1">The complete beginner&apos;s guide</p>
            </Link>
            <Link href="/celebrity-birth-charts" className="card p-4 hover:border-slate-400 transition-colors group">
              <p className="font-medium text-sm group-hover:text-slate-900 transition-colors">Celebrity Birth Charts</p>
              <p className="text-xs text-slate-400 mt-1">See charts for 550+ famous people</p>
            </Link>
            <Link href="/astrology-interpretations" className="card p-4 hover:border-slate-400 transition-colors group">
              <p className="font-medium text-sm group-hover:text-slate-900 transition-colors">Interpretation Library</p>
              <p className="text-xs text-slate-400 mt-1">Look up any planet, sign, or house combination</p>
            </Link>
            <Link href="/reading-room" className="card p-4 hover:border-slate-400 transition-colors group">
              <p className="font-medium text-sm group-hover:text-slate-900 transition-colors">The Reading Room</p>
              <p className="text-xs text-slate-400 mt-1">Curated astrology books for your journey</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
