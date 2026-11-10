import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import AdminListCard from '@/components/AdminListCard'

interface Article {
  id: string
  title: string
  slug: string
  publish_date: string
  published: boolean
  category: string
}

interface Props {
  articles: Article[]
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {

  const articles = await query<Article>(
    'SELECT id, title, slug, publish_date, published, category FROM blog_articles ORDER BY publish_date DESC'
  )

  return { props: { articles: articles || [] } }
})

export default function AdminArticlesPage({ articles }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Blog Articles | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Articles' },
        ]} />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl tracking-wide">Blog Articles</h1>
          <Link href="/admin/articles/new" className="btn-primary text-sm">+ New Article</Link>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-2">
            {articles.map(article => (
              <AdminListCard
                key={article.id}
                href={`/admin/articles/${article.id}`}
                title={article.title}
                subtitle={`${article.publish_date} · ${article.category} · /blog/${article.slug}`}
                meta={<span className={`px-2 py-0.5 rounded-full ${article.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {article.published ? 'Published' : 'Draft'}
                </span>}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-10">
            <p className="text-slate-500 mb-4">No articles yet.</p>
            <Link href="/admin/articles/new" className="btn-primary">Write Your First Article</Link>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
