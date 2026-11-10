import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { serialize, parse } from 'cookie'
import { queryOne } from './db'
import { env } from './env'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { GetServerSidePropsContext } from 'next'

const JWT_SECRET = env.jwtSecret
const COOKIE_NAME = 'bcl_session'
const TOKEN_EXPIRY = '7d'

export interface AuthUser {
  id: string
  email: string
  is_admin: boolean
}

// Generates a secure random token with optional SHA-256 hash for DB storage.
// Use `token` in URLs; store `tokenHash` in DB when the field is hashed at rest.
export function generateToken(expiryMs: number): { token: string; tokenHash: string; expires: Date } {
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expires = new Date(Date.now() + expiryMs)
  return { token, tokenHash, expires }
}

// Password validation
export function validatePassword(password: string): string | null {
  if (!password || password.length < 8) return 'Password must be at least 8 characters'
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain letters'
  if (!/[0-9]/.test(password)) return 'Password must contain numbers'
  return null
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// JWT tokens
export function createToken(user: { id: string; email: string }): string {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; email: string }
  } catch {
    return null
  }
}

// Cookie management
export function setAuthCookie(res: NextApiResponse, token: string) {
  const sessionCookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  // Non-HttpOnly flag so client JS can detect login state
  const flagCookie = serialize('bcl_logged_in', '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  const existing = res.getHeader('Set-Cookie') || []
  const current = Array.isArray(existing) ? existing : typeof existing === 'string' ? [existing] : []
  res.setHeader('Set-Cookie', [...current, sessionCookie, flagCookie])
}

// Structural type (not NextApiResponse) so this also works from
// getServerSideProps, whose `context.res` is a plain http.ServerResponse —
// needed to clear a JWT that's edge-valid but points at a deleted profile
// (see middleware.ts's edge-only check vs this module's DB-backed getUser).
interface CookieCapableResponse {
  getHeader(name: string): number | string | string[] | undefined
  setHeader(name: string, value: string | string[]): void
}

export function clearAuthCookie(res: CookieCapableResponse) {
  const sessionCookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  const flagCookie = serialize('bcl_logged_in', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  const existing = res.getHeader('Set-Cookie') || []
  const current = Array.isArray(existing) ? existing : typeof existing === 'string' ? [existing] : []
  res.setHeader('Set-Cookie', [...current, sessionCookie, flagCookie])
}

function getTokenFromRequest(req: { cookies: Record<string, string | undefined> }): string | null {
  return req.cookies[COOKIE_NAME] || null
}

// Get current user from request (for API routes and getServerSideProps)
export async function getUser(context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse }): Promise<AuthUser | null> {
  const token = getTokenFromRequest(context.req)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const profile = await queryOne<{ id: string; email: string; is_admin: boolean }>(
    'SELECT id, email, is_admin FROM profiles WHERE id = $1',
    [payload.sub]
  )

  return profile || null
}

// Get user from raw cookie header string (for middleware)
export function getUserFromCookie(cookieHeader: string | undefined): { sub: string; email: string } | null {
  if (!cookieHeader) return null
  const cookies = parse(cookieHeader)
  const token = cookies[COOKIE_NAME]
  if (!token) return null
  return verifyToken(token)
}

export { COOKIE_NAME }
