import * as Sentry from '@sentry/nextjs'
import { scrubSentryEvent } from '@/lib/sentry-scrub'

Sentry.init({
  dsn: 'https://a41d4c8f580910087ebc6cb0a995abbb@o4511355989262336.ingest.us.sentry.io/4511355992211456',
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  beforeSend: scrubSentryEvent,
})
