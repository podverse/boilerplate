# E2E: Management-web – Create bucket

## Route

(main)/buckets/new.

## Layout conditions to test

- Form: bucket name, owner (if selectable), isPublic or other options.
- Submit and cancel/back buttons; main nav visible.

## Auth / redirect conditions

- **Authenticated admin with buckets create:** Form loads; submit allowed.
- **Unauthenticated:** Redirect to login.
- **No create permission:** 403 or redirect; form not shown.

## Values / display conditions

- Defaults (e.g. isPublic) match app.
- After create: redirect to bucket list or detail; new bucket appears with submitted values and correct owner.

## CRUD

- **Create:** Valid submit → bucket created in main DB via management API; redirect; new bucket in list.

## Functionality / interactions

- Required field (name) validated; owner selection if present.
- Submit: loading state; success redirect; no double submit. Double-click submit: only one bucket created. Browser back after submit: no duplicate create.
- Cancel → buckets list.
- Validation errors shown; form retained on error.

## Edge / error states

- API error: message; form retained.
- Duplicate or validation failure: error message.
- Permission denied: 403 or redirect.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Create bucket with known name; assert it appears in list and has correct owner.
