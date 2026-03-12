# 02 - Web E2E top-level suite title sweep

## Scope

Normalize top-level `test.describe(...)` titles in `apps/web/e2e` from verbose
`This suite verifies ...` sentences to concise natural phrases.

## Steps

1. Build affected list in `apps/web/e2e` by matching:
   - `test.describe('This suite verifies`
   - `test.describe("This suite verifies`
   - any equivalent top-level suite phrase that starts with `This suite verifies`.
2. For each affected file:
   - update only the first/top-level `test.describe(...)` title string;
   - keep role/page wording accurate;
   - do not alter nested describes, test titles, or step labels;
   - do not reorder imports/fixtures or touch non-title logic.
3. Skip files already using concise top-level titles.
4. Keep naming style natural and scannable, for example:
   - `Signup page for the unauthenticated user`
   - `Bucket settings page for the bucket-owner user`

## Key files

- `apps/web/e2e/*.spec.ts`

## Verification

- `apps/web/e2e` has zero remaining matches for:
  - `test.describe('This suite verifies`
  - `test.describe("This suite verifies`
- Spot-check at least 5 changed specs, including auth-mode variants.
- Confirm no nested/test/step text changed from verbose style.

## Deliverable

- All web E2E top-level suites use concise phrase titles consistently.
