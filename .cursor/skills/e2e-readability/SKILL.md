---
name: e2e-readability
description: E2E specs use verbose complete sentences and explicit post-navigation verification; report keeps redirect-to-login summary-only and hides only non-validating navigation screenshots.
version: 1.0.0
---

# E2E Readability and Report Behavior

Use this skill when adding or editing E2E specs in `apps/web/e2e/` or `apps/management-web/e2e/`. Test descriptions and step labels should be clear, complete sentences that prefer verbosity for clarity over conciseness.

## Describe blocks

Use a **full-sentence** description of the feature or suite, not a short phrase.

- Good: "Creating a new child bucket under an existing bucket"
- Avoid: "Bucket child new"

## Test titles

Use **complete, verbose sentences**. Prefer "When … , they/he/she …" for readability.

- Good: "When an unauthenticated user tries to open the page to create a new child bucket, they are redirected to the login page."
- Good: "When an authenticated user opens the page to create a new child bucket, they see the create form with a name field and a submit button."
- Avoid: "unauthenticated user is redirected to login", "authenticated user sees child bucket create form"

## Step labels

Use **full sentences** for the third argument to `capturePageLoad`, `actionAndCapture`, and `expectUnauthedRouteRedirectsToLogin`, and keep compound terms consistent with titles.

- Good: "User navigates to the admin-edit-route for the seeded-bucket-owner's user id and sees not found."
- Good: "The bucket-admin-edit-form is visible for the seeded-bucket-admin."
- Avoid: mixing hyphenated compound terms in one section and space-separated terms in another for the same concept.

The reporter preserves step labels as authored, including hyphenated compound terms.

## Post-navigation verification (required)

Every navigation action in E2E tests must be followed by explicit verification that the destination loaded correctly.

- Applies to `page.goto(...)`, route-changing link/button clicks, and helper-driven navigation.
- After navigation, assert destination with at least one explicit check:
  - URL assertion (`toHaveURL(...)`), and/or
  - destination-specific element visibility (`toBeVisible()` on heading, form field, table, CTA, etc.).
- Do not rely only on "absence" assertions right after navigation (for example, only checking a value is missing). Add a positive destination-load assertion first.
- For shared helpers that navigate (for example login helpers), include the destination-load verification inside the helper.

## Redirect-to-login tests

Tests that assert an unauthenticated user is redirected to the login page appear **only in the Test summary** at the top of the E2E HTML report; they are not shown in the "Screenshots and step descriptions" section (to avoid repetitive content). When adding such tests, use a title that clearly indicates redirect to login (e.g. contains "redirected to the login page") so the reporter keeps them summary-only.

## Navigation screenshot filtering in report

The reporter hides **image only** (not step text) for navigation-only, non-validating steps when the same test has a later validation/evidence step.

- Keep the step row and authored step description visible in the report.
- Hide only the screenshot image for navigation-only setup steps.
- Keep screenshots for validation/evidence steps.
- This uses step-label patterns plus same-test local context to avoid over-filtering.
- Redirect-to-login summary-only behavior remains unchanged.

## Error-state screenshot ordering (required)

When a test step expects an error-like result (validation error, invalid credentials, not found, invalid token, or unauth redirect), capture screenshots only after that outcome is verified.

- For `actionAndCapture(...)`, place error-like assertions inside the callback so capture happens after verification.
- For helper wrappers (for example invalid-route and unauth-redirect helpers), verify the expected error-like state inside the wrapped callback before the screenshot is taken.
- Acceptable post-action verification includes:
  - explicit error/validation/not-found text visibility,
  - redirect target verification plus destination UI evidence (for example login form fields).
- Avoid taking screenshots immediately after navigation or submit when the expected error-like state has not yet been asserted.

## User context in reports

Every test that has a defined user (unauthenticated or a specific role) should set the **user-role** annotation so the E2E HTML report shows **User context** for that test. Call `setE2EUserContext(testInfo, description)` at the start of each test (from `./helpers/userContext`). Use consistent descriptions: `unauthenticated`, `super-admin (full CRUD)` (management-web), `seeded-bucket-owner`, `seeded-bucket-admin (bucket CRUD)` (web). The report then shows "User context: <description>" in each test section and in the summary, so readers can see which CRUD permissions are in effect.

## Seeded user role naming

When a test refers to a **specific seeded user role**, use consistent names so "user" vs "seeded owner user" is unambiguous:

- **seeded-bucket-owner** — the seeded user who owns the bucket (web: e2e@example.com). In code/comments: `seededBucketOwner`.
- **seeded-bucket-admin** — the seeded user who is a bucket admin but not the owner (web: e2e-admin2@example.com). In code/comments: `seededBucketAdmin`.
- **seeded-super-admin** — management-web: e2e-superadmin. In code/comments: `seededSuperAdmin`.

Avoid "seeded owner user" (prefer seeded-bucket-owner) and "seeded non-owner admin" (prefer seeded-bucket-admin) so the role is clear.

## Hyphens for compound concepts in titles and step labels

In **test titles and step labels**, use **hyphens between words** for compound terms that represent one thing. Joining words that refer to a single concept (routes, pages, forms, seeded identities) makes it clearer what is being asserted when reading the report.

- Apply this consistently across **all** specs in both `apps/web/e2e` and `apps/management-web/e2e`.
- **Routes:** admin-edit-route, bucket-admin-edit-route (not "admin edit route" with spaces).
- **Pages:** bucket-admin-edit-page, admin-edit-page (not "bucket admin edit page").
- **Forms:** bucket-admin-edit-form (not "bucket admin edit form").
- **Seeded identities:** seeded-bucket-owner, seeded-bucket-admin, seeded-super-admin (not "seeded bucket owner").
- **Other single concepts:** bucket-admin-permissions when referring to one thing.

Example: "When the user opens the admin-edit-route with the seeded-bucket-owner's user id, they see not found." In variable names and constant comments in code, use camelCase (e.g. `seededBucketOwner`).

## Screenshot shows verified element

When a step documents verification of a **specific element** (e.g. a row, form, or control state), pass that element to the capture helper so the screenshot is taken with it vertically centered. See the **e2e-screenshot-verified-element** skill.

## Reference

See [apps/web/e2e/bucket-nested-new.spec.ts](apps/web/e2e/bucket-nested-new.spec.ts) for the canonical pattern. Reporter logic: [scripts/e2e-html-steps-reporter.ts](scripts/e2e-html-steps-reporter.ts) (`isRedirectToLoginTest`).
