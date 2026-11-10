import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

// Zodiac glyphs (♈♉♊...) were previously rendered here but they sit in
// Unicode's Miscellaneous Symbols block, which Inter doesn't cover. next/og
// would fall back to its emoji loader and fetch glyph renderings from a
// Google CDN at request time, which failed intermittently from Helsinki
// (Sentry: ETIMEDOUT on 34.160.x.x, ENETUNREACH on 2600:1901::). Removed
// the symbols since the sign name + accent color carry the visual signal.
const ELEMENT_COLORS: Record<string, string> = {
  Aries: '#ef4444', Taurus: '#22c55e', Gemini: '#f59e0b', Cancer: '#3b82f6',
  Leo: '#ef4444', Virgo: '#22c55e', Libra: '#f59e0b', Scorpio: '#3b82f6',
  Sagittarius: '#ef4444', Capricorn: '#22c55e', Aquarius: '#f59e0b', Pisces: '#3b82f6',
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name') || 'Unknown'
  const sun = searchParams.get('sun') || ''
  const moon = searchParams.get('moon') || ''
  const rising = searchParams.get('rising') || ''
  const category = searchParams.get('category') || ''

  const accentColor = ELEMENT_COLORS[sun] || '#94a3b8'

  // The previous version tried to load Inter via fetch() from this origin,
  // which broke when self-hosted on Helsinki: the Edge container can't
  // TLS-handshake back through Cloudflare to its own public URL — Sentry
  // logged `tls_validate_record_header: wrong version number`. Every social
  // share of a celebrity page was rendering a broken image card.
  //
  // Matches the pattern in the other working OG endpoints (/api/og,
  // /topic, /chart, /blog, /compare) which use system-ui. Acceptable
  // trade-off — social-share preview doesn't need brand-perfect typography.

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <svg width="32" height="32" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="140" stroke="#64748b" strokeWidth="20" fill="none" />
            <circle cx="256" cy="256" r="48" fill="#64748b" />
          </svg>
          <span style={{ color: '#64748b', fontSize: 20, letterSpacing: '0.05em' }}>Birth Chart Library</span>
        </div>

        {/* Name */}
        <div style={{ fontSize: 64, fontWeight: 800, color: '#f8fafc', marginBottom: 8, lineHeight: 1.1 }}>
          {name}
        </div>

        {category && (
          <div style={{ fontSize: 22, color: '#94a3b8', marginBottom: 30 }}>
            {category}
          </div>
        )}

        {/* Big Three */}
        <div style={{ display: 'flex', gap: 24, marginTop: 'auto' }}>
          {sun && (
            <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '12px 24px' }}>
              <span style={{ fontSize: 14, color: '#64748b' }}>Sun</span>
              <span style={{ fontSize: 22, color: accentColor, fontWeight: 700 }}>{sun}</span>
            </div>
          )}
          {moon && (
            <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '12px 24px' }}>
              <span style={{ fontSize: 14, color: '#64748b' }}>Moon</span>
              <span style={{ fontSize: 22, color: '#94a3b8', fontWeight: 700 }}>{moon}</span>
            </div>
          )}
          {rising && (
            <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '12px 24px' }}>
              <span style={{ fontSize: 14, color: '#64748b' }}>Rising</span>
              <span style={{ fontSize: 22, color: '#94a3b8', fontWeight: 700 }}>{rising}</span>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
