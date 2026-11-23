import { useEffect, useRef, useState } from 'react'
import { safeSessionGet, safeSessionSet } from '@/lib/safe-storage'

// A filter that is still set when the reader comes back to the page, until the
// tab closes (no new URLs; owner, 11/23). The first render always uses the start
// value, so the server HTML matches. `ok` turns away stale or odd values.
export function useTabState<T>(key: string, start: T, ok: (v: unknown) => boolean): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(start)
  const okRef = useRef(ok)
  useEffect(() => {
    const raw = safeSessionGet(`bcl-f:${key}`)
    if (raw === null) return
    try { const v: unknown = JSON.parse(raw); if (okRef.current(v)) setValue(v as T) } catch { /* ignore */ }
  }, [key])
  const set = (v: T) => { setValue(v); safeSessionSet(`bcl-f:${key}`, JSON.stringify(v)) }
  return [value, set]
}
