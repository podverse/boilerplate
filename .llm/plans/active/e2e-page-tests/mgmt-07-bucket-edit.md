# E2E: Management-web – Edit bucket (redirect)

## Route

(main)/bucket/[id]/edit.

## Layout conditions to test

- Page redirects to bucket settings; no dedicated edit layout or redirect only.
- No infinite redirect.

## Auth / redirect conditions

- **Authenticated admin:** Visiting /bucket/[id]/edit redirects to bucket settings (e.g. /bucket/[id]/settings).
- **Unauthenticated:** Redirect to login (from edit or from settings after redirect).
- **Invalid bucket id:** After redirect to settings, settings page may 404; or redirect handles invalid id.

## Values / display conditions

- N/A (redirect); after redirect, settings page shows bucket data.

## CRUD

- N/A for this route (redirect); actual edit on settings page.

## Functionality / interactions

- Single redirect from /bucket/[id]/edit to /bucket/[id]/settings.
- Then settings page behavior (see mgmt-08).

## Edge / error states

- Invalid id: notFound on settings or on redirect target.
- No permission: 403 on settings.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Visit edit URL with valid bucket id; assert redirect to settings and settings load.
