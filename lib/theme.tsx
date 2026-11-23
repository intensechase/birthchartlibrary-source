import { createContext, useContext, useEffect, useState } from 'react'
import { safeLocalGet, safeLocalSet } from '@/lib/safe-storage'
import { REDESIGN_ANY } from '@/lib/redesign'

type Theme = 'light' | 'dark'

// While a redesign stage is on, the site is dark only (owner, 11/19): no
// toggle, and the visitor's saved choice is left alone so a rollback restores it.
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void; canToggle: boolean }>({
  theme: REDESIGN_ANY ? 'dark' : 'light',
  toggleTheme: () => {},
  canToggle: !REDESIGN_ANY,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(REDESIGN_ANY ? 'dark' : 'light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (REDESIGN_ANY) return
    const stored = safeLocalGet('bcl_theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = stored ?? (prefersDark ? 'dark' : 'light')
    setTheme(resolved)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (REDESIGN_ANY || !mounted) return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    safeLocalSet('bcl_theme', theme)
  }, [theme, mounted])

  function toggleTheme() {
    if (REDESIGN_ANY) return
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, canToggle: !REDESIGN_ANY }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
