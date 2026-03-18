# 11 – CRUD permission helpers refactor

## Scope

Group CRUD permission helpers in a consistent way (similar to the existing bucket-policy
pattern) and consider introducing higher-order “can” functions to reduce duplication and improve
consistency. Current locations: `apps/api/src/lib/bucket-policy.ts` (canReadBucket,
canCreateBucket, canDeleteBucket, canCreateMessage, canDeleteMessage, etc.) and
`apps/web/src/lib/bucket-authz.ts` (canCreateBucketRoles, canEditBucketRoles,
canCreateChildBuckets, canEditBucketMessages). Refactor and update call sites while keeping
behavior identical.

## Steps

### 1. Map current helpers and call sites

- **API** (`apps/api/src/lib/bucket-policy.ts`): List every exported function (canReadBucket,
  canCreateBucket, canUpdateBucket, canDeleteBucket, canCreateMessage, canDeleteMessage, etc.)
  and their signatures. Grep for usages in `apps/api` (controllers, middleware, etc.).
- **Web** (`apps/web/src/lib/bucket-authz.ts`): List every exported function
  (canCreateBucketRoles, canEditBucketRoles, canCreateChildBuckets, canEditBucketMessages, etc.)
  and their signatures. Grep for usages in `apps/web` (pages, components, server actions, etc.).
- Document: which helpers exist, where they are called, and what parameters they take (e.g.
  userId, bucket, bucketAdmin, message).

### 2. Propose grouping and shared types

- Decide whether to keep two modules (api vs web) or introduce a shared package (e.g.
  `packages/helpers` or a small `packages/bucket-authz`) for types and pure policy logic that
  both API and web can use. Often API stays in apps/api (server-only) and web in apps/web
  (client/server); shared types can live in `packages/helpers` or `packages/orm`.
- Ensure bucket-policy and bucket-authz use the same terminology (e.g. CRUD bits, bucketAdmin,
  owner) and that types (Bucket, BucketAdmin, BucketMessage) are imported from a single
  source (e.g. `@boilerplate/orm`).

### 3. Consider higher-order “can” functions

- Review the current implementations: many “can” functions follow the pattern “if owner return
  true; else if bucketAdmin check bitmask; else return false.” Consider a higher-order
  factory, e.g.:
  - `makeCanCrud(bit)` that returns a function `(userId, bucket, bucketAdmin) => ...`, or
  - `withBucketPolicy(operation)` that takes a CRUD operation and returns the predicate.
- If the refactor reduces duplication and keeps readability, implement it; if the current
  explicit functions are clearer, document that and only group/organize. Do not change
  behavior (same return values for same inputs).

### 4. Refactor and update call sites

- Move or rename functions only as needed for grouping; update all call sites in API and web.
  Ensure imports point to the new locations. Keep function names stable at call sites if
  possible (e.g. still export canReadBucket, canCreateBucket from the same or new module).
- Run the full test suite (unit, integration, E2E) and fix any failures. Permission behavior
  must remain identical.

### 5. Verify

- All existing tests and E2E permission flows pass. No change to who can do what; only
  structure and possibly internal implementation changed.

## Key files

- `apps/api/src/lib/bucket-policy.ts`
- `apps/web/src/lib/bucket-authz.ts`
- `apps/api/src/controllers/bucketsController.ts`, `apps/api/src/controllers/bucketMessagesController.ts`
- `apps/web` pages and components that call bucket-authz (e.g. bucket detail, roles, messages)
- `packages/helpers` or `packages/orm` if shared types or CRUD_BITS are used

## Verification

- Permission behavior is unchanged; tests and E2E pass.
- Code is better grouped and optionally uses higher-order helpers; call sites are updated and
  imports correct.
