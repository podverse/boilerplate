# Plan 01: Rate limiting for critical endpoints

## Scope

Implement basic rate limiting for critical endpoints in `apps/api` and `apps/management-api`,
prioritising security-sensitive and write/delete operations. Keep the implementation minimal
and consistent with the rest of the boilerplate (e.g. env-driven, testable).

## Goals

- Reduce brute-force and credential-stuffing on login and password-reset flows.
- Reduce signup and verification-token spam (DB writes).
- Reduce abuse of user/admin create/update/delete in the management API.
- Return 429 with a clear, user-facing message and optional Retry-After when limited.

## Steps

### 1. Choose strategy and dependency

- **Option A (simple):** Use `express-rate-limit` with in-memory store. Good for single-instance
  or dev; multiple instances will each have their own window.
- **Option B (multi-instance):** Use a store backed by Valkey (e.g. `rate-limit-redis` with
  Valkey-compatible client). Requires Valkey already in use (boilerplate has Valkey for
  messages).
- Decide per-app or shared config (e.g. `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`).
  Consider separate limits for “strict” (login, signup, forgot-password, reset-password,
  verify-email, confirm-email-change) vs “moderate” (change-password, create/update/delete).

### 2. Add rate limit middleware (apps/api)

- Install chosen package(s) in `apps/api`.
- Create a small middleware helper (e.g. `apps/api/src/middleware/rateLimit.ts`) that
  builds the limiter with config from env (or defaults). Key by IP (and optionally by
  endpoint for per-route limits).
- On limit exceeded: respond with 429, JSON body with a clear message (e.g. “Too many
  requests. Please try again later.”), and set `Retry-After` header if the library
  supports it.
- Document required/optional env vars in `apps/api` (e.g. in README or env.example) and
  in startup validation if limits are required for production.

### 3. Apply to critical routes (apps/api)

- **Strict limit** (e.g. 5–10 per 15 min per IP): `POST /login`, `POST /signup`,
  `POST /forgot-password`, `POST /reset-password`, `POST /verify-email`,
  `POST /request-email-change`, `POST /confirm-email-change`.
- **Moderate limit** (e.g. 20 per 15 min per IP or per user): `POST /change-password`,
  `POST /logout` (optional).
- Mount middleware on the auth router or on specific routes so only these endpoints are
  limited; avoid applying a global limit to read-only or less sensitive routes unless
  desired.
- If the app has other write/delete routes (e.g. messages), add them to the “moderate”
  or “strict” list as appropriate.

### 4. Add rate limit middleware (apps/management-api)

- Same approach as apps/api: install dependency, add middleware helper, read config from env.
- **Strict:** `POST /auth/login`.
- **Moderate or strict:** `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`,
  `POST /admins`, `PATCH /admins/:id`, `DELETE /admins/:id`, `POST /admins/change-password`.
- Apply per route or per router so only these endpoints are rate limited.

### 5. Tests

- **apps/api:** Add at least one integration test: e.g. send more than the allowed requests
  to a strict endpoint (e.g. `POST /login` or `POST /forgot-password`) and expect 429 with
  the chosen message. Reset or use a fresh limiter per test so tests are deterministic.
- **apps/management-api:** Same idea: exceed limit on e.g. `POST /auth/login` or
  `DELETE /users/:id` and assert 429.
- If limits are configurable via env, consider a test that uses a very low limit (e.g. 1
  request per window) to trigger 429 quickly.

### 6. Documentation and alignment

- Update OpenAPI spec (and any API docs) to document 429 responses for rate-limited
  endpoints (see swagger-openapi skill).
- Document rate limiting in the main docs (e.g. README or `docs/`): which endpoints are
  limited, how limits are keyed (IP/user), and how to configure (env vars). Mention
  Retry-After if used.
- If boilerplate aligns with Podverse patterns, consider a shared rate-limit message
  or helper (see Podverse rate-limit-message skill) so 429 bodies are consistent.

## Key files

- `apps/api/package.json` – Add rate limit dependency.
- `apps/api/src/middleware/rateLimit.ts` (or equivalent) – Middleware factory.
- `apps/api/src/routes/auth.ts` – Apply rate limit middleware to auth routes.
- `apps/api/.env.example` – Optional env vars for rate limits.
- `apps/management-api/package.json` – Add rate limit dependency.
- `apps/management-api/src/middleware/rateLimit.ts` (or equivalent) – Middleware factory.
- `apps/management-api/src/routes/auth.ts`, `users.ts`, `admins.ts` – Apply middleware.
- `apps/management-api/.env.example` – Optional env vars.
- Integration tests: `apps/api/src/test/*.test.ts`, `apps/management-api/src/test/*.test.ts`.
- OpenAPI spec and any `docs/` or README sections for rate limiting.

## Verification

- Run `npm run test` (including integration tests) and ensure new rate-limit tests pass.
- Manually: exceed limit on login or signup and confirm 429 and message.
- Confirm no rate limiting on read-only endpoints (e.g. GET /me) unless intentionally added.
- Confirm management-api delete and create endpoints return 429 when over limit.
- Run lint and build; update OpenAPI and docs as per project conventions.
