# 05 - API contracts and guardrails

## Scope

Rewrite API contracts to bucket-only semantics and enforce descendant mutation constraints.

## Steps

1. Remove topic-oriented route shapes and params from APIs.
2. Normalize nested route parameter naming (`bucketId` convention).
3. Update Joi schemas and response contracts to bucket-only wording.
4. Add hard guards:
   - descendant cannot change owner/admin/settings.
   - descendant name update remains allowed.
5. Ensure permission checks resolve against effective root governance.

## Key files

- `apps/api/src/routes/buckets.ts`
- `apps/api/src/controllers/bucketsController.ts`
- `apps/api/src/schemas/buckets.ts`
- `apps/management-api/src/routes/buckets.ts`
- `apps/management-api/src/controllers/bucketsController.ts`
- `apps/management-api/src/schemas/buckets.ts`

## Verification

- API tests for accept/reject matrix:
  - root settings/admin mutations pass with permission.
  - descendant settings/admin mutations fail.
  - descendant name update succeeds.
