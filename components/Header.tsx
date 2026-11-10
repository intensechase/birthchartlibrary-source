'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import MobileNav from '@/components/MobileNav'
import SiteSearch from '@/components/SiteSearch'
import { useTheme } from '@/lib/theme'
import { safeSessionGet, safeSessionSet, safeSessionRemove } from '@/lib/safe-storage'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function NavDropdown({ label, items, className }: { label: string; items: { href: string; label: string }[]; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={`relative ${className || ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="font-bold text-slate-800 dark:text-slate-100 hover:text-[color:var(--accent)] transition-colors flex items-center gap-1"
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-50">
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [myChartId, setMyChartId] = useState<string | null>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const hasAuth = document.cookie.split(';').some(c => c.trim().startsWith('bcl_logged_in='))
    setIsLoggedIn(hasAuth)
    if (!hasAuth) return

    const cached = safeSessionGet('bcl_chart_id')
    if (cached) setMyChartId(cached)

    // The bcl_logged_in cookie is a client-visible flag, not proof the
    // session is still valid server-side (e.g. the JWT is unexpired but its
    // account was deleted outside the normal sign-out/delete flow). Always
    // reconcile with the server rather than trusting the cached chart id
    // forever — on a 401, correct the optimistic logged-in state instead of
    // leaving the nav pointing at a chart the visitor can no longer reach.
    fetch('/api/my-chart').then(r => {
      if (r.status === 401) {
        setIsLoggedIn(false)
        setMyChartId(null)
        safeSessionRemove('bcl_chart_id')
        document.cookie = 'bcl_logged_in=; path=/; max-age=0'
        return null
      }
      return r.ok ? r.json() : null
    }).then(d => {
      if (d?.id) { setMyChartId(d.id); safeSessionSet('bcl_chart_id', d.id) }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 px-4 py-3 bg-slate-50 dark:bg-slate-900" style={{ borderBottom: '3px solid var(--outline)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-0 sm:shrink-0 group" aria-label="Birth Chart Library home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={34} height={34} className="shrink-0 transition-transform group-hover:rotate-12" />
          <span className="font-display text-lg sm:text-2xl leading-tight text-slate-800 dark:text-slate-100">Birth Chart Library</span>
        </Link>

        {/* Center — Primary nav (desktop only) */}
        <nav className="hidden min-[1180px]:flex items-center gap-5 text-sm">
          <Link href={isLoggedIn ? '/daily-horoscope' : '/horoscope'} className="font-bold text-slate-800 dark:text-slate-100 hover:text-[color:var(--accent)] transition-colors">
            Horoscope
          </Link>

          <NavDropdown
            label="Celebrities"
            items={[
              { href: '/celebrity-birth-charts', label: 'Celebrity Charts' },
              { href: '/celebrity-match', label: 'Celebrity Match' },
              { href: '/born-today', label: 'Born Today' },
              { href: '/love/celebrity-couples', label: 'Celebrity Couples' },
            ]}
          />

          <NavDropdown
            label="Love"
            items={[
              { href: '/love', label: 'Love & Astrology' },
              { href: '/compatibility', label: 'Compatibility' },
              { href: '/love/celebrity-couples', label: 'Celebrity Couples' },
              { href: '/calculators/synastry', label: 'Synastry Calculator' },
            ]}
          />

          <NavDropdown
            label="Learn"
            items={[
              { href: '/zodiac-signs', label: 'Zodiac Signs' },
              { href: '/astrology-planets', label: 'Planets' },
              { href: '/astrology-houses', label: 'Houses' },
              { href: '/astrology-aspects', label: 'Aspects' },
              { href: '/chinese-zodiac', label: 'Chinese Zodiac' },
              { href: '/astrology-interpretations', label: 'Interpretation Library' },
              { href: '/glossary', label: 'Glossary' },
            ]}
          />

          <Link href="/calculators" className="font-bold text-slate-800 dark:text-slate-100 hover:text-[color:var(--accent)] transition-colors">
            Calculators
          </Link>

          <NavDropdown
            label="Read"
            items={[
              { href: '/blog', label: 'Blog' },
              { href: '/reading-room', label: 'Reading Room' },
            ]}
          />
        </nav>

        {/* Right — Search + Actions + Mobile menu */}
        <div className="flex items-center gap-0 sm:gap-2 shrink-0">
          <SiteSearch />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 hover:text-[color:var(--accent)] transition-colors rounded-lg"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <nav className="hidden min-[1180px]:flex items-center gap-3 text-sm">
            {isLoggedIn ? (
              <>
                <Link href="/birth-chart" className="btn-primary text-sm py-1.5">
                  New Chart
                </Link>
                {/* Account dropdown */}
                <div ref={accountRef} className="relative">
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 hover:text-[color:var(--accent)] transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-500">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                    </svg>
                    <span className="text-sm">Account</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {accountOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-50">
                      <Link href={myChartId ? `/birth-chart/${myChartId}` : '/account'} onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100">
                        My Chart
                      </Link>
                      <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100">
                        Settings
                      </Link>
                      <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                      <form action="/api/auth/signout" method="POST">
                        <button type="submit" className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          Sign Out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="font-bold text-slate-800 dark:text-slate-100 hover:text-[color:var(--accent)] transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-sm py-1.5">
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          <MobileNav isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  )
}
