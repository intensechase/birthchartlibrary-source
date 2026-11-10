import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { query } from '@/lib/db'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { PHOTO_CREDIT_COLUMNS, toPhotoCredit, type PhotoCredit } from '@/lib/photo-credit'

interface Row {
  name: string
  slug: string
  credit: PhotoCredit | null
}

interface Props {
  rows: Row[]
}

// Full attribution for every celebrity photo on the site, so thumbnails in
// lists (which have no room for a credit line) are covered too.
export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await query<{ name: string; slug: string; image_author: string | null; image_license: string | null; image_license_url: string | null; image_file_page: string | null }>(
    `SELECT name, slug, ${PHOTO_CREDIT_COLUMNS} FROM celebrities
     WHERE image_url IS NOT NULL AND ${QUALITY_BIO_SQL}
     ORDER BY name`
  )
  return {
    props: { rows: data.map(r => ({ name: r.name, slug: r.slug, credit: toPhotoCredit(r) })) },
    revalidate: 86400,
  }
}

export default function PhotoCreditsPage({ rows }: Props) {
  return (
    <>
      <Head>
        <title>Photo Credits | Birth Chart Library</title>
        <meta name="description" content="Author and license for every celebrity photo on Birth Chart Library. All photos come from Wikimedia Commons." />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-3">Photo Credits</h1>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl">
          Every celebrity photo on this site comes from Wikimedia Commons and is used under the license its author chose.
          Each name below links to the photo&apos;s Commons page, where the full license terms are. Photos may be cropped
          into a circle on our pages. If you took one of these photos and the credit is wrong,{' '}
          <Link href="/contact" className="underline">please tell us</Link>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-2 pr-4 font-medium">Person</th>
                <th className="py-2 pr-4 font-medium">Photo by</th>
                <th className="py-2 font-medium">License</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.slug} className="border-b border-slate-100 dark:border-slate-800 align-top">
                  <td className="py-2 pr-4">
                    <Link href={`/celebrity-birth-charts/${r.slug}`} className="hover:underline text-slate-800 dark:text-slate-100">{r.name}</Link>
                  </td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-300 break-words">
                    {r.credit?.filePage
                      ? <a href={r.credit.filePage} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.credit.author || 'See Commons page'}</a>
                      : (r.credit?.author || 'Wikimedia Commons')}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {r.credit?.licenseUrl
                      ? <a href={r.credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className="hover:underline">{r.credit.license}</a>
                      : (r.credit?.license || '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
