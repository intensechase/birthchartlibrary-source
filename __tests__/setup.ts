// Prevent env validation from throwing in tests
// NODE_ENV is already 'test' when running jest
process.env.DATABASE_URL = 'postgresql://test:test@localhost/test'
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long!'
process.env.RESEND_API_KEY = 'test-resend-key'
process.env.TURNSTILE_SECRET = 'test-turnstile-secret'
process.env.CRON_SECRET = 'test-cron-secret'
process.env.APP_URL = 'https://birthchartlibrary.com'
process.env.ADMIN_EMAIL = 'admin@birthchartlibrary.com'
