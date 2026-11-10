'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { safeSessionGet, safeSessionSet } from '@/lib/safe-storage'

const BASE_NAV_ITEMS = [
  {
    label: 'Daily Horoscope',
    icon: '☽',
    href: '/daily-horoscope',
    children: [
      { label: 'Today', href: '/daily-horoscope' },
      { label: 'Yesterday', href: '/daily-horoscope?day=yesterday' },
      { label: 'Tomorrow', href: '/daily-horoscope?day=tomorrow' },
    ],
  },
  {
    label: 'My Chart',
    icon: '☉',
    href: '/account',
  },
  {
    label: 'Chart Library',
    icon: '📚',
    href: '/account#chart-library',
  },
  {
    label: 'New Chart',
    icon: '✦',
    href: '/birth-chart',
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [expandedItem, setExpandedItem] = useState<string | null>('Daily Horoscope')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const cached = safeSessionGet('bcl_is_admin')
    if (cached !== null) { setIsAdmin(cached === 'true'); return }
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      const val = d.is_admin === true
      setIsAdmin(val)
      safeSessionSet('bcl_is_admin', String(val))
    }).catch(() => {})
  }, [])

  const NAV_ITEMS = isAdmin
    ? [...BASE_NAV_ITEMS, { label: 'Admin', icon: '⚙', href: '/admin' }]
    : BASE_NAV_ITEMS

  function isActive(href: string) {
    if (href.includes('?')) {
      const [path, query] = href.split('?')
      const params = new URLSearchParams(query)
      if (pathname !== path) return false
      for (const [key, value] of params) {
        if (searchParams.get(key) !== value) return false
      }
      return true
    }
    // For /daily-horoscope, only match if no day param (i.e. "today")
    if (href === '/daily-horoscope' && pathname === '/daily-horoscope') {
      return !searchParams.get('day')
    }
    return pathname === href
  }

  function isParentActive(item: typeof BASE_NAV_ITEMS[0]) {
    if (pathname === item.href) return true
    if (item.children) return item.children.some(c => isActive(c.href))
    return false
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-slate-200 bg-white min-h-full shrink-0">
        <nav className="py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isParentActive(item)
                        ? 'bg-slate-100 text-slate-800'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className={`text-xs transition-transform ${expandedItem === item.label ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {expandedItem === item.label && (
                    <div className="ml-7 mt-1 space-y-0.5">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isActive(child.href)
                              ? 'text-slate-800 bg-slate-100'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isParentActive(item)
                      ? 'bg-slate-100 text-slate-800'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around py-2 px-1">
        <Link
          href="/daily-horoscope"
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            pathname === '/daily-horoscope' ? 'text-slate-800' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">☽</span>
          <span>Horoscope</span>
        </Link>
        <Link
          href="/account"
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            pathname === '/account' ? 'text-slate-800' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">☉</span>
          <span>My Chart</span>
        </Link>
        <Link
          href="/birth-chart"
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            pathname === '/birth-chart' ? 'text-slate-800' : 'text-slate-400'
          }`}
        >
          <span className="text-lg">✦</span>
          <span>New Chart</span>
        </Link>
      </nav>
    </>
  )
}
