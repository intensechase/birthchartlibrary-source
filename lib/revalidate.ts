import type { NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'

// Best-effort ISR revalidation. Mutating routes (admin saves, scripts)
// should call this AFTER the DB write succeeds — never let a revalidate
// failure roll back the user's edit. Errors go to Sentry and the caller
// continues as if nothing happened. Pages Router uses res.revalidate(path).
export async function safeRevalidate(
  res: NextApiResponse,
  paths: string | string[]
): Promise<void> {
  const arr = Array.isArray(paths) ? paths : [paths]
  await Promise.all(
    arr.map(async path => {
      try {
        await res.revalidate(path)
      } catch (err) {
        Sentry.captureException(err, { tags: { component: 'revalidate', path } })
      }
    })
  )
}
