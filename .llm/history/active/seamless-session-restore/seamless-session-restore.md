# Seamless session restore via SSR (no user-visible restore)

**Started:** 2026-03-02
**Context:** Plan: when access token is expired but refresh token is valid, server restores session in proxy; layout receives user via x-auth-user header so the user never sees a "session restore" or logged-out flash.

---

### Session 1 - 2026-03-02

#### Prompt (Developer)

Seamless session restore via SSR (no user-visible restore). Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Session restore runs in the **proxy** (Next.js 16 uses `proxy.ts` instead of deprecated `middleware.ts`). Standalone `middleware.ts` was removed and logic merged into existing `proxy.ts` for both web and management-web to avoid "Both middleware and proxy detected" build error.
- Web: `trySessionRestore()` in proxy calls GET /auth/me; on 401 calls POST /auth/refresh; on 200 copies Set-Cookie to response and sets request header `x-auth-user` with serialized user. Redirect logic treats `hasRestoredSession` as valid session so protected routes are not redirected to login after a successful restore.
- `getServerUser()` in both apps prefers `x-auth-user` header (parse + validate shape); falls back to cookies + /auth/me.
- Management-web: same flow using management API base URL and cookie names `management_session`, `management_refresh`.

#### Files Created/Modified

- **apps/web/src/proxy.ts** – Merged session-restore logic: `trySessionRestore()`, then existing redirect logic with `hasSession = request.cookies.has(SESSION_COOKIE_NAME) || hasRestoredSession`.
- **apps/web/src/lib/server-auth.ts** – Prefer `x-auth-user` header via `headers()`, `parseAuthUserHeader()`; fall back to cookies + /auth/me.
- **apps/management-web/src/proxy.ts** – Same merge: `trySessionRestore()` for management API, redirect logic with `hasRestoredSession`.
- **apps/management-web/src/lib/server-auth.ts** – Prefer `x-auth-user` header; fall back to getCookieHeader + /auth/me.
- **apps/web/src/middleware.ts** – Deleted (logic moved to proxy).
- **apps/management-web/src/middleware.ts** – Deleted (logic moved to proxy).

#### Notes

- Build passes. Lint/type-check fails on pre-existing `.next` validator references to b/[slug] routes (unrelated to this feature).
- Cookie names: web uses `session` / `refresh`; management-web uses `management_session` / `management_refresh` to match management-api .env.example.

### Session 2 - 2026-03-02

#### Prompt (Developer)

this should be handled i18n (referring to "← Back to bucket" link on public bucket submit page)

#### Key Decisions

- Added `buckets.backToBucket` in `apps/web` i18n (en-US: "← Back to bucket"; es: "← Volver al cubo"). Submit page already used `getTranslations('buckets')`; now uses `t('backToBucket')` for the link.
- Restored key parity for web es: added full `buckets` section and `common.profile` / `common.buckets` to originals and overrides so web i18n validate passes.

#### Files Created/Modified

- **apps/web/i18n/originals/en-US.json** – `buckets.backToBucket`.
- **apps/web/i18n/originals/es.json** – `buckets` section (with `backToBucket`) and `common.profile` / `common.buckets`.
- **apps/web/i18n/overrides/es.json** – `buckets` section and `common.profile` / `common.buckets`.
- **apps/web/src/app/(main)/b/[id]/submit/page.tsx** – Link text from `t('backToBucket')`.

### Session 3 - 2026-03-02

#### Prompt (Developer)

fetches like this should always use the helpers-requests / also, if you need a skill to help remind you of this pattern, create it. the pattern is to use helpers-requests AND the "req..." function pattern

#### Key Decisions

- All API calls from apps must use @boilerplate/helpers-requests with req... functions (reqFetch..., reqPost..., etc.), not raw fetch().
- Added reqPostPublicBucketMessage in packages/helpers-requests (web/buckets.ts) and PublicSubmitMessageBody type; PublicSubmitForm now uses webBuckets.reqPostPublicBucketMessage().
- Created project skill .cursor/skills/helpers-requests-req-pattern/SKILL.md to remind agents to use helpers-requests and the req... pattern when adding or changing API calls.

#### Files Created/Modified

- **packages/helpers-requests/src/types/bucket-types.ts** – PublicSubmitMessageBody type.
- **packages/helpers-requests/src/web/buckets.ts** – reqPostPublicBucketMessage().
- **packages/helpers-requests/src/types/index.ts**, **src/index.ts** – Export PublicSubmitMessageBody.
- **apps/web/src/app/(main)/b/[id]/submit/PublicSubmitForm.tsx** – Use webBuckets.reqPostPublicBucketMessage(); error from res.error.message.
- **.cursor/skills/helpers-requests-req-pattern/SKILL.md** – New skill (description, rules, examples).
