import Head from 'next/head'
import { useState } from 'react'

const LIGHT_CODE = `<iframe
  src="https://birthchartlibrary.com/embed/birth-chart"
  width="100%"
  height="480"
  frameborder="0"
  style="border:none;border-radius:12px;max-width:480px;"
  title="Free Birth Chart Calculator"
></iframe>`

const DARK_CODE = `<iframe
  src="https://birthchartlibrary.com/embed/birth-chart?theme=dark"
  width="100%"
  height="480"
  frameborder="0"
  style="border:none;border-radius:12px;max-width:480px;"
  title="Free Birth Chart Calculator"
></iframe>`

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative">
      <pre className="bg-slate-900 text-slate-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">{code}</pre>
      <button onClick={copy} className="absolute top-3 right-3 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-lg transition-colors">
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default function EmbedIndex() {
  return (
    <>
      <Head>
        <title>Embed a Free Birth Chart Calculator — Birth Chart Library</title>
        <meta name="description" content="Add a free birth chart calculator to your website or blog. Paste one line of HTML — no signup required." />
      </Head>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">For publishers & bloggers</p>
          <h1 className="font-display text-4xl tracking-wide dark:text-slate-100 mb-3">Embed a Free Birth Chart Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Add a fully functional birth chart calculator to any website or blog — free, no signup required.
            Paste one line of HTML and you&apos;re done. Visitors get their Sun, Moon, and Rising sign instantly.
          </p>
        </div>

        {/* What it does */}
        <div className="card mb-8">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">What it does</h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-amber-500 shrink-0">✦</span>Calculates Sun, Moon, and Rising sign from birth date, time, and city</li>
            <li className="flex gap-2"><span className="text-amber-500 shrink-0">✦</span>Shows a one-line interpretation for each placement</li>
            <li className="flex gap-2"><span className="text-amber-500 shrink-0">✦</span>Links visitors to a full free chart at Birth Chart Library</li>
            <li className="flex gap-2"><span className="text-amber-500 shrink-0">✦</span>Works on any site — WordPress, Squarespace, Wix, custom HTML</li>
            <li className="flex gap-2"><span className="text-amber-500 shrink-0">✦</span>No signup, no API key, no cost</li>
          </ul>
        </div>

        {/* Light theme */}
        <div className="mb-8">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Light theme</h2>
          <p className="text-xs text-slate-400 mb-4">For white or light-background sites</p>
          <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700" style={{ height: 480 }}>
            <iframe
              src="/embed/birth-chart"
              width="100%"
              height="480"
              frameBorder="0"
              title="Birth Chart Widget Preview — Light"
            />
          </div>
          <CopyBlock code={LIGHT_CODE} />
        </div>

        {/* Dark theme */}
        <div className="mb-12">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Dark theme</h2>
          <p className="text-xs text-slate-400 mb-4">For dark-background sites</p>
          <div className="mb-4 rounded-xl overflow-hidden border border-slate-700" style={{ height: 480 }}>
            <iframe
              src="/embed/birth-chart?theme=dark"
              width="100%"
              height="480"
              frameBorder="0"
              title="Birth Chart Widget Preview — Dark"
            />
          </div>
          <CopyBlock code={DARK_CODE} />
        </div>

        <div className="card text-sm text-slate-500 dark:text-slate-400">
          <p>Questions? <a href="mailto:chase@birthchartlibrary.com" className="underline hover:text-slate-700 dark:hover:text-slate-200">chase@birthchartlibrary.com</a></p>
        </div>
      </main>
    </>
  )
}
