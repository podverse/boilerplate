# 03 - Management-web E2E top-level suite title sweep

## Scope

Normalize top-level `test.describe(...)` titles in `apps/management-web/e2e` from verbose
`This suite verifies ...` sentences to concise natural phrases.

## Steps

1. Build affected list in `apps/management-web/e2e` by matching:
   - `test.describe('This suite verifies`
   - `test.describe("This suite verifies`
   - any equivalent top-level suite phrase that starts with `This suite verifies`.
2. For each affected file:
   - update only the first/top-level `test.describe(...)` title string;
   - preserve role/permission context in concise form;
   - do not alter nested describes, test titles, or step labels;
   - do not reorder imports/fixtures or touch non-title logic.
3. Keep titles short but specific enough to distinguish similar suites.

## Key files

- `apps/management-web/e2e/*.spec.ts`

## Verification

- `apps/management-web/e2e` has zero remaining matches for
  `test.describe('This suite verifies` and `test.describe("This suite verifies`.
- Spot-check at least 5 changed specs that include permission-matrix cases.
- Confirm nested/test/step text remains verbose sentence-style.

## Deliverable

- All management-web E2E top-level suites use concise phrase titles consistently.
