import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Birth Chart Library'
  const category = searchParams.get('category') || 'Blog'

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

        {/* Category badge */}
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <span style={{ fontSize: 16, color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '6px 16px', borderRadius: 999 }}>
            {category}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 52, fontWeight: 800, color: '#f8fafc', lineHeight: 1.15, maxWidth: 900 }}>
          {title}
        </div>

        {/* Bottom */}
        <div style={{ marginTop: 'auto', fontSize: 18, color: '#64748b' }}>
          birthchartlibrary.com/blog
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
