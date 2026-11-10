import type { GetServerSideProps } from 'next'
import { query } from '@/lib/db'

// Parses publishDate which can come in as either "YYYY-MM-DD" (static
// articles) or a full ISO timestamp (Postgres DATE column serialized to
// "2026-05-22T00:00:00.000Z"). The previous `new Date(date + "T00:00:00Z")`
// concatenated the suffix onto already-ISO strings, producing
// "...ZT00:00:00Z" → Invalid Date → every RSS item showed
// <pubDate>Invalid Date</pubDate>.
function toRfc822(dateStr: string): string {
  const ymd = dateStr.slice(0, 10) // YYYY-MM-DD prefix
  const d = new Date(ymd + 'T00:00:00Z')
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString()
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://birthchartlibrary.com'

  const today = new Date().toISOString().split('T')[0]
  const dbArticles = await query<{ slug: string; title: string; description: string | null; publish_date: string }>(
    `SELECT slug, title, description, publish_date
     FROM blog_articles
     WHERE published = true AND publish_date <= $1
     ORDER BY publish_date DESC LIMIT 20`,
    [today]
  )

  const allArticles = dbArticles.map(a => ({
    slug: a.slug,
    title: a.title,
    description: a.description || '',
    publishDate: a.publish_date,
  }))

  const items = allArticles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${toRfc822(article.publishDate)}</pubDate>
      <guid>${baseUrl}/blog/${article.slug}</guid>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Birth Chart Library Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Astrology explained... one article at a time. Learn about birth charts, zodiac signs, planets, houses, and more.</description>
    <language>en</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function Feed() { return null }
