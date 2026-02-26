# Plan 34: Sign-up verification and password flows

## Scope

Implement essential sign-up process operations for **mailer mode** only: email verification after signup, forgot/reset password, and change email with verification. No-mailer mode is unchanged. All token-based flows are single-use, time-limited, and do not leak user existence (e.g. forgot-password returns same response whether email exists or not).

## Prerequisites

- **Plan 15** (auth handling): Login, signup, change-password, JWT, User entity must exist.
- **Mailer**: A mailer abstraction or service must exist to send transactional email. If the codebase only has `MAILER_ENABLED` and no transport, introduce a minimal mailer (e.g. nodemailer or a thin adapter) with env-driven SMTP or test transport. Config: e.g. `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, and `APP_BASE_URL` (or `PUBLIC_APP_URL`) for building verification links.

## Schema

- **Tables and columns use snake_case** (see `.cursor/skills/database-schema-naming/SKILL.md`).
- **User table extensions:**
  - `email_verified_at` (TIMESTAMP, nullable). Set when user verifies their email; null means unverified.
  - Option A (tokens on User): `password_reset_token_hash` (VARCHAR, nullable), `password_reset_expires_at` (TIMESTAMP, nullable); `pending_email` (VARCHAR, nullable), `email_change_token_hash` (VARCHAR, nullable), `email_change_expires_at` (TIMESTAMP, nullable). Store only token hash, never plain token.
  - Option B (recommended): Dedicated table `verification_tokens` with columns: `id` (UUID PK), `user_id` (FK to users), `kind` (e.g. 'email_verify', 'password_reset', 'email_change'), `token_hash` (VARCHAR NOT NULL), `expires_at` (TIMESTAMP NOT NULL), `payload` (JSONB nullable; e.g. for pending_email). Single-use: delete row when consumed. User table then only needs `email_verified_at` and optionally `pending_email` + `email_change_expires_at` if you prefer to store pending email on User for simplicity.
- **Migration:** Add new migration file under `infra/database/migrations/` (e.g. `0002_verification_and_email_verified.sql`). Regenerate `infra/database/combined/init_database.sql` with the project’s combine script so new installs get the full schema.
- **ORM:** Extend User entity with `emailVerifiedAt` (map to `email_verified_at`). Add entity or repository for verification tokens if using Option B. Add UserService methods to create/consume tokens (by kind).

## Email verification (sign-up)

1. **Signup behavior:** When a user signs up (POST `/auth/signup`), create the user with `email_verified_at = null`. Generate a secure one-time token (e.g. 32 bytes random, or signed JWT with short expiry). Store token hash in `verification_tokens` (kind `email_verify`) with expiry (e.g. 24 hours). Send an email containing a link: `{APP_BASE_URL}/auth/verify-email?token={token}` (or a front-end URL that calls the API with the token). Return 201 as today (no enumeration); optionally include a flag in the response that "verification email sent" when mailer is configured.
2. **Verify endpoint:** `GET /auth/verify-email?token=...` or `POST /auth/verify-email` with body `{ "token": "..." }`. Look up token by hash; if not found or expired return 400 with generic message. If valid, set `User.email_verified_at = NOW()`, delete the verification token, return 200 with a simple success message or redirect URL. Idempotent: if already verified, return 200.
3. **Login gating (optional):** If config (e.g. `REQUIRE_EMAIL_VERIFICATION=true`) is set, login may return 403 with a message that the user must verify email first; otherwise allow login regardless of `email_verified_at`. Document the behavior.

## Forgot password / reset password

1. **Request reset:** `POST /auth/forgot-password`. Body: `{ "email": "..." }`. **No user enumeration:** Always return 200 (or 202) with a generic message (e.g. "If an account exists with this email, you will receive a reset link."). If a user exists, generate a single-use token (e.g. 32 bytes), store hash + expiry (e.g. 1 hour) in `verification_tokens` (kind `password_reset`), send email with link `{APP_BASE_URL}/auth/reset-password?token={token}` (or front-end equivalent). If user does not exist, do nothing; still return success.
2. **Reset password:** `POST /auth/reset-password`. Body: `{ "token": "...", "newPassword": "..." }`. Validate token (hash lookup, expiry); if invalid return 400 with generic message. If valid, update user password (hash with bcrypt), delete the verification token, return 204 or 200. Single-use: token is consumed.

## Change email with verification

1. **Request email change:** `POST /auth/request-email-change`. **Requires authentication** (Bearer JWT). Body: `{ "newEmail": "..." }`. Validate new email format and that it is not the current email; ensure new email is not already in use (return 409 if taken). Store pending state: either a row in `verification_tokens` with kind `email_change` and payload `{ "pending_email": "new@example.com" }`, or columns on User (`pending_email`, `email_change_token_hash`, `email_change_expires_at`). Send verification email to **new** email with link containing token. Return 200/202 with generic success.
2. **Confirm email change:** `POST /auth/confirm-email-change`. Body: `{ "token": "..." }` (or token in query for GET). No auth required (token is the proof). Look up token; if invalid or expired return 400. If valid, set `User.email = pending_email`, clear pending state and token, set `email_verified_at = NOW()` for the new email (or leave as-is if already verified). Return 200. Invalidate token after use.

## Security

- **Token entropy:** Use cryptographically secure random (e.g. 32 bytes) or a short-lived signed JWT; store only a hash (e.g. SHA-256) in the DB.
- **Expiry:** Email verify: e.g. 24h; password reset: e.g. 1h; email change: e.g. 24h. Make values configurable via env if desired.
- **Single-use:** Delete or mark token consumed immediately after successful use.
- **No enumeration:** Forgot-password and verify-email responses must not reveal whether an email is registered; use generic success messages.
- **Rate limiting:** Consider rate limiting forgot-password and request-email-change by IP or email to prevent abuse (document in plan or implement in a follow-up).

## Key files

- `infra/database/migrations/0002_verification_and_email_verified.sql` – New migration (or single migration adding `email_verified_at` and `verification_tokens` table / User columns). Snake_case.
- `infra/database/combined/init_database.sql` – Regenerate after migration (combine script).
- `packages/orm/src/entities/User.ts` – Add `emailVerifiedAt` (map to `email_verified_at`). If Option A: add password_reset and email_change columns with snake_case names.
- `packages/orm/src/entities/VerificationToken.ts` – If Option B: entity for verification_tokens.
- `packages/orm/src/services/UserService.ts` – Methods to update `email_verified_at`; create/consume verification tokens (or delegate to a small VerificationTokenService).
- `apps/api/src/lib/mailer/` or `apps/api/src/services/mailer.ts` – Mailer abstraction: sendVerificationEmail(to, token, kind), sendPasswordResetEmail(to, token), sendEmailChangeVerificationEmail(to, token). Use env for SMTP and base URL.
- `apps/api/src/routes/auth.ts` – Mount new routes: verify-email, forgot-password, reset-password, request-email-change, confirm-email-change.
- `apps/api/src/controllers/authController.ts` (or new controller) – Handlers for the above; call ORM and mailer.
- `apps/api/src/config/index.ts` – Add mailer-related env (SMTP_*, APP_BASE_URL, REQUIRE_EMAIL_VERIFICATION, token expiry seconds).
- `apps/api/src/lib/startup/validation.ts` – When MAILER_ENABLED=true, validate required mailer env vars.
- `apps/api/.env.example` – Document new vars.
- `apps/api/src/openapi.ts` – Document new endpoints and request/response bodies per `.cursor/skills/swagger-openapi/SKILL.md`.

## Verification

- With mailer enabled: signup creates user with email_verified_at null and sends verification email. Verify-email endpoint accepts token and sets email_verified_at. Forgot-password returns 200 always; if user exists, reset email is sent. Reset-password with valid token updates password and invalidates token. Request-email-change (authenticated) sends verification to new email; confirm-email-change applies new email and invalidates token.
- No-mailer mode: these endpoints may return 403 or be unmounted when mailer is disabled; existing auth behavior unchanged.
