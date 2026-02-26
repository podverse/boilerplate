import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter !== null) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.MAIL_FROM;
  if (host === undefined || port === undefined || from === undefined) {
    throw new Error(
      'Mailer requires SMTP_HOST, SMTP_PORT, MAIL_FROM when MAILER_ENABLED is true'
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
    throw new Error('Mailer requires APP_BASE_URL when MAILER_ENABLED is true');
  }
  return url.replace(/\/$/, '');
}

export function isMailerEnabled(): boolean {
  return process.env.MAILER_ENABLED === 'true';
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  if (!isMailerEnabled()) return;
  const base = getBaseUrl();
  const link = `${base}/auth/verify-email?token=${encodeURIComponent(token)}`;
  const transport = getTransporter();
  const from = process.env.MAIL_FROM ?? 'noreply@localhost';
  await transport.sendMail({
    from,
    to,
    subject: 'Verify your email',
    text: `Please verify your email by opening this link: ${link}`,
    html: `<p>Please <a href="${link}">verify your email</a>.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  if (!isMailerEnabled()) return;
  const base = getBaseUrl();
  const link = `${base}/auth/reset-password?token=${encodeURIComponent(token)}`;
  const transport = getTransporter();
  const from = process.env.MAIL_FROM ?? 'noreply@localhost';
  await transport.sendMail({
    from,
    to,
    subject: 'Reset your password',
    text: `Reset your password by opening this link: ${link}`,
    html: `<p><a href="${link}">Reset your password</a>.</p>`,
  });
}

export async function sendEmailChangeVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  if (!isMailerEnabled()) return;
  const base = getBaseUrl();
  const link = `${base}/auth/confirm-email-change?token=${encodeURIComponent(token)}`;
  const transport = getTransporter();
  const from = process.env.MAIL_FROM ?? 'noreply@localhost';
  await transport.sendMail({
    from,
    to,
    subject: 'Confirm your new email',
    text: `Confirm your new email by opening this link: ${link}`,
    html: `<p><a href="${link}">Confirm your new email</a>.</p>`,
  });
}
