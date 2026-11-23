import { useEffect, useState } from 'react'
import Script from 'next/script'
import { COOKIE_CHOICE_EVENT, GA_ID, cookiesDeclined } from '@/lib/cookie-choice'

// Google Analytics, unless the reader chose Decline in the cookie notice.
export default function Analytics() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const read = () => setOn(!cookiesDeclined())
    read()
    window.addEventListener(COOKIE_CHOICE_EVENT, read)
    return () => window.removeEventListener(COOKIE_CHOICE_EVENT, read)
  }, [])
  if (!on) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}
