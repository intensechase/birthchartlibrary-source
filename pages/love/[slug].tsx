import Head from 'next/head'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, faqSchema, articleSchema, jsonLd } from '@/lib/schema'
import { ARTICLES, type Article } from '@/lib/love-articles'

// ─── Static generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(ARTICLES).map(slug => ({ params: { slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const article = ARTICLES[slug]
  if (!article) return { notFound: true }
  return { props: { article, slug } }
}

// ─── Render ───────────────────────────────────────────────────────────────────

interface PageProps { article: Article; slug: string }

const CATEGORY_LABEL = { couple: 'Couple Deep-Dive', sign: 'Sign Profile', guide: 'Guide' }
const CATEGORY_COLOR = {
  couple: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  sign: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  guide: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

export default function LoveArticlePage({ article, slug }: PageProps) {
  const canonicalUrl = `https://birthchartlibrary.com/love/${slug}`
  const ec1 = article.sign1 ? getElementColor(article.sign1) : null
  const ec2 = article.sign2 ? getElementColor(article.sign2) : null

  const relatedArticles = (article.related ?? [])
    .filter(r => ARTICLES[r])
    .slice(0, 3)
    .map(r => ({ slug: r, title: ARTICLES[r].title, category: ARTICLES[r].category }))

  return (
    <>
      <Head>
        <title>{`${article.title} | Birth Chart Library`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(article.title)}&subtitle=${encodeURIComponent(article.description.slice(0, 80))}&symbol=%E2%99%A5&label=Love+%26+Astrology`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Love & Astrology', url: 'https://birthchartlibrary.com/love' },
        { name: article.title, url: canonicalUrl },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema({ title: article.title, description: article.description, publishDate: article.publishDate, slug: `love/${slug}`, category: article.category })) }} />
      {article.faqs && article.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(article.faqs)) }} />
      )}

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/love" className="hover:text-slate-600 dark:hover:text-slate-300">Love &amp; Astrology</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300 truncate">{article.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLOR[article.category]}`}>
              {CATEGORY_LABEL[article.category]}
            </span>
            <span className="text-xs text-slate-400">{article.readTime}</span>
          </div>

          {/* Sign symbols for couple articles */}
          {article.sign1 && article.sign2 && (
            <div className="flex items-center gap-3 mb-4">
              <SignGlyph sign={article.sign1} className="text-4xl text-slate-900 dark:text-white" />
              <span className="text-slate-300 dark:text-slate-600 text-xl">&amp;</span>
              <SignGlyph sign={article.sign2} className="text-4xl text-slate-900 dark:text-white" />
            </div>
          )}
          {article.sign1 && !article.sign2 && (
            <div className="mb-4">
              <SignGlyph sign={article.sign1} className="text-5xl text-slate-900 dark:text-white" />
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl tracking-wide text-slate-800 dark:text-slate-100 mb-4 leading-tight">{article.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed italic">{article.intro}</p>
        </div>

        {/* Sign pills for couple articles */}
        {article.sign1 && article.sign2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href={`/zodiac-signs/${article.sign1.toLowerCase()}`} className={`text-sm px-3 py-1 rounded-full font-medium ${ec1?.bg} ${ec1?.text} hover:opacity-80 transition-opacity`}>
              <SignGlyph sign={article.sign1} decorative /> {article.sign1}
            </Link>
            <Link href={`/zodiac-signs/${article.sign2.toLowerCase()}`} className={`text-sm px-3 py-1 rounded-full font-medium ${ec2?.bg} ${ec2?.text} hover:opacity-80 transition-opacity`}>
              <SignGlyph sign={article.sign2} decorative /> {article.sign2}
            </Link>
            {article.compatLink && (
              <Link href={article.compatLink} className="text-sm px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Compatibility Guide →
              </Link>
            )}
          </div>
        )}
        {article.sign1 && !article.sign2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href={`/zodiac-signs/${article.sign1.toLowerCase()}`} className={`text-sm px-3 py-1 rounded-full font-medium ${ec1?.bg} ${ec1?.text} hover:opacity-80 transition-opacity`}>
              <SignGlyph sign={article.sign1} decorative /> {article.sign1}
            </Link>
            {article.compatLink && (
              <Link href={article.compatLink} className="text-sm px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                {article.sign1} Compatibility →
              </Link>
            )}
          </div>
        )}

        {/* Article body */}
        <div className="space-y-8">
          {article.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">{section.heading}</h2>
              )}
              {section.callout && !section.heading && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">&ldquo;{section.callout}&rdquo;</p>
                </div>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3 last:mb-0">{p}</p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 mt-3">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-slate-300 dark:text-slate-600 shrink-0 mt-0.5">+</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.signBullets && section.signBullets.length > 0 && (
                <ul className="space-y-2 mt-3">
                  {section.signBullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-slate-300 dark:text-slate-600 shrink-0 mt-0.5">+</span>
                      <span><SignGlyph sign={b.sign} /> {b.text}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.callout && section.heading && (
                <div className="mt-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">&ldquo;{section.callout}&rdquo;</p>
                </div>
              )}
              {/* Mid-page CTA after 2nd section */}
              {i === 1 && article.sections.length > 2 && (
                <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-800/30 px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Know your own side of the equation</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Free birth chart — Sun, Moon, Rising, and 1,700+ interpretations.</p>
                  </div>
                  <Link href="/birth-chart?ref=love-mid" className="btn-primary text-sm px-5 py-2 whitespace-nowrap shrink-0">
                    Get Mine Free
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        {article.faqs && article.faqs.length > 0 && (
          <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-10">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Common Questions</h2>
            <div className="space-y-4">
              {article.faqs.map((faq, i) => (
                <div key={i} className="card">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{faq.question}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 card text-center">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Go deeper than Sun signs</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">A full synastry reading compares Moon signs, Venus placements, Mars, and every other planet in both charts. That\'s where the real picture is.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators/synastry" className="btn-primary text-sm px-6 py-2.5">Compare Full Charts</Link>
            <Link href="/birth-chart" className="btn-outline text-sm px-6 py-2.5">Get My Birth Chart</Link>
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Related</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedArticles.map(r => (
                <Link key={r.slug} href={`/love/${r.slug}`} className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group block">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLOR[r.category]} inline-block mb-2`}>{CATEGORY_LABEL[r.category]}</span>
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors leading-snug">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back + explore */}
        <div className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-wrap gap-3">
          <Link href="/love" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">← Love &amp; Astrology</Link>
          <Link href="/compatibility" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Compatibility Guide</Link>
          <Link href="/love/celebrity-couples" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Celebrity Couples</Link>
        </div>
      </main>
    </>
  )
}
