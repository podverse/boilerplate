# Plan 36: API integration auth tests

## Scope

Add API integration tests for all auth endpoints, including signup (admin-only vs mailer
enabled) and verification flows (verify-email, forgot-password, reset-password,
request-email-change, confirm-email-change). Verification flows are testable in an
automated way by using a **mocked mailer** that captures tokens (see plan 35); no local
mailer service. Depends on plan 35 (test framework, app factory, test DB, mailer mock
strategy).

## DB and Valkey (recap)

- **No create/destroy of Postgres or Valkey.** Use a dedicated test database
  (`DB_NAME=boilerplate_test`) on the same Postgres server; same Valkey instance with
  test env vars. Schema applied via combined init script before tests (in CI or in
  globalSetup).

## Mailer and signup modes

- **Admin-only (no mailer):** `MAILER_ENABLED` not `true` (or `AUTH_MODE=admin_only`).
  - Signup: `POST /signup` → 403.
  - Verification routes: `POST /verify-email`, `/forgot-password`, `/reset-password`,
    `POST /request-email-change`, `POST /confirm-email-change` → 403.
- **Signup with mailer (mocked):** Set `MAILER_ENABLED=true` and mock
  `apps/api/src/lib/mailer/send.js` so `isMailerEnabled()` returns true and send
  functions capture `(to, token)`. Tests then call verification endpoints with the
  captured token. No real SMTP or local mailer service.

## Test cases

1. **Login**
   - 400: missing email or password.
   - 401: unknown email; wrong password.
   - 200: valid credentials; body has `token` and `user` (id, email, displayName).

2. **Logout**
   - 204: no body.

3. **Me**
   - 401: no `Authorization` header or invalid token.
   - 200: valid JWT in `Authorization: Bearer <token>`; body has `user`.

4. **Change-password** (requires auth)
   - 401: no or invalid token.
   - 400: missing currentPassword or newPassword.
   - 401: wrong currentPassword.
   - 204: success (then login with new password to confirm).

5. **Signup — admin-only**
   - With mailer disabled (or AUTH_MODE=admin_only): `POST /signup` with body → 403,
     message "Registration is by admin only".

6. **Signup — mailer enabled (mocked)**
   - With mailer mock and MAILER_ENABLED=true: `POST /signup` with email, password,
     optional displayName → 201, body has `token` and `user`. If implementation
     sends verification email on signup, mock captures the token for verify-email test.

7. **Verify-email — mailer disabled**
   - `POST /verify-email` → 403, "Email verification is not enabled".

8. **Verify-email — mailer enabled (mocked)**
   - After signup (with mailer mock), use captured token: `POST /verify-email` with
     `{ token: capturedToken }` (or query `?token=...`) → 200. Optionally GET /me or
     login to confirm email_verified state if exposed.

9. **Forgot-password — mailer disabled**
   - `POST /forgot-password` with email → 403.

10. **Forgot-password — mailer enabled (mocked)**
    - Create user (signup or ensure exists). `POST /forgot-password` with email → 200;
      mock captures token. `POST /reset-password` with `{ token: capturedToken,
      newPassword }` → 204. Login with new password to confirm.

11. **Reset-password**
    - 400: missing or invalid token, or invalid newPassword.
    - 204: valid token (from mock) and newPassword.

12. **Request-email-change — mailer disabled**
    - With auth: `POST /request-email-change` with newEmail → 403.

13. **Request-email-change — mailer enabled (mocked)**
    - With auth and mailer mock: `POST /request-email-change` with newEmail → 200;
      mock captures token. `POST /confirm-email-change` with `{ token: capturedToken }`
      → 200. Optionally GET /me to confirm new email.

14. **Confirm-email-change**
    - 400: missing or invalid token.
    - 200: valid token from mock.

## Implementation notes

- Use one or more describe blocks to separate "mailer disabled" vs "mailer enabled"
  (mock) so env and mocks are set per group.
- For "mailer enabled" tests, `vi.mock('../lib/mailer/send.js')` (or the correct
  path from the test file) with a factory that returns an object exposing
  `isMailerEnabled: () => true`, `sendVerificationEmail`, `sendPasswordResetEmail`,
  `sendEmailChangeVerificationEmail` that each store the token (and optionally to)
  in a variable the test can read. Reset captured tokens between tests if needed.
- Base URL for API: use config.apiVersionPath (e.g. `/v1`) so requests go to
  `/v1/auth/login`, etc.
- Create the app once per test file or describe (beforeAll) after setting env and
  initializing DataSource; use supertest(app) for each request.

## CI

- In [.github/workflows/ci.yml](../../../.github/workflows/ci.yml), in the `validate`
  job (comment-triggered /test):
  - Add Postgres and Valkey (or Redis) service containers with the same env names
    expected by the API (DB_HOST, DB_PORT, DB_NAME, DB_READ_USERNAME, DB_READ_PASSWORD,
    DB_READ_WRITE_*, VALKEY_*, etc.). Use a dedicated test DB name (e.g.
    `boilerplate_test`).
  - Add a step that creates the test database (if not exists) and runs the combined
    init script ([infra/database/combined/init_database.sql](../../../infra/database/combined/init_database.sql)) against it. Exact step depends on CI image (e.g. `psql` or a small script).
  - Add a "Test" step after "Type-check": set test env vars (or use .env.test), then
    `npm run test` (or `npm run test -w apps/api`). Ensure JWT_SECRET and other
    required vars are set (e.g. from env or a minimal secret).

## Key files

- `apps/api/src/test/auth.test.ts` (shared: versioned root, login, logout, me, change-password), `apps/api/src/test/auth-no-mailer.test.ts` (no-mailer), `apps/api/src/test/auth-mailer.test.ts` (mailer-enabled, mocked)
- `apps/api/src/test/setup.ts` or shared helpers (create app, set env, optional
  truncate or cleanup)
- `.github/workflows/ci.yml` (services, DB init step, test step)

## Verification

- `npm run test` from repo root passes with all auth cases above covered.
- CI validate job runs tests when /test is commented; test step uses the same
  Postgres and Valkey services (no separate create/destroy of instances).
- Verification endpoints (verify-email, reset-password, confirm-email-change) are
  exercised using tokens captured from the mailer mock; no real email is sent.
