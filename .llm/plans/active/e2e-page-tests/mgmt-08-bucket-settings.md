# E2E: Management-web – Bucket settings

## Route

(main)/bucket/[id]/settings.

## Layout conditions to test

- Bucket settings form/sections (e.g. message body max length).
- Admins section: list of admins, link to add/edit admins.
- Save and cancel/back; main nav visible.

## Auth / redirect conditions

- **Authenticated admin with bucket update permission:** Settings load; save allowed.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket id:** notFound (404).
- **No permission:** 403 or redirect.

## Values / display conditions

- Bucket name in context; current settings values pre-filled.
- Admins list: emails/names and roles; owner indicated.
- After save: values persist; next load shows updated data.

## CRUD

- **Read:** Settings and admins from API.
- **Update:** Save settings persists; admin add/edit/remove persists.

## Functionality / interactions

- Save: loading state; success feedback; validation on invalid values. Double-click save: only one update. Browser back after save: no duplicate submit.
- Admins link → list or invite; edit admin → /bucket/[id]/settings/admins/[userId]/edit.
- Cancel/back → bucket detail.

## Edge / error states

- API error on save: message; form retained.
- 404 for invalid bucket: notFound.
- Permission denied: 403.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded bucket; assert settings and admins; test one update round-trip.
