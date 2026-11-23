import type { ReactNode, RefObject } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

// The frame every account page shares (sign in, sign up, password, email links):
// same column, title and card as the birth chart form.
export default function AuthShell({ title, sub, children, after }: { title: string; sub?: ReactNode; children?: ReactNode; after?: ReactNode }) {
  return (
    <main className="rdp">
      <div className="wrap mine auth">
        <h1>{title}</h1>
        {sub ? <p className="sub">{sub}</p> : null}
        {children}
        {after ? <div className="authafter">{after}</div> : null}
      </div>
    </main>
  )
}

// The captcha, with what to do when it is slow or has run out.
export function AuthCaptcha({ boxRef, ready, expired, onSuccess, onExpire, onError }: {
  boxRef: RefObject<TurnstileInstance | null>; ready: boolean; expired: boolean
  onSuccess: (token: string) => void; onExpire: () => void; onError: () => void
}) {
  return (
    <div>
      <div className="ts">
        <Turnstile ref={boxRef} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={onSuccess} onExpire={onExpire} onError={onError} options={{ theme: 'dark' }} />
      </div>
      {!ready ? <p className="note" role="status">Checking that you are human…</p> : null}
      {expired ? <p className="note" role="status">The check ran out. <button type="button" className="tlink" onClick={() => boxRef.current?.reset()}>Run it again</button></p> : null}
    </div>
  )
}

export const PrivacyLine = ({ text }: { text: string }) => (
  <p className="lockline">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
    <span>{text}</span>
  </p>
)
