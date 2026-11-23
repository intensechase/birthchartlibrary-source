import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Bricolage_Grotesque, Figtree, Outfit } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import CookieConsent from '@/components/CookieConsent'
import { useKeepPlace } from '@/lib/use-keep-place'
import { ThemeProvider } from '@/lib/theme'
import { REDESIGN_ANY } from '@/lib/redesign'
import '@/styles/globals.css'
import '@/styles/redesign.css'
import SiteHeader from '@/components/redesign/SiteHeader'
import SiteFooter from '@/components/redesign/SiteFooter'

// Variable font with the optical size axis: one file covers every weight, and large
// headings get tighter, more characterful shapes while small ones stay readable.
// At weight 800 the live headings look the same as before.
const displayFont = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', axes: ['opsz'] })
// Reading text on redesigned pages (owner chose Figtree, 11/20).
const bodyFont = Figtree({ subsets: ['latin'], variable: '--font-body', preload: false })
// Headings on redesigned pages (owner chose Outfit, 11/20). Not preloaded so the
// live build is unchanged; at switch over (all pages at once) drop Bricolage and
// preload these two.
const headingFont = Outfit({ subsets: ['latin'], variable: '--font-heading', preload: false })

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useKeepPlace(router)
  const canonicalPath = router.asPath.split('?')[0].split('#')[0]
  const canonicalUrl = `https://birthchartlibrary.com${canonicalPath === '/' ? '' : canonicalPath}`

  return (
    <ThemeProvider>
    <div className={`fontroot ${displayFont.variable} ${bodyFont.variable} ${headingFont.variable}`}>
      <Head>
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        {/* Redesign brand (public/brand, scripts/build-brand.ts) once a stage is on. */}
        {REDESIGN_ANY ? (
          <>
            <link rel="icon" href="/brand/favicon.ico" sizes="any" />
            <link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
            {/* Google's search result icon wants a multiple of 48px; the .ico is 16/32 only. */}
            <link rel="icon" href="/brand/icon-192.png" type="image/png" sizes="192x192" />
            <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
            <link rel="manifest" href="/brand/manifest.json" />
          </>
        ) : (
          <>
            <link rel="icon" href="/icon.svg" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/manifest.json" />
          </>
        )}
        <meta name="theme-color" content={REDESIGN_ANY ? '#0F1328' : '#FFF6DF'} />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:site" content="@birthchartlib" key="twitter:site" />
        <meta property="og:site_name" content="Birth Chart Library" key="og:site_name" />
      </Head>
      <Analytics />
      {!router.pathname.startsWith('/embed') && (
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-slate-800 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
      )}
      {!router.pathname.startsWith('/embed') && (REDESIGN_ANY ? <SiteHeader ownChart={pageProps?.own === true} /> : <Header />)}
      <div className="flex-1" id="main-content">
        <Component {...pageProps} />
      </div>
      {!router.pathname.startsWith('/embed') && (REDESIGN_ANY ? <SiteFooter /> : <Footer />)}
      {!router.pathname.startsWith('/embed') && <CookieConsent />}
    </div>
    </ThemeProvider>
  )
}
