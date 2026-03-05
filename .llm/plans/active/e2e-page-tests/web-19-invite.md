# E2E: Web – Invite acceptance

## Route

(main)/invite/[token].

## Layout conditions to test

- When token valid and not expired: invitation details (bucket name, permissions summary); Accept and Reject buttons; or login form if unauthenticated.
- When invalid/expired: error message (e.g. "Invitation not found or no longer valid"); no accept/reject.
- Loading state while fetching invitation; no flash of wrong content.
- Rate limit modal (if shown) when too many requests.
- Main nav when logged in; minimal when not.

## Auth / redirect conditions

- **Valid token, unauthenticated:** Invitation details and login form or prompt to log in; after login, accept/reject available.
- **Valid token, authenticated (invitee):** Accept and Reject visible; accept adds user as bucket admin and redirects or shows success; reject declines and redirects or shows message.
- **Invalid token (malformed, wrong format):** Error message (e.g. "Invalid link"); no accept/reject.
- **Expired or already-used token (404/410):** Error message (e.g. "not found or no longer valid"); no accept/reject.
- **Authenticated as different user:** Invitation for another user; accept/reject applies to that invitation for current user or appropriate error.

## Values / display conditions

- Bucket name and short_id (if shown) match invitation.
- Permission summary (bucket CRUD, message CRUD) matches invitation payload.
- After accept: success message or redirect to bucket; user appears as admin in bucket settings.
- After reject: success message or redirect; invitation invalidated.
- After accept: user can perform actions per granted CRUD (e.g. open bucket settings, view/edit messages) without extra prompts.
- No password or invite token echoed in DOM or error messages; token only in URL path where required.

## CRUD

- **Read:** Invitation fetched by token; displayed data matches API.
- **Update (accept):** POST accept creates/updates bucket_admin; redirect or success.
- **Update (reject):** POST reject invalidates invitation; no admin created.

## Functionality / interactions

- Accept: loading state; API success → redirect to bucket or success message; failure → error message.
- Reject: loading state; API success → message or redirect; invitation no longer usable.
- Login (when shown): email/password; success → then accept/reject available or auto-continue.
- Rate limit: modal with retry-after when API returns 429; no infinite retry loop.
- Link to bucket (after accept): navigates to bucket detail with correct id.

## Edge / error states

- 404/410 from API: clear "not found or no longer valid" (or translated) message.
- Network error: "Failed to load invitation" or equivalent; retry possible.
- Empty token in URL: "Invalid link" or equivalent.
- Double accept: second request fails gracefully; UI reflects already accepted.
- Expired token: same as 404/410 handling.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Create an invitation via API or seed; use valid token for accept/reject flow; use invalid and expired tokens for error states.
