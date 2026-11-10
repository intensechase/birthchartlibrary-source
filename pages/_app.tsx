import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { Bricolage_Grotesque } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import { ThemeProvider } from '@/lib/theme'
import '@/styles/globals.css'

const displayFont = Bricolage_Grotesque({ weight: '800', subsets: ['latin'], variable: '--font-display' })

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const canonicalPath = router.asPath.split('?')[0].split('#')[0]
  const canonicalUrl = `https://birthchartlibrary.com${canonicalPath === '/' ? '' : canonicalPath}`

  return (
    <ThemeProvider>
    <div className={`${displayFont.variable}`}>
      <Head>
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <link rel="icon" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFF6DF" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:site" content="@birthchartlib" key="twitter:site" />
        <meta property="og:site_name" content="Birth Chart Library" key="og:site_name" />
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-KR0XTRC1JJ" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-KR0XTRC1JJ');`}
      </Script>
      {!router.pathname.startsWith('/embed') && (
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-slate-800 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
      )}
      {!router.pathname.startsWith('/embed') && <Header />}
      <div className="flex-1" id="main-content">
        <Component {...pageProps} />
      </div>
      {!router.pathname.startsWith('/embed') && <Footer />}
      {!router.pathname.startsWith('/embed') && <CookieConsent />}
    </div>
    </ThemeProvider>
  )
}
