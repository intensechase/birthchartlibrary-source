'use client'

import { useState } from 'react'

export default function ExportData() {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)

    const res = await fetch('/api/account/export')
    if (!res.ok) { setExporting(false); return }
    const charts = await res.json()

    const exportData = {
      exported_at: new Date().toISOString(),
      charts: charts ?? [],
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `birthchartlibrary-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    setExporting(false)
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="text-xs text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
    >
      {exporting ? 'Preparing download...' : 'Export my data'}
    </button>
  )
}
