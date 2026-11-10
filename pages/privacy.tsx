import Head from 'next/head'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Birth Chart Library</title>
        <meta name="description" content="Privacy Policy for Birth Chart Library — how we collect, use, and protect your data." />
      </Head>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-10">Last updated: November 10, 2026</p>

        <div className="space-y-8 text-slate-500 leading-relaxed prose max-w-none">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Overview</h2>
            <p>Birth Chart Library (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the website birthchartlibrary.com. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data. By using our service, you agree to the practices described in this policy.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Information We Collect</h2>
            <h3 className="text-base font-semibold text-slate-700 mb-2">Account Information</h3>
            <p>When you create an account, we collect your email address and a hashed password. We do not store your password in plain text.</p>
            <h3 className="text-base font-semibold text-slate-700 mb-2 mt-4">Birth Chart Data</h3>
            <p>To generate your natal chart, you provide your birth date, birth time (optional), and birth city. We store this information in association with your account so you can access your chart on future visits and receive your personalized daily horoscope. You may delete this data at any time by deleting your account.</p>
            <h3 className="text-base font-semibold text-slate-700 mb-2 mt-4">Usage Data</h3>
            <p>We may collect standard server log data including IP addresses, browser type, pages visited, and timestamps. This data is used to maintain site security and improve performance.</p>
            <h3 className="text-base font-semibold text-slate-700 mb-2 mt-4">Analytics</h3>
            <p>We use Google Analytics to understand how visitors use the site, such as which pages are viewed and roughly where visitors come from. Google Analytics sets cookies and collects data such as your IP address, device and browser details, and the pages you visit. You can opt out with the{' '}<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Google Analytics opt-out browser add-on</a>.</p>
            <h3 className="text-base font-semibold text-slate-700 mb-2 mt-4">Error Reports</h3>
            <p>When a page or feature fails, an error report is sent to Sentry so we can fix it. Reports include technical details such as the page address, browser and the error itself. We configure Sentry not to send personal information, and we strip sensitive fields such as birth data before a report is sent.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To create and manage your account</li>
              <li>To generate and store your birth chart</li>
              <li>To calculate and deliver your personalized daily horoscope</li>
              <li>To respond to support requests sent through our contact form</li>
              <li>To maintain the security and integrity of the platform</li>
              <li>To serve relevant advertisements through Google AdSense</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Google AdSense & Advertising</h2>
            <p>We use Google AdSense to display advertisements on our site. Google AdSense uses cookies and similar tracking technologies to serve ads based on your prior visits to this and other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet.</p>
            <p className="mt-3">You may opt out of personalized advertising by visiting{' '}<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Google&apos;s Ads Settings</a>. You can also opt out via the{' '}<a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Network Advertising Initiative opt-out page</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services, each with their own privacy policies:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong className="text-slate-800">Hetzner</strong> — web hosting and object storage. <a href="https://www.hetzner.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Privacy Policy</a></li>
              <li><strong className="text-slate-800">Cloudflare</strong> — DNS, CDN, and bot protection (Turnstile). <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Privacy Policy</a></li>
              <li><strong className="text-slate-800">Resend</strong> — transactional email delivery. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Privacy Policy</a></li>
              <li><strong className="text-slate-800">Google AdSense</strong> — advertising. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Privacy Policy</a></li>
              <li><strong className="text-slate-800">Google Analytics</strong> — site usage statistics. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">How Google uses data from sites that use its services</a></li>
              <li><strong className="text-slate-800">Sentry</strong> — error reporting. <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Privacy Policy</a></li>
              <li><strong className="text-slate-800">Amazon Associates</strong> — affiliate links to books and tools. If you follow one, Amazon may set cookies to record the referral. <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800 transition-colors">Privacy Notice</a></li>
              <li><strong className="text-slate-800">Wikimedia Commons</strong> — source of celebrity photos. We store copies on our own servers, so viewing a photo doesn&apos;t send your data to Wikimedia.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Cookies</h2>
            <p>We use cookies to maintain your login session. Additionally, Google AdSense, Google Analytics and Cloudflare Turnstile use cookies for their respective purposes (advertising personalization, usage statistics and bot detection). You can control cookies through your browser settings, but disabling cookies may affect site functionality.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Data Retention & Deletion</h2>
            <p>We retain your account and birth chart data for as long as your account is active. You may request deletion of your account and all associated data by contacting us at{' '}<a href="mailto:librarian@birthchartlibrary.com" className="text-slate-600 hover:text-slate-800 transition-colors">librarian@birthchartlibrary.com</a>. We will process deletion requests within 30 days.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Children&apos;s Privacy</h2>
            <p>Birth Chart Library is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify registered users of significant changes by email. The &ldquo;last updated&rdquo; date at the top of this page reflects when the policy was last revised.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">10. Contact</h2>
            <p>If you have questions about this Privacy Policy, please contact us at{' '}<a href="mailto:librarian@birthchartlibrary.com" className="text-slate-600 hover:text-slate-800 transition-colors">librarian@birthchartlibrary.com</a>.</p>
          </section>
        </div>
      </main>
    </>
  )
}
