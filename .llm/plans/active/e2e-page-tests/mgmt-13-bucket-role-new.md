# E2E: Management-web – Bucket role create

## Route

`(main)/bucket/[id]/settings/roles/new` (`/bucket/[id]/settings/roles/new`)

## Scope (placeholder)

- Validate creating bucket-scoped roles in management settings.
- Verify role permissions and visibility behavior after creation.

## Key scenarios

- Layout: role form fields and permission controls are visible and usable.
- Auth/permissions: only authorized admins can create roles.
- CRUD: create role, handle validation errors, prevent duplicate submissions.
- Navigation: save/cancel routes preserve expected settings context.

## Key files for future implementation

- `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx`
- `apps/management-web/e2e/` bucket settings/roles spec(s)

## Verification notes

- Validate role appears in roles list/detail UI after save.
- Include scoped-admin vs super-admin behavior where relevant.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, CRUD matrix, permission matrix, and screenshot checkpoints before coding.
