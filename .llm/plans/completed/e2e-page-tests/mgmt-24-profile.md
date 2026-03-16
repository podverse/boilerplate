# E2E: Management-web – Profile – Detailed Plan

## Route and objective

- **Route:** `(main)/profile`.
- **Objective:** Verify `/profile` performs a single redirect to `/settings`; unauthenticated access redirects to `/login`; no dedicated standalone profile content is asserted.

## Selector strategy

- Redirect target URL (`/settings`) and one stable settings-page element after redirect.

## Assertion matrix

### Layout

- Single redirect to `/settings` (or `/login` when unauthenticated); no loop.
- No dedicated `/profile` content should be asserted before or after redirect.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Visit /profile | Single redirect to `/settings`; settings page loads. |
| Unauthenticated | Visit /profile | Redirect to /login. |

### Values / display

- Redirect target belongs to the logged-in admin context.

### Interaction

- Single navigation; no loop.
- Redirect target is `/settings`; further profile edits are covered by the settings plan.
- Accessibility: primary links (e.g. Settings) focusable; tab order reasonable.

## CRUD

- N/A for `/profile`; updates occur on `/settings`.

## Edge / error states

- Session expiry: redirect to login.

## Test data mapping

- Seeded super admin for authenticated case.

## Screenshot and trace checkpoints

- After redirect to settings: "mgmt-profile-redirected-to-settings".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; profile spec.

## Implementation notes

- Spec: `apps/management-web/e2e/profile.spec.ts`.
- Page: `apps/management-web/src/app/(main)/profile/page.tsx`.
- This route should be treated as redirect-only; the dedicated settings plan covers the rendered form.
