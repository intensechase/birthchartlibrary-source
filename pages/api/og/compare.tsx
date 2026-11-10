import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

const ELEMENT_COLORS: Record<string, string> = {
  Aries: '#ef4444', Taurus: '#22c55e', Gemini: '#f59e0b', Cancer: '#3b82f6',
  Leo: '#ef4444', Virgo: '#22c55e', Libra: '#f59e0b', Scorpio: '#3b82f6',
  Sagittarius: '#ef4444', Capricorn: '#22c55e', Aquarius: '#f59e0b', Pisces: '#3b82f6',
}

function PersonCard({ name, sun, moon, rising, score }: { name: string; sun: string; moon: string; rising: string; score?: number }) {
  const sunColor = ELEMENT_COLORS[sun] || '#94a3b8'
  const sunSymbol = SIGN_SYMBOLS[sun] || ''
  const moonSymbol = SIGN_SYMBOLS[moon] || ''
  const risingSymbol = SIGN_SYMBOLS[rising] || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>{name}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {sun && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '8px 14px' }}>
            <span style={{ fontSize: 20 }}>{sunSymbol}</span>
            <span style={{ fontSize: 16, color: sunColor, fontWeight: 700 }}>{sun}</span>
          </div>
        )}
        {moon && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '8px 14px' }}>
            <span style={{ fontSize: 20 }}>{moonSymbol}</span>
            <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 700 }}>{moon}</span>
          </div>
        )}
        {rising && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '8px 14px' }}>
            <span style={{ fontSize: 20 }}>{risingSymbol}</span>
            <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 700 }}>{rising} ↑</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const nameA = searchParams.get('nameA') || 'Person A'
  const sunA = searchParams.get('sunA') || ''
  const moonA = searchParams.get('moonA') || ''
  const risingA = searchParams.get('risingA') || ''
  const nameB = searchParams.get('nameB') || 'Person B'
  const sunB = searchParams.get('sunB') || ''
  const moonB = searchParams.get('moonB') || ''
  const risingB = searchParams.get('risingB') || ''
  const scoreLabel = searchParams.get('score') || ''
  const scoreNum = parseInt(searchParams.get('pct') || '0', 10)

  const scoreColor = scoreNum >= 70 ? '#10b981' : scoreNum >= 45 ? '#f59e0b' : '#ef4444'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '50px 70px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <span style={{ color: '#64748b', fontSize: 18, letterSpacing: '0.05em' }}>Birth Chart Library — Compatibility</span>
        </div>

        {/* Two people */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flex: 1 }}>
          <PersonCard name={nameA} sun={sunA} moon={moonA} rising={risingA} />

          {/* VS divider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 8, gap: 8 }}>
            <span style={{ fontSize: 28, color: '#475569', fontWeight: 700 }}>&</span>
          </div>

          <PersonCard name={nameB} sun={sunB} moon={moonB} rising={risingB} />
        </div>

        {/* Score bar */}
        {scoreLabel && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, color: '#94a3b8' }}>Compatibility</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor }}>{scoreLabel} · {scoreNum}%</span>
            </div>
            <div style={{ display: 'flex', width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
              <div style={{ width: `${scoreNum}%`, height: 8, background: scoreColor, borderRadius: 4 }} />
            </div>
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
