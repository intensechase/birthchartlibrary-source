import Head from 'next/head'
import Link from 'next/link'
import { Search } from '@/components/redesign/HomePage'

// Not found: say what happened, then give the reader somewhere to go. Search
// first, since most missing URLs are a person's chart under an old address.
const PLACES: [string, string, string][] = [
  ['/celebrity-birth-charts', 'Celebrity charts', 'Browse the whole library'],
  ['/birth-chart', 'Your birth chart', 'Free, no account needed'],
  ['/born-today', 'Born today', 'Today’s birthdays'],
  ['/zodiac-signs', 'The signs', 'What each one means'],
]

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page Not Found | Birth Chart Library</title>
        {/* noindex so Google doesn't index the 404 template. */}
        <meta name="robots" content="noindex" />
      </Head>
      <div className="rdp">
        <div className="wrap hm nf">
          <div className="open">
            <h1>This page isn’t in the library</h1>
            <p className="sub">The link may be old, or the page has moved. Search for someone, or start from one of these.</p>
            <Search />
          </div>
          <div className="nfgrid">
            {PLACES.map(([href, title, sub]) => (
              <Link key={href} href={href} className="lt"><b>{title}</b><small>{sub}</small></Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
