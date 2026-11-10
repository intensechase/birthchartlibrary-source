import { ImageResponse } from 'next/og'

export const config = { runtime: 'edge' }

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Chart circle icon */}
        <svg width="100" height="100" viewBox="0 0 512 512" style={{ marginBottom: 30 }}>
          <circle cx="256" cy="256" r="140" stroke="#94a3b8" strokeWidth="20" fill="none" />
          <circle cx="256" cy="256" r="48" fill="#94a3b8" />
        </svg>

        <div style={{ fontSize: 56, fontWeight: 800, color: '#f8fafc', marginBottom: 12, letterSpacing: '0.05em' }}>
          Birth Chart Library
        </div>

        <div style={{ fontSize: 24, color: '#94a3b8', maxWidth: 700, textAlign: 'center', lineHeight: 1.4 }}>
          Free birth chart calculator with full natal chart interpretations
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
