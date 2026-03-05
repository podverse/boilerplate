# E2E: Web – Sign up

## Route

(auth)/signup.

## Layout conditions to test

- Signup form: email, password, confirm password (if present), display name (if present).
- Submit button; link to Log in.
- Validation messages for email format, password policy, match.
- Loading state on submit.
- Success: redirect to login or dashboard; or verification message.

## Auth / redirect conditions

- **Unauthenticated user:** Form visible; submit creates account (or returns 403 when signup disabled).
- **Valid submit:** Account created; redirect to login or "check email" or dashboard per app (e.g. when verification required → message; when not → login).
- **Already authenticated:** May redirect to dashboard; signup form not needed.
- **Signup disabled (e.g. no-mailer mode):** 403 from API; error message shown; no account created.

## Values / display conditions

- Validation: email format, password min length and rules, confirm password match.
- Success message or redirect target per app (verification email sent vs immediate login).
- Error from API: duplicate email, policy violation, or 403 message displayed.

## CRUD

- **Create (user):** Submit valid data → user and credentials created; verification token if mailer enabled.

## Functionality / interactions

- Required fields: email, password (and confirm); validation before or on submit.
- Password policy: length, complexity; error messages clear.
- Submit: loading state; success → redirect or message; failure → error.
- Log in link → login page.
- No double submit; button disabled during request. Double-click submit: only one account created.
- No password echoed in DOM, URL, or error message.

## Edge / error states

- Duplicate email: error message; form retained.
- 403 (signup disabled): clear message.
- Invalid email format: validation error.
- Password too weak: validation error.
- Network/API error: message; form retained.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Sign up with new email and valid password; assert success flow (and verification flow if applicable). Sign up with e2e@example.com (existing) → duplicate error.
