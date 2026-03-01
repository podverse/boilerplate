# Rate limiting plan (added to boilerplate plans)

**Started:** 2025-02-27  
**Context:** Add a plan to the boilerplate plans for basic rate limiting on critical endpoints.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

Add to the boilerplate plans a plan to add basic rate limiting to critical endpoints, especially
those That may have security or the ability to spam a database with write operations or delete
operations

#### Key Decisions

- Created a **new plan set** `rate-limiting-critical-endpoints` under `.llm/plans/active/` (not
  a new numbered file in the main boilerplate set) so the initiative is self-contained and
  executable independently.
- Plan targets apps/api (auth) and apps/management-api (auth, users, admins); calls out
  strict vs moderate limits and 429 + Retry-After + user-facing message.

#### Files Created/Modified

- `.llm/plans/active/rate-limiting-critical-endpoints/00-EXECUTION-ORDER.md`
- `.llm/plans/active/rate-limiting-critical-endpoints/00-SUMMARY.md`
- `.llm/plans/active/rate-limiting-critical-endpoints/01-rate-limiting-critical-endpoints.md`

---

### Session 2 - 2025-03-01

#### Prompt (Developer)

Implement the rate-limiting plan

#### Key Decisions

- Rate limit logic in new package `@boilerplate/helpers-backend-api` (reusable by api,
  management-api later). Uses express-rate-limit v7, key by IP + path so each endpoint has its own bucket.
- apps/api: strict (10/15min) on login, signup, forgot-password, reset-password, verify-email,
  request-email-change, confirm-email-change; moderate (30/15min) on change-password. GET /me and
  POST /logout not limited.
- Test setup sets RATE_LIMIT_STRICT_MAX=100 (and MODERATE=100) so existing auth tests don't hit
  limit; auth-rate-limit.test.ts sends strictLimit+1 requests to trigger 429.
- OpenAPI: 429 documented for all rate-limited auth endpoints. Docs in docs/api/RATE-LIMITING.md.

#### Files Created/Modified

- `packages/helpers-backend/` (new): package.json, tsconfig.json, src/rateLimit.ts, src/index.ts
- Root package.json: workspaces, build:packages, type-check include helpers-backend-api
- apps/api: package.json (dep + watch), config (rate limit env), middleware/rateLimit.ts,
  routes/auth.ts (apply limiters), .env.example, test/setup.ts, test/auth-rate-limit.test.ts,
  openapi.ts (429 responses)
- docs/api/RATE-LIMITING.md

---

### Session 9 - 2026-03-01

#### Prompt (Developer)

implement all the ones you recommend

#### Key Decisions

- Fixed `createSuperAdminForTest` to use `findByEmail` instead of `findSuperAdmin` so multiple test files can create their own super admin when running in parallel (pool: forks).
- New test file `management-admins-permissions.test.ts`: read-only, no-perm, permission-update (non-super-admin blocked), display-name uniqueness, super admin hidden from GET /admins/:id.
- New test file `management-users-permissions.test.ts`: read-only, no-perm, canChangePasswords, rate-limit on login.
- Expanded `management-api.test.ts`: logout cookie-clear, refresh (invalid token + valid cycle), auth 401 coverage for all admins/users routes, 404/409 for admins CRUD, full users CRUD with PATCH/DELETE/change-password + 404/409.
- Expanded `auth.test.ts`: logout clears cookies, refresh with invalid token, me via Bearer, change-password weak newPassword.
- Expanded `auth-mailer.test.ts`: signup missing fields/weak password/duplicate anti-enumeration, verify-email missing token, forgot-password missing/unknown anti-enumeration, reset-password weak password, request-email-change same email/conflict, confirm-email-change missing token.
- Expanded `auth-rate-limit.test.ts`: signup (strict), change-password (moderate), logout not limited.

#### Files Created/Modified

- `apps/management-api/src/test/createSuperAdminForTest.ts`
- `apps/management-api/src/test/management-api.test.ts`
- `apps/management-api/src/test/management-admins-permissions.test.ts` (new)
- `apps/management-api/src/test/management-users-permissions.test.ts` (new)
- `apps/api/src/test/auth.test.ts`
- `apps/api/src/test/auth-mailer.test.ts`
- `apps/api/src/test/auth-rate-limit.test.ts`

---

### Session 10 - 2026-03-01

#### Prompt (Agent)

Fix Test Failures

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Reverted `createSuperAdminForTest` to use `findSuperAdmin()` (any super admin check), wrapped the INSERT in try/catch so a parallel-process race on `idx_one_super_admin` is tolerated gracefully (recheck and return if another process succeeded).
- All three management-api test files now share the same fixed credentials: `test-super-admin@example.com` / `test-super-admin-password-1`.
- Fixed bitmask values: `CrudMask = { create: 1, read: 2, update: 4, delete: 8 }`. Read-only admins must use `adminsCrud: 2` / `usersCrud: 2`, not `1` (which means create-only).

#### Files Created/Modified

- `apps/management-api/src/test/createSuperAdminForTest.ts`
- `apps/management-api/src/test/management-api.test.ts`
- `apps/management-api/src/test/management-admins-permissions.test.ts`
- `apps/management-api/src/test/management-users-permissions.test.ts`

---

### Session 3 - 2025-03-01

#### Prompt (Developer)

Front-end rate limit modal — Implement the plan as specified. There should be front end handling for the endpoints that can potentially return rate limiting error responses. They should display a standardized modal component in that event that tells the user how long before they can take that action again.

#### Key Decisions

- Extended `ApiError` in helpers-requests with optional `retryAfterSeconds`; parse `Retry-After` header on 429 (integer seconds or HTTP-date).
- Added `RateLimitModal` in packages/ui (uses Modal, Stack, Text; i18n under ui.rateLimitModal).
- AuthContext login return type includes optional `rateLimit?: { retryAfterSeconds: number }` on failure; when status 429, pass through from res.error.
- Login, signup, forgot-password, reset-password pages: on 429 show RateLimitModal with retryAfterSeconds and do not set submitError.

#### Files Created/Modified

- packages/helpers-requests/src/request.ts (ApiError + Retry-After parsing)
- packages/ui: RateLimitModal.tsx, Modal index + main index exports
- apps/web/i18n/originals/en-US.json, es.json (ui.rateLimitModal)
- apps/web/src/context/AuthContext.tsx (login return type + 429 branch)
- apps/web/src/app/(auth)/login/page.tsx, signup/page.tsx, forgot-password/page.tsx, reset-password/page.tsx (modal state + RateLimitModal)
