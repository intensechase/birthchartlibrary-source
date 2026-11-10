import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useState } from 'react'
import { query } from '@/lib/db'

interface Article {
  slug: string
  title: string
  description: string
  publishDate: string
  category: string
  readTime: string
}

interface Props {
  articles: Article[]
}

const CATEGORY_LABELS: Record<string, string> = {
  basics: 'Basics',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  tools: 'Tools',
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const today = new Date().toISOString().split('T')[0]
  const dbArticles = await query<{ slug: string; title: string; description: string; publish_date: string; category: string; read_time: string }>(
    `SELECT slug, title, description, publish_date, category, read_time
     FROM blog_articles
     WHERE published = true AND publish_date <= $1
     ORDER BY publish_date DESC`,
    [today]
  )

  // Normalize category casing here — the DB has both "Basics" and "basics"
  // (and same for "Intermediate"), which previously caused duplicate chips
  // in the filter row with split counts.
  const articles = dbArticles.map(a => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    publishDate: a.publish_date.split('T')[0].split(' ')[0],
    category: (a.category || '').toLowerCase().trim(),
    readTime: a.read_time,
  }))

  return { props: { articles }, revalidate: 86400 }
}

export default function BlogPage({ articles }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))]
  const categoryCounts = Object.fromEntries(categories.filter(c => c !== 'all').map(c => [c, articles.filter(a => a.category === c).length]))
  const filtered = activeCategory === 'all' ? articles : articles.filter(a => a.category === activeCategory)
  const featured = filtered[0] ?? null
  const rest = filtered.slice(1)

  return (
    <>
      <Head>
        <title>Blog — Astrology Articles &amp; Guides | Birth Chart Library</title>
        <meta name="description" content="Learn astrology from the ground up. Articles on birth charts, zodiac signs, planets, houses, retrogrades, and more." />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og/blog?title=Astrology+Articles+%26+Guides&category=Blog" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="font-display text-5xl md:text-6xl tracking-wide text-slate-800 dark:text-slate-100 mb-3">Blog</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base mb-12">Astrology explained... one article at a time.</p>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-600 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              {cat === 'all' ? `All (${articles.length})` : `${CATEGORY_LABELS[cat] || cat} (${categoryCounts[cat] ?? 0})`}
            </button>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-slate-500">New articles coming soon...</p>
          </div>
        )}

        {/* Love & Relationships cross-link */}
        <Link href="/love" className="card flex items-center gap-4 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group mb-8 border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/10">
          <span className="text-3xl flex-shrink-0">♥</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Love &amp; Astrology</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Celebrity couple deep-dives, sign-in-love profiles, and compatibility guides</p>
          </div>
          <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 text-sm">Explore →</span>
        </Link>

        {/* Featured — latest article */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="card block hover:border-slate-400 transition-colors group mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-white">{CATEGORY_LABELS[featured.category] || featured.category}</span>
              <span className="text-xs text-slate-400">{featured.readTime}</span>
              <span className="text-xs text-slate-300">&middot;</span>
              <span className="text-xs text-slate-400">
                {new Date(featured.publishDate + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors leading-tight mb-3">{featured.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{featured.description}</p>
          </Link>
        )}

        {/* Rest — 2-column grid */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {rest.map(article => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="card block hover:border-slate-400 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{CATEGORY_LABELS[article.category] || article.category}</span>
                  <span className="text-xs text-slate-400">{article.readTime}</span>
                </div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors leading-snug mb-2">{article.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{article.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
