import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getUser, clearAuthCookie } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import AccountShell from '@/components/redesign/AccountShell'
import SignOutButton from '@/components/SignOutButton'
import DailyEmailToggle from '@/components/DailyEmailToggle'
import EmailSettings from '@/components/EmailSettings'
import ChangePassword from '@/components/ChangePassword'
import ExportData from '@/components/ExportData'
import DeleteAccount from '@/components/DeleteAccount'

interface Props { email: string; isAdmin: boolean; hasMain: boolean; dailyEmail: boolean; emailCadenceDays: number }

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = await getUser(context)
  if (!user) {
    clearAuthCookie(context.res) // see daily-horoscope.tsx: avoids a /login loop
    return { redirect: { destination: '/login', permanent: false } }
  }
  const [profile, main] = await Promise.all([
    queryOne<{ daily_email: boolean; email_cadence_days: number }>('SELECT daily_email, email_cadence_days FROM profiles WHERE id = $1', [user.id]),
    queryOne<{ id: string }>('SELECT id FROM birth_charts WHERE user_id = $1 AND is_primary = true LIMIT 1', [user.id]),
  ])
  return { props: { email: user.email || '', isAdmin: !!user.is_admin, hasMain: !!main, dailyEmail: profile?.daily_email ?? false, emailCadenceDays: profile?.email_cadence_days ?? 1 } }
}

export default function SettingsPage({ email, isAdmin, hasMain, dailyEmail, emailCadenceDays }: Props) {
  const verify = useRouter().query.emailVerifyError as string | undefined
  return (
    <>
      <Head>
        <title>Settings | Birth Chart Library</title>
        <meta name="robots" content="noindex" />
      </Head>
      <AccountShell tab="settings" title="Settings" action={<SignOutButton />}>
        {verify === 'expired' ? <p className="msg" role="alert">Your verification link has expired. <Link className="tlink" href="/api/auth/resend-verification" prefetch={false}>Resend verification email</Link></p> : null}
        {verify === 'invalid' ? <p className="msg" role="alert">That verification link is invalid or has already been used.</p> : null}
        {hasMain ? <section><h2>Horoscope email</h2><DailyEmailToggle initialEnabled={dailyEmail} initialCadenceDays={emailCadenceDays} /></section> : null}
        <section className="stack">
          <h2>Sign in</h2>
          <EmailSettings email={email} />
          <ChangePassword />
        </section>
        <section className="stack">
          <h2>Your data</h2>
          <div className="card flex items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">Download all your charts and account data as JSON.</p>
            <ExportData />
          </div>
          <DeleteAccount />
        </section>
        {isAdmin ? <p className="acts"><Link className="tlink" href="/admin">Admin</Link></p> : null}
      </AccountShell>
    </>
  )
}
