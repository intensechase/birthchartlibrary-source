import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { queryOne } from '@/lib/db'
import ArticleEditor from '@/components/ArticleEditor'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'

interface ArticleData {
  id: string
  title: string
  slug: string
  description: string | null
  content: string
  category: string | null
  read_time: string | null
  publish_date: string
  published: boolean
}

interface Props {
  article: ArticleData
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth<Props>(async (context) => {
  const id = context.params?.id as string

  const article = await queryOne<ArticleData>(
    'SELECT id, title, slug, description, content, category, read_time, publish_date, published FROM blog_articles WHERE id = $1',
    [id]
  )

  if (!article) return { notFound: true }

  return { props: { article } }
})

export default function EditArticlePage({ article }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>{`Edit: ${article.title} | Admin | Birth Chart Library`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Articles', href: '/admin/articles' },
          { label: article.title },
        ]} />
        <h1 className="font-display text-3xl tracking-wide mb-8">Edit Article</h1>
        <ArticleEditor article={article} />
      </main>
    </DashboardLayout>
  )
}
