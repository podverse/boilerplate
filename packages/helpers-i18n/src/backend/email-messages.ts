/**
 * Locale-aware email subject/body for API mailer (verification, password reset, email change).
 * Only used by apps/api; management-api does not send transactional email.
 */

import { t } from './t.js';

export function getVerificationEmailContent(
  locale: string,
  link: string
): {
  subject: string;
  text: string;
  html: string;
} {
  return {
    subject: t(locale, 'email.verifySubject'),
    text: t(locale, 'email.verifyText', { link }),
    html: t(locale, 'email.verifyHtml', { link }),
  };
}

export function getPasswordResetEmailContent(
  locale: string,
  link: string
): {
  subject: string;
  text: string;
  html: string;
} {
  return {
    subject: t(locale, 'email.resetSubject'),
    text: t(locale, 'email.resetText', { link }),
    html: t(locale, 'email.resetHtml', { link }),
  };
}

export function getEmailChangeVerificationContent(
  locale: string,
  link: string
): {
  subject: string;
  text: string;
  html: string;
} {
  return {
    subject: t(locale, 'email.confirmEmailChangeSubject'),
    text: t(locale, 'email.confirmEmailChangeText', { link }),
    html: t(locale, 'email.confirmEmailChangeHtml', { link }),
  };
}
