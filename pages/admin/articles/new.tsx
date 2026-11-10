import Head from 'next/head'
import { withAdminAuth } from '@/lib/ssr'
import ArticleEditor from '@/components/ArticleEditor'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'

export const getServerSideProps = withAdminAuth()

export default function NewArticlePage() {
  return (
    <DashboardLayout>
      <Head>
        <title>New Article | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Articles', href: '/admin/articles' },
          { label: 'New' },
        ]} />
        <h1 className="font-display text-3xl tracking-wide mb-8">New Article</h1>
        <ArticleEditor />
      </main>
    </DashboardLayout>
  )
}
