import Head from 'next/head'

export default function TermsOfServicePage() {
  return (
    <>
      <Head>
        <title>Terms of Service | Birth Chart Library</title>
        <meta name="description" content="Terms of Service for Birth Chart Library." />
      </Head>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-10">Last updated: November 10, 2026</p>

        <div className="space-y-8 text-slate-500 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Birth Chart Library (&ldquo;the Service&rdquo;) at birthchartlibrary.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Description of Service</h2>
            <p>Birth Chart Library provides free natal chart calculations, astrology interpretations, personalized daily horoscopes, and a library of celebrity birth charts. You can calculate and view a chart without an account. Saving charts and the personalized daily horoscope require a free account.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account credentials. You agree to provide accurate information when creating your account and to notify us promptly of any unauthorized use. We reserve the right to terminate accounts that violate these terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Use automated tools to scrape, crawl, or abuse the Service</li>
              <li>Attempt to circumvent rate limits or access controls</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Impersonate any person or entity</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Usage Limits</h2>
            <p>To keep the Service available for everyone, we limit how often charts can be calculated and saved in a given hour. If you reach a limit, wait a while and try again. We may adjust these limits at any time.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Astrology Disclaimer</h2>
            <p>Birth chart interpretations and daily horoscopes provided by Birth Chart Library are intended for entertainment and personal reflection purposes only. They do not constitute professional advice of any kind — medical, psychological, financial, or legal. We make no representations or warranties regarding the accuracy or applicability of astrological interpretations.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Intellectual Property</h2>
            <p>The source code for Birth Chart Library is open source under the AGPL-3.0 license and is <a href="https://github.com/intensechase/birthchartlibrary-source" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 underline transition-colors">published on GitHub</a>. The interpretation text, written content, and site design are the property of Birth Chart Library and may not be reproduced without permission, including where that text appears in the source code. Astrological calculation data is derived from the Swiss Ephemeris, used under its open source license. Celebrity photos belong to their authors and are used under the licenses listed on our <a href="/photo-credits" className="text-slate-600 hover:text-slate-800 underline transition-colors">photo credits page</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Advertising</h2>
            <p>The Service may display advertisements through Google AdSense. We are not responsible for the content of third-party advertisements. Ad content is governed by Google&apos;s advertising policies. Some links to Amazon are affiliate links: as an Amazon Associate, Birth Chart Library earns from qualifying purchases.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Limitation of Liability</h2>
            <p>Birth Chart Library is provided &ldquo;as is&rdquo; without warranty of any kind. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes are posted constitutes acceptance of the revised terms. We will notify registered users of material changes by email.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">11. Contact</h2>
            <p>Questions about these terms may be directed to{' '}<a href="mailto:librarian@birthchartlibrary.com" className="text-slate-600 hover:text-slate-800 transition-colors">librarian@birthchartlibrary.com</a>.</p>
          </section>
        </div>
      </main>
    </>
  )
}
