import Head from 'next/head'
import type { GetStaticProps } from 'next'
import MethodContent from '@/components/MethodContent'
import { getChartCoverage, type ChartCoverage } from '@/lib/celebrities'

const TITLE = 'How We Check Our Charts | Birth Chart Library'
const DESCRIPTION = 'Where Birth Chart Library gets its birth data, how many charts have a rated birth time, how charts are calculated, how bios are written, and what has been corrected.'

export const getStaticProps: GetStaticProps<{ coverage: ChartCoverage }> = async () => ({
  props: { coverage: await getChartCoverage() },
  revalidate: 86400,
})

export default function MethodPage({ coverage }: { coverage: ChartCoverage }) {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" key="canonical" href="https://birthchartlibrary.com/method" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content="https://birthchartlibrary.com/method" />
        <meta property="og:type" content="article" />
      </Head>
      <MethodContent coverage={coverage} />
    </>
  )
}
