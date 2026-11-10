'use client'

import { useState, useEffect, useRef } from 'react'
import { PLANET_KEYS, PLANET_LABELS, SIGN_LIST } from '@/lib/constants'

interface InterpData {
  combined: string
  planetInSign: string
  planetInHouse: string
}

export default function InterpretationLookup() {
  const [planet, setPlanet] = useState('')
  const [sign, setSign] = useState('')
  const [house, setHouse] = useState('')
  const [data, setData] = useState<InterpData | null>(null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const hasFullSelection = planet && sign && house

  useEffect(() => {
    if (!hasFullSelection) {
      setData(null)
      return
    }
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    fetch(`/api/interpretation?planet=${planet}&sign=${sign}&house=${house}`, { signal: ctrl.signal })
      .then(r => r.json())
      .then((d: InterpData) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [planet, sign, house])

  const hasSelection = planet || sign || house

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Planet</label>
          <select value={planet} onChange={e => setPlanet(e.target.value)} className="input text-sm">
            <option value="">Select...</option>
            {PLANET_KEYS.map(p => (
              <option key={p} value={p}>{PLANET_LABELS[p]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Sign</label>
          <select value={sign} onChange={e => setSign(e.target.value)} className="input text-sm">
            <option value="">Select...</option>
            {SIGN_LIST.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">House</label>
          <select value={house} onChange={e => setHouse(e.target.value)} className="input text-sm">
            <option value="">Select...</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>House {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {!hasSelection && (
        <p className="text-slate-400 text-sm text-center py-8">
          Select a planet, sign, and house to explore any placement.
        </p>
      )}

      {hasFullSelection && loading && (
        <div className="card mb-4 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/6" />
          </div>
        </div>
      )}

      {hasFullSelection && !loading && data?.combined && (
        <div className="card mb-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            {PLANET_LABELS[planet]} in {sign} in House {house}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{data.combined}</p>
        </div>
      )}

      {hasFullSelection && !loading && data && !data.combined && (
        <div className="card mb-4">
          <p className="text-slate-400 text-sm">No combined interpretation found for this placement.</p>
        </div>
      )}

      {hasFullSelection && !loading && (data?.planetInSign || data?.planetInHouse) && (
        <details className="mt-2">
          <summary className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer">
            Learn more
          </summary>
          <div className="mt-3 space-y-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
            {data.planetInSign && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">{PLANET_LABELS[planet]} in {sign}</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">{data.planetInSign}</p>
              </div>
            )}
            {data.planetInHouse && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">{PLANET_LABELS[planet]} in House {house}</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">{data.planetInHouse}</p>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  )
}
