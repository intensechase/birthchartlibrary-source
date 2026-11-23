import Head from 'next/head'
import AuthShell from '@/components/redesign/AuthShell'
import Link from 'next/link'

export default function UnsubscribedPage() {
  return (
    <>
      <Head>
        <title>Unsubscribed | Birth Chart Library</title>
        <meta name="robots" content="noindex" />
      </Head>
      <AuthShell
        title="You are unsubscribed"
        sub="No more daily horoscope emails from us. You can sign up again any time."
        after={<p className="acts"><Link className="btn" href="/">Home</Link><Link className="tlink" href="/zodiac-signs">Read about the signs</Link></p>}
      />
    </>
  )
}
