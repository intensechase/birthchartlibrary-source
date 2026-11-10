import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { query } from '@/lib/db'

interface Book {
  id: number
  title: string
  author: string
  description: string
  why_we_recommend: string | null
  amazon_url: string
  category: string
  featured_month: string | null
  cover_url: string | null
}

interface Props {
  monthlyPick: Book | null
  previousPicks: (Book & { monthLabel: string })[]
  beginnerBooks: Book[]
  intermediateBooks: Book[]
  advancedBooks: Book[]
  toolBooks: Book[]
  currentMonthLabel: string
}

const MONTH_LABELS: Record<string, string> = {
  '01': 'January', '02': 'February', '03': 'March', '04': 'April',
  '05': 'May', '06': 'June', '07': 'July', '08': 'August',
  '09': 'September', '10': 'October', '11': 'November', '12': 'December',
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
  const currentMonthLabel = MONTH_LABELS[currentMonth] || ''

  const allBooks = await query<Book>(
    `SELECT id, title, author, description, why_we_recommend, amazon_url, category, featured_month, cover_url
     FROM reading_room_books WHERE active = true ORDER BY sort_order ASC, created_at DESC`
  )

  const monthlyPick = allBooks.find(b => b.featured_month === currentMonth) || null
  const previousPicks = allBooks
    .filter(b => b.featured_month && b.featured_month !== currentMonth && b.featured_month < currentMonth)
    .map(b => ({ ...b, monthLabel: MONTH_LABELS[b.featured_month!] || '' }))
    .sort((a, b) => b.featured_month!.localeCompare(a.featured_month!))
  const beginnerBooks = allBooks.filter(b => b.category === 'beginner')
  const intermediateBooks = allBooks.filter(b => b.category === 'intermediate')
  const advancedBooks = allBooks.filter(b => b.category === 'advanced')
  const toolBooks = allBooks.filter(b => b.category === 'tools')

  return {
    props: { monthlyPick, previousPicks, beginnerBooks, intermediateBooks, advancedBooks, toolBooks, currentMonthLabel },
    revalidate: 86400,
  }
}

function BookCard({ book }: { book: Book }) {
  return (
    <a
      href={book.amazon_url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="card flex gap-4 p-5 hover:border-slate-400 transition-colors group"
    >
      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={`${book.title} cover`}
          className="shrink-0 w-20 h-28 object-cover rounded shadow-sm bg-slate-100 dark:bg-slate-800"
          loading="lazy"
        />
      )}
      <div className="min-w-0">
        <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{book.title}</p>
        <p className="text-sm text-slate-400 mt-0.5">by {book.author}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{book.description}</p>
        {book.why_we_recommend && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic">{book.why_we_recommend}</p>
        )}
      </div>
    </a>
  )
}

export default function ReadingRoom({ monthlyPick, previousPicks, beginnerBooks, intermediateBooks, advancedBooks, toolBooks, currentMonthLabel }: Props) {
  const hasBooks = monthlyPick || previousPicks.length > 0 || beginnerBooks.length > 0 || intermediateBooks.length > 0 || advancedBooks.length > 0 || toolBooks.length > 0

  return (
    <>
      <Head>
        <title>The Reading Room — Birth Chart Library</title>
        <meta name="description" content="Curated astrology books and tools for every stage of your journey. Beginner-friendly guides, deep dives into transits and synastry, and tools for tracking your chart." />
        <link rel="canonical" key="canonical" href="https://birthchartlibrary.com/reading-room" />
        <meta property="og:title" content="The Reading Room — Birth Chart Library" />
        <meta property="og:description" content="Curated astrology books and tools for every stage of your journey." />
        <meta property="og:url" content="https://birthchartlibrary.com/reading-room" />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="font-display text-5xl md:text-6xl tracking-wide text-slate-800 dark:text-slate-100 mb-4">The Reading Room</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mb-12">
          Curated reads for your astrological journey. Whether you&apos;re just discovering your birth chart or diving into planetary transits, these are the books and tools we keep coming back to.
        </p>

        {/* Kindle Unlimited Banner */}
        <a
          href="https://www.amazon.com/kindle-dbs/hz/signup?tag=birthchartlib-20"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 px-6 py-5 mb-10 hover:border-amber-300 dark:hover:border-amber-700/60 transition-colors group"
        >
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Unlimited astrology books — free to try</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kindle Unlimited gives you access to thousands of astrology titles. Read as many as you want, cancel anytime.</p>
          </div>
          <span className="shrink-0 text-sm font-medium text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/50 rounded-lg px-3 py-1.5 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/20 transition-colors whitespace-nowrap">Try free →</span>
        </a>

        {!hasBooks && (
          <div className="text-center py-16">
            <p className="text-slate-400">Our reading list is being curated. Check back soon.</p>
          </div>
        )}

        {/* Monthly Pick */}
        {monthlyPick && (
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-wide mb-1">{currentMonthLabel}&apos;s Pick</h2>
            <p className="text-sm text-slate-400 mb-4">What we&apos;re reading this month</p>
            <a
              href={monthlyPick.amazon_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="card flex gap-5 p-6 hover:border-slate-400 transition-colors group border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10"
            >
              {monthlyPick.cover_url && (
                <img
                  src={monthlyPick.cover_url}
                  alt={`${monthlyPick.title} cover`}
                  className="shrink-0 w-24 h-36 object-cover rounded shadow-md bg-slate-100 dark:bg-slate-800"
                  loading="lazy"
                />
              )}
              <div className="min-w-0">
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{monthlyPick.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">by {monthlyPick.author}</p>
                <p className="text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">{monthlyPick.description}</p>
                {monthlyPick.why_we_recommend && (
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-3 italic">{monthlyPick.why_we_recommend}</p>
                )}
              </div>
            </a>
          </section>
        )}

        {/* Previous Monthly Picks */}
        {previousPicks.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-wide mb-1">Previous Picks</h2>
            <p className="text-sm text-slate-400 mb-4">What we recommended in past months</p>
            <div className="space-y-3">
              {previousPicks.map(book => (
                <a
                  key={book.id}
                  href={book.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="card flex gap-4 p-5 hover:border-slate-400 transition-colors group"
                >
                  {book.cover_url && (
                    <img
                      src={book.cover_url}
                      alt={`${book.title} cover`}
                      className="shrink-0 w-20 h-28 object-cover rounded shadow-sm bg-slate-100 dark:bg-slate-800"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{book.title}</p>
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">{book.monthLabel}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">by {book.author}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{book.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Start Here */}
        {beginnerBooks.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-wide mb-1">Start Here</h2>
            <p className="text-sm text-slate-400 mb-4">New to birth charts? These will get you grounded</p>
            <div className="space-y-3">
              {beginnerBooks.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {/* Go Deeper */}
        {intermediateBooks.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-wide mb-1">Go Deeper</h2>
            <p className="text-sm text-slate-400 mb-4">Ready to explore aspects, transits, and technique</p>
            <div className="space-y-3">
              {intermediateBooks.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {/* Advanced */}
        {advancedBooks.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-wide mb-1">For the Dedicated Student</h2>
            <p className="text-sm text-slate-400 mb-4">Professional-level references and specialized topics</p>
            <div className="space-y-3">
              {advancedBooks.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {/* Tools */}
        {toolBooks.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-wide mb-1">Journals, Planners & Tools</h2>
            <p className="text-sm text-slate-400 mb-4">Helpful companions for tracking your chart and transits</p>
            <div className="space-y-3">
              {toolBooks.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        <p className="text-xs text-slate-400 text-center mt-12">
          As an Amazon Associate, Birth Chart Library earns from qualifying purchases. We only recommend books and tools we genuinely believe in.
        </p>
      </div>
    </>
  )
}
