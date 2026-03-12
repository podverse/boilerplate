import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { DEFAULT_LOCALE } from '@boilerplate/helpers-i18n';
import {
  getVerificationEmailContent,
  getPasswordResetEmailContent,
  getEmailChangeVerificationContent,
} from '@boilerplate/helpers-i18n';

let transporter: Transporter | null = null;
const AUTH_MODE_ADMIN_ONLY_EMAIL = 'admin_only_email';
const AUTH_MODE_USER_SIGNUP_EMAIL = 'user_signup_email';

function getTransporter(): Transporter {
  if (transporter !== null) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.MAIL_FROM;
  if (host === undefined || port === undefined || from === undefined) {
    throw new Error(
      'Mailer requires SMTP_HOST, SMTP_PORT, and MAIL_FROM when AUTH_MODE uses email flows'
    );
  }
  transporter = nodemailer.createTransport({
    host,
    port: Number.parseInt(port, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      user !== undefined && user !== '' && pass !== undefined && pass !== ''
        ? { user, pass }
        : undefined,
  });
  return transporter;
}

function getBaseUrl(): string {
  const url = process.env.APP_BASE_URL;
  if (url === undefined || url === '') {
    throw new Error('Mailer requires APP_BASE_URL when AUTH_MODE uses email flows');
  }
  return url.replace(/\/$/, '');
}

export function isMailerEnabled(): boolean {
  const authMode = process.env.AUTH_MODE?.trim().toLowerCase();
  return authMode === AUTH_MODE_ADMIN_ONLY_EMAIL || authMode === AUTH_MODE_USER_SIGNUP_EMAIL;
}

export async function sendVerificationEmail(
  to: string,
  token: string,
  locale: string = DEFAULT_LOCALE
): Promise<void> {
  if (!isMailerEnabled()) return;
  const base = getBaseUrl();
  const link = `${base}/auth/verify-email?token=${encodeURIComponent(token)}`;
  const content = getVerificationEmailContent(locale, link);
  const transport = getTransporter();
  const from = process.env.MAIL_FROM ?? 'noreply@localhost';
  await transport.sendMail({
    from,
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  locale: string = DEFAULT_LOCALE
): Promise<void> {
  if (!isMailerEnabled()) return;
  const base = getBaseUrl();
  const link = `${base}/auth/reset-password?token=${encodeURIComponent(token)}`;
  const content = getPasswordResetEmailContent(locale, link);
  const transport = getTransporter();
  const from = process.env.MAIL_FROM ?? 'noreply@localhost';
  await transport.sendMail({
    from,
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export async function sendEmailChangeVerificationEmail(
  to: string,
  token: string,
  locale: string = DEFAULT_LOCALE
): Promise<void> {
  if (!isMailerEnabled()) return;
  const base = getBaseUrl();
  const link = `${base}/auth/confirm-email-change?token=${encodeURIComponent(token)}`;
  const content = getEmailChangeVerificationContent(locale, link);
  const transport = getTransporter();
  const from = process.env.MAIL_FROM ?? 'noreply@localhost';
  await transport.sendMail({
    from,
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}
