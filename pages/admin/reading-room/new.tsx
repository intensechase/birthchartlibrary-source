import Head from 'next/head'
import { withAdminAuth } from '@/lib/ssr'
import DashboardLayout from '@/components/DashboardLayout'
import BookEditor from '@/components/BookEditor'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'

export const getServerSideProps = withAdminAuth()

export default function NewBook() {
  return (
    <DashboardLayout>
      <Head>
        <title>Add Book — Reading Room — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reading Room', href: '/admin/reading-room' },
          { label: 'Add Book' },
        ]} className="mb-4" />

        <h1 className="text-2xl font-bold mb-6">Add a Book</h1>
        <BookEditor />
      </div>
    </DashboardLayout>
  )
}
