# 03 – API tokens shared types, i18n, skill, and docs

## Scope

Add shared CRUD/permission types and main API resource list so the API and web apps stay
aligned; add i18n keys for the API token settings UI; add a Cursor skill for maintaining
token-aware routes; and add user-facing and developer documentation.

**Key files:**

- `packages/helpers/src/` – CRUD types and constants; main API resources
- `apps/web/i18n/`, `apps/management-web/i18n/`, `packages/ui` – i18n keys
- `.cursor/skills/api-tokens/SKILL.md`
- `docs/api/API-TOKENS.md`
- `AGENTS.md` (optional update)

---

## Step 1: Shared CRUD and permission types

1. **Option A – In @boilerplate/helpers:**
   - Add a module (e.g. `packages/helpers/src/crud/permissions.ts` or
     `packages/helpers/src/api-tokens/crud.ts`) that defines:
     - `CrudMask = { create: 1, read: 2, update: 4, delete: 8 } as const`
     - `CrudOp = keyof typeof CrudMask` (type)
     - `hasCrud(crud: number, op: CrudOp): boolean` – same logic as
       `packages/management-orm` (bitwise AND). This keeps helpers free of management-orm
       dependency while mirroring the convention.
   - Export from `packages/helpers/src/index.ts`.

2. **Option B – Re-export from management-orm:**
   - If `@boilerplate/helpers` must not duplicate logic and can depend on
     `@boilerplate/management-orm`, re-export CrudOp, CrudMask, hasCrud from helpers (and
     document that main API token permissions align with management API). Watch for
     circular dependencies (orm → helpers; management-orm → helpers; helpers → management-orm
     may be acceptable if management-orm does not depend on helpers in a way that pulls in
     api-token code). Prefer Option A if circular dependency is an issue.

3. **Main API resources:**
   - In helpers (or a dedicated file), define the list of main API resources that can be
     permission-scoped, e.g. `MAIN_API_RESOURCES = ['me', 'auth']` as const. Export type
     `MainApiResource` (union of those literals). Use in apps/api (middleware, validation)
     and in apps/web (permission form) so resource names stay in sync.

---

## Step 2: i18n keys for API tokens

1. **Where keys live (recommended):** Add keys to **apps/web and apps/management-web only**
   (e.g. under `settings.apiTokens` in each app’s `i18n/originals/en-US.json`). **Apps pass
   translated strings as props** to the UI components (e.g. `title`, `copyTokenLabel`,
   `storeTokenWarning`). **Do not add api-token keys to packages/ui/I18N-KEYS.md** — the UI
   package does not render these strings directly; it receives them as props. This avoids
   duplicate keys and keeps the UI package independent of app namespaces. Follow existing
   i18n pattern (see .cursor/skills/i18n/SKILL.md).

2. **Suggested keys (examples; adjust to existing key style):**
   - `apiTokens.title` – “API tokens”
   - `apiTokens.create` – “Create token”
   - `apiTokens.name` – “Name”
   - `apiTokens.namePlaceholder` – placeholder for name input
   - `apiTokens.expiration` – “Expiration”
   - `apiTokens.permissions` – “Permissions”
   - `apiTokens.createPermission` – “Create”
   - `apiTokens.readPermission` – “Read”
   - `apiTokens.updatePermission` – “Update”
   - `apiTokens.deletePermission` – “Delete”
   - `apiTokens.resourceMe` – “Me (profile)”
   - `apiTokens.resourceAuth` – “Auth (password, email)”
   - `apiTokens.copyToken` – “Copy token”
   - `apiTokens.copyTokenSuccess` – “Copied”
   - `apiTokens.storeTokenWarning` – “Copy this token now; it won’t be shown again.”
   - `apiTokens.revoke` – “Revoke”
   - `apiTokens.confirmRevoke` – “Are you sure you want to revoke this token?”
   - `apiTokens.emptyList` – “No API tokens yet.”
   - `apiTokens.createButton` – “Create token”
   - (Add any missing for expiration picker, errors, etc.)

3. Add overrides for non–en-US locales as per project process (e.g. es.json overrides).

4. Apps pass labels and messages into UI components via props (e.g. `t('settings.apiTokens.title')`
   or `t('apiTokens.copyToken')` from the app’s namespace). No changes to packages/ui/I18N-KEYS.md
   are required when using the props approach.

---

## Step 3: Cursor skill – api-tokens

1. Create `.cursor/skills/api-tokens/SKILL.md` (or equivalent path per project skills
   layout).

2. **Content (summary):**
   - **When to use:** When adding or changing API routes that should be callable with API
     tokens (Bearer token that is not a JWT).
   - **Steps:**
     - Register the route’s **resource** and **CRUD op** (e.g. resource `me`, op `read`).
     - Use the combined requireAuth + requireApiTokenResource(resource, op) middleware so
       that JWT gets full access and API token requests are checked against
       req.apiTokenPermissions.
     - Update the **OpenAPI** spec to document that the endpoint accepts Bearer (JWT or
       API token) and, when using an API token, requires the stated resource + op.
     - If a new resource is introduced, add it to MAIN_API_RESOURCES in helpers and to the
       permission form resources list in the UI.
   - **Convention:** Main API token permissions use the same CrudOp and bitmask as the
     management API (create=1, read=2, update=4, delete=8). Document route → resource + op
     in code or in docs/api/API-TOKENS.md.

3. Keep the skill short and actionable (~1 page).

---

## Step 4: Documentation – API-TOKENS.md

1. Create `docs/api/API-TOKENS.md` (or `docs/API-TOKENS.md` if there is no api subdir).
   Follow documentation-conventions skill for file naming.

2. **Sections:**
   - **Overview:** API tokens let users call the main API programmatically with
     `Authorization: Bearer <token>` without using the same session/cookie flow as the
     website. Tokens are created and revoked from the user’s settings page.
   - **Creating and revoking tokens:** Users go to Settings → API tokens; they set a name
     (max 50 characters, per `SHORT_TEXT_MAX_LENGTH`), expiration, and permissions
     (Create/Read/Update/Delete per resource). The raw token is shown only once with a copy
     button; they must store it securely. They can revoke tokens from the same page.
   - **Using a token:** Send `Authorization: Bearer <token>` on each request. The token
     has resource-scoped CRUD permissions; the API returns 403 if the token does not have
     the required permission for the route.
   - **Permission model:** List main API resources (e.g. `me`, `auth`) and what they cover
     (e.g. GET/PATCH me → `me`; change-password, request-email-change → `auth`). Explain
     CRUD bits (create, read, update, delete) and that they mirror the management API
     convention.
   - **Security:** Treat the token like a password; store it securely; do not commit it to
     source control or expose it in client-side code if the client is public. Revoke
     tokens that may be compromised.

3. Link from main API or developer docs index if one exists.

---

## Step 5: AGENTS.md update (optional)

1. In AGENTS.md, add a short bullet or subsection under “Where to Find Things” or “Critical
   Rules”:
   - API tokens: users create/revoke from settings; tokens use resource-scoped CRUD
     permissions; see docs/api/API-TOKENS.md and .cursor/skills/api-tokens when adding
     token-aware routes.

2. If the repo has an “LLM alignment” or “When you change X, update Y” section, add:
   - When adding or changing API routes that support API token auth, update the
     route→resource+op mapping and OpenAPI; use the api-tokens skill.

---

## Verification

- Helpers (or shared package) export CrudOp, CrudMask, hasCrud, MAIN_API_RESOURCES, and
  MainApiResource type; apps/api and apps/web can import them.
- i18n keys exist and are used (or passed) by the API token UI components.
- Skill file exists and describes when and how to add token-aware routes.
- API-TOKENS.md exists and covers create/revoke, usage, permission model, and security.
- AGENTS.md updated if desired.
