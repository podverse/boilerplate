# Rate limiting critical endpoints – Summary

## Scope

Add **basic rate limiting** to critical API endpoints to reduce:

- **Security abuse**: brute-force login, credential stuffing, token guessing (e.g. reset-password,
  verify-email, confirm-email-change).
- **Write spam**: signup spam and other endpoints that perform database writes.

Focus on endpoints that are unauthenticated or that perform sensitive operations. Read-heavy or
idempotent endpoints are not rate limited.

Rate-limiting logic lives in a **shared helpers package** (`packages/helpers-backend`) so it can
be reused by management-api or other APIs in future; only apps/api applies it in this plan.

## Target apps

- **apps/api** – Main API (auth, and any future write/delete routes such as messages).

Rate limiting is **not** applied to management-api.

## Critical endpoints (rate limited)

### apps/api (auth only)

| Tier     | Default limit | Window | Endpoints |
| -------- | ------------- | ------ | --------- |
| Strict   | 10 req        | 15 min | POST /auth/login, /auth/signup, /auth/forgot-password, /auth/reset-password, /auth/verify-email, /auth/request-email-change, /auth/confirm-email-change |
| Moderate | 30 req        | 15 min | POST /auth/change-password |

**Not rate limited:** GET /auth/me, POST /auth/logout, and all non-auth routes (unless added
later). GET /me is read-only and not a typical bot target; POST /logout is low impact.

## Plan files

| ID | File | Description |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Phase order and pointers |
| – | 00-SUMMARY.md | This file |
| 01 | 01-rate-limiting-critical-endpoints.md | Implementation: middleware, apply to API, tests, docs |

## Dependency map

- **01** has no plan dependencies; requires existing `apps/api` routes. Implementation adds a
  new workspace package `packages/helpers-backend` (rate limit middleware factory) used by
  apps/api; (optional) Valkey if using a store-backed limiter.

## Decisions (to be recorded during implementation)

- Rate limit strategy: in-memory (e.g. express-rate-limit) vs Valkey-backed for multi-instance.
- Limits per endpoint or tier (e.g. strict for login/signup/reset, looser for change-password).
- Key: IP only vs IP + endpoint vs (when authenticated) user id.
- Response: 429 status, Retry-After header, and user-facing message (see Podverse rate-limit
  skill if aligning with that repo).
- Env: whether limits are configurable via env (e.g. RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX).
- Shared package: rate limit middleware lives in `@boilerplate/helpers-backend` for reuse by
  api, management-api, or other APIs later.
