import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { queryOne } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import BookEditor from '@/components/BookEditor'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'

interface Book {
  id: number
  title: string
  author: string
  description: string
  why_we_recommend: string
  amazon_url: string
  category: string
  featured_month: string | null
  relevant_signs: string[]
  relevant_planets: string[]
  sort_order: number
  active: boolean
  cover_url: string | null
}

interface Props {
  book: Book
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth<Props>(async (context) => {
  const book = await queryOne<Book>(
    'SELECT id, title, author, description, why_we_recommend, amazon_url, category, featured_month, relevant_signs, relevant_planets, sort_order, active, cover_url FROM reading_room_books WHERE id = $1',
    [context.params?.id]
  )

  if (!book) return { notFound: true }

  return { props: { book } }
})

export default function EditBook({ book }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>{`Edit ${book.title} — Reading Room — Admin`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reading Room', href: '/admin/reading-room' },
          { label: book.title },
        ]} className="mb-4" />

        <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
        <BookEditor book={{ ...book, why_we_recommend: book.why_we_recommend || '', featured_month: book.featured_month || '', cover_url: book.cover_url || '' }} />
      </div>
    </DashboardLayout>
  )
}
