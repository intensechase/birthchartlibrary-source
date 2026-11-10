import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { dbGetGlossary, type GlossaryTermDB } from '@/lib/interpretations/db'
import { glossary as staticGlossary } from '@/lib/glossary'
import { faqSchema, jsonLd } from '@/lib/schema'

interface GlossaryItem { term: string; definition: string; link: string | null }
interface Props { glossary: GlossaryItem[] }

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dbTerms = await dbGetGlossary()
  const glossary = dbTerms.length > 0
    ? dbTerms.map(t => ({ term: t.term, definition: t.definition, link: t.link }))
    : staticGlossary.map(t => ({ term: t.term, definition: t.definition, link: t.link || null }))
  return { props: { glossary }, revalidate: 86400 }
}

export default function GlossaryPage({ glossary }: Props) {
  const grouped = new Map<string, typeof glossary>()
  for (const term of glossary) {
    const letter = term.term[0].toUpperCase()
    if (!grouped.has(letter)) grouped.set(letter, [])
    grouped.get(letter)!.push(term)
  }

  const letters = Array.from(grouped.keys()).sort()

  return (
    <>
      <Head>
        <title>Astrology Glossary — 50+ Terms Defined | Birth Chart Library</title>
        <meta name="description" content="A complete glossary of astrology terms: aspects, houses, planets, signs, retrogrades, and more. Every term defined in plain English." />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og/topic?title=Astrology+Glossary&subtitle=50%2B+Terms+Defined&symbol=✦&label=Birth+Chart+Library" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(glossary.slice(0, 10).map(t => ({ question: `What is ${t.term}?`, answer: t.definition })))) }} />
        <h1 className="font-display text-4xl tracking-wide mb-2">Astrology Glossary</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Every term you need to read a birth chart... defined in plain English.</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {letters.map(letter => (
            <a key={letter} href={`#${letter}`} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              {letter}
            </a>
          ))}
        </div>

        <div className="space-y-8">
          {letters.map(letter => (
            <section key={letter} id={letter}>
              <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">{letter}</h2>
              <div className="space-y-4">
                {grouped.get(letter)!.map(entry => (
                  <div key={entry.term} id={entry.term.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {entry.link ? (
                        <Link href={entry.link} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          {entry.term} →
                        </Link>
                      ) : (
                        entry.term
                      )}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-1">{entry.definition}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
          <p className="font-display text-xl tracking-wide mb-2">Ready to see these concepts in action?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Generate your free birth chart and see how every term applies to you personally.</p>
          <Link href="/signup?ref=glossary" className="btn-primary">Create Your Free Chart</Link>
        </div>
      </main>
    </>
  )
}
