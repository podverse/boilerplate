# E2E: Web – Bucket role edit

## Route

`(main)/bucket/[id]/settings/roles/[roleId]/edit`
(`/bucket/[id]/settings/roles/[roleId]/edit`)

## Scope (placeholder)

- Validate role edit behavior, including update and optional delete flow if present.
- Confirm scoped role data loads correctly from route params.

## Key scenarios

- Layout: role details/form render correctly for selected `roleId`.
- Auth/permissions: unauthorized users are blocked or redirected.
- CRUD: read existing role values, update values, validation on invalid updates.
- Safety: cancel leaves unchanged values; destructive actions (if present) require confirmation.

## Key files for future implementation

- `apps/web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx`
- `apps/web/e2e/` settings/roles spec(s)

## Verification notes

- Use seeded role and bucket IDs.
- Assert edited values persist in UI after reload/navigation.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, assertions, and screenshot checkpoints before writing tests.
