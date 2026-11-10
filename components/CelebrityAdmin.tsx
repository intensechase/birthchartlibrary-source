'use client'

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import CityAutocomplete from '@/components/CityAutocomplete'

const CATEGORIES = ['Musician', 'Actor', 'Athlete', 'Politician', 'Business', 'Entertainer', 'Writer', 'Scientist', 'Artist']

export default function CelebrityAdmin() {
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthLat: 0,
    birthLng: 0,
    category: 'Musician',
    bio: '',
  })
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCitySelect(city: string, lat: number, lng: number) {
    setForm(prev => ({ ...prev, birthCity: city, birthLat: lat, birthLng: lng }))
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.birthDate || !form.birthLat || !turnstileToken) {
      setError('Name, birth date, birth city, and verification are required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Calculate chart via our API
      const calcRes = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: form.birthDate,
          birthTime: form.birthTime || null,
          birthCity: form.birthCity,
          birthLat: form.birthLat,
          birthLng: form.birthLng,
          turnstileToken,
        }),
      })
      const calcData = await calcRes.json()
      if (!calcRes.ok) { setError(calcData.error || 'Calculation failed'); setSaving(false); return }

      // Insert into celebrities table
      const slug = generateSlug(form.name)

      const insertRes = await fetch('/api/admin/celebrities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug,
          birth_date: form.birthDate,
          birth_time: form.birthTime || null,
          birth_city: form.birthCity,
          birth_lat: form.birthLat,
          birth_lng: form.birthLng,
          timezone: calcData.timezone || 'UTC',
          chart_data: calcData.chart,
          category: form.category,
          bio: form.bio || null,
        }),
      })
      const insertData = await insertRes.json()

      if (!insertRes.ok) { setError(insertData.error || 'Failed to save'); setSaving(false); return }

      setSuccess(`${form.name} added! View at /celebrity-birth-charts/${slug}`)
      setForm({ name: '', birthDate: '', birthTime: '', birthCity: '', birthLat: 0, birthLng: 0, category: 'Musician', bio: '' })
      setTurnstileToken(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setSaving(false)
  }

  return (
    <div>
      <h2 className="font-semibold mb-4">Add Celebrity</h2>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-slate-500">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Full Name" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-500">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth Date *</label>
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth Time</label>
            <input type="time" name="birthTime" value={form.birthTime} onChange={handleChange} className="input" />
            {!form.birthTime && <p className="text-xs text-slate-400 mt-1">Defaults to noon if unknown</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-500">Birth City *</label>
          <CityAutocomplete value={form.birthCity} onChange={handleCitySelect} />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-500">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="input min-h-16 resize-y" placeholder="One sentence about who they are" />
        </div>

        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setTurnstileToken} />

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}

        <button type="submit" disabled={saving || !turnstileToken || !form.birthLat} className="btn-primary">
          {saving ? 'Adding...' : 'Add Celebrity'}
        </button>
      </form>
    </div>
  )
}
