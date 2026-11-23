import Link from 'next/link'
import { useRouter } from 'next/router'
import EmailVerificationBanner from '@/components/EmailVerificationBanner'

// Plain centered column for admin pages, the daily horoscope and the old chart
// views. Only admin pages get the admin links and their colors (11/23).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = useRouter().pathname.startsWith('/admin')
  return (
    <div className={`${admin ? 'dash ' : ''}flex-1`}>
      <EmailVerificationBanner />
      {admin ? (
        <nav className="dash-nav max-w-3xl mx-auto px-4 pt-6 flex gap-5 text-sm" aria-label="Account and admin">
          <Link href="/admin">Admin home</Link>
          <Link href="/account">Your charts</Link>
        </nav>
      ) : null}
      {children}
    </div>
  )
}
