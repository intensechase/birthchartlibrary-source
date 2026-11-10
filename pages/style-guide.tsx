import Head from 'next/head'
import Link from 'next/link'

const ZODIAC_ELEMENT_COLORS = [
  { sign: 'Aries', symbol: '\u2648', element: 'Fire', color: '#CC3333' },
  { sign: 'Taurus', symbol: '\u2649', element: 'Earth', color: '#3D8B40' },
  { sign: 'Gemini', symbol: '\u264A', element: 'Air', color: '#2094C4' },
  { sign: 'Cancer', symbol: '\u264B', element: 'Water', color: '#5E80A8' },
  { sign: 'Leo', symbol: '\u264C', element: 'Fire', color: '#CC3333' },
  { sign: 'Virgo', symbol: '\u264D', element: 'Earth', color: '#3D8B40' },
  { sign: 'Libra', symbol: '\u264E', element: 'Air', color: '#2094C4' },
  { sign: 'Scorpio', symbol: '\u264F', element: 'Water', color: '#5E80A8' },
  { sign: 'Sagittarius', symbol: '\u2650', element: 'Fire', color: '#CC3333' },
  { sign: 'Capricorn', symbol: '\u2651', element: 'Earth', color: '#3D8B40' },
  { sign: 'Aquarius', symbol: '\u2652', element: 'Air', color: '#2094C4' },
  { sign: 'Pisces', symbol: '\u2653', element: 'Water', color: '#5E80A8' },
]

export default function StyleGuidePage() {
  return (
    <>
      <Head>
        <title>Style Guide | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display text-5xl tracking-wide mb-2">Style Guide</h1>
        <p className="text-slate-500 mb-12">Visual reference for Birth Chart Library design elements.</p>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Typography</h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Display — Bebas Neue</p>
              <p className="font-display text-6xl tracking-wide text-slate-800">Birth Chart Library</p>
              <p className="font-display text-4xl tracking-wide text-slate-800 mt-2">Your cosmic blueprint... explained in plain English.</p>
              <p className="font-display text-2xl tracking-wide text-slate-800 mt-2">Daily Horoscope · Interpretation Library · Celebrity Charts</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Body — Source Sans 3</p>
              <p className="text-xl text-slate-800">Large body text for hero descriptions and summaries.</p>
              <p className="text-base text-slate-700 mt-2">Regular body text for paragraphs, descriptions, and interpretation content. This is the workhorse font used across all reading content on the site.</p>
              <p className="text-sm text-slate-500 mt-2">Small text for secondary information, metadata, dates, and supporting details.</p>
              <p className="text-xs text-slate-400 mt-2">Extra small for labels, timestamps, and fine print.</p>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Colors</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Slate Palette</p>
          <div className="flex gap-2 mb-8">
            {[
              { name: '50', hex: '#F8F9FC' }, { name: '100', hex: '#F1F3F8' }, { name: '200', hex: '#E2E8F0' },
              { name: '300', hex: '#CBD5E0' }, { name: '400', hex: '#A0AEC0' }, { name: '500', hex: '#718096' },
              { name: '600', hex: '#4A5568' }, { name: '700', hex: '#2D3748' }, { name: '800', hex: '#1A202C' },
              { name: '900', hex: '#171923' },
            ].map(c => (
              <div key={c.name} className="flex-1 text-center">
                <div className="h-16 rounded-lg mb-2 border border-slate-200" style={{ background: c.hex }} />
                <p className="text-xs text-slate-500">{c.name}</p>
                <p className="text-[10px] text-slate-400">{c.hex}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Element Colors</p>
          <div className="flex gap-4 mb-8">
            {[
              { name: 'Fire', hex: '#CC3333', signs: 'Aries, Leo, Sagittarius' },
              { name: 'Earth', hex: '#3D8B40', signs: 'Taurus, Virgo, Capricorn' },
              { name: 'Air', hex: '#2094C4', signs: 'Gemini, Libra, Aquarius' },
              { name: 'Water', hex: '#5E80A8', signs: 'Cancer, Scorpio, Pisces' },
            ].map(e => (
              <div key={e.name} className="flex-1">
                <div className="h-20 rounded-lg mb-2" style={{ background: e.hex }} />
                <p className="text-sm font-semibold text-slate-700">{e.name}</p>
                <p className="text-xs text-slate-400">{e.signs}</p>
                <p className="text-[10px] text-slate-400">{e.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Zodiac Signs */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Zodiac Signs</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {ZODIAC_ELEMENT_COLORS.map(z => (
              <div key={z.sign} className="card text-center py-4 px-2">
                <span className="text-3xl block mb-1" style={{ color: z.color }}>{z.symbol}</span>
                <p className="text-sm font-semibold text-slate-700">{z.sign}</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: z.color }}>{z.element}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-outline">Outline Button</button>
            <button className="btn-primary" disabled>Disabled</button>
            <button className="btn-primary text-lg px-8 py-3">Large Primary</button>
            <button className="btn-outline text-lg px-8 py-3">Large Outline</button>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Inputs</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-500">Text Input</label>
              <input className="input" placeholder="e.g. Honolulu, New York, London" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-500">Date Input</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-500">Select</label>
              <select className="input">
                <option>Select an option</option>
                <option>Sun</option>
                <option>Moon</option>
                <option>Mercury</option>
              </select>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Cards</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card">
              <p className="font-semibold text-slate-800 mb-1">Default Card</p>
              <p className="text-slate-500 text-sm">White background, slate-200 border, rounded-xl, p-6.</p>
            </div>
            <div className="card hover:border-slate-400 transition-colors cursor-pointer">
              <p className="font-semibold text-slate-800 mb-1">Interactive Card</p>
              <p className="text-slate-500 text-sm">Hover to see the border darken. Used for clickable items.</p>
            </div>
          </div>
        </section>

        {/* Planet Cards */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Planet Cards (with element colors)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { glyph: '\u2609', planet: 'Sun', sign: 'Aries', house: 'H1', color: '#CC3333' },
              { glyph: '\u263D', planet: 'Moon', sign: 'Cancer', house: 'H4', color: '#5E80A8' },
              { glyph: '\u263F', planet: 'Mercury', sign: 'Gemini', house: 'H3', color: '#2094C4' },
              { glyph: '\u2640', planet: 'Venus', sign: 'Taurus', house: 'H2', color: '#3D8B40' },
              { glyph: '\u2642', planet: 'Mars', sign: 'Scorpio', house: 'H8', color: '#5E80A8' },
              { glyph: '\u2643', planet: 'Jupiter', sign: 'Sagittarius', house: 'H9', color: '#CC3333' },
              { glyph: '\u2644', planet: 'Saturn', sign: 'Capricorn', house: 'H10', color: '#3D8B40' },
              { glyph: '\u2645', planet: 'Uranus', sign: 'Aquarius', house: 'H11', color: '#2094C4' },
            ].map(p => (
              <div key={p.planet} className="card text-center py-4">
                <span className="text-2xl block mb-1" style={{ color: p.color }}>{p.glyph}</span>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{p.planet}</p>
                <p className="font-semibold text-sm mt-1" style={{ color: p.color }}>{p.sign}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.house}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Labels & Badges */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Labels &amp; Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Default Badge</span>
            <span className="text-xs px-3 py-1 rounded-full text-white" style={{ background: '#CC3333' }}>Fire</span>
            <span className="text-xs px-3 py-1 rounded-full text-white" style={{ background: '#3D8B40' }}>Earth</span>
            <span className="text-xs px-3 py-1 rounded-full text-white" style={{ background: '#2094C4' }}>Air</span>
            <span className="text-xs px-3 py-1 rounded-full text-white" style={{ background: '#5E80A8' }}>Water</span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-white">Primary</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Category</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-slate-200 text-slate-500">Musician</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-slate-200 text-slate-500">Actor</span>
          </div>
        </section>

        {/* Section Dividers */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Section Dividers</h2>
          <div className="space-y-6">
            <div className="border-t border-slate-200 pt-4">
              <p className="text-slate-500 text-sm">Standard section divider — <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">border-t border-slate-200</code></p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Section Label</p>
              <p className="text-slate-500 text-sm">Used above sections for context — uppercase, tracked, slate-400.</p>
            </div>
          </div>
        </section>

        {/* Text Hierarchy */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Text Hierarchy</h2>
          <div className="space-y-3">
            <p className="text-slate-800 font-semibold">slate-800 font-semibold — Primary headings and names</p>
            <p className="text-slate-700">slate-700 — Body text, descriptions</p>
            <p className="text-slate-500">slate-500 — Secondary text, subtitles</p>
            <p className="text-slate-400">slate-400 — Muted text, labels, timestamps</p>
          </div>
        </section>

        {/* Brand Voice */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Brand Voice</h2>
          <div className="space-y-4">
            <div className="card">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Self-Discovery (default)</p>
              <p className="text-slate-700 leading-relaxed text-sm">This placement invites you to explore identity through action... bold, self-directed energy that asks you to lead with courage rather than wait for permission.</p>
            </div>
            <div className="card">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Daily Reflection</p>
              <p className="text-slate-700 leading-relaxed text-sm italic">&ldquo;What would you do today if you weren&apos;t afraid of being too much?&rdquo;</p>
            </div>
            <div className="card">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Sarcastic (C.H. Hendricks)</p>
              <p className="text-slate-700 leading-relaxed text-sm">Oh good... another month where you charge headfirst into something without reading the instructions.</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500"><strong>Rules:</strong> Use ellipses (...) not em dashes. &ldquo;Invites you to&rdquo; not &ldquo;you ARE.&rdquo; Straightforward, educational, slightly uplifting. Every description should feel like a self-discovery tool, not a verdict.</p>
          </div>
        </section>

        {/* Element Colors on Cards */}
        <section className="mb-16">
          <h2 className="font-display text-3xl tracking-wide mb-6 pb-2 border-b border-slate-200">Element Colors on Cards</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="card border-l-4 border-[#FF3800]/25">
              <p className="text-[#FF3800] font-semibold text-sm">{'\u2648'} Aries — Fire</p>
              <p className="text-slate-500 text-xs">border-l-4 + element border color</p>
            </div>
            <div className="card border-l-4 border-[#228B22]/25">
              <p className="text-[#228B22] font-semibold text-sm">{'\u2649'} Taurus — Earth</p>
              <p className="text-slate-500 text-xs">border-l-4 + element border color</p>
            </div>
            <div className="card border-l-4 border-[#00BFFF]/25">
              <p className="text-[#00BFFF] font-semibold text-sm">{'\u264A'} Gemini — Air</p>
              <p className="text-slate-500 text-xs">border-l-4 + element border color</p>
            </div>
            <div className="card border-l-4 border-[#1F75FE]/25">
              <p className="text-[#1F75FE] font-semibold text-sm">{'\u264B'} Cancer — Water</p>
              <p className="text-slate-500 text-xs">border-l-4 + element border color</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
