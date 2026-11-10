'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  slug: string
}

export default function BlogCTA({ slug }: Props) {
  const [state, setState] = useState<'loading' | 'guest' | 'no-chart' | 'has-chart'>('loading')

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/account/status')
        if (!res.ok) { setState('guest'); return }
        const data = await res.json()
        if (!data.loggedIn) setState('guest')
        else if (data.hasChart) setState('has-chart')
        else setState('no-chart')
      } catch {
        setState('guest')
      }
    }
    check()
  }, [])

  if (state === 'loading') return null

  if (state === 'has-chart') {
    return (
      <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="font-display text-xl tracking-wide mb-2">See how this applies to you</p>
        <p className="text-slate-500 text-sm mb-4">Check your personalized daily horoscope based on your unique birth chart.</p>
        <Link href="/daily-horoscope" className="btn-primary">View Your Horoscope</Link>
      </div>
    )
  }

  if (state === 'no-chart') {
    return (
      <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="font-display text-xl tracking-wide mb-2">Ready to see your chart?</p>
        <p className="text-slate-500 text-sm mb-4">Generate your free birth chart to unlock personalized daily horoscopes.</p>
        <Link href="/birth-chart" className="btn-primary">Create Your Birth Chart</Link>
      </div>
    )
  }

  // Guest
  return (
    <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
      <p className="font-display text-xl tracking-wide mb-2">Ready to see your chart?</p>
      <p className="text-slate-500 text-sm mb-4">Generate your free birth chart and discover what the planets reveal about you.</p>
      <Link href={`/signup?ref=blog-${slug}`} className="btn-primary">Create Your Free Chart</Link>
    </div>
  )
}
