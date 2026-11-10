'use client'

import { useState, useEffect, useRef } from 'react'

interface GeoOption {
  displayName: string
  shortName: string
  lat: number
  lng: number
}

interface Props {
  value: string
  onChange: (city: string, lat: number, lng: number) => void
}

export default function CityAutocomplete({ value, onChange }: Props) {
  const [query, setQuery] = useState(value)
  const [options, setOptions] = useState<GeoOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setOptions([]); return }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setSearchError(false)
      try {
        const params = new URLSearchParams({ q: query, format: 'json', limit: '5', addressdetails: '1' })
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          headers: { 'Accept-Language': 'en' },
        })
        if (!res.ok) throw new Error('Search unavailable')
        const results = await res.json()
        setOptions(results.map((r: { display_name: string; address: { city?: string; town?: string; village?: string; county?: string; state?: string; country?: string }; lat: string; lon: string }) => {
          const a = r.address
          const city = a.city ?? a.town ?? a.village ?? a.county ?? ''
          const region = [a.state, a.country].filter(Boolean).join(', ')
          return {
            displayName: r.display_name,
            shortName: [city, region].filter(Boolean).join(', '),
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
          }
        }))
        setOpen(true)
      } catch {
        setOptions([])
        setSearchError(true)
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [query])

  function select(opt: GeoOption) {
    setQuery(opt.shortName)
    setOpen(false)
    onChange(opt.shortName, opt.lat, opt.lng)
  }

  const listboxId = 'city-autocomplete-list'
  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        required
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        className="input"
        placeholder="e.g. Honolulu, New York, London"
        // Mobile keyboard hints: inputMode=search shows the magnifying-glass
        // "Search" return key on iOS instead of "Go". autoCapitalize=words
        // matches how people type city names. role=combobox + aria-* wires
        // the JS-rendered dropdown to screen readers as a real combobox.
        autoComplete="off"
        autoCapitalize="words"
        autoCorrect="off"
        inputMode="search"
        enterKeyHint="search"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={open && options.length > 0}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
          searching…
        </div>
      )}
      {searchError && !loading && (
        <p className="absolute z-50 w-full mt-1 px-4 py-2.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg shadow-xl">
          Location search unavailable. Try again or enter your city manually.
        </p>
      )}
      {open && options.length > 0 && (
        <ul id={listboxId} role="listbox" className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xl">
          {options.map((opt, i) => (
            <li key={i} role="option" aria-selected="false">
              <button
                type="button"
                onClick={() => select(opt)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 transition-colors border-b border-slate-200 last:border-0"
              >
                <span className="font-medium">{opt.shortName}</span>
                <span className="block text-xs text-slate-400 truncate mt-0.5">{opt.displayName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
