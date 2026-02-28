# Rate limiting critical endpoints – Summary

## Scope

Add **basic rate limiting** to critical API endpoints to reduce:

- **Security abuse**: brute-force login, credential stuffing, token guessing (e.g. reset-password,
  verify-email, confirm-email-change).
- **Write/delete spam**: signup spam, bulk user/admin creation or deletion, or other endpoints
  that perform database writes or deletes.

Focus on endpoints that are unauthenticated or that perform sensitive or high-impact operations.
Read-heavy or idempotent endpoints can be treated with looser limits or deferred.

## Target apps

- **apps/api** – Main API (auth, and any future write/delete routes such as messages).
- **apps/management-api** – Management API (auth, users CRUD, admins CRUD).

## Critical endpoints (candidates for rate limiting)

### apps/api (auth)

- `POST /login` – Brute force / credential stuffing.
- `POST /signup` – Signup spam (user/DB writes).
- `POST /verify-email` – Token guessing.
- `POST /forgot-password` – Email enumeration / token spam.
- `POST /reset-password` – Token guessing.
- `POST /request-email-change` – Spam (writes).
- `POST /confirm-email-change` – Token guessing.
- `POST /change-password` – Brute force (after auth).
- `POST /logout` – Lower risk; can use same global auth limit or skip.
- `GET /me` – Read-only; optional stricter limit per IP or user.

### apps/management-api

- `POST /auth/login` – Brute force.
- `POST /users` – Create user (write).
- `PATCH /users/:id` – Update user (write).
- `DELETE /users/:id` – Delete user (high impact).
- `POST /admins` – Create admin (write).
- `PATCH /admins/:id` – Update admin (write).
- `DELETE /admins/:id` – Delete admin (high impact).
- `POST /admins/change-password` – Sensitive write.

## Plan files

| ID | File | Description |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Phase order and pointers |
| – | 00-SUMMARY.md | This file |
| 01 | 01-rate-limiting-critical-endpoints.md | Implementation: middleware, apply to APIs, tests, docs |

## Dependency map

- **01** has no plan dependencies; requires existing `apps/api` and `apps/management-api` routes
  and (optional) Valkey if using a store-backed limiter.

## Decisions (to be recorded during implementation)

- Rate limit strategy: in-memory (e.g. express-rate-limit) vs Valkey-backed for multi-instance.
- Limits per endpoint or tier (e.g. strict for login/signup/reset, looser for change-password).
- Key: IP only vs IP + endpoint vs (when authenticated) user id.
- Response: 429 status, Retry-After header, and user-facing message (see Podverse rate-limit
  skill if aligning with that repo).
- Env: whether limits are configurable via env (e.g. RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX).
