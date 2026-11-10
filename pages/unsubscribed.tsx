import Head from 'next/head'
import Link from 'next/link'

export default function UnsubscribedPage() {
  return (
    <>
      <Head>
        <title>Unsubscribed | Birth Chart Library</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-4xl mb-6">☽</p>
        <h1 className="font-display text-3xl tracking-wide mb-3">You&apos;re unsubscribed</h1>
        <p className="text-slate-500 leading-relaxed mb-8">
          You won&apos;t receive any more daily horoscope emails from us. If you change your mind, you can sign up again any time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/zodiac-signs" className="btn-outline text-sm px-6 py-2.5">Browse Zodiac Signs</Link>
          <Link href="/" className="btn-primary text-sm px-6 py-2.5">Back to Home</Link>
        </div>
      </main>
    </>
  )
}
