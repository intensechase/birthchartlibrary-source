import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

const ELEMENT_BG: Record<string, string> = {
  Aries: 'rgba(239,68,68,0.15)', Taurus: 'rgba(34,197,94,0.15)', Gemini: 'rgba(245,158,11,0.15)', Cancer: 'rgba(59,130,246,0.15)',
  Leo: 'rgba(239,68,68,0.15)', Virgo: 'rgba(34,197,94,0.15)', Libra: 'rgba(245,158,11,0.15)', Scorpio: 'rgba(59,130,246,0.15)',
  Sagittarius: 'rgba(239,68,68,0.15)', Capricorn: 'rgba(34,197,94,0.15)', Aquarius: 'rgba(245,158,11,0.15)', Pisces: 'rgba(59,130,246,0.15)',
}

const ELEMENT_ACCENT: Record<string, string> = {
  Aries: '#f87171', Taurus: '#4ade80', Gemini: '#fbbf24', Cancer: '#60a5fa',
  Leo: '#f87171', Virgo: '#4ade80', Libra: '#fbbf24', Scorpio: '#60a5fa',
  Sagittarius: '#f87171', Capricorn: '#4ade80', Aquarius: '#fbbf24', Pisces: '#60a5fa',
}

function PlanetChip({ label, sign, accent, bg }: { label: string; sign: string; accent: string; bg: string }) {
  const sym = SIGN_SYMBOLS[sign] || ''
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: bg, borderRadius: 14, padding: '14px 20px', gap: 4, minWidth: 110 }}>
      <span style={{ fontSize: 13, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 26, lineHeight: 1 }}>{sym}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: accent }}>{sign}</span>
    </div>
  )
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name      = searchParams.get('name')    || 'Birth Chart'
  const sun       = searchParams.get('sun')     || ''
  const moon      = searchParams.get('moon')    || ''
  const rising    = searchParams.get('rising')  || ''
  const mercury   = searchParams.get('mercury') || ''
  const venus     = searchParams.get('venus')   || ''
  const mars      = searchParams.get('mars')    || ''
  const date      = searchParams.get('date')    || ''
  const city      = searchParams.get('city')    || ''
  const square    = searchParams.get('sq')      === '1'

  const accent = ELEMENT_ACCENT[sun] || '#94a3b8'
  const bg     = ELEMENT_BG[sun]     || 'rgba(148,163,184,0.12)'
  const subtitle = [date, city].filter(Boolean).join(' · ')
  const w = square ? 1080 : 1200
  const h = square ? 1080 : 630

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(160deg, #0a0f1e 0%, #0f172a 55%, #1a1f35 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: square ? '70px 80px' : '52px 80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow from sun element color */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 500, height: 500, borderRadius: '50%',
          background: accent, opacity: 0.06, filter: 'blur(80px)',
        }} />

        {/* BCL branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: square ? 48 : 32 }}>
          <svg width="28" height="28" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="140" stroke="#475569" strokeWidth="22" fill="none" />
            <circle cx="256" cy="256" r="48" fill="#475569" />
          </svg>
          <span style={{ color: '#475569', fontSize: 18, letterSpacing: '0.06em' }}>birthchartlibrary.com</span>
        </div>

        {/* Name */}
        <div style={{
          fontSize: square ? 68 : 58,
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.1,
          marginBottom: subtitle ? 8 : 20,
          maxWidth: 900,
        }}>
          {name}
        </div>

        {subtitle && (
          <div style={{ fontSize: 18, color: '#64748b', marginBottom: square ? 44 : 32 }}>
            {subtitle}
          </div>
        )}

        {/* Big Three */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          {sun    && <PlanetChip label="Sun"    sign={sun}    accent={accent} bg={bg} />}
          {moon   && <PlanetChip label="Moon"   sign={moon}   accent="#94a3b8" bg="rgba(148,163,184,0.1)" />}
          {rising && <PlanetChip label="Rising" sign={rising} accent="#94a3b8" bg="rgba(148,163,184,0.1)" />}
        </div>

        {/* Personal planets row */}
        {(mercury || venus || mars) && (
          <div style={{ display: 'flex', gap: 12 }}>
            {mercury && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 14px' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>☿</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>Mercury</span>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{mercury}</span>
              </div>
            )}
            {venus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 14px' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>♀</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>Venus</span>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{venus}</span>
              </div>
            )}
            {mars && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 14px' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>♂</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>Mars</span>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{mars}</span>
              </div>
            )}
          </div>
        )}

        {/* Tagline */}
        <div style={{
          marginTop: 'auto',
          fontSize: 16,
          color: '#334155',
          fontStyle: 'italic',
          letterSpacing: '0.02em',
        }}>
          Every chart tells a story.
        </div>
      </div>
    ),
    { width: w, height: h }
  )
}
