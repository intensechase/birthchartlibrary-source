'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || 'Contact from Birth Chart Library')
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:librarian@birthchartlibrary.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="card text-center py-10">
        <div className="text-4xl mb-4">✦</div>
        <p className="font-semibold text-lg mb-2">Message sent</p>
        <p className="text-slate-500 text-sm">We&apos;ll get back to you as soon as we can.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label className="block text-sm mb-1 text-slate-500">Your Name</label>
        <input name="name" required value={form.name} onChange={handleChange} className="input" placeholder="Jane Smith" />
      </div>
      <div>
        <label className="block text-sm mb-1 text-slate-500">Email Address</label>
        <input type="email" name="email" required autoComplete="email" autoCapitalize="none" autoCorrect="off" inputMode="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm mb-1 text-slate-500">Subject</label>
        <select name="subject" value={form.subject} onChange={handleChange} className="input">
          <option value="">Select a topic</option>
          <option value="General Question">General Question</option>
          <option value="Bug Report">Bug Report</option>
          <option value="Celebrity Chart Request">Celebrity Chart Request</option>
          <option value="Interpretation Feedback">Interpretation Feedback</option>
          <option value="Account Issue">Account Issue</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-slate-500">Message</label>
        <textarea
          name="message"
          required
          value={form.message}
          onChange={handleChange}
          className="input min-h-32 resize-y"
          placeholder="Tell us what&apos;s on your mind..."
        />
      </div>
      <button type="submit" className="btn-primary w-full">Send Message</button>
    </form>
  )
}
