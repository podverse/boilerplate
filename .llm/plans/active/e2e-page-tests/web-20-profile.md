# E2E: Web – Profile – Detailed Plan

## Route and objective

- **Route:** `(main)/profile`.
- **Objective:** Profile is redirect-only; verify single redirect to settings (or login when unauthenticated) with no loop.

## Selector strategy

- Use URL assertion: after `goto('/profile')`, expect `toHaveURL` containing `/settings` or `/login`.
- Optionally assert one stable element on destination (e.g. settings heading or login form).

## Assertion matrix

### Layout

- No dedicated profile layout; redirect only; no infinite redirect.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Visit /profile | Redirect to /settings (or /settings?tab=profile). |
| Unauthenticated | Visit /profile | Redirect to /login (or to settings then login). |
| Redirect target | Final URL | Settings or login; single redirect. |

### Values / display

- N/A (redirect-only).

### Interaction

- Single navigation to /profile → one redirect; no loop.
- Browser back: returns to previous page (e.g. dashboard).
- Accessibility: primary links (e.g. Settings) focusable; tab order reasonable.

## CRUD

- N/A.

## Edge / error states

- Same as settings for auth/session.

## Test data mapping

- Seeded user for authenticated case; no session for unauthenticated.

## Screenshot and trace checkpoints

- After redirect: "profile-redirect-to-settings" or "profile-redirect-to-login".

## Verification commands

- `make e2e_test_web`; profile spec or combined with settings.

## Implementation notes

- Spec: `apps/web/e2e/profile.spec.ts` or settings spec.
- Page: `apps/web/src/app/(main)/profile/page.tsx`.
- Test: two cases — authenticated → settings; unauthenticated → login.
