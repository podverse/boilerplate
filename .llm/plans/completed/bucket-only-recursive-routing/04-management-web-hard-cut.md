# 04 - Management-web hard cut

## Scope

Apply the same topic removal and recursive bucket routing model to `apps/management-web`.

## Steps

1. Remove management-web `topic` route trees.
2. Replace topic pages/components with nested-bucket equivalents.
3. Update links, tab navigation, and breadcrumbs to ancestry helpers.
4. Enforce governance UI rules:
   - root bucket: normal admin/settings controls.
   - descendant bucket: name-only editable.

## Key files

- `apps/management-web/src/app/(main)/bucket/[id]/topic/**`
- `apps/management-web/src/app/(main)/bucket/[id]/messages/**`
- `apps/management-web/src/components/buckets/BucketForm.tsx`
- `apps/management-web/src/components/buckets/BucketMessagesClient.tsx`
- `apps/management-web/src/lib/routes.ts`

## Verification

- Depth-3 nested route navigation works.
- No management-web links use `/topic`.
- Descendant bucket settings/admin mutation UI is blocked.
