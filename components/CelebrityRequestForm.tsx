'use client'

import { useState } from 'react'

export default function CelebrityRequestForm() {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const res = await fetch('/api/celebrity-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })

    if (!res.ok) {
      setError('Something went wrong... try again.')
    } else {
      setSubmitted(true)
    }
  }

  const box = 'rounded-2xl bg-[var(--band)] px-5 sm:px-7 py-6 text-slate-800 dark:text-slate-100'

  if (submitted) {
    return (
      <div className={box} role="status">
        <p>Thanks! We&apos;ll look into adding <strong>{name}</strong> to the library.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={box}>
      <label htmlFor="celeb-request" className="block font-black text-[19px] mb-1">Can&apos;t find who you&apos;re looking for?</label>
      <p className="mb-4">Request a celebrity and we&apos;ll add them.</p>
      <div className="flex flex-wrap gap-2.5 max-w-xl">
        <input
          id="celeb-request"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input flex-[1_1_220px] min-w-0"
          placeholder="Celebrity name"
          required
        />
        <button type="submit" className="btn-primary px-6 shrink-0">Request</button>
      </div>
      {error && <p className="text-red-700 dark:text-red-300 text-sm mt-2">{error}</p>}
    </form>
  )
}
