# E2E: Web – Short URL send message – Detailed Plan

## Route and objective

- **Route:** `(main)/b/[id]/send-message` — id is bucket short_id.
- **Objective:** Verify send-message form (sender, body, isPublic), submit persistence, redirect or success message; unauthenticated redirect or login prompt; invalid/private bucket 404 or redirect.

## Selector strategy

- Sender name: `getByLabel(/sender|name/i)`.
- Body: `getByLabel(/body|message/i)` or textarea.
- isPublic: checkbox or toggle if present.
- Submit: `getByRole('button', { name: /send|submit/i })`.
- Login link: if unauthenticated, link to login or inline login form.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: sender, body, optional isPublic; bucket context (name or short_id) visible.
- Submit button; login link or prompt when unauthenticated.
- Main nav minimal or present when logged in.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated, valid public bucket | Load /b/[shortId]/send-message | Form loads; submit allowed. |
| Unauthenticated | Load | Redirect to login (with returnUrl) or inline login; after login return to send-message. |
| Invalid or private bucket short_id | Load | notFound or redirect; form not visible. |

### Values / display

- Bucket name or short_id context visible.
- After success: message sent; redirect to /b/[id] or success message; new message visible in public view when public.

### Interaction

- Required fields: sender and body validated; empty submit shows errors.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); one send on double-click; success redirect or message.
- Body over bucket max length: submit button disabled or validation error shown; no submit until body within limit.
- Login then send: returnUrl preserves /b/[id]/send-message; after login form visible and submit works.
- Accessibility: primary actions (submit, login link) focusable; tab order reasonable.

## CRUD

- **Create (message):** Valid submit → message created in bucket; visible per isPublic.

## Edge / error states

- API error: error message; form retained.
- Invalid short_id: 404 or redirect.
- Private bucket: 404 or redirect to login.
- Rate limit (if applicable): message with retry-after.

## Test data mapping

- **Public bucket short_id:** From seed (e.g. e2ebucket00001).
- **Seeded user:** e2e@example.com for authenticated send.
- **New message:** Unique body; assert appears in /b/[id] when public or in bucket messages when logged in.

## Screenshot and trace checkpoints

- Form loaded: "short-send-message-form".
- After send: "short-send-message-success".
- Unauthenticated: "short-send-message-login-prompt".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; send-message spec.

## Implementation notes

- Spec: `apps/web/e2e/short-send-message.spec.ts`.
- Page: `apps/web/src/app/(main)/b/[id]/send-message/page.tsx`.
- Test: unauthenticated redirect or login flow; authenticated send; validation; invalid/private bucket.
