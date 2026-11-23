import type { ReactNode } from 'react'
import Link from 'next/link'
import EmailVerificationBanner from '@/components/EmailVerificationBanner'

// The two account pages: what the reader comes back for (charts), and what they
// touch once a year (settings). The header's person icon opens the first.
export default function AccountShell({ tab, title, action, children }: { tab: 'charts' | 'settings'; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <>
      <EmailVerificationBanner />
      <main className="rdp"><div className="acc acct">
        <nav className="chips filt atabs" aria-label="Account">
          <Link className="chip" href="/account" aria-current={tab === 'charts' ? 'page' : undefined}>Charts</Link>
          <Link className="chip" href="/account/settings" aria-current={tab === 'settings' ? 'page' : undefined}>Settings</Link>
        </nav>
        <div className="ahead"><h1>{title}</h1>{action}</div>
        {children}
      </div></main>
    </>
  )
}
