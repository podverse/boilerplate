# 04 - Validation and report smoke check

## Scope

Validate that title normalization is complete with static checks, then hand off exact
user-run report commands to confirm readability.

## Steps

1. Run static search checks:
   - no `test.describe('This suite verifies` left in web E2E specs;
   - no `test.describe("This suite verifies` left in web E2E specs;
   - no `test.describe('This suite verifies` left in management-web E2E specs.
   - no `test.describe("This suite verifies` left in management-web E2E specs.
2. Confirm expected behavior boundaries:
   - top-level suite titles concise;
   - nested/test/step labels still verbose.
3. Do not run E2E test/report commands during this implementation pass.
4. Add a handoff note with exact user-run `make` command(s) for:
   - one representative changed web spec (`make e2e_test_web_report_spec SPEC=...`);
   - one representative changed management-web spec
     (`make e2e_test_management_web_report_spec SPEC=...`);
   - optional broader scoped follow-up when many files changed
     (`make e2e_test_report_scoped WEB_SPEC=... MGMT_SPEC=...`).
5. If reporter grouping might be ambiguous with concise titles, capture examples from static
   inspection and propose a reporter-only follow-up plan (out of scope unless requested).

## Key files

- `scripts/e2e-html-steps-reporter.ts` (behavior check only unless follow-up requested)
- `apps/web/e2e/*.spec.ts`
- `apps/management-web/e2e/*.spec.ts`

## Verification

- Pattern checks return zero verbose top-level suite matches.
- Final implementation response includes exact user-run `make` verification commands.

## Deliverable

- Normalization complete with regression confidence on report readability.
