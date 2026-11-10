'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  chartId: string
  currentLabel: string
  isPrimary: boolean
}

export default function ChartActions({ chartId, currentLabel, isPrimary }: Props) {
  const [mode, setMode] = useState<'idle' | 'rename' | 'delete'>('idle')
  const [label, setLabel] = useState(currentLabel)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRename() {
    if (!label.trim() || label === currentLabel) { setMode('idle'); return }
    setLoading(true)
    await fetch(`/api/birth-chart/${chartId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: label.trim() }),
    })
    setLoading(false)
    setMode('idle')
    router.refresh()
  }

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/birth-chart/${chartId}`, { method: 'DELETE' })
    setLoading(false)
    setMode('idle')
    router.refresh()
  }

  if (mode === 'rename') {
    return (
      <div className="flex items-center gap-2 mt-2" onClick={e => e.preventDefault()}>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          className="input text-xs py-1 flex-1"
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setMode('idle') }}
        />
        <button onClick={handleRename} disabled={loading} className="text-xs text-slate-600 hover:text-slate-800">
          {loading ? '...' : 'Save'}
        </button>
        <button onClick={() => { setMode('idle'); setLabel(currentLabel) }} className="text-xs text-slate-400">
          Cancel
        </button>
      </div>
    )
  }

  if (mode === 'delete') {
    return (
      <div className="flex items-center gap-2 mt-2" onClick={e => e.preventDefault()}>
        <span className="text-xs text-red-500">Delete this chart?</span>
        <button onClick={handleDelete} disabled={loading} className="text-xs text-red-600 hover:text-red-700">
          {loading ? '...' : 'Yes'}
        </button>
        <button onClick={() => setMode('idle')} className="text-xs text-slate-400">No</button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 mt-2" onClick={e => e.preventDefault()}>
      <button onClick={() => setMode('rename')} className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
        Rename
      </button>
      {!isPrimary && (
        <button onClick={() => setMode('delete')} className="text-[10px] text-slate-400 hover:text-red-500 transition-colors">
          Delete
        </button>
      )}
    </div>
  )
}
