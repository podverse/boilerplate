# E2E: Web – Dashboard – Detailed Plan

## Route and objective

- **Route:** `(main)/dashboard`.
- **Objective:** Verify authenticated dashboard shows correct user identity, main nav, and no layout shift; unauthenticated users redirect to login.

## Selector strategy

- Heading: `getByRole('heading', { name: /dashboard/i })`.
- User identity: text or region containing display name or email (e.g. "e2e@example.com", "E2E User").
- Nav: `getByRole('navigation')` and links (Buckets, Profile, Settings, Log out).
- Avoid asserting on raw "Hello" only; pair with user identity for deterministic value.

## Assertion matrix

### Layout

- Initial load: wait for greeting/content or loading to settle before asserting.
- Page heading "Dashboard" (or translation) visible.
- Section with greeting and signed-in user identity (display name or email).
- Main app nav visible; authenticated state (no login link in nav; logout or profile present).
- No layout shift or missing sections when data loads.
- No duplicate headings or broken layout.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Load /dashboard | Dashboard loads; heading and user identity visible. |
| Unauthenticated | Load /dashboard | Redirect to /login; dashboard content not visible. |
| After login | Login then land on dashboard | Redirect lands on /dashboard with correct user info. |
| Session expired | Load dashboard with expired session | Redirect to login on load or next navigation. |

### Values / display

- Greeting uses display name from seed when present (e.g. "E2E User"); fallback to email (e.g. "e2e@example.com").
- "Signed in as" or equivalent shows authenticated user's email or display name.
- Title/heading matches translation.

### Interaction

- Nav links (Buckets, Profile, Settings, Log out) present and clickable.
- Click Buckets → /buckets; Profile → /profile (or /settings); Settings → /settings; Log out → session cleared and redirect to login.
- No duplicate or broken links; keyboard navigation to primary links.
- Accessibility: primary actions (nav links) focusable; tab order reasonable.

## CRUD

- N/A (read-only summary).

## Edge / error states

- Expired session: redirect to login on refresh or next navigation.
- API failure loading user: error message or redirect; no uncaught exception.

## Test data mapping

- **Seeded user:** e2e@example.com / Test!1Aa; display name "E2E User" if set in seed.
- Login before visiting dashboard; assert displayed name/email match seed.

## Screenshot and trace checkpoints

- Dashboard loaded: "dashboard-with-user-identity".
- After login redirect: "dashboard-after-login".
- On failure: trace and screenshot at assertion.

## Verification commands

- `make e2e_test_web`; dashboard spec or smoke that includes login → dashboard.

## Implementation notes

- Spec: `apps/web/e2e/dashboard.spec.ts` (existing home/dashboard smoke).
- Page: `apps/web/src/app/(main)/dashboard/page.tsx`.
- Test: unauthenticated redirect; authenticated load with correct user display; nav links work.
