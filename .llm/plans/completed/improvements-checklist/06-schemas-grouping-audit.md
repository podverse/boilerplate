# 06 – Schemas grouping audit

## Scope

Confirm that all validation and DTO schemas (e.g. Joi, Zod) are grouped in a single place per app
and that there are no ad-hoc schema definitions in controllers or routes. Document the layout; move
or add index re-exports only if schemas are scattered.

## Steps

### 1. List schema locations

- **API**: List every file under `apps/api/src/schemas/` and any other file in `apps/api` that
  defines a Joi (or other) schema. Note what each schema is used for (auth, buckets, etc.).
- **Management API**: Same for `apps/management-api/src/schemas/` and any schema defined
  elsewhere in that app.
- **Packages**: Check `packages/helpers`, `packages/helpers-requests`, and any other package for
  schema definitions (e.g. shared validation). Document where they live.

### 2. Confirm no ad-hoc schemas in controllers/routes

- Search `apps/api/src/` and `apps/management-api/src/` for inline Joi.object, Joi.string, etc.,
  or for schema construction inside controllers or route handlers. If any are found, move the
  schema definition to the appropriate file under `apps/*/src/schemas/` and import it where used.

### 3. Document and optionally add index

- Document in a short comment or doc: “Validation schemas live in `apps/api/src/schemas/` and
  `apps/management-api/src/schemas/`. Shared request/response types may live in
  `packages/helpers-requests` or `packages/helpers`.”
- If schemas are in multiple files but there is no index, add `index.ts` (or equivalent) that
  re-exports all schemas from the app’s schemas directory so consumers can import from a single
  path if desired. Do not break existing imports; add index as a convenience.

### 4. Verify

- No schema definitions remain in controllers or route files; they only import from schemas (or
  shared packages).
- Build and tests pass; OpenAPI or other generated docs still reflect the same validation.

## Key files

- `apps/api/src/schemas/` (auth, buckets, etc.)
- `apps/management-api/src/schemas/` (auth, admins, buckets, messages, users, events, etc.)
- `apps/api/src/controllers/`, `apps/api/src/routes/`
- `apps/management-api/src/controllers/`, `apps/management-api/src/routes/`
- Any package that exports validation-related types or schemas

## Verification

- Single documented home per app for validation schemas; no stray definitions in controllers/routes.
- Optional: index file for each app’s schemas directory.
- Build and tests pass.
