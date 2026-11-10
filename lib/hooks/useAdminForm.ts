import { useState } from 'react'
import { useRouter } from 'next/router'

interface SubmitOptions {
  url: string
  body: unknown
  redirectTo: string
  method?: 'POST' | 'PATCH'
}

interface DestroyOptions {
  url: string
  redirectTo: string
  message?: string
}

export function useAdminForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent, { url, body, redirectTo, method = 'PATCH' }: SubmitOptions) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) router.push(redirectTo)
      else setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function destroy({ url, redirectTo, message = 'Delete this item?' }: DestroyOptions) {
    if (!confirm(message)) return
    const res = await fetch(url, { method: 'DELETE' })
    if (res.ok) router.push(redirectTo)
    else setError('Failed to delete')
  }

  return { saving, error, submit, destroy }
}
