# 01 – API tokens backend

## Scope

Implement the database schema, ORM entity and service, main API auth middleware (JWT or API
token), permission-check middleware, and API routes for creating, listing, and revoking API
tokens. Align CRUD permissioning with management API conventions (CrudOp, bitmask).

**Prerequisites:** Phase 1 complete (shared CRUD/permission types and main API resource list in
`@boilerplate/helpers` or equivalent; see 03).

**Key files:**

- `infra/database/combined/` – init/migration SQL
- `packages/orm/` – ApiToken entity, ApiTokenService
- `apps/api/src/` – middleware, routes, controller, schemas, openapi

---

## Step 1: Database schema

1. Add a new migration or append to combined init script in `infra/database/combined/`.

2. Create table `api_token` (singular, snake_case per database-schema-naming skill):
   - `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - `user_id` UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
   - `name` varchar_short NOT NULL (from existing domain; e.g. 50 chars)
   - `token_hash` varchar_token_hash UNIQUE NOT NULL (existing domain, 64-char hex)
   - `expires_at` TIMESTAMP NOT NULL
   - `permissions` JSONB NOT NULL (e.g. default '{}'; structure: `{ "me": 2, "auth": 6 }`)
   - `created_at` server_time_with_default NOT NULL
   - `updated_at` server_time_with_default NOT NULL

3. Add trigger for `updated_at` using existing `set_updated_at_field()`.

4. Create indexes:
   - UNIQUE on `token_hash` (if not already implied by UNIQUE constraint)
   - INDEX on `user_id`
   - INDEX on `expires_at` (for cleanup or expiry checks)

5. Regenerate or document combined migration per repo script (e.g.
   `scripts/database/combine-migrations.sh` if present).

---

## Step 2: ORM entity and constants

1. In `packages/orm`:
   - Create entity `ApiToken` in `src/entities/ApiToken.ts`.
   - Map all columns with `name` for snake_case (e.g. `user_id`, `token_hash`, `expires_at`,
     `created_at`, `updated_at`). Use `@CreateDateColumn` / `@UpdateDateColumn` or manual
     columns as per existing entities.
   - Relation: ManyToOne to User (or reference User entity); JoinColumn `user_id`.
   - Use `TOKEN_HASH_HEX_LENGTH` and existing helpers for column lengths; permissions as
     `Record<string, number>` or appropriate type (JSONB).

2. Register entity in data source (e.g. `packages/orm/src/data-source.ts` or equivalent).

3. Export ApiToken and any new types from `packages/orm/src/index.ts`.

---

## Step 3: ApiTokenService

1. Create `packages/orm/src/services/ApiTokenService.ts` (or equivalent path).

2. **Token generation (internal):**
   - Generate raw token: e.g. prefix `bp_` + 32 bytes random (crypto.randomBytes) encoded as
     hex (64 chars). Full token string is shown once to the user.
   - Hash: SHA-256 of the raw token string, hex-encoded (64 chars); store only the hash.

3. **Methods:**
   - `create(userId: string, name: string, expiresAt: Date, permissions: Record<string, number>): Promise<{ apiToken: ApiToken; rawToken: string }>`
     - Generate raw token and hash; insert row with token_hash, name, expires_at, permissions,
       user_id; return entity and rawToken (caller uses rawToken only in create response).
   - `findByTokenHash(tokenHash: string): Promise<ApiToken | null>` – include user relation
     for loading req.user.
   - `listByUserId(userId: string): Promise<ApiToken[]>` – return id, name, expires_at,
     created_at (no token_hash); order by created_at desc.
   - `revoke(id: string, userId: string): Promise<boolean>` – delete only if user_id matches;
     return true if deleted, false if not found or not owner.

4. Export ApiTokenService from `packages/orm/src/index.ts`.

---

## Step 4: Main API – auth middleware (JWT or API token)

1. Refactor or extend `apps/api/src/middleware/requireAuth.ts` (or create a new middleware
   used by the app) so that:
   - Read `Authorization: Bearer <value>`.
   - If no token or empty: 401.
   - **If value looks like a JWT** (e.g. three base64 parts separated by dots): use existing
     JWT verify logic; on success set `req.user` and call `next()`. Optionally set
     `req.authMethod = 'jwt'` so permission middleware can treat JWT as full access.
   - **Else** (opaque token): treat as API token:
     - Hash the value with SHA-256 (hex). Look up by token hash via ApiTokenService.
     - If not found or expired (`expires_at <= now`): 401.
     - Load user via token’s user_id; set `req.user` and `req.apiTokenPermissions =
       token.permissions` (and e.g. `req.authMethod = 'api_token'`). Call `next()`.

2. Ensure `req.apiTokenPermissions` is typed (e.g. `Record<string, number> | undefined`) in
   `apps/api/src/types/express.d.ts`.

---

## Step 5: Permission-check middleware

1. Create middleware (e.g. `requireApiTokenResource(resource: MainApiResource, op: CrudOp)`):
   - If `req.authMethod === 'jwt'` (or `req.apiTokenPermissions` is undefined): allow (full
     access for session/JWT).
   - Else: get `crud = req.apiTokenPermissions[resource]`; if missing or not number, 403.
   - Use `hasCrud(crud, op)` (from helpers or management-orm) to check; if false, 403.
   - On pass, call `next()`.

2. Use shared CrudOp and hasCrud from `@boilerplate/helpers` (or re-export from
   management-orm if no circular deps). Main API resource type should match the list defined
   in Phase 1 (e.g. `me`, `auth`).

---

## Step 6: Route → resource mapping

1. Document and implement mapping for existing auth routes:
   - `GET /auth/me` → resource `me`, op `read`.
   - `PATCH /auth/change-password` (or POST) → resource `auth`, op `update`.
   - `POST /auth/request-email-change` → resource `auth`, op `update` (or create,
     depending on convention).
   - Any other protected auth route: assign resource + op.

2. Apply `requireAuth` then `requireApiTokenResource(resource, op)` to each protected route
   that should honor token permissions. Routes that only accept JWT (e.g. token management)
   can use requireAuth and then check `req.authMethod !== 'api_token'` if you want to
   restrict token management to session only (recommended: only JWT can create/list/revoke
   tokens).

---

## Step 7: API routes for token management

1. **POST /v1/auth/api-tokens** (or under existing auth router):
   - Require auth (requireAuth). Optionally require `req.authMethod === 'jwt'` so only
     session users can create tokens (recommended).
   - Validate body: name (string, max length), expiresAt (ISO date, future), permissions
     (object, keys = main API resources, values = number 0–15). Schema in
     `apps/api/src/schemas/` (e.g. createApiTokenSchema).
   - Call ApiTokenService.create(req.user.id, name, expiresAt, permissions). Return
     `{ token: rawToken, name, expiresAt }` (status 201). Never store or log rawToken.

2. **GET /v1/auth/api-tokens**:
   - Require auth (requireAuth); optionally JWT-only.
   - Call ApiTokenService.listByUserId(req.user.id). Return `{ tokens: [{ id, name,
     expiresAt, createdAt }] }` (no token field).

3. **DELETE /v1/auth/api-tokens/:id**:
   - Require auth (requireAuth); optionally JWT-only.
   - Call ApiTokenService.revoke(id, req.user.id). If false, 404. Else 204.

4. Mount these routes on the existing auth router or versioned router (see
   `apps/api/src/app.ts`).

---

## Step 8: Validation and OpenAPI

1. Add request body schemas for create (name, expiresAt, permissions). Use existing
   validateBody pattern and Joi or equivalent.

2. Update `apps/api/src/openapi.ts`: document security (Bearer JWT or API token), document
   POST/GET/DELETE api-tokens endpoints, and document that API tokens have resource-scoped
   CRUD permissions; list which routes require which resource+op when using an API token.

---

## Step 9: Tests

1. Integration tests (e.g. in `apps/api/src/test/`):
   - Create token (with JWT); response includes token, name, expiresAt; token is not in list
     response.
   - List tokens; only own tokens; no raw token in list.
   - Revoke token; then Bearer with that token returns 401.
   - Use API token with only `me` read: GET /auth/me succeeds; change-password (auth
     update) returns 403.
   - Use API token with `auth` update: change-password succeeds (if applicable).

2. Follow existing test patterns (supertest, app factory, test DB). Ensure test DB has
   api_token table (migration or init run in test setup).

---

## Verification

- Table `api_token` exists; ORM can create and query.
- Creating a token via API returns raw token once; list does not include it.
- Revoked token returns 401 when used as Bearer.
- JWT still works for all protected routes. API token with only read on `me` can call GET
  /auth/me but not change-password; with auth update can call change-password.
- OpenAPI and validation are updated; tests pass.
