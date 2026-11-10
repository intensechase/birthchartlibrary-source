import Head from 'next/head'
import type { GetStaticProps } from 'next'
import RatedChartsContent from '@/components/RatedChartsContent'
import { getRatedCelebrities, type RatedCeleb } from '@/lib/celebrities'
import { breadcrumbSchema, itemListSchema, jsonLd } from '@/lib/schema'

const URL = 'https://birthchartlibrary.com/celebrity-birth-charts/rated-birth-times'
const TITLE = 'Celebrity Birth Charts With Rated Birth Times'
const DESCRIPTION = 'Featured celebrity birth charts whose birth time has a Rodden rating from Astro-Databank: birth records, quotes from memory and biographies, with a link to each source.'

export const getStaticProps: GetStaticProps<{ celebs: RatedCeleb[] }> = async () => ({
  props: { celebs: await getRatedCelebrities() },
  revalidate: 86400,
})

export default function RatedBirthTimesPage({ celebs }: { celebs: RatedCeleb[] }) {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" key="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemListSchema(celebs.map(c => ({ name: c.name, url: `https://birthchartlibrary.com/celebrity-birth-charts/${c.slug}` })))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Celebrity Birth Charts', url: 'https://birthchartlibrary.com/celebrity-birth-charts' },
        { name: 'Rated Birth Times', url: URL },
      ])) }} />
      <RatedChartsContent celebs={celebs} />
    </>
  )
}
