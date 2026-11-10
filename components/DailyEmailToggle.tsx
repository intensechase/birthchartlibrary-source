'use client'

import { useState } from 'react'

interface Props {
  initialEnabled: boolean
  initialCadenceDays: number
}

const CADENCE_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 1, label: 'Every day' },
  { value: 2, label: 'Every 2 days' },
  { value: 3, label: 'Every 3 days' },
  { value: 5, label: 'Every 5 days' },
  { value: 7, label: 'Once a week' },
  { value: 14, label: 'Every 2 weeks' },
  { value: 30, label: 'Once a month' },
]

export default function DailyEmailToggle({ initialEnabled, initialCadenceDays }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [cadenceDays, setCadenceDays] = useState(initialCadenceDays)
  const [saving, setSaving] = useState(false)

  async function save(nextEnabled: boolean, nextCadence: number) {
    setSaving(true)
    const res = await fetch('/api/account/daily-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: nextEnabled, cadenceDays: nextCadence }),
    })
    if (res.ok) {
      setEnabled(nextEnabled)
      setCadenceDays(nextCadence)
    }
    setSaving(false)
  }

  async function handleToggle() {
    if (saving) return
    await save(!enabled, cadenceDays)
  }

  async function handleCadenceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = Number(e.target.value)
    if (!Number.isInteger(next)) return
    await save(enabled, next)
  }

  const summary = !enabled
    ? 'Turn on to get your horoscope delivered to your inbox.'
    : cadenceDays === 1
      ? "You'll receive your personalized horoscope every morning."
      : `You'll receive your personalized horoscope ${CADENCE_OPTIONS.find(o => o.value === cadenceDays)?.label.toLowerCase() || `every ${cadenceDays} days`}.`

  return (
    <div className={`card transition-colors ${enabled ? 'border-green-200' : ''}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={saving}
        className="flex items-center gap-3 w-full text-left"
        aria-pressed={enabled}
      >
        <div className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${enabled ? 'bg-green-500' : 'bg-slate-300'}`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
        <div>
          <p className="text-sm font-medium">{enabled ? 'Horoscope email is on' : 'Horoscope email is off'}</p>
          <p className="text-xs text-slate-400">{summary}</p>
        </div>
      </button>

      {enabled && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <label htmlFor="cadence" className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
            How often
          </label>
          <select
            id="cadence"
            value={cadenceDays}
            onChange={handleCadenceChange}
            disabled={saving}
            className="input text-sm py-1.5"
          >
            {CADENCE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
