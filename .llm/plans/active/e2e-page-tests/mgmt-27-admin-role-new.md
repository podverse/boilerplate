# E2E: Management-web – Admin role create

## Route

`(main)/admins/roles/new` (`/admins/roles/new`)

## Scope (placeholder)

- Validate creation of admin roles and associated permissions.
- Confirm role is usable by downstream admin create/edit workflows.

## Key scenarios

- Layout: admin role form and permission controls render correctly.
- Auth/permissions: route is restricted to authorized admin role managers.
- CRUD: create role, validation handling, duplicate submit protection.
- Navigation: successful save returns to expected admin-role context.

## Key files for future implementation

- `apps/management-web/src/app/(main)/admins/roles/new/page.tsx`
- `apps/management-web/e2e/` admin roles/admin management spec(s)

## Verification notes

- Assert newly created admin role appears where role options are managed/selected.
- Include permission visibility assertions for scoped admins.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, permission matrix, CRUD matrix, and screenshot checkpoints before coding.
