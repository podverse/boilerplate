# 02 - Recursive routing model

## Scope

Standardize URL construction/parsing for recursive bucket paths in private and public namespaces.

## Steps

1. Add path builders that accept ordered ancestry arrays.
2. Add path parsers/utilities to read ancestry from URL segments.
3. Remove topic-specific route helper APIs.
4. Update any pathname checks to use centralized helper methods.

## Key files

- `apps/web/src/lib/routes.ts`
- `apps/management-web/src/lib/routes.ts`
- `apps/web/src/lib/buckets.ts`
- `apps/web/src/app/(main)/bucket/[id]/settings/BucketSettingsLayoutClient.tsx`
- `apps/management-web/src/app/(main)/bucket/[id]/settings/BucketSettingsLayoutClient.tsx`

## Verification

- Helper tests for:
  - `bucket/<a>/bucket/<b>/bucket/<c>`
  - `b/<a>/b/<b>/b/<c>`
- No helper outputs `/topic` or `/t`.
