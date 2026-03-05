# E2E: Web – Bucket settings

## Route

(main)/bucket/[id]/settings.

## Layout conditions to test

- Page title or heading indicates bucket settings.
- Settings form or sections visible (e.g. message body max length, or other bucket-level options).
- Link or section to manage admins (e.g. "Admins" list or link to add/edit admins).
- Back/cancel or link to bucket detail visible.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user with access (owner or bucket admin with update):** Settings load; edits allowed.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket id:** notFound (404).
- **Authenticated but no permission:** 403 or redirect; settings not editable (or read-only message).

## Values / display conditions

- Bucket name or breadcrumb matches current bucket.
- Current settings values (e.g. message body max length) match stored values; empty when null.
- Admins list: shows current bucket admins and owner; labels (e.g. "owner") correct.

## CRUD

- **Read:** Displayed settings and admins match API.
- **Update:** Changing settings and saving persists values; next load shows updated data.
- **Admin management:** Links to add/edit/remove admins; permission changes persist.

## Functionality / interactions

- Save/update button: submits form; loading state during request; success feedback or redirect.
- Double-click save: only one update; no duplicate request. Browser back after save: no duplicate submit.
- Validation: invalid values (e.g. negative max length) show error; no save.
- Admins link → bucket settings admins list or invite flow.
- Edit admin → (main)/bucket/[id]/settings/admins/[userId]/edit.
- Cancel/back → bucket detail without saving.

## Edge / error states

- API error on save: error message; form data retained.
- Permission denied: clear message or redirect; no 500.
- Invalid bucket id: notFound.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded bucket; assert owner and any default settings; test one update and verify persistence.
