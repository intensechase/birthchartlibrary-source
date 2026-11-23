import { useEffect } from 'react'
import type { NextRouter } from 'next/router'

// Back and Forward return to where the reader was on the page. Next's pages
// router scrolls to the top after a Back unless experimental.scrollRestoration
// is on, and that switch turns off the browser's own memory, so a refresh would
// jump to the top instead. This keeps the browser's memory and adds ours: one
// position per history entry (Next stamps each entry with a key).
const STORE = 'bcl-place'
const MAX = 60
const READER_MOVES = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

type Places = Record<string, number>
const keyNow = (): string | null => {
  const k = window.history.state?.key
  return typeof k === 'string' ? k : null
}
function read(): Places {
  try { return JSON.parse(sessionStorage.getItem(STORE) ?? '{}') as Places } catch { return {} }
}
function write(p: Places) {
  try {
    const keys = Object.keys(p)
    for (const k of keys.slice(0, Math.max(0, keys.length - MAX))) delete p[k]
    sessionStorage.setItem(STORE, JSON.stringify(p))
  } catch { /* storage blocked: places last until a reload */ }
}

export function useKeepPlace(router: NextRouter) {
  const { events } = router
  useEffect(() => {
    const places = read()
    let here = keyNow()
    let popped: string | null = null
    let cancel = () => {}

    const save = () => {
      if (!here) return
      delete places[here] // newest last, so trimming drops the oldest
      places[here] = Math.round(window.scrollY)
      write(places)
    }
    const onPop = (e: PopStateEvent) => { popped = e.state?.__N && typeof e.state.key === 'string' ? e.state.key : null }

    // A list that loads its rows later is short at first, so keep trying for a
    // moment, and stop as soon as the reader scrolls for themselves.
    const restore = (y: number) => {
      cancel()
      const until = performance.now() + 2000
      let frame = 0
      const stop = () => {
        cancelAnimationFrame(frame)
        for (const t of READER_MOVES) window.removeEventListener(t, stop)
      }
      for (const t of READER_MOVES) window.addEventListener(t, stop, { passive: true })
      cancel = stop
      const go = () => {
        if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, left: 0, behavior: 'instant' })
        if (Math.abs(window.scrollY - y) <= 1 || performance.now() > until) return stop()
        frame = requestAnimationFrame(go)
      }
      go()
    }
    const onStart = () => { cancel(); save() }
    const onDone = () => {
      here = keyNow()
      const y = here && popped === here ? places[here] : undefined
      popped = null
      if (y != null) restore(y)
    }
    // A failed or cancelled route change leaves the reader where they were.
    const onError = () => { popped = null }

    window.addEventListener('popstate', onPop)
    window.addEventListener('pagehide', save)
    events.on('routeChangeStart', onStart)
    events.on('routeChangeComplete', onDone)
    events.on('routeChangeError', onError)
    return () => {
      cancel()
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('pagehide', save)
      events.off('routeChangeStart', onStart)
      events.off('routeChangeComplete', onDone)
      events.off('routeChangeError', onError)
    }
  }, [events])
}
