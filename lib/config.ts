export const CONFIG = {
  // Rate limiting
  RATE_LIMIT_AUTH_WINDOW_MS: 60 * 60 * 1000,   // 1 hour
  RATE_LIMIT_AUTH_MAX: 10,
  RATE_LIMIT_SENSITIVE_MAX: 3,                   // forgot-password, email-change

  // Tokens
  RESET_TOKEN_EXPIRY_MS: 60 * 60 * 1000,        // 1 hour
  EMAIL_CHANGE_TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000,

  // Cache
  INTERPRETATION_CACHE_TTL_MS: 30 * 60 * 1000,  // 30 minutes

  // ISR revalidation
  REVALIDATE_ARCHIVE_S: 604800,                  // 7 days
  REVALIDATE_HOME_S: 86400,                      // 24 hours

  // Search / UI
  CITY_SEARCH_DEBOUNCE_MS: 350,

  // Email cron
  EMAIL_SEND_DELAY_MS: 100,

  // Astrology
  DEFAULT_HOUSE_SYSTEM: 'P' as const,            // Placidus
} as const
