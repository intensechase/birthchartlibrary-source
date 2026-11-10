import { env } from './env'

const RESEND_API_KEY = env.resendApiKey
const FROM = 'Birth Chart Library <librarian@birthchartlibrary.com>'

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  extraHeaders?: Record<string, string>,
): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject,
        html,
        ...(extraHeaders ? { headers: extraHeaders } : {}),
      }),
    })
    return res.ok
  } catch (err) {
    console.error('Failed to send email:', err)
    return false
  }
}

function emailLayout(body: string, options?: { subtitle?: string; manageUrl?: string }): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1A202C;">
      <div style="text-align: center; padding: ${options?.subtitle ? '24px' : '32px'} 0; border-bottom: 1px solid #E2E8F0;">
        <h1 style="font-size: 20px; margin: 0; letter-spacing: 2px;">BIRTH CHART LIBRARY</h1>
        ${options?.subtitle ? `<p style="color: #718096; font-size: 13px; margin-top: 4px;">${options.subtitle}</p>` : ''}
      </div>
      ${body}
      <div style="text-align: center; padding: 16px 0; color: #A0AEC0; font-size: 11px;">
        <p>Birth Chart Library · Free forever, supported by ads</p>
        ${options?.manageUrl ? `<p style="margin-top: 4px;"><a href="${options.manageUrl}" style="color: #A0AEC0;">Manage email preferences</a></p>` : ''}
      </div>
    </div>
  `
}

export async function sendWelcomeEmail(email: string) {
  const body = `
    <div style="padding: 32px 0;">
      <h2 style="font-size: 22px; margin: 0 0 16px; text-align: center;">Welcome to the Library</h2>
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Your account is ready... now it's time to build your birth chart.
      </p>
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Your natal chart is the foundation of everything here... your personalized daily horoscope, planetary transits, and cosmic insights are all built from it. It takes about 30 seconds.
      </p>
    </div>
    <div style="text-align: center; padding: 24px 0;">
      <a href="https://birthchartlibrary.com/birth-chart" style="display: inline-block; background: #1A202C; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">Create Your Birth Chart</a>
    </div>
    <div style="padding: 24px 0; border-top: 1px solid #E2E8F0;">
      <p style="color: #718096; font-size: 13px; line-height: 1.6; text-align: center;">
        <strong>What you'll need:</strong> your birth date, birth time (if you know it), and birth city. That's it.
      </p>
    </div>
  `
  await sendEmail(email, '✦ Welcome to Birth Chart Library', emailLayout(body))
}

export async function sendChartCreatedEmail(email: string, sunSign: string, moonSign: string, risingSign: string) {
  const body = `
    <div style="padding: 32px 0; text-align: center;">
      <h2 style="font-size: 22px; margin: 0 0 8px;">Your Chart is Ready</h2>
      <p style="color: #718096; font-size: 14px; margin: 0 0 24px;">Here's a quick snapshot of your cosmic blueprint.</p>
      <div style="background: #F8F9FC; border-radius: 12px; padding: 24px; display: inline-block; text-align: center;">
        <p style="font-size: 15px; margin: 4px 0; color: #2D3748;">☉ Sun in <strong>${sunSign}</strong></p>
        <p style="font-size: 15px; margin: 4px 0; color: #2D3748;">☽ Moon in <strong>${moonSign}</strong></p>
        <p style="font-size: 15px; margin: 4px 0; color: #2D3748;">↑ Rising: <strong>${risingSign}</strong></p>
      </div>
    </div>
    <div style="padding: 8px 0 24px;">
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Your personalized daily horoscope is now active... it updates every day based on how the planets are interacting with your unique chart. Your first reading is ready now.
      </p>
    </div>
    <div style="text-align: center; padding: 24px 0; border-top: 1px solid #E2E8F0;">
      <a href="https://birthchartlibrary.com/daily-horoscope" style="display: inline-block; background: #1A202C; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">View Your Daily Horoscope</a>
    </div>
  `
  await sendEmail(email, `☉ Your Chart: ${sunSign} Sun, ${moonSign} Moon, ${risingSign} Rising`, emailLayout(body))
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const body = `
    <div style="padding: 32px 0;">
      <h2 style="font-size: 22px; margin: 0 0 16px; text-align: center;">Reset Your Password</h2>
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Click the link below to choose a new password. This link expires in 1 hour.
      </p>
    </div>
    <div style="text-align: center; padding: 24px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: #1A202C; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">Reset Password</a>
    </div>
    <p style="color: #94A3B8; font-size: 12px; text-align: center; padding-top: 24px; border-top: 1px solid #E2E8F0;">
      If you didn't request this, you can safely ignore this email.
    </p>
  `
  await sendEmail(email, 'Reset Your Password', emailLayout(body))
}

export async function sendDailyHoroscopeEmail(
  email: string,
  moonSign: string,
  moonTransit: string,
  reflection: string,
  transitText: string,
  today: string,
): Promise<boolean> {
  const body = `
    <div style="display:none;max-height:0;overflow:hidden;">\u263D Moon in ${moonSign} today... ${reflection.slice(0, 80)}</div>
    <div style="padding: 24px 0;">
      <h2 style="font-size: 16px; margin: 0 0 8px;">\u263D Moon in ${moonSign}</h2>
      <p style="color: #4A5568; font-size: 14px; line-height: 1.6;">${moonTransit.split('\n\n')[0]}</p>
    </div>
    <div style="padding: 20px; background: #F8F9FC; border-radius: 8px; margin-bottom: 20px;">
      <p style="font-style: italic; color: #4A5568; font-size: 15px; line-height: 1.5; margin: 0;">"${reflection}"</p>
    </div>
    ${transitText ? `
    <div style="padding: 24px 0; border-top: 1px solid #E2E8F0;">
      <h2 style="font-size: 16px; margin: 0 0 8px;">\u2726 This Week</h2>
      <p style="color: #4A5568; font-size: 14px; line-height: 1.6;">${transitText}</p>
    </div>
    ` : ''}
    <div style="text-align: center; padding: 24px 0; border-top: 1px solid #E2E8F0;">
      <a href="https://birthchartlibrary.com/daily-horoscope" style="display: inline-block; background: #1A202C; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View Full Horoscope</a>
    </div>
  `
  return sendEmail(
    email,
    `\u263D Your Daily Horoscope \u2014 Moon in ${moonSign}`,
    emailLayout(body, { subtitle: today, manageUrl: 'https://birthchartlibrary.com/account' }),
    {
      'List-Unsubscribe': '<https://birthchartlibrary.com/account>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  )
}

export async function sendEmailVerification(email: string, verifyUrl: string) {
  const body = `
    <div style="padding: 32px 0;">
      <h2 style="font-size: 22px; margin: 0 0 16px; text-align: center;">Verify Your Email</h2>
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Click the link below to verify your email address. This link expires in 24 hours.
      </p>
    </div>
    <div style="text-align: center; padding: 24px 0;">
      <a href="${verifyUrl}" style="display: inline-block; background: #1A202C; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">Verify Email</a>
    </div>
    <p style="color: #94A3B8; font-size: 12px; text-align: center; padding-top: 24px; border-top: 1px solid #E2E8F0;">
      If you didn't create this account, you can safely ignore this email.
    </p>
  `
  await sendEmail(email, 'Verify Your Email — Birth Chart Library', emailLayout(body))
}

export async function sendEmailChangeVerification(newEmail: string, verifyUrl: string) {
  const body = `
    <div style="padding: 32px 0;">
      <h2 style="font-size: 22px; margin: 0 0 16px; text-align: center;">Confirm Your New Email</h2>
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Click the link below to confirm this email address for your account. This link expires in 24 hours.
      </p>
    </div>
    <div style="text-align: center; padding: 24px 0;">
      <a href="${verifyUrl}" style="display: inline-block; background: #1A202C; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">Confirm Email</a>
    </div>
    <p style="color: #94A3B8; font-size: 12px; text-align: center; padding-top: 24px; border-top: 1px solid #E2E8F0;">
      If you didn't request this change, you can safely ignore this email.
    </p>
  `
  await sendEmail(newEmail, 'Confirm Your New Email Address', emailLayout(body))
}

export async function sendGuestSubscribeConfirmation(email: string, sunSign: string, unsubscribeToken: string) {
  const body = `
    <div style="padding: 32px 0; text-align: center;">
      <h2 style="font-size: 22px; margin: 0 0 8px;">You're subscribed</h2>
      <p style="color: #718096; font-size: 14px; margin: 0 0 24px;">Your daily horoscope email starts tomorrow morning.</p>
      <div style="background: #F8F9FC; border-radius: 12px; padding: 20px 32px; display: inline-block;">
        <p style="font-size: 15px; margin: 0; color: #2D3748;">☉ Sun in <strong>${sunSign}</strong></p>
      </div>
    </div>
    <div style="padding: 8px 0 24px;">
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Each morning you'll receive the day's Moon sign and a reflection to orient your energy. It's a light, daily touchpoint with the sky.
      </p>
      <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
        Want a deeper read? Create a free account and we'll build a full birth chart with transits personalized to your exact planetary positions... not just your Sun sign.
      </p>
    </div>
    <div style="text-align: center; padding: 24px 0; border-top: 1px solid #E2E8F0;">
      <a href="https://birthchartlibrary.com/signup" style="display: inline-block; background: #1A202C; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">Create Your Free Chart</a>
    </div>
    <p style="color: #A0AEC0; font-size: 11px; text-align: center; padding-top: 16px;">
      <a href="https://birthchartlibrary.com/api/guest-unsubscribe?token=${unsubscribeToken}" style="color: #A0AEC0;">Unsubscribe</a>
    </p>
  `
  await sendEmail(
    email,
    `☉ Welcome — your daily horoscope emails start tomorrow`,
    emailLayout(body),
    {
      'List-Unsubscribe': `<https://birthchartlibrary.com/api/guest-unsubscribe?token=${unsubscribeToken}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  )
}

export async function sendGuestDailyHoroscopeEmail(
  email: string,
  moonSign: string,
  moonTransit: string,
  reflection: string,
  unsubscribeToken: string,
  today: string,
  sunSign: string,
  showUpgradeCta: boolean,
): Promise<boolean> {
  const unsubUrl = `https://birthchartlibrary.com/api/guest-unsubscribe?token=${unsubscribeToken}`
  const horoscopeUrl = `https://birthchartlibrary.com/horoscope/${sunSign.toLowerCase()}`
  const body = `
    <div style="display:none;max-height:0;overflow:hidden;">${sunSign} | Moon in ${moonSign} today... ${reflection.slice(0, 70)}</div>
    <div style="padding: 24px 0;">
      <p style="font-size: 11px; letter-spacing: 1.5px; color: #A0AEC0; text-transform: uppercase; margin: 0 0 12px;">\u2609 ${sunSign}</p>
      <h2 style="font-size: 16px; margin: 0 0 8px;">\u263D Moon in ${moonSign}</h2>
      <p style="color: #4A5568; font-size: 14px; line-height: 1.6;">${moonTransit.split('\n\n')[0]}</p>
    </div>
    <div style="padding: 20px; background: #F8F9FC; border-radius: 8px; margin-bottom: 20px;">
      <p style="font-style: italic; color: #4A5568; font-size: 15px; line-height: 1.5; margin: 0;">"${reflection}"</p>
    </div>
    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E2E8F0;">
      <a href="${horoscopeUrl}" style="display: inline-block; background: #1A202C; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">${sunSign} Horoscope \u2192</a>
    </div>
    ${showUpgradeCta ? `
    <div style="text-align: center; padding: 16px 0; border-top: 1px solid #E2E8F0;">
      <p style="color: #718096; font-size: 13px; margin: 0 0 10px;">Want transits personalized to your exact birth chart \u2014 not just your Sun sign?</p>
      <a href="https://birthchartlibrary.com/signup" style="color: #1A202C; font-size: 13px; font-weight: 600; text-decoration: underline;">Create a free account \u2192</a>
    </div>
    ` : ''}
    <p style="color: #A0AEC0; font-size: 11px; text-align: center; padding-top: 8px; border-top: 1px solid #F7FAFC;">
      <a href="${unsubUrl}" style="color: #A0AEC0;">Unsubscribe</a>
    </p>
  `
  return sendEmail(
    email,
    `${sunSign} | Moon in ${moonSign} \u2014 ${today}`,
    emailLayout(body, { subtitle: today }),
    {
      'List-Unsubscribe': `<${unsubUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  )
}

export async function sendErrorAlert(method: string, url: string, message: string) {
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Unhandled API Error</h2>
      <p><strong>Route:</strong> ${method} ${url}</p>
      <p><strong>Error:</strong> ${message}</p>
      <p style="color: #718096; font-size: 12px;">This alert fires at most once per 5 minutes.</p>
    </div>
  `
  await sendEmail(env.adminEmail, `⚠ API Error: ${method} ${url}`, html)
}

export async function sendAdminAlert(sent: number, failed: number, total: number) {
  const failureRate = total > 0 ? failed / total : 0
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Daily Email Cron Report</h2>
      <p><strong>Subscribers:</strong> ${total}</p>
      <p><strong>Sent:</strong> ${sent}</p>
      <p><strong>Failed:</strong> ${failed}</p>
      <p><strong>Failure rate:</strong> ${(failureRate * 100).toFixed(1)}%</p>
      <p style="color: #e53e3e; margin-top: 16px;">This alert fired because ${sent === 0 ? 'no emails were sent' : 'the failure rate exceeded 50%'}.</p>
    </div>
  `
  await sendEmail(env.adminEmail, `\u26A0 Daily Email Alert: ${sent} sent, ${failed} failed of ${total}`, html)
}
