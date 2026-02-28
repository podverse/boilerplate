# API locale and email handling – Summary

## Scope

Add **locale handling at specific API touch points** so that **user-facing** interactions
(such as emails) use the **preferred locale** of the user who triggered the action. At the
same time, **API status and error messages** (e.g. `res.json({ message })`) remain **always
in American English** for consistency, logging, and client handling.

## Principles

- **API responses (status messages):** Always American English. No localization of
  `message` in JSON responses. This includes error messages, success messages, and
  validation messages returned by the API.
- **User-facing content (e.g. emails):** Support locales. Verification emails, password
  reset emails, and email-change confirmation emails should be sent in the user’s
  preferred locale when available.

## Touch points (emails)

- **Verification email** (after signup) – locale from user preference or request.
- **Password reset email** (forgot-password) – locale from user preference or request.
- **Email change verification email** (request-email-change) – locale from authenticated
  user’s preference or request.

Other future user-facing touch points (e.g. other transactional emails) should follow
the same pattern: resolve locale, pass to sender, use localized content.

## Plan files

| ID | File | Description |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Phase order and pointers |
| – | 00-SUMMARY.md | This file |
| 01 | 01-api-locale-email-handling.md | Locale resolution, mailer locale, email content by locale; API messages en-US |

## Dependency map

- **01** depends on: existing mailer (sendVerificationEmail, sendPasswordResetEmail,
  sendEmailChangeVerificationEmail) and auth controllers; may depend on user/profile
  schema if preferred locale is stored there. Aligns with i18n plan (21) and i18n audit
  for key strategy; API may use its own email translation bundle or shared originals.

## Decisions (to be recorded during implementation)

- Where preferred locale is stored: user table (e.g. `preferred_locale`) vs profile vs
  session. How the client sends it (e.g. settings page persists to API, or request header
  `Accept-Language` / body param when triggering email).
- Fallback order: user’s stored preferred_locale → Accept-Language → default `en-US`.
- How email content is localized: API-only translation files (e.g. `apps/api/i18n/email/`),
  or shared bundle from apps/web originals, or runtime translation service. Same key set as
  web app for email copy where applicable.
- Supported email locales: which locales have email templates/translations (e.g. en-US,
  es; add more as needed).
