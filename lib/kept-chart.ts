import { safeLocalGet, safeSessionGet, safeSessionRemove, safeSessionSet } from '@/lib/safe-storage'
import type { MineFormValues } from '@/components/redesign/MineForm'
import type { MineChart } from '@/components/redesign/MinePage'
import type { ReadingTeaser } from '@/lib/reading/teaser'

// What a reader without an account has made (owner, 11/23). Their own chart: in
// this browser for 7 days from when it was made, then deleted. A chart for
// someone else and a comparison: until the tab closes. Nothing here goes to the
// server unless the reader saves it.
export interface HeldChart { form: MineFormValues; isForSelf: boolean; chart: MineChart; teaser: ReadingTeaser | null; until?: number }

export const KEPT_KEY = 'bcl_kept_chart'
export const KEPT_UNTIL_KEY = 'bcl_kept_until' // its own small key, so every page can check it cheaply
const TAB_KEY = 'bcl_tab_chart'
// Raise when the saved shape changes: an older copy is dropped, not shown broken.
const VERSION = 1
export const KEEP_MS = 7 * 24 * 60 * 60 * 1000

/** Deletes the kept chart when its time is up (or it has no valid time). */
export function purgeKept(now = Date.now()) {
  try {
    const raw = localStorage.getItem(KEPT_UNTIL_KEY)
    if (raw === null && localStorage.getItem(KEPT_KEY) === null) return
    const until = Number(raw)
    if (!(until > now && until <= now + KEEP_MS)) removeKept()
  } catch { /* storage blocked: nothing is kept */ }
}

/** Keeps the reader's own chart; null when the browser will not store it. */
export function keepOwn(h: HeldChart, now = Date.now()): number | null {
  const until = now + KEEP_MS
  try {
    localStorage.setItem(KEPT_UNTIL_KEY, String(until))
    localStorage.setItem(KEPT_KEY, JSON.stringify({ v: VERSION, ...h, until }))
    return until
  } catch {
    removeKept()
    return null
  }
}

export function readKept(now = Date.now()): HeldChart | null {
  purgeKept(now)
  return parse(safeLocalGet(KEPT_KEY), removeKept)
}

export function removeKept() {
  try { localStorage.removeItem(KEPT_KEY); localStorage.removeItem(KEPT_UNTIL_KEY) } catch { /* blocked */ }
}

export function holdInTab(h: HeldChart): boolean {
  safeSessionSet(TAB_KEY, JSON.stringify({ v: VERSION, ...h }))
  return safeSessionGet(TAB_KEY) !== null
}
export const readTab = (): HeldChart | null => parse(safeSessionGet(TAB_KEY), dropTab)
export function dropTab() { safeSessionRemove(TAB_KEY) }

function parse(raw: string | null, drop: () => void): HeldChart | null {
  if (!raw) return null
  try {
    const h = JSON.parse(raw) as HeldChart & { v?: number }
    if (h.v === VERSION && h.form?.birthDate && h.chart?.view?.cards && Array.isArray(h.chart.view.bigThree)) return h
  } catch { /* fall through */ }
  drop()
  return null
}

// The form as a save waits for sign up or sign in (read by /signup, /login and
// /birth-chart?save=1).
export const PENDING_KEY = 'bcl_pending_chart'
export type PendingChart = MineFormValues & { isForSelf: boolean }

/** The chart a new account should save: the one Save was pressed on, else the
 *  reader's own kept chart. */
export function waitingChart(): PendingChart | null {
  const raw = safeSessionGet(PENDING_KEY)
  if (raw) {
    try { return JSON.parse(raw) as PendingChart } catch { safeSessionRemove(PENDING_KEY) }
  }
  const kept = readKept()
  return kept ? { ...kept.form, isForSelf: true } : null
}

/** After the waiting chart is in the account, it is not left on the device. */
export function clearWaiting(saved: { isForSelf?: boolean }) {
  safeSessionRemove(PENDING_KEY)
  if (saved.isForSelf === false) dropTab()
  else removeKept()
}

// A comparison made in this tab, and one waiting to be saved after sign up.
export const TAB_COMPARE_KEY = 'bcl_tab_compare'
export const PENDING_COMPARE_KEY = 'synastry_pending'

/** Signing out: nothing made in this tab is left for the next person. */
export function clearTab() {
  for (const k of [PENDING_KEY, PENDING_COMPARE_KEY, TAB_COMPARE_KEY, 'bcl-f:match']) safeSessionRemove(k)
  dropTab()
}

// The header lights "My chart" only on the reader's own chart; a guest's is
// only known in the browser, so the chart page says so.
export const OWN_CHART_EVENT = 'bcl-own-chart'
export function sayOwnChart(on: boolean) { window.dispatchEvent(new CustomEvent(OWN_CHART_EVENT, { detail: on })) }

export const isSignedIn = () => typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('bcl_logged_in='))
