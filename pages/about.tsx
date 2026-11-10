import Head from 'next/head'
import Link from 'next/link'

const DESCRIPTION = 'Birth Chart Library is a free natal chart calculator and celebrity chart archive that shows where each birth time came from. Run by one independent developer.'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Birth Chart Library | Birth Chart Library</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://birthchartlibrary.com/about" />
        <meta property="og:title" content="About Birth Chart Library" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content="https://birthchartlibrary.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Birth Chart Library" />
        <meta name="twitter:description" content={DESCRIPTION} />
      </Head>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">About Birth Chart Library</h1>
        <p className="text-slate-500 mb-10">A free birth chart calculator, and a celebrity chart archive that shows its sources.</p>

        <div className="space-y-8 text-slate-500 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Who runs this site</h2>
            <p>
              Birth Chart Library is built and run by one independent developer with a longtime interest in astrology.
              There&apos;s no editorial team or company behind it. Our{' '}
              <Link href="/method" className="underline hover:text-slate-800 transition-colors">method page</Link> explains how charts
              and bios are checked.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Why it exists</h2>
            <p>
              Celebrity birth times get copied from site to site, often with no sign of where they came from, and a wrong time means a
              wrong Rising sign and wrong houses. Here, a chart page with a birth time tells you its source and rating when we have them,
              and says so when we don&apos;t.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">What you can do here</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><Link href="/birth-chart?ref=about" className="underline hover:text-slate-800 transition-colors">Calculate your birth chart</Link> for free, with no account needed to see it</li>
              <li><Link href="/celebrity-birth-charts/rated-birth-times" className="underline hover:text-slate-800 transition-colors">Browse celebrity charts by birth time rating</Link>, or browse all 550+ charts in the library</li>
              <li><Link href="/calculators/synastry" className="underline hover:text-slate-800 transition-colors">Compare two charts</Link> with the synastry calculator</li>
              <li><Link href="/astrology-interpretations" className="underline hover:text-slate-800 transition-colors">Look up what a placement means</Link>, from Sun in Aries to Pluto in the 12th house</li>
              <li>Create a free account to save charts and get a daily horoscope based on your own chart</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">How we approach astrology</h2>
            <p>
              Astrology is a symbolic tradition that many people find useful for reflection. It isn&apos;t a science, and we don&apos;t
              present it as one. We try to describe placements specifically, including the difficult parts, and to let you
              draw your own conclusions. Please don&apos;t use anything here as medical, legal or financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">How the site pays for itself</h2>
            <p>
              The site is free. It may show ads, and as an Amazon Associate we earn from qualifying purchases made through links
              in the Reading Room and elsewhere. Neither affects what a chart says.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Corrections</h2>
            <p>
              If you spot an error in a chart, a birth time or a bio, please use the{' '}
              <Link href="/contact" className="underline hover:text-slate-800 transition-colors">contact page</Link>, ideally with a
              source. We keep a list of significant fixes on the <Link href="/method" className="underline hover:text-slate-800 transition-colors">method page</Link>.
            </p>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/birth-chart?ref=about" className="btn-primary">Calculate My Chart</Link>
            <Link href="/contact" className="btn-outline">Contact</Link>
          </div>
        </div>
      </main>
    </>
  )
}
