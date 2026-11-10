import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="preload" href="/fonts/zen-kaku-gothic-new-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Without initial-scale=1, mobile Safari occasionally lays the
            page out at 980px and shrinks, then won't re-fit after rotation.
            Next.js default is just width=device-width — override here. */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Pinterest domain verification meta tag — inert, kept for when
            the channel resumes. The Pinterest tracking script that used to
            sit below this line was a second, independent copy of the tag
            already removed from _app.tsx — the "moved from _document.tsx"
            comment there was aspirational; this file kept its own copy the
            whole time, which is why it kept shipping after the first fix. */}
        <meta name="p:domain_verify" content="1cf83f790a224968cb7cf7271e152b6e" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3785592967844957"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="font-body flex flex-col min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
