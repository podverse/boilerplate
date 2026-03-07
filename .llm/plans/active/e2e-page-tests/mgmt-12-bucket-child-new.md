# E2E: Management-web – Create child bucket

## Route

`(main)/bucket/[id]/new` (`/bucket/[id]/new`)

## Scope (placeholder)

- Validate child bucket creation from a specific parent bucket in management-web.
- Ensure permissions and parent scoping are enforced.

## Key scenarios

- Layout: parent context, create form, save/cancel actions.
- Auth/permissions: unauthenticated redirect; permission denied for scoped admins without access.
- CRUD: successful create, validation errors, duplicate submit prevention.
- Navigation: post-create destination and parent-child visibility are correct.

## Key files for future implementation

- `apps/management-web/src/app/(main)/bucket/[id]/new/page.tsx`
- `apps/management-web/e2e/` bucket CRUD spec(s)

## Verification notes

- Use deterministic seed parent bucket IDs.
- Assert created child is visible under the intended parent bucket.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, permission matrix, assertions, and screenshot checkpoints before coding.
