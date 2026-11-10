import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { query } from '@/lib/db'
import DashboardLayout from '@/components/DashboardLayout'
import ReadingRoomAdmin from '@/components/ReadingRoomAdmin'

interface Book {
  id: number
  title: string
  author: string
  description: string
  why_we_recommend: string | null
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
  books: Book[]
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {
  const books = await query<Book>(
    `SELECT id, title, author, description, why_we_recommend, amazon_url, category,
            featured_month, relevant_signs, relevant_planets, sort_order, active, cover_url
     FROM reading_room_books ORDER BY category, sort_order ASC, created_at DESC`
  )
  return { props: { books } }
})

export default function AdminReadingRoomPage({ books }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Reading Room | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">Admin</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-slate-800">Reading Room</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl tracking-wide">Reading Room</h1>
            <p className="text-slate-400 text-sm">{books.length} books</p>
          </div>
          <Link href="/reading-room" target="_blank" className="text-xs text-slate-400 hover:text-slate-700 transition-colors">
            View page →
          </Link>
        </div>

        <ReadingRoomAdmin initialBooks={books} />
      </main>
    </DashboardLayout>
  )
}
