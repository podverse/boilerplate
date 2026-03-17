### Session 1 - 2026-03-16

#### Prompt (Developer)

Fix Bucket Admin List E2E Regression

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Confirmed `e2e_test_report` setup path is working; failure is from UI label assumptions after PII-safe bucket admin responses.
- Updated `formatUserLabel` fallback order to prefer `displayName` when `username` and `email` are absent.
- Added focused unit coverage for `formatUserLabel` in API Vitest suite to prevent regressions.
- Stabilized web E2E bucket-admin-edit assertions by targeting the known admin edit link for the seeded shortId instead of PII text.
- Added explicit 10s visibility waits for the three affected admins-list checks to reduce timing flake on navigation/render.

#### Files Modified

- .llm/history/active/bucket-admin-list-e2e-regression/bucket-admin-list-e2e-regression-part-01.md
- packages/helpers/src/userLabel.ts
- apps/api/src/test/user-label.test.ts
- apps/web/e2e/bucket-admin-edit-bucket-owner.spec.ts
