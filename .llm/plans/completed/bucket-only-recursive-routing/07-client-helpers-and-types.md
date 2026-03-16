# 07 - Client helpers and shared types

## Scope

Update request helpers and shared types to bucket-chain-first semantics with no topic artifacts.

## Steps

1. Replace helper signatures that take parent/topic pairs with ancestry-oriented inputs.
2. Update management-web and web helper exports to new naming.
3. Align role/admin/bucket types with root-governed semantics where exposed.
4. Remove dead helper exports and update all call sites.

## Key files

- `packages/helpers-requests/src/web/buckets.ts`
- `packages/helpers-requests/src/management-web/bucketRoles.ts`
- `packages/helpers-requests/src/types/management-admin-types.ts`
- `packages/helpers-requests/src/index.ts`
- `packages/helpers/src/index.ts`

## Verification

- Type check across all apps/packages with no lingering topic helper imports.
- Runtime calls hit bucket-only endpoints with expected params.
