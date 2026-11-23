import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Turnstile } from '@marsidev/react-turnstile'
import { UNDER_AGE_MESSAGE, isUnderAge } from '@/lib/age'
import CityAutocomplete from '@/components/CityAutocomplete'

// The birth chart form (stage 'mine'): who it is for, date, time or "I don't
// know", place, then one button. A missing time is said out loud, not quietly
// replaced by noon.
export interface MineFormValues {
  label: string; subjectName: string; birthDate: string; birthTime: string
  birthCity: string; birthLat: number; birthLng: number
}

export default function MineForm({ title, sub, submitText, onSubmit, top, after, hasMain, keptOwn, note, edit }: {
  title: string
  sub: string
  submitText: string
  onSubmit: (form: MineFormValues, isForSelf: boolean, token: string) => Promise<string | null>
  top?: ReactNode     // above the title (breadcrumbs on the calculator pages)
  hasMain?: boolean   // signed in with a chart already: open on someone else
  keptOwn?: boolean   // no account, but a chart of their own kept on this device
  note?: ReactNode    // under the title
  edit?: { form: MineFormValues; forSomeone: boolean } // correcting a saved chart: who it is for is settled, and no captcha (signed in)
  after?: ReactNode   // below the form (what the tool is for, where to go next)
}) {
  const editing = !!edit
  const [self, setSelf] = useState(edit ? !edit.forSomeone : !hasMain)
  // "Add someone's chart" links here with ?for=someone, so the form opens on
  // the right choice instead of making the reader switch it.
  const { query } = useRouter()
  useEffect(() => { if (query.for === 'someone' && !editing) setSelf(false) }, [query.for, editing])
  const [f, setF] = useState<MineFormValues>(edit?.form ?? { label: '', subjectName: '', birthDate: '', birthTime: '', birthCity: '', birthLat: 0, birthLng: 0 })
  const [noTime, setNoTime] = useState(!!edit && !edit.form.birthTime)
  const [token, setToken] = useState<string | null>(edit ? '' : null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof MineFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: e.target.value }))

  const go = async (e: FormEvent) => {
    e.preventDefault()
    if (token === null) return
    if (self && isUnderAge(f.birthDate)) { setError(UNDER_AGE_MESSAGE); return }
    if (!f.birthLat || !f.birthLng) { setError('Pick the birth place from the list so the sky can be placed.'); return }
    setBusy(true); setError(null)
    const err = await onSubmit({ ...f, birthTime: noTime ? '' : f.birthTime }, self, token)
    if (err) setError(err)
    setBusy(false)
  }
  const ready = token !== null && !!f.birthDate && !!f.birthLat && (self || !!f.subjectName.trim()) && (noTime || !!f.birthTime)

  return (
    <div className="wrap mine">
      {top}
      <h1>{title}</h1>
      <p className="sub">{sub}</p>
      {note}
      <form className="mform" onSubmit={go}>
        {edit ? null : <div className="seg" role="radiogroup" aria-label="Who is this chart for?">
          <button type="button" role="radio" aria-checked={self} onClick={() => setSelf(true)}>For me</button>
          <button type="button" role="radio" aria-checked={!self} onClick={() => setSelf(false)}>For someone else</button>
        </div>}

        {self && hasMain ? <p className="hint">You already have a chart. This one is kept with your other charts.</p> : null}
        {self && keptOwn ? <p className="hint">You already have a chart on this device. A new one replaces it.</p> : null}
        {!self && !edit ? (
          <label className="field">
            <span>Their name</span>
            <input value={f.subjectName} onChange={set('subjectName')} placeholder="Sarah, Mom, a new crush" required autoComplete="off" />
          </label>
        ) : null}

        <div className="two">
          <label className="field">
            <span>Birth date</span>
            <input type="date" value={f.birthDate} onChange={set('birthDate')} required />
          </label>
          <label className="field">
            <span>Birth time</span>
            <input type="time" value={noTime ? '' : f.birthTime} onChange={set('birthTime')} disabled={noTime} required={!noTime} />
          </label>
        </div>
        <label className="check">
          <input type="checkbox" checked={noTime} onChange={e => setNoTime(e.target.checked)} />
          <span>I don’t know the birth time</span>
        </label>
        <p className="hint">
          {noTime
            ? 'Fine. You still get every planet by sign. The rising sign and houses need a time, so they are left out rather than guessed.'
            : 'Local time where the birth happened. A birth certificate is the best source.'}
        </p>

        <div className="field">
          <span>Birth place</span>
          <CityAutocomplete value={f.birthCity} onChange={(city, lat, lng) => setF(p => ({ ...p, birthCity: city, birthLat: lat, birthLng: lng }))} />
        </div>

        {edit ? null : <div className="ts"><Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setToken} options={{ theme: 'dark' }} /></div>}

        {error ? <p className="err" role="alert">{error}</p> : null}

        <button type="submit" className="btn wide" disabled={busy || !ready}>{busy ? 'Working out the sky…' : submitText}</button>
        {edit ? null : <p className="hint center">Private by default. Nothing is shared unless you choose to share it.</p>}
      </form>
      {after}
    </div>
  )
}
