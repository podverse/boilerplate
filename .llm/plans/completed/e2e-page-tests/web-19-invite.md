# E2E: Web – Invite acceptance – Detailed Plan

## Route and objective

- **Route:** `(main)/invite/[token]`.
- **Objective:** Verify invitation load (bucket name, permissions), accept and reject flows, valid/invalid/expired token handling, unauthenticated login then accept; no token/password leak in UI.

## Selector strategy

- Invitation details: bucket name, permissions summary.
- Accept: `getByRole('button', { name: /accept/i })`.
- Reject: `getByRole('button', { name: /reject|decline/i })`.
- Login form (when unauthenticated): email, password, submit.
- Error message: "Invitation not found or no longer valid" or equivalent.
- Rate limit modal: when 429.

## Assertion matrix

### Layout

- Valid token: invitation details (bucket name, permissions); Accept and Reject buttons; or login form if unauthenticated.
- Invalid/expired: error message; no accept/reject.
- Loading state while fetching; no flash of wrong content.
- Main nav when logged in; minimal when not.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Valid token, unauthenticated | Load invite | Details and login prompt; after login accept/reject available. |
| Valid token, authenticated (invitee) | Load invite | Accept and Reject visible; accept adds user as bucket admin and redirect/success; reject declines and redirect/message. |
| Invalid token (malformed) | Load invite | Error "Invalid link" or equivalent; no accept/reject. |
| Expired or already-used token | Load invite | Error "not found or no longer valid"; no accept/reject. |
| Authenticated as different user | Load invite for another | Accept/reject applies to invitation for current user or appropriate error. |

### Values / display

- Bucket name and short_id (if shown) match invitation.
- Permission summary matches invitation.
- After accept: success or redirect to bucket; user appears as admin in bucket settings.
- After reject: success or redirect; invitation invalidated.
- No token or password in DOM or error message; token only in URL path.

### Interaction

- Accept: assert button disabled or shows loading during request; re-enables after success or error; success → redirect to bucket or success message; failure → error.
- Reject: assert button disabled or shows loading during request; re-enables after success or error; success → message or redirect; invitation no longer usable.
- Login (when shown): email/password; success → accept/reject available or auto-continue.
- Rate limit (429): modal with retry-after; no infinite retry.
- Link to bucket after accept → bucket detail with correct id.
- Accessibility: primary actions (Accept, Reject, login submit) focusable; tab order reasonable.

## CRUD

- **Read:** Invitation by token; displayed data matches API.
- **Update (accept):** Creates/updates bucket_admin; redirect or success.
- **Update (reject):** Invalidates invitation; no admin created.

## Edge / error states

- 404/410: "not found or no longer valid".
- Network error: "Failed to load invitation" or equivalent; retry possible.
- Empty token: "Invalid link".
- Double accept: second request fails; UI reflects already accepted.
- After accept or reject completes, revisiting the same invite URL shows the invalid/used-link state and does not render accept/reject actions again.
- Expired token: same as 404/410.

## Test data mapping

- **Valid token:** Create invitation via API or seed; use token for accept/reject.
- **Invalid/expired:** Use malformed token or expired/used token for error states.
- **Invitee:** e2e@example.com; after accept assert user in bucket admins.

## Screenshot and trace checkpoints

- Valid invite loaded: "invite-details-loaded".
- After accept: "invite-accept-success".
- After reject: "invite-reject-success".
- Invalid/expired: "invite-invalid-or-expired".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; invite spec.
- Requires way to create invitation (API or seed).

## Implementation notes

- Spec: `apps/web/e2e/invite.spec.ts`.
- Page: `apps/web/src/app/(main)/invite/[token]/page.tsx`.
- Test: valid accept; valid reject; invalid token; expired token; unauthenticated login then accept; double accept.
