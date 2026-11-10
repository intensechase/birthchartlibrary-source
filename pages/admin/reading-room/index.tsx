import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import AdminListCard from '@/components/AdminListCard'

interface Book {
  id: number
  title: string
  author: string
  category: string
  featured_month: string | null
  active: boolean
  sort_order: number
}

interface Props {
  books: Book[]
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {

  const books = await query<Book>(
    'SELECT id, title, author, category, featured_month, active, sort_order FROM reading_room_books ORDER BY sort_order ASC, created_at DESC'
  )

  return { props: { books } }
})

const MONTH_LABELS: Record<string, string> = {
  '01': 'January', '02': 'February', '03': 'March', '04': 'April',
  '05': 'May', '06': 'June', '07': 'July', '08': 'August',
  '09': 'September', '10': 'October', '11': 'November', '12': 'December',
}

export default function AdminReadingRoom({ books }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Reading Room — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AdminBreadcrumb crumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reading Room' },
        ]} className="mb-4" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reading Room</h1>
          <Link href="/admin/reading-room/new" className="btn-primary text-sm px-4 py-2">
            Add Book
          </Link>
        </div>

        {books.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No books yet. Add your first recommendation.</p>
        ) : (
          <div className="space-y-2">
            {books.map(book => (
              <AdminListCard
                key={book.id}
                href={`/admin/reading-room/${book.id}`}
                title={<>{book.title}{!book.active && <span className="ml-2 text-xs text-red-400">(hidden)</span>}</>}
                subtitle={`by ${book.author}`}
                meta={<>
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600">{book.category}</span>
                  {book.featured_month && (
                    <span className="inline-block ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                      {MONTH_LABELS[book.featured_month] || book.featured_month} pick
                    </span>
                  )}
                </>}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/reading-room" className="text-sm text-slate-400 hover:text-slate-600">
            View public reading room →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
