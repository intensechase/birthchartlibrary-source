import Head from 'next/head'
import ContactForm from '@/components/ContactForm'
import { TextPage } from '@/components/redesign/Learn'

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Birth Chart Library</title>
        <meta name="description" content="Get in touch with Birth Chart Library — questions, bug reports, celebrity chart requests, and feedback welcome." />
      </Head>
      <TextPage title="Contact us" lead={<>Have a question, found a bug, or want to suggest a celebrity chart? We&apos;d love to hear from you.</>} narrow art={false}>
        <ContactForm />
        <p className="text-xs text-slate-400 mt-6 text-center">
          You can also reach us directly at{' '}
          <a href="mailto:librarian@birthchartlibrary.com" className="text-slate-600 hover:text-slate-800 transition-colors">
            librarian@birthchartlibrary.com
          </a>
        </p>
      </TextPage>
    </>
  )
}
