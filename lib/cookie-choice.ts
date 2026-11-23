import { safeLocalGet, safeLocalSet } from '@/lib/safe-storage'

// The reader's answer to the cookie notice. No answer yet counts as before
// (Analytics and ads load). Declined: Analytics does not load, its cookies are
// cleared, and ads are requested without personalization. The ad script itself
// stays in the page so AdSense can verify the site
// (support.google.com/adsense/answer/9042142).
export const GA_ID = 'G-KR0XTRC1JJ'
export const COOKIE_CHOICE_KEY = 'cookie-consent'
export const COOKIE_CHOICE_EVENT = 'bcl-cookie-choice'

export function cookiesDeclined(): boolean {
  return safeLocalGet(COOKIE_CHOICE_KEY) === 'declined'
}

// Runs in <head> before the ad script, so the first ad request already knows.
export const COOKIE_CHOICE_SCRIPT = `try{if(localStorage.getItem('${COOKIE_CHOICE_KEY}')==='declined'){window['ga-disable-${GA_ID}']=true;(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}}catch(e){}`

export function setCookieChoice(choice: 'accepted' | 'declined') {
  safeLocalSet(COOKIE_CHOICE_KEY, choice)
  const w = window as unknown as Record<string, unknown> & { adsbygoogle?: { requestNonPersonalizedAds?: number } }
  const no = choice === 'declined'
  w[`ga-disable-${GA_ID}`] = no
  const ads = (w.adsbygoogle = w.adsbygoogle ?? ([] as { requestNonPersonalizedAds?: number }))
  ads.requestNonPersonalizedAds = no ? 1 : 0
  if (no) clearAnalyticsCookies()
  window.dispatchEvent(new Event(COOKIE_CHOICE_EVENT))
}

function clearAnalyticsCookies() {
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (!/^_ga(_|$)/.test(name)) continue
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
  }
}
