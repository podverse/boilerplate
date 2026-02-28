# Plan 01: API locale handling at email touch points

## Scope

1. **Emails:** Send verification, password reset, and email-change confirmation emails in
   the **preferred locale** of the user who triggered the email (when available). Resolve
   locale from stored user preference, request header, or body, then pass locale into the
   mailer and use localized subject/body.
2. **API status messages:** Keep all API response messages (e.g. `res.status(400).json({
   message: '...' })`) **in American English**. Do not localize these; document as a
   rule so future changes stay consistent.

## Principles (document and enforce)

- **API JSON `message` field:** Always American English. Used for errors, validation, and
  success text. Clients may display these directly or map them to local UI; the canonical
  value is en-US. No translation layer for API response messages.
- **User-facing content outside the API response body:** Localized. Emails are the first
  touch point; any future push notifications or similar should use the same locale
  resolution.

## Steps

### 1. Store and provide preferred locale

- **Option A – User table:** Add a column (e.g. `preferred_locale`, nullable, e.g.
  `en-US`, `es`) to the user or credentials table. Settings page (or equivalent) calls an
  API to update it when the user changes language. When the API sends an email, it loads
  the user’s preferred_locale and passes it to the mailer.
- **Option B – Request only:** No stored preference; use `Accept-Language` (or an explicit
  body/query param like `locale`) on the request that triggers the email (signup, forgot-
  password, request-email-change). Simpler but no persistence across sessions or devices.
- **Option C – Hybrid:** Prefer stored preferred_locale when present; otherwise
  Accept-Language or explicit param; default to `en-US`.

Recommend Option C so that once the user sets a language in the app, emails use it even
if the request does not send a header. Document the resolution order in code and in docs.

### 2. Resolve locale at email send sites

- **Signup:** After creating the user, before calling `sendVerificationEmail`, resolve
  locale: if user has preferred_locale use it; else from request (Accept-Language or
  body); else `en-US`. Pass (to, token, locale) to the mailer.
- **Forgot-password:** When sending the reset email, resolve locale for the found user
  (preferred_locale) or from request; default `en-US`. Pass (to, token, locale).
- **Request-email-change:** Authenticated user; resolve locale from user’s
  preferred_locale or request; pass (to, token, locale).

Implement a small helper (e.g. `resolveLocaleForEmail(user, req): string`) used by the
auth controller so resolution logic lives in one place. If there is no user (e.g. forgot-
password before lookup), resolve from request only; after user lookup you can use
user.preferred_locale.

### 3. Mailer API and localized content

- Change mailer signatures to accept an optional locale (e.g. `locale?: string`, default
  `en-US`):
  - `sendVerificationEmail(to, token, locale?)`
  - `sendPasswordResetEmail(to, token, locale?)`
  - `sendEmailChangeVerificationEmail(to, token, locale?)`
- For each email type, provide subject and body (text/html) per locale. Options:
  - **API-owned JSON:** e.g. `apps/api/i18n/email/en-US.json`, `es.json`, etc., with keys
    like `verification.subject`, `verification.text`, `verification.html` (with placeholder
    for link). Load the right file by locale and fallback to en-US if missing.
  - **Shared with web:** If the web app already has email copy in its i18n originals, the
    API could depend on a compiled bundle or duplicate only the email keys in the API.
  Prefer API-owned or a small shared subset so the API does not pull in the whole web
  i18n tree unless desired.
- In each send function: select the bundle or map for the given locale (fallback to en-US);
  fill in the link; send. Keep link generation and env (e.g. APP_BASE_URL) as today.

### 4. API response messages – keep en-US

- Audit existing `res.status(...).json({ message: '...' })` in auth and other controllers.
  Ensure every `message` is a literal or constant in American English. Do not add
  translation or locale-based selection for these.
- Document in AGENTS.md or API docs: “API status and error messages are always in
  American English. Do not localize the `message` field in JSON responses. User-facing
  content such as email body and subject is localized using the user’s preferred locale.”

### 5. Tests and validation

- **Unit or integration:** For at least one email type, test that (1) when locale is
  `es` (or a supported non–en-US locale), the mailer receives the call with that locale
  and the sent content (or the content passed to the transport) is in the expected
  language; (2) when locale is missing or unsupported, fallback to en-US. Mock the
  transport so no real email is sent.
- **Mailer mock in auth tests:** Update the mock to accept optional locale if needed;
  existing tests that don’t pass locale should still pass (default en-US).
- **Validation:** If you add preferred_locale to the user, validate allowed values (e.g.
  allowlist of supported locales) on update.

### 6. Documentation

- **Docs (e.g. docs/localization/API-LOCALE.md or section in I18N.md):** Describe that
  (1) API response messages are always American English; (2) emails (and any future
  user-facing API-triggered content) use the user’s preferred locale; (3) how locale is
  resolved (stored preference, Accept-Language, param, default en-US); (4) where email
  translations live and how to add a new locale or new email type.
- **OpenAPI:** If any endpoint documents a request body or header for locale (e.g.
  optional `locale` or Accept-Language), add it. Response `message` fields remain
  described as en-US.

## Key files

- **apps/api:** `src/controllers/authController.ts` (resolve locale, pass to mailer);
  `src/lib/mailer/send.ts` (add locale param, load localized subject/body); optional
  `src/lib/locale/resolve.ts` or similar for resolveLocaleForEmail; optional
  `apps/api/i18n/email/*.json` or equivalent for email copy per locale.
- **Schema/ORM:** User or credentials entity and migration if adding `preferred_locale`;
  optional settings or me endpoint to update preferred_locale.
- **Tests:** `apps/api/src/test/auth-mailer.test.ts` (and any new mailer/locale tests).
- **Docs:** AGENTS.md or API docs; `docs/localization/` for API locale and email behavior.

## Verification

- Signup with a user that has preferred_locale `es` (or set via request) results in
  verification email with Spanish subject/body (when es is supported). Same for password
  reset and email-change.
- When no locale or unknown locale is provided, emails use en-US.
- All API JSON responses still use American English for the `message` field.
- Tests pass; docs and code comment clearly separate “API messages = en-US” from “emails
  = localized.”
