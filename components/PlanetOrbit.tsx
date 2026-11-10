export default function PlanetOrbit({ className = '' }: { className?: string }) {
  return (
    <div className={`select-none pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 420 420" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="bcl-sun-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7cc" />
            <stop offset="40%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <radialGradient id="bcl-sun-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <filter id="bcl-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="bcl-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="bcl-planet-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes bcl-mercury { from { transform: rotate(30deg);  } to { transform: rotate(390deg); } }
          @keyframes bcl-venus   { from { transform: rotate(110deg); } to { transform: rotate(470deg); } }
          @keyframes bcl-earth   { from { transform: rotate(200deg); } to { transform: rotate(560deg); } }
          @keyframes bcl-moon    { from { transform: rotate(0deg);   } to { transform: rotate(360deg); } }
          @keyframes bcl-mars    { from { transform: rotate(280deg); } to { transform: rotate(640deg); } }
        `}</style>

        {/* Star field — dark mode only */}
        <g className="hidden dark:block">
          {([
            [30, 55, 1.2, 0.55], [380, 40, 1.0, 0.45], [60, 370, 1.4, 0.62],
            [390, 360, 1.0, 0.48], [15, 200, 1.1, 0.50], [400, 210, 1.3, 0.60],
            [120, 20, 1.0, 0.43], [300, 15, 1.2, 0.57], [200, 395, 1.0, 0.46],
            [340, 390, 1.3, 0.61], [75, 140, 0.9, 0.42], [355, 140, 1.0, 0.50],
            [145, 390, 1.1, 0.53], [25, 310, 1.2, 0.58], [400, 300, 0.9, 0.44],
          ] as [number, number, number, number][]).map(([x, y, r, opacity], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={opacity} />
          ))}
        </g>

        {/* Orbit rings */}
        <circle cx="210" cy="210" r="65"  fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx="210" cy="210" r="100" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx="210" cy="210" r="138" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx="210" cy="210" r="178" fill="none" stroke="rgba(148,163,184,0.10)" strokeWidth="1" strokeDasharray="4 3" />

        {/* Sun halo + core */}
        <circle cx="210" cy="210" r="42" fill="url(#bcl-sun-halo)" filter="url(#bcl-soft-glow)" />
        <circle cx="210" cy="210" r="22" fill="url(#bcl-sun-core)" filter="url(#bcl-glow)" />

        {/* Mercury — r=65, silver-gray, 8s */}
        <g transform="translate(210,210)">
          <g style={{ transformOrigin: '0 0', animation: 'bcl-mercury 8s linear infinite' }}>
            <circle cx="65" cy="0" r="5" fill="#a8b0bc" filter="url(#bcl-planet-glow)" />
          </g>
        </g>

        {/* Venus — r=100, pale cream, 14s */}
        <g transform="translate(210,210)">
          <g style={{ transformOrigin: '0 0', animation: 'bcl-venus 14s linear infinite' }}>
            <circle cx="100" cy="0" r="7" fill="#e8d5a0" filter="url(#bcl-planet-glow)" />
          </g>
        </g>

        {/* Earth + Moon — Earth r=138, blue, 22s. Moon orbits Earth at r=16, 4s */}
        <g transform="translate(210,210)">
          <g style={{ transformOrigin: '0 0', animation: 'bcl-earth 22s linear infinite' }}>
            {/* Earth */}
            <circle cx="138" cy="0" r="8" fill="#4a90d9" filter="url(#bcl-planet-glow)" />
            {/* Moon orbit (subtle ring around Earth) */}
            <circle cx="138" cy="0" r="16" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="0.75" strokeDasharray="2 2" />
            {/* Moon — orbits Earth */}
            <g transform="translate(138,0)">
              <g style={{ transformOrigin: '0 0', animation: 'bcl-moon 4s linear infinite' }}>
                <circle cx="16" cy="0" r="3.5" fill="#c8ccd4" filter="url(#bcl-planet-glow)" />
              </g>
            </g>
          </g>
        </g>

        {/* Mars — r=178, red-orange, 34s */}
        <g transform="translate(210,210)">
          <g style={{ transformOrigin: '0 0', animation: 'bcl-mars 34s linear infinite' }}>
            <circle cx="178" cy="0" r="6.5" fill="#c1440e" filter="url(#bcl-planet-glow)" />
          </g>
        </g>
      </svg>
    </div>
  )
}
