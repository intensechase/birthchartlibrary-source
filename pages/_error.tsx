import Head from 'next/head'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import type { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <>
      <Head>
        <title>Error | Birth Chart Library</title>
      </Head>
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-6 opacity-20">✦</div>
        <h1 className="font-display text-4xl tracking-wide text-slate-800 mb-3">Something went wrong</h1>
        <p className="text-slate-500 mb-6">
          {statusCode
            ? `An error ${statusCode} occurred on the server.`
            : 'An unexpected error occurred. Try refreshing, or head back to safety.'}
        </p>
        <div className="flex gap-3">
          <button onClick={() => window.location.reload()} className="btn-primary">Try again</button>
          <Link href="/" className="btn-outline">Go Home</Link>
        </div>
      </main>
    </>
  )
}

ErrorPage.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err.statusCode ?? 500) : 404
  if (err) {
    Sentry.captureException(err)
    await Sentry.flush(2000)
  }
  return { statusCode }
}

export default ErrorPage
