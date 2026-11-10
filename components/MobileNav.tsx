'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/lib/theme'

const SECTIONS = [
  {
    label: 'Horoscope',
    items: [
      { href: '/horoscope', label: 'Daily Horoscope' },
    ],
  },
  {
    label: 'Celebrities',
    items: [
      { href: '/celebrity-birth-charts', label: 'Celebrity Charts' },
      { href: '/celebrity-match', label: 'Celebrity Match' },
      { href: '/born-today', label: 'Born Today' },
      { href: '/love/celebrity-couples', label: 'Celebrity Couples' },
    ],
  },
  {
    label: 'Love',
    items: [
      { href: '/love', label: 'Love & Astrology' },
      { href: '/compatibility', label: 'Compatibility' },
      { href: '/love/celebrity-couples', label: 'Celebrity Couples' },
      { href: '/calculators/synastry', label: 'Synastry Calculator' },
    ],
  },
  {
    label: 'Learn',
    items: [
      { href: '/zodiac-signs', label: 'Zodiac Signs' },
      { href: '/astrology-planets', label: 'Planets' },
      { href: '/astrology-houses', label: 'Houses' },
      { href: '/astrology-aspects', label: 'Aspects' },
      { href: '/chinese-zodiac', label: 'Chinese Zodiac' },
      { href: '/astrology-interpretations', label: 'Interpretation Library' },
      { href: '/glossary', label: 'Glossary' },
    ],
  },
  {
    label: 'Tools & Read',
    items: [
      { href: '/calculators', label: 'Calculators' },
      { href: '/blog', label: 'Blog' },
      { href: '/reading-room', label: 'Reading Room' },
    ],
  },
]

export default function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  // The slide-out MUST be portaled to document.body. The header uses
  // `dark:backdrop-blur-md`, and backdrop-filter creates a new containing
  // block for `position: fixed` descendants (same as transform/filter).
  // If the slide-out renders inside the header it gets clipped to the
  // header's 68px height in dark mode.
  const slideOut = open && (
    <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-display text-lg tracking-wider text-slate-800 dark:text-slate-100">Menu</span>
              <button onClick={() => setOpen(false)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              {SECTIONS.map((section, i) => (
                <div key={section.label}>
                  {i > 0 && <div className="border-t border-slate-200 dark:border-slate-700 my-3" />}
                  <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{section.label}</p>
                  <div className="space-y-1">
                    {section.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          pathname === item.href
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {isLoggedIn && (
                <>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-3" />
                  <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">My Account</p>
                  <div className="space-y-1">
                    {[
                      { href: '/daily-horoscope', label: 'Daily Horoscope' },
                      { href: '/account', label: 'Account' },
                      { href: '/birth-chart', label: 'New Chart' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          pathname === item.href
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 my-3" />
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Sign Out
                    </button>
                  </form>
                </>
              )}

              {!isLoggedIn && (
                <>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-3" />
                  <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm bg-slate-800 dark:bg-slate-700 text-white text-center mt-2">
                    Sign Up
                  </Link>
                </>
              )}

              {/* Theme toggle */}
              <div className="border-t border-slate-200 dark:border-slate-700 my-3" />
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
            </nav>
          </div>
        </>
  )

  return (
    <div className="min-[1180px]:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
        aria-label="Menu"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {mounted && createPortal(slideOut, document.body)}
    </div>
  )
}
