# 01 - Inheritance/governance foundation

## Scope

Implement root-scoped governance resolution for all bucket operations.

## Steps

1. Add/extend effective-bucket resolution helpers to compute top ancestor (`effectiveRootBucket`).
2. Route all owner/admin/settings permission checks through root-derived context.
3. Add mutation constraints:
   - root bucket: normal governance updates allowed.
   - descendant bucket: name-only updates allowed.
4. Ensure permission middleware/controllers use the same rule path.

## Key files

- `apps/api/src/lib/bucket-effective.ts`
- `apps/api/src/lib/bucket-policy.ts`
- `apps/management-api/src/lib/bucket-effective.ts`
- `apps/management-api/src/middleware/requireCrud.ts`
- `apps/management-api/src/controllers/bucketsController.ts`

## Verification

- Unit/integration checks for depth 2 and depth 3 descendants.
- Confirm descendant governance mutation attempts return clear 4xx errors.
