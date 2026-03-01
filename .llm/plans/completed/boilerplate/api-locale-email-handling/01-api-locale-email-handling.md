# Plan 01: API locale handling at email touch points

## Scope

1. **Emails:** Send verification, password reset, and email-change confirmation emails in a
   locale determined at send time: when the client sends a supported locale (e.g. via
   `Accept-Language`), use it; otherwise use the **app default locale** set by an
   **environment variable**. No database column or table is added for locale.
2. **API status messages:** Keep all API response messages (e.g. `res.status(400).json({
   message: '...' })`) **in American English**. Do not localize these; document as a
   rule so future changes stay consistent.

## Principles (document and enforce)

- **API JSON `message` field:** Always American English. Used for errors, validation, and
  success text. Clients may display these directly or map them to local UI; the canonical
  value is en-US. No translation layer for API response messages.
- **User-facing content outside the API response body:** Localized. Emails use the
  resolved locale (request header when supported, else app default from env). Any future
  push notifications or similar should use the same resolution.

## Locale resolution (no DB)

- **App default locale:** Provided by an environment variable (e.g. `DEFAULT_LOCALE`).
  Used when no request locale is provided or when the requested locale is not supported.
- **Request locale:** When a user signs up (or triggers forgot-password, request-email-
  change) on the main app server, if a locale is passed correctly in a header (e.g.
  `Accept-Language`) and that language is **supported**, use it for the email. Otherwise
  fall back to the app default from the env var.
- **No stored preference:** Do not add a column or table to the database for user
  preferred locale. Resolution is strictly: request header (if supported) → env default.

---

## Current state (as of plan review)

**Done:**

- **Mailer and localized content:** `apps/api/src/lib/mailer/send.ts` accepts `locale`
  (default `DEFAULT_LOCALE`) for all three send functions. Content comes from
  `@boilerplate/helpers-i18n` (`getVerificationEmailContent`, `getPasswordResetEmailContent`,
  `getEmailChangeVerificationContent`) which use `t(locale, ...)` and compiled bundles in
  `packages/helpers-i18n` (originals/overrides/compiled).
- **Request-based locale at send sites:** `authController.ts` uses
  `resolveLocale(req.get('Accept-Language'))` at signup, forgot-password, and
  request-email-change and passes `locale` into the mailer.
- **Env-driven default:** `packages/helpers-i18n` `resolveLocale()` already uses
  `process.env.DEFAULT_LOCALE` and `SUPPORTED_LOCALES` for app default and supported list
  (see `backend/resolve-locale.ts`).
- **Docs:** `docs/localization/I18N.md` has a "Backend i18n" section (Accept-Language,
  password and email usage; internal messages not translated).

**Not done:**

- API message rule not in AGENTS.md; no explicit audit of `res.status().json({ message })`.
- Mailer test mock does not accept `locale`; no tests that assert locale or fallback to
  app default.
- No dedicated API-LOCALE doc (or I18N section) describing resolution order (header when
  supported → env default) and "API messages = en-US" rule. No explicit note that no DB
  column is used for locale.

---

## Remaining work

### 1. Confirm locale resolution (no code change if already correct)

- Ensure the API uses `resolveLocale(req.get('Accept-Language'))` from
  `@boilerplate/helpers-i18n` at all email send sites (signup, forgot-password,
  request-email-change). That function already: parses Accept-Language, returns the first
  **supported** locale, and otherwise returns the app default (from `DEFAULT_LOCALE` env).
- Ensure the app (or helpers-i18n) reads `DEFAULT_LOCALE` from the environment so the app
  instance's default is configurable. Document `DEFAULT_LOCALE` (and `SUPPORTED_LOCALES` if
  used) in the API's `.env.example` if not already.

### 2. API response messages – document and optionally audit

- Add to **AGENTS.md** (or API docs): "API status and error messages are always in
  American English. Do not localize the `message` field in JSON responses. User-facing
  content such as email subject/body is localized using the request locale (header when
  supported, else app default from env)."
- Optionally audit `res.status(...).json({ message: '...' })` in auth and other
  controllers to ensure literals/constants are American English.

### 3. Tests and validation

- **Mailer mock:** In `apps/api/src/test/auth-mailer.test.ts`, update the mocked send
  functions to accept an optional third parameter `locale?: string`. Existing tests
  that don't pass locale should still pass (default).
- **Locale behavior:** Add at least one test that (1) triggers an email with a supported
  non-default locale (e.g. `Accept-Language: es`) and asserts the mailer is called with
  that locale (e.g. via mock capture), and (2) asserts fallback to the app default when
  locale is missing or unsupported (e.g. mock receives default locale). Use env or test
  setup to define default/supported locales; no real email.

#### Thorough locale handling test matrix

Cover the following paths so locale resolution and usage are well exercised. Tests live in **apps/api/src/test/auth-mailer.test.ts** (and optionally **packages/helpers-i18n** for unit tests of `resolveLocale`).

**A. Email locale – signup (verification email)**

| Scenario | Accept-Language | DEFAULT_LOCALE (test setup) | Assert |
|----------|------------------|-----------------------------|--------|
| Supported exact (es) | `es` | any | `captured.verifyLocale === 'es'` |
| Supported exact (en-US) | `en-US` | any | `captured.verifyLocale === 'en-US'` |
| Base language (en) | `en` | any | `captured.verifyLocale === 'en-US'` (or supported en) |
| Base language (en-GB) | `en-GB` | any | `captured.verifyLocale === 'en-US'` (or supported en) |
| No header | (none) | `en-US` | `captured.verifyLocale === 'en-US'` |
| No header, default es | (none) | `es` | `captured.verifyLocale === 'es'` |
| Unsupported locale | `fr` or `de` | `en-US` | `captured.verifyLocale === 'en-US'` |

**B. Email locale – forgot-password (password reset email)**

| Scenario | Accept-Language | Assert |
|----------|------------------|--------|
| Supported es | `es` | `captured.passwordResetLocale === 'es'` |
| No header | (none) | `captured.passwordResetLocale === DEFAULT_LOCALE` (set in test) |

**C. Email locale – request-email-change (email-change verification)**

| Scenario | Accept-Language | Assert |
|----------|------------------|--------|
| Supported es | `es` | `captured.emailChangeLocale === 'es'` when flow runs |

**D. Password validation (400 response) – localized message**

Endpoints that use `getPasswordValidationMessages(locale)` and return `res.status(400).json({ message: passwordCheck.message })`: signup, reset-password, change-password (management-api). For at least one endpoint:

| Scenario | Endpoint | Accept-Language | Assert |
|----------|----------|------------------|--------|
| Weak password | POST /auth/signup or /auth/reset-password | `es` | 400 and `res.body.message` equals the Spanish validation message (e.g. min length) from helpers-i18n for locale `es` |
| Weak password | same | (none) | 400 and `res.body.message` equals default-locale validation message |

Use a password that fails validation (e.g. too short) so the API returns the localized message.

**E. Structural messages (American English) – no locale**

Ensure these remain in English; existing tests already check the exact string:

- POST /auth/verify-email with invalid token → 400 `message: 'Invalid or expired link'`
- POST /auth/reset-password with invalid token → 400 `message: 'Invalid or expired link'`
- POST /auth/confirm-email-change with invalid token → 400 `message: 'Invalid or expired link'`
- 401 responses → `message: 'Authentication required'` (or as defined)

**F. Optional: resolveLocale unit tests (packages/helpers-i18n)**

If adding a test file for `resolve-locale.ts` (e.g. `resolve-locale.test.ts`):

- `undefined` or `''` → returns `getDefaultLocale()` (or supported default).
- Exact match: `'en-US'`, `'es'` → returns that value (with supported list including both).
- Base match: `'en'`, `'en-GB'` → returns supported en locale (e.g. `en-US`); `'es'`, `'es-ES'` → returns `es`.
- Unsupported: `'fr'`, `'de'` → returns `getDefaultLocale()`.
- `SUPPORTED_LOCALES=es` (only es), header `en` → no match, returns default (es).
- `DEFAULT_LOCALE=es`, empty header → returns `es`.

Implement the minimum needed for confidence: at least A (signup locale), B (forgot-password locale), and one path from D (password validation message in one locale). Add more rows from the matrix as needed.

### 4. Documentation

- Add **docs/localization/API-LOCALE.md** (or an equivalent section in I18N.md) that
  describes: (1) API response `message` is always American English; (2) emails use
  resolved locale: request header (e.g. Accept-Language) when the value is supported,
  otherwise the app default from the `DEFAULT_LOCALE` environment variable; (3) **no
  database column or table** is used for locale; (4) where email translations live
  (`packages/helpers-i18n` originals/overrides/compiled, `email.*` keys) and how to add
  a locale or new email type.
- **OpenAPI:** If any endpoint documents a request header for locale (e.g.
  Accept-Language), add it. Response `message` fields remain described as en-US.

---

## Key files

- **apps/api:** `src/controllers/authController.ts` (already uses resolveLocale at email
  send sites); ensure config or env supplies default if needed.
- **Mailer:** `src/lib/mailer/send.ts` (already has locale param; no change needed).
- **packages/helpers-i18n:** `src/backend/resolve-locale.ts` (uses `DEFAULT_LOCALE` and
  `SUPPORTED_LOCALES` from env); `src/backend/email-messages.ts`; compiled email copy
  (originals/overrides/compiled).
- **Tests:** `apps/api/src/test/auth-mailer.test.ts` (add locale to mock and locale tests).
- **Docs:** AGENTS.md (API message rule); `docs/localization/API-LOCALE.md` or I18N.md
  section. API `.env.example` for `DEFAULT_LOCALE` / `SUPPORTED_LOCALES` if applicable.

## Verification

- Signup (or forgot-password / request-email-change) with a supported locale in the
  request header (e.g. Accept-Language: es) results in the verification email in that
  language when supported. Same for password reset and email-change.
- When no locale or an unsupported locale is provided, emails use the app default locale
  (from the `DEFAULT_LOCALE` environment variable).
- No database column or table is added for locale.
- All API JSON responses use American English for the `message` field.
- **Tests:** Locale handling test matrix (section 3) implemented; docs clearly separate "API messages = en-US" from "emails = localized
  (header when supported, else env default)."
