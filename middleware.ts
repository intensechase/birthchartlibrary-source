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

export async function middleware(request: NextRequest) {
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
    url.pathname = '/daily-horoscope'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
