export const env = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  resendApiKey: process.env.RESEND_API_KEY!,
  adminEmail: process.env.ADMIN_EMAIL || 'librarian@birthchartlibrary.com',
  cronSecret: process.env.CRON_SECRET,
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://birthchartlibrary.com',
  s3AccessKey: process.env.S3_ACCESS_KEY || '',
  s3SecretKey: process.env.S3_SECRET_KEY || '',
  s3Bucket: process.env.S3_BUCKET || 'bcl-files',
  piiEncryptionKey: process.env.PII_ENCRYPTION_KEY,
}

if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
  const required: Array<keyof typeof env> = ['databaseUrl', 'resendApiKey', 'turnstileSecret', 'cronSecret', 'piiEncryptionKey']
  for (const key of required) {
    if (!env[key]) throw new Error(`Missing required env var: ${key}`)
  }
  if (env.jwtSecret === 'dev-secret-change-me') {
    throw new Error('JWT_SECRET must be set in production')
  }
}
