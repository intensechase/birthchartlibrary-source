import { createContext, useContext, type ReactNode, type MouseEvent } from 'react'

// Cards open from anywhere on the page. Each card has its own link (?card=moon,
// build list), so the links work as plain links too; with JavaScript they open
// the card in place and add one step to history, so the phone's Back closes it.
export interface CardApi { open: (key: string) => void; swap: (key: string) => void; has: (key: string) => boolean }
export const CardContext = createContext<CardApi>({ open: () => {}, swap: () => {}, has: () => false })
export const useCards = () => useContext(CardContext)

interface Props { card: string; swap?: boolean; className?: string; label?: string; current?: boolean; children: ReactNode }

export function CardLink({ card, swap, className, label, current, children }: Props) {
  const api = useCards()
  if (!api.has(card)) return <span className={className}>{children}</span>
  const go = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (current) return
    if (swap) api.swap(card)
    else api.open(card)
  }
  return (
    <a href={`?card=${card}`} rel="nofollow" className={className} aria-label={label} aria-current={current ? 'true' : undefined} onClick={go}>
      {children}
    </a>
  )
}
