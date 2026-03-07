# E2E: Web – Bucket role create

## Route

`(main)/bucket/[id]/settings/roles/new` (`/bucket/[id]/settings/roles/new`)

## Scope (placeholder)

- Validate creating a role within bucket settings.
- Ensure role configuration and permission options persist correctly.

## Key scenarios

- Layout: role form, permission controls, save/cancel actions.
- Auth/permissions: only authorized users can access/create roles.
- CRUD: create role, validation handling, duplicate submission protection.
- Navigation: save returns to expected settings context; cancel preserves state expectations.

## Key files for future implementation

- `apps/web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx`
- `apps/web/src/app/(main)/bucket/[id]/settings/layout.tsx`
- `apps/web/e2e/` settings/roles spec(s)

## Verification notes

- Assert new role appears in roles/admin settings UI for the bucket.
- Include permission-scoped assertions for allowed vs denied users.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, permission matrix, CRUD matrix, and screenshot checkpoints before coding.
