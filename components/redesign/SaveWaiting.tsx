import { useRef, useState } from 'react'
import Head from 'next/head'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { formatBirthDate } from '@/lib/format-birth'
import { clearWaiting, type PendingChart } from '@/lib/kept-chart'

// A chart made before signing in, now that the reader is signed in (owner,
// 11/23): their own chart saves by itself when the account has no main chart;
// anything else is offered, never added without asking.
export default function SaveWaiting({ pending, hasMain, next, onSkip }: { pending: PendingChart; hasMain: boolean; next: string | null; onSkip: () => void }) {
  const auto = pending.isForSelf && !hasMain
  const [token, setToken] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)
  const box = useRef<TurnstileInstance>(null)

  async function save(t: string) {
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pending,
          birthTime: pending.birthTime || null,
          turnstileToken: t,
          label: pending.isForSelf ? (hasMain ? 'Another chart for me' : 'My Chart') : pending.subjectName,
          subjectName: pending.isForSelf ? null : pending.subjectName,
        }),
      })
      const data: { error?: string; chart?: { id: string } } = await res.json()
      if (res.ok && data.chart?.id) {
        clearWaiting(pending)
        window.location.href = next ?? `/birth-chart/${data.chart.id}`
        return
      }
      setError(data.error ?? 'That did not work. Try again in a moment.')
    } catch {
      setError('No connection. Check your internet and try again.')
    }
    setBusy(false)
    setToken(null) // each check works once
    box.current?.reset()
  }
  const onToken = (t: string) => {
    setToken(t)
    if (auto && !started.current) { started.current = true; save(t) }
  }

  const whose = pending.isForSelf ? 'Your chart' : `${pending.subjectName || 'This person'}’s chart`
  return (
    <main className="rdp">
      <Head>
        <title>Save a birth chart | Birth Chart Library</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="wrap mine savew">
        <h1>{auto && !error ? 'Saving your chart' : 'Save this chart?'}</h1>
        <p className="sub">
          {auto && !error
            ? 'One moment. It opens as soon as it is in your account.'
            : `${whose} for ${formatBirthDate(pending.birthDate)}, ${pending.birthCity}. Saved charts are private unless you share them.`}
          {!auto && pending.isForSelf ? ' You already have a chart, so this one is kept with your other charts.' : ''}
        </p>
        <div className="ts"><Turnstile ref={box} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={onToken} onExpire={() => setToken(null)} options={{ theme: 'dark' }} /></div>
        {error ? <p className="err" role="alert">{error}</p> : null}
        {!auto || error ? (
          <div className="acts">
            <button type="button" className="btn" disabled={busy || !token} onClick={() => token && save(token)}>{busy ? 'Saving…' : error ? 'Try again' : 'Save it'}</button>
            <button type="button" className="tlink" onClick={onSkip}>Not now</button>
          </div>
        ) : null}
      </div>
    </main>
  )
}
