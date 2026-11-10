import Head from 'next/head'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page Not Found | Birth Chart Library</title>
        {/* noindex this page so Google doesn't index the 404 template
            (which used to ship a canonical pointing at /404 itself for
            every missing URL). */}
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <svg width="36" height="36" viewBox="0 0 512 512" className="shrink-0">
            <circle cx="256" cy="256" r="140" stroke="#1A202C" strokeWidth="24" fill="none"/>
            <circle cx="256" cy="256" r="48" fill="#1A202C"/>
          </svg>
          <span className="font-display text-2xl tracking-wider text-slate-800">Birth Chart Library</span>
        </Link>

        <h1 className="font-display text-7xl tracking-wide text-slate-800 mb-4">404</h1>
        <p className="text-slate-500 text-lg mb-2">Mercury&apos;s in retrograde... that&apos;s probably what caused this.</p>
        <p className="text-slate-400 text-sm mb-10">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>

        <div className="flex gap-3 mb-12">
          <Link href="/" className="btn-primary">Go Home</Link>
          {/* /calculators is publicly accessible (no auth gate); the previous
              /birth-chart link was Disallow: in robots.txt, which meant the
              404 page was the most-visible internal link to a disallowed URL. */}
          <Link href="/calculators" className="btn-outline">Open a Calculator</Link>
        </div>

        <div className="max-w-md w-full">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Try one of these instead</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/zodiac-signs" className="border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors">
              Zodiac Signs
            </Link>
            <Link href="/celebrity-birth-charts" className="border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors">
              Celebrity Charts
            </Link>
            <Link href="/astrology-planets" className="border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors">
              Planets
            </Link>
            <Link href="/astrology-interpretations" className="border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors">
              Interpretation Library
            </Link>
            <Link href="/reading-room" className="border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors col-span-2">
              The Reading Room — Astrology Books
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
