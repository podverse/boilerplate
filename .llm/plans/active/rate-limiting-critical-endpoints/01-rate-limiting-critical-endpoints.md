# Plan 01: Rate limiting for critical endpoints

## Scope

Implement basic rate limiting for critical endpoints in **apps/api only**, prioritising
security-sensitive and write operations. Keep the implementation minimal and consistent with
the rest of the boilerplate (e.g. env-driven, testable).

## Goals

- Reduce brute-force and credential-stuffing on login and password-reset flows.
- Reduce signup and verification-token spam (DB writes).
- Return 429 with a clear, user-facing message and optional Retry-After when limited.

## Steps

### 1. Choose strategy and dependency

- **Option A (simple):** Use `express-rate-limit` with in-memory store. Good for single-instance
  or dev; multiple instances will each have their own window.
- **Option B (multi-instance):** Use a store backed by Valkey (e.g. `rate-limit-redis` with
  Valkey-compatible client). Requires Valkey already in use (boilerplate has Valkey for
  messages).
- Decide per-app config (e.g. `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`). Use separate
  limits for “strict” (login, signup, forgot-password, reset-password, verify-email,
  request-email-change, confirm-email-change) vs “moderate” (change-password). Defaults: strict
  10 per 15 min per IP, moderate 30 per 15 min per IP.

### 2. Add shared rate limit helpers package (backend-only)

- **New package:** Create `packages/helpers-backend` so rate-limiting logic can be reused by
  `apps/api`, and in future by `apps/management-api` or other APIs. Rate limiting is
  backend-only (Express middleware, Node), so a dedicated backend helpers package is
  appropriate.
- Add the package to root `package.json` workspaces and to the build order (e.g.
  `build:packages` so it is built before apps that depend on it).
- **In `packages/helpers-backend`:** Install `express-rate-limit` (and optionally
  Valkey-backed store). Export a middleware factory (e.g. `createRateLimiter(options)`) that:
  - Accepts options: `windowMs`, `max`, and optional store. Key by IP (and optionally by
    endpoint for per-route limits).
  - On limit exceeded: respond with 429, JSON body with a clear message (e.g. “Too many
    requests. Please try again later.”), and set `Retry-After` header if the library
    supports it.
- Export presets or helpers for “strict” and “moderate” limits (defaults: 10/15 min and
  30/15 min) so apps can use `createStrictRateLimiter(options?)` and
  `createModerateRateLimiter(options?)` without duplicating logic.
- Publish no app-specific config from this package; each app passes in its own config
  (e.g. from env).

### 3. Use rate limit middleware in apps/api

- Add dependency on `@boilerplate/helpers-backend` in `apps/api`.
- In `apps/api`, create a thin wrapper or use the helpers directly (e.g. in
  `apps/api/src/middleware/rateLimit.ts` or in the auth router): read env (e.g.
  `RATE_LIMIT_STRICT_MAX`, `RATE_LIMIT_STRICT_WINDOW_MS`, `RATE_LIMIT_MODERATE_*`), pass to
  the shared factory, and mount the returned middleware on the auth routes.
- Document required/optional env vars in `apps/api` (e.g. in README or env.example) and
  in startup validation if limits are required for production.

### 4. Apply to critical routes (apps/api)

- **Strict limit** (default 10 per 15 min per IP): `POST /auth/login`, `POST /auth/signup`,
  `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/verify-email`,
  `POST /auth/request-email-change`, `POST /auth/confirm-email-change`.
- **Moderate limit** (default 30 per 15 min per IP): `POST /auth/change-password`.
- **Do not rate limit:** GET /auth/me (read-only; not a bot abuse vector), POST /auth/logout
  (low impact). Mount middleware on the auth router or on specific routes so only the
  endpoints above are limited.
- If the app has other write/delete routes (e.g. messages), add them to the “moderate” or
  “strict” list as appropriate.

### 5. Tests

- **apps/api:** Add at least one integration test: e.g. send more than the allowed requests
  to a strict endpoint (e.g. `POST /auth/login` or `POST /auth/forgot-password`) and expect
  429 with the chosen message. Reset or use a fresh limiter per test so tests are
  deterministic.
- If limits are configurable via env, consider a test that uses a very low limit (e.g. 1
  request per window) to trigger 429 quickly.

### 6. Documentation and alignment

- Update OpenAPI spec (and any API docs) to document 429 responses for rate-limited
  endpoints (see swagger-openapi skill).
- Document rate limiting in the main docs (e.g. README or `docs/`): which endpoints are
  limited, how limits are keyed (IP), and how to configure (env vars). Mention Retry-After
  if used.
- If boilerplate aligns with Podverse patterns, consider a shared rate-limit message or
  helper (see Podverse rate-limit-message skill) so 429 bodies are consistent.

## Key files

- `packages/helpers-backend/` – New package: `package.json`, rate limit middleware factory
  (e.g. `src/rateLimit.ts` exporting `createRateLimiter`, `createStrictRateLimiter`,
  `createModerateRateLimiter`). Holds `express-rate-limit` (and optional Valkey store)
  dependency so any API (api, management-api, or future) can reuse it.
- Root `package.json` – Add `packages/helpers-backend` to workspaces; ensure build order
  includes it before apps.
- `apps/api/package.json` – Add dependency on `@boilerplate/helpers-backend` (no direct
  rate-limit dependency in app).
- `apps/api/src/middleware/rateLimit.ts` (or equivalent) – Thin wrapper that reads env and
  calls shared factory from `@boilerplate/helpers-backend`.
- `apps/api/src/routes/auth.ts` – Apply rate limit middleware to auth routes.
- `apps/api/.env.example` – Optional env vars for rate limits.
- Integration tests: `apps/api/src/test/*.test.ts`.
- OpenAPI spec and any `docs/` or README sections for rate limiting.

## Verification

- Build `@boilerplate/helpers-backend` (and ensure it is in the workspace build order).
- Run `npm run test` (including integration tests) and ensure new rate-limit tests pass.
- Manually: exceed limit on login or signup and confirm 429 and message.
- Confirm no rate limiting on GET /auth/me or POST /auth/logout.
- Run lint and build; update OpenAPI and docs as per project conventions.
