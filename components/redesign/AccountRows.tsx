import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

// One saved person on the account page: open, compare, rename, delete.
export interface PersonRow { id: string; name: string; sub: string }

export default function PersonItem({ p }: { p: PersonRow }) {
  const router = useRouter()
  const [mode, setMode] = useState<'idle' | 'more' | 'rename' | 'delete'>('idle')
  const [name, setName] = useState(p.name)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const send = async (method: 'PATCH' | 'DELETE') => {
    setBusy(true); setError('')
    try {
      const res = await fetch(`/api/birth-chart/${p.id}`, {
        method,
        ...(method === 'PATCH' ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: name.trim() }) } : {}),
      })
      if (!res.ok) throw new Error()
      setMode('idle')
      await router.replace(router.asPath, undefined, { scroll: false }) // fresh list, same place
    } catch {
      setError('That did not work. Try again in a moment.')
    }
    setBusy(false)
  }
  const rename = () => {
    if (!name.trim() || name.trim() === p.name) { setName(p.name); setMode('idle'); return }
    send('PATCH')
  }

  return (
    <li>
      {mode === 'rename' ? (
        <form className="pacts" style={{ flex: '1 1 100%' }} onSubmit={e => { e.preventDefault(); rename() }}>
          <input aria-label={`New name for ${p.name}`} value={name} maxLength={200} autoFocus onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') { setName(p.name); setMode('idle') } }} />
          <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          <button type="button" onClick={() => { setName(p.name); setMode('idle') }}>Cancel</button>
        </form>
      ) : (
        <>
          <div><Link className="nm" href={`/birth-chart/${p.id}`}>{p.name}</Link><small>{p.sub}</small></div>
          {mode === 'delete' ? (
            <div className="pacts" role="group" aria-label={`Delete ${p.name}?`}>
              <span>Delete this chart?</span>
              <button type="button" disabled={busy} onClick={() => send('DELETE')}>{busy ? 'Deleting…' : 'Yes, delete'}</button>
              <button type="button" onClick={() => setMode('idle')}>No</button>
            </div>
          ) : (
            <div className="pacts">
              <Link href={`/birth-chart/${p.id}`} aria-label={`Open ${p.name}’s chart`}>Open</Link>
              <Link href={`/calculators/synastry?chart=${p.id}`} aria-label={`Compare with ${p.name}`}>Compare</Link>
              {mode === 'more' ? (
                <>
                  <Link href={`/birth-chart/${p.id}/edit`} aria-label={`Edit ${p.name}’s birth details`}>Edit birth details</Link>
                  <button type="button" aria-label={`Rename ${p.name}`} onClick={() => setMode('rename')}>Rename</button>
                  <button type="button" aria-label={`Delete ${p.name}`} onClick={() => setMode('delete')}>Delete</button>
                </>
              ) : null}
              <button type="button" className="dots" aria-expanded={mode === 'more'} aria-label={`More for ${p.name}`} onClick={() => setMode(mode === 'more' ? 'idle' : 'more')}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>
              </button>
            </div>
          )}
        </>
      )}
      {error ? <small role="alert">{error}</small> : null}
    </li>
  )
}
