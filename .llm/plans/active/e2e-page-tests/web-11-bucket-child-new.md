# E2E: Web – Create child bucket (inline)

## Route

`(main)/bucket/[id]/new` (`/bucket/[id]/new`)

## Scope (placeholder)

- Validate the create-child-bucket flow launched from a specific parent bucket.
- Confirm parent context is visible and correct.
- Cover success, validation error, and cancel navigation.

## Key scenarios

- Layout: heading, parent context, form fields, primary/secondary actions.
- Auth/permissions: unauthenticated redirect, insufficient permissions handling.
- CRUD: create child bucket once, reject invalid payload, no duplicate create on double submit.
- Navigation: submit redirect target is correct; cancel/back returns to parent context safely.

## Key files for future implementation

- `apps/web/src/app/(main)/bucket/[id]/new/page.tsx`
- `apps/web/e2e/` (new or existing bucket-create spec)

## Verification notes

- Use deterministic seed parent bucket IDs from E2E seed scripts.
- Assert newly created child is visible in the parent bucket UI.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, assertions, state matrix, and screenshot checkpoints before coding this page test.
