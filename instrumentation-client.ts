import * as Sentry from '@sentry/nextjs'
import { scrubSentryEvent } from '@/lib/sentry-scrub'

Sentry.init({
  dsn: 'https://a41d4c8f580910087ebc6cb0a995abbb@o4511355989262336.ingest.us.sentry.io/4511355992211456',
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  ignoreErrors: [
    // Browser extension noise, not app code -- content scripts (ad
    // blockers, password managers, in-app browser injections) calling
    // the WebExtension messaging API against a tab that's already gone.
    'Invalid call to runtime.sendMessage()',
    // Turnstile's own script throws this when something outside our code
    // rewrites the DOM around the widget (automation tools, translators).
    // Seen from a Chrome 118 bot on /calculators/synastry, 2026-10-19.
    'Cloned widget is not an iframe',
  ],
  beforeSend: scrubSentryEvent,
})
