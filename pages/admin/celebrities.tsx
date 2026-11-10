import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withAdminAuth } from '@/lib/ssr'
import { queryCount } from '@/lib/db'
import CelebrityAdmin from '@/components/CelebrityAdmin'
import DashboardLayout from '@/components/DashboardLayout'

interface Props {
  count: number
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {

  const count = await queryCount('SELECT count(*) FROM celebrities')

  return { props: { count } }
})

export default function AdminCelebritiesPage({ count }: Props) {
  return (
    <DashboardLayout>
      <Head>
        <title>Celebrities | Admin | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-slate-400 mb-6">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">Admin</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-slate-800">Celebrities</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl tracking-wide">Celebrities</h1>
            <p className="text-slate-400 text-sm">{count} total</p>
          </div>
        </div>

        <CelebrityAdmin />
      </main>
    </DashboardLayout>
  )
}
