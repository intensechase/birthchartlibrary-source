import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import { query, queryOne } from '@/lib/db'
import { getListableCelebrities } from '@/lib/celebrities'
import { autoLinkContent, newAutoLinkState } from '@/lib/blog/auto-link'
import { articleSchema, jsonLd } from '@/lib/schema'
import BlogCTA from '@/components/BlogCTA'
import Scallop from '@/components/Scallop'
import { isNoindexBlogSlug } from '@/lib/thin-pages'

interface RelatedPost {
  title: string
  slug: string
  category: string
  read_time: string
}

interface Props {
  title: string
  content: string
  category: string
  readTime: string
  publishDate: string
  isHtml: boolean
  description: string
  slug: string
  celebLinks: Record<string, string>
  related: RelatedPost[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

// Older articles consolidated into a single longer replacement — 2026-08-08
// duplicate cleanup, see docs/blog-content-library.md "Known duplicates".
// 301s preserve any accrued link value instead of 404ing these URLs.
const CONSOLIDATED_REDIRECTS: Record<string, string> = {
  'the-big-three-explained': 'the-big-three-astrology-sun-moon-rising',
  'what-does-your-rising-sign-mean': 'what-your-rising-sign-means',
  'what-is-an-ascendant': 'what-your-rising-sign-means',
  'north-node-souls-growth-direction': 'north-node-astrology-meaning',
  'what-is-a-stellium': 'stellium-meaning-astrology',
  'chiron-in-your-birth-chart': 'chiron-in-astrology',
  'what-is-mercury-retrograde': 'mercury-retrograde-meaning',
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = context.params?.slug as string

  if (CONSOLIDATED_REDIRECTS[slug]) {
    return {
      redirect: {
        destination: `/blog/${CONSOLIDATED_REDIRECTS[slug]}`,
        permanent: true,
      },
    }
  }

  const today = new Date().toISOString().split('T')[0]
  try {
    const article = await queryOne<{ title: string; description: string; content: string; category: string; read_time: string; publish_date: string }>(
      `SELECT title, description, content, category, read_time, publish_date
       FROM blog_articles
       WHERE slug = $1 AND published = true AND publish_date <= $2`,
      [slug, today]
    )

    if (!article) return { notFound: true }

    const isHtml = /<[a-z][\s\S]*>/i.test(article.content)

    const [celebRows, related] = await Promise.all([
      getListableCelebrities<{ name: string; slug: string }>({
        columns: 'name, slug',
        where: "name LIKE '% %'",
        orderBy: 'name',
        limit: 300,
      }),
      query<RelatedPost>(
        `SELECT title, slug, category, read_time FROM blog_articles
         WHERE published = true AND publish_date <= $1 AND slug != $2 AND category = $3
         ORDER BY publish_date DESC LIMIT 3`,
        [today, slug, article.category]
      ),
    ])

    const celebLinks: Record<string, string> = {}
    for (const c of celebRows) {
      celebLinks[c.name] = `/celebrity-birth-charts/${c.slug}`
    }

    return {
      props: {
        title: article.title,
        content: article.content,
        category: article.category,
        readTime: article.read_time,
        publishDate: article.publish_date.split('T')[0].split(' ')[0],
        isHtml,
        description: article.description,
        slug,
        celebLinks,
        related,
      },
      revalidate: 604800,
    }
  } catch (err) {
    console.error('[blog/slug] getStaticProps error:', err)
    return { notFound: true }
  }
}

export default function ArticlePage({ title, content, category, readTime, publishDate, isHtml, description, slug, celebLinks, related }: Props) {
  const dateStr = new Date(publishDate + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" key="canonical" href={`https://birthchartlibrary.com/blog/${slug}`} />
        {isNoindexBlogSlug(slug) && <meta name="robots" content="noindex,follow" />}
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/blog?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema({ title, description, publishDate, slug, category })) }} />

      {/* Hero band */}
      <section className="bg-[var(--band)]">
        <div className="max-w-[46rem] mx-auto px-4 sm:px-6 pt-5 pb-10">
          <AdminBreadcrumb crumbs={[
            { label: 'Blog', href: '/blog' },
            { label: category },
          ]} className="mb-7 !text-sm" />
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center min-h-8 px-3.5 rounded-full bg-[var(--gold)] border-2 border-[var(--outline)] text-sm font-black text-[#1A1622]">{category}</span>
            <span className="inline-flex items-center min-h-8 px-3.5 rounded-full bg-[var(--surface)] text-sm font-bold text-slate-800 dark:text-slate-100">{readTime}</span>
            <span className="inline-flex items-center min-h-8 px-3.5 rounded-full bg-[var(--surface)] text-sm font-bold text-slate-800 dark:text-slate-100">{dateStr}</span>
          </div>
          <h1 className="text-[clamp(2.2rem,5.4vw,3.5rem)] leading-[1.08] text-slate-800 dark:text-slate-100 mb-4">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400">By Birth Chart Library Editorial Team</p>
        </div>
      </section>
      <Scallop id="hero-scallops" top="var(--band)" className="bg-[var(--background)]" />

      <main className="max-w-[46rem] mx-auto px-4 sm:px-6 pt-10 pb-16">
        {isHtml ? (
          <div
            className="prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-normal prose-h2:text-[30px] prose-h2:leading-tight prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-[22px] prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-slate-800 dark:prose-p:text-slate-100 prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-strong:text-slate-800 dark:prose-strong:text-slate-100 prose-a:text-[var(--accent)] prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-li:text-slate-800 dark:prose-li:text-slate-100 prose-blockquote:border-[var(--gold)] prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-100"
            dangerouslySetInnerHTML={{ __html: autoLinkContent(content, [title], celebLinks) }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {(() => {
              // One state for the whole article, so each term links only at its first mention.
              const linkState = newAutoLinkState()
              return content.replace(/\r\n/g, '\n').split('\n\n').filter((p: string) => p.trim()).map((paragraph: string, i: number) => (
                <p
                  key={i}
                  className="text-slate-800 dark:text-slate-100 text-lg leading-relaxed [&_a]:font-bold [&_a]:text-[var(--accent)] [&_a:hover]:underline"
                  dangerouslySetInnerHTML={{ __html: autoLinkContent(paragraph.trim(), [title], celebLinks, linkState) }}
                />
              ))
            })()}
          </div>
        )}

        <BlogCTA slug={slug} />

        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-3.5">
              <h2 className="text-[28px] sm:text-[32px]">More in {category}</h2>
              <Link href="/blog" className="font-bold text-[var(--accent)] hover:underline">All articles →</Link>
            </div>
            <ul>
              {related.map(r => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="block py-4 border-t-2 border-slate-300 dark:border-slate-600 group">
                    <span className="block font-black text-[19px] leading-snug mb-1 text-slate-800 dark:text-slate-100 group-hover:underline">{r.title}</span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400">{r.read_time}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  )
}
