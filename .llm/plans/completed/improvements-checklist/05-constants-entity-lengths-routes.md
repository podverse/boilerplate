# 05 – Constants: entity lengths and routes

## Scope

Extract magic numbers and string literals into named constants: (1) schema/migration version
numbers if any exist, (2) route/path usage in API and management-api so they use constants where
appropriate, (3) entity column lengths (e.g. short_id length 12, token length 64, status length 20)
in ORM entities and in validation schemas that mirror them. Web app already has `ROUTES` in
`apps/web/src/lib/routes.ts`; keep that and align API/management-api if needed.

## Steps

### 1. Schema/migration version numbers

- Search the repo for schema or migration version numbers (e.g. numeric version in migrations,
  version in schema validation). If any magic numbers appear, introduce constants (e.g.
  `CURRENT_SCHEMA_VERSION` or `CURRENT_MIGRATION`) in a single place and use them everywhere.

### 2. API and management-api route/path constants

- Review `apps/api/src/routes/` and `apps/management-api/src/routes/` for path strings (e.g.
  `/auth/login`, `/buckets`, `/users`). If the same path is repeated or used for redirects/docs,
  consider a shared route/path constant file (e.g. `apps/api/src/lib/routes.ts`) and use it in
  route definitions and any code that builds URLs.
- Ensure route names or path segments used in tests match these constants so changes are in one
  place. Do not duplicate web’s `ROUTES`; API can have its own minimal set for server-side paths.

### 3. Entity column length constants

- In `packages/orm` (or `packages/helpers` if lengths are shared with validation), define
  constants for:
  - Short ID length (e.g. `SHORT_ID_LENGTH = 12`) used in User, Bucket, etc.
  - Invitation/token length (e.g. `INVITATION_TOKEN_LENGTH = 64`) if used in entities.
  - Status or enum-like varchar length (e.g. `STATUS_LENGTH = 20`) where applicable.
- Replace magic numbers in ORM entities:
  - `packages/orm/src/entities/User.ts` (short_id length 12)
  - `packages/orm/src/entities/Bucket.ts` (short_id length 12)
  - `packages/orm/src/entities/BucketAdminInvitation.ts` (e.g. token 64, status 20)
- Ensure validation schemas (Joi/Zod) that mirror these lengths use the same constants—e.g. in
  `apps/api/src/schemas/` and `apps/management-api/src/schemas/`—so DB and API stay in sync.

### 4. Export and use

- Add new constants in the same module as existing length exports (e.g. where
  `EMAIL_MAX_LENGTH` lives in `packages/helpers`) so ORM and schemas can import from one place.
- Export length constants from `packages/helpers` (or orm) so both ORM and apps can import them.
- Update all entities and schemas that reference these lengths; run tests and migrations (if any)
  to confirm nothing breaks.

### 5. Verify

- Grep for raw numbers `12`, `64`, `20` in entity and schema files; only constants should remain
  where they represent these lengths.
- Route/path constants used in API/management-api where you decided to add them.
- `npm run build` and relevant tests pass.

## Key files

- `packages/orm/src/entities/User.ts`
- `packages/orm/src/entities/Bucket.ts`
- `packages/orm/src/entities/BucketAdminInvitation.ts`
- `packages/helpers` (length exports, e.g. existing `EMAIL_MAX_LENGTH`, `USERNAME_MAX_LENGTH`)
- `apps/api/src/routes/`, `apps/management-api/src/routes/`
- `apps/api/src/schemas/`, `apps/management-api/src/schemas/`
- `apps/web/src/lib/routes.ts` (reference only; already has ROUTES)

## Verification

- No magic numbers for entity/schema lengths in entities and validation schemas; constants used.
- Route/path constants used in API and management-api where introduced.
- Build and tests pass; migrations (if any) still valid.
