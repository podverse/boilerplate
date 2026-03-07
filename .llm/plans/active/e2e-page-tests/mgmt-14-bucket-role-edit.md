# E2E: Management-web – Bucket role edit

## Route

`(main)/bucket/[id]/settings/roles/[roleId]/edit`
(`/bucket/[id]/settings/roles/[roleId]/edit`)

## Scope (placeholder)

- Validate editing bucket role configuration for a selected role.
- Ensure role data is correctly scoped to both bucket and role ID params.

## Key scenarios

- Layout: role edit form pre-populated with expected values.
- Auth/permissions: restricted access for insufficiently privileged admins.
- CRUD: read existing values, update role values, validation on invalid inputs.
- Safety: cancel path preserves original values; destructive operations require confirmation if present.

## Key files for future implementation

- `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx`
- `apps/management-web/e2e/` bucket settings/roles spec(s)

## Verification notes

- Use seeded bucket and role IDs.
- Assert updates persist and are visible after refresh.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, assertion matrix, and screenshot checkpoints before writing tests.
