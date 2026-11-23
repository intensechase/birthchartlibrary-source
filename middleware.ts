import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'bcl_session'
const FLAG_COOKIE = 'bcl_logged_in'
// /birth-chart is intentionally NOT edge-gated — it's public so visitors
// can calculate a chart with no account (see pages/birth-chart/index.tsx).
// /birth-chart/[id] still enforces access at the data layer (its own
// getServerSideProps 404s on private charts you don't own), so removing
// the blanket edge gate here doesn't weaken that.
const PROTECTED_ROUTES = ['/daily-horoscope', '/account']
const AUTH_ROUTES = ['/login', '/signup']

// Edge-compatible HS256 JWT verification. Mirrors the shape produced by
// `jsonwebtoken` in lib/auth.ts (signed with env.JWT_SECRET).
async function verifyJwtEdge(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [headerB64, payloadB64, sigB64] = parts

  try {
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) return false

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBytes = Uint8Array.from(
      atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    )
    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    )
  } catch {
    return false
  }
}

function clearCookies(response: NextResponse): NextResponse {
  response.cookies.delete(COOKIE_NAME)
  response.cookies.delete(FLAG_COOKIE)
  return response
}

// Preview site (preview.birthchartlibrary.com, PREVIEW_MODE=1 at run time).
// It reads the live database, so it must never write to it: only the
// calculator and read routes below may take a POST, and account, sign in,
// admin, cron and unsubscribe routes are closed for every method. A new
// route is closed on the preview until it is added here. Every response
// also says noindex (Cloudflare Access already keeps crawlers out).
const PREVIEW_OPEN_POSTS = ['/api/calculate', '/api/synastry', '/api/celebrity-match', '/api/compatibility', '/api/embed/calculate']
const PREVIEW_CLOSED = ['/api/auth', '/api/account', '/api/admin', '/api/cron', '/api/guest-subscribe', '/api/guest-unsubscribe', '/api/celebrity-requests', '/api/synastry-save', '/api/user-charts', '/api/my-chart', '/api/birth-chart', '/login', '/signup', '/account', '/admin']

function previewGuard(request: NextRequest): NextResponse | null {
  const p = request.nextUrl.pathname
  const m = request.method
  const write = m !== 'GET' && m !== 'HEAD' && m !== 'OPTIONS'
  const closed = PREVIEW_CLOSED.some((r) => p === r || p.startsWith(r + '/'))
    || (write && !PREVIEW_OPEN_POSTS.includes(p))
  if (!closed) return null
  const res = p.startsWith('/api/')
    ? NextResponse.json({ error: 'This is the preview site. Forms and accounts are turned off here.' }, { status: 403 })
    : new NextResponse('This is the preview site. Accounts and forms are turned off here.', { status: 403 })
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export async function middleware(request: NextRequest) {
  if (process.env.PREVIEW_MODE === '1') {
    const blocked = previewGuard(request)
    if (blocked) return blocked
    const res = await siteMiddleware(request)
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }
  return siteMiddleware(request)
}

async function siteMiddleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname

  // Case-insensitive URL canonicalization: external links sometimes
  // arrive title-cased (e.g. /Zodiac-Signs/Leo) and used to hard-404.
  // Redirect to the lowercase canonical so backlink equity isn't lost.
  // Skip API routes, _next, and explicit case-sensitive paths.
  if (pathname !== pathname.toLowerCase() && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.toLowerCase()
    return NextResponse.redirect(url, 308)
  }

  const needsAuth = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    || AUTH_ROUTES.includes(pathname)

  if (!needsAuth) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  const secret = process.env.JWT_SECRET
  const validSession = !!token && !!secret && await verifyJwtEdge(token, secret)

  if (!validSession && !AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    const redirect = NextResponse.redirect(url)
    if (token) clearCookies(redirect) // tampered/expired — wipe stale state
    return redirect
  }

  if (validSession && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/birth-chart' // their chart, or the form when there is none
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
