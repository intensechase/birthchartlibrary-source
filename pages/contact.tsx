import Head from 'next/head'
import ContactForm from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Birth Chart Library</title>
        <meta name="description" content="Get in touch with Birth Chart Library — questions, bug reports, celebrity chart requests, and feedback welcome." />
      </Head>
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Contact Us</h1>
        <p className="text-slate-500 mb-8">
          Have a question, found a bug, or want to suggest a celebrity chart? We&apos;d love to hear from you.
        </p>
        <ContactForm />
        <p className="text-xs text-slate-400 mt-6 text-center">
          You can also reach us directly at{' '}
          <a href="mailto:librarian@birthchartlibrary.com" className="text-slate-600 hover:text-slate-800 transition-colors">
            librarian@birthchartlibrary.com
          </a>
        </p>
      </main>
    </>
  )
}
