# E2E: Web – Create nested bucket from bucket detail

## Route

`(main)/bucket/[id]/bucket/new` (`/bucket/[id]/bucket/new`)

## Scope (placeholder)

- Validate nested child-bucket creation under an existing bucket context.
- Ensure route-specific behavior is distinct from `/bucket/[id]/new` where applicable.

## Key scenarios

- Layout: parent breadcrumb/context, form structure, action buttons.
- Auth/permissions: authenticated allowed path, unauthenticated redirect, denied access behavior.
- CRUD: create succeeds, validation failures block create, duplicate submit guarded.
- Post-submit: redirect and parent/child relationship visibility are correct.

## Key files for future implementation

- `apps/web/src/app/(main)/bucket/[id]/bucket/new/page.tsx`
- `apps/web/e2e/` bucket hierarchy coverage spec(s)

## Verification notes

- Use deterministic seed parent bucket.
- Verify created entity is shown as child of the intended parent.

## Detailed plan to be generated before implementation

- Produce implementation-grade selectors, assertions, and visual checkpoints before writing tests.
