# E2E: Management-web – Create user

## Route

(main)/users/new.

## Layout conditions to test

- Form: email, password, display name (or equivalent); submit and cancel.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with users create:** Form loads; submit allowed.
- **Unauthenticated:** Redirect to login.
- **No create permission:** 403 or redirect.

## Values / display conditions

- After create: redirect to user list or user detail; new user appears with submitted email/name.
- Validation: email format, password policy, display name length.

## CRUD

- **Create:** Valid submit → user created in main DB via management API; redirect; new user in list.

## Functionality / interactions

- Required fields (email, password) validated; display name optional or required per app.
- Password policy: length, complexity; validation errors shown.
- Submit: loading state; success redirect; no double submit. Double-click submit: only one user created. Browser back after submit: no duplicate create. No password echoed in DOM or error message.
- Cancel → users list.
- Duplicate email: error message; form retained.

## Edge / error states

- API error: message; form retained.
- Duplicate email: error message.
- Invalid email format: validation error.
- Permission denied: 403.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Create user with unique email and valid password; assert user appears in list and can log in to main app.
