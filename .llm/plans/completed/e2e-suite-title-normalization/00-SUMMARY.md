# E2E suite-title normalization - Summary

## Objective

Normalize top-level E2E suite titles so they are concise title-like phrases, while preserving
verbose sentence descriptions for behavior-level text.

## Why this is split

The affected set is large, and changing all specs in one pass is high-risk and hard to review.
This plan set decomposes work into memory/rules first, then app-by-app sweeps, then validation.

## Current baseline

- Total E2E specs in scope: `195`
  - `apps/web/e2e`: `96`
  - `apps/management-web/e2e`: `99`
- Top-level suites still matching `This suite verifies ...`: `179`
  - Web: `80`
  - Management-web: `99`
- Already concise top-level suites: `16`
  - Web: `16`
  - Management-web: `0`

### Baseline verification snapshot (2026-03-11)

- Spec totals are derived from `*.spec.ts` file counts in each E2E directory.
- Verbose-suite counts are derived from files matching top-level
  `test.describe('This suite verifies...')`/`test.describe("This suite verifies...")`.

## Conventions to enforce

- Top-level `test.describe(...)`: concise natural phrase.
- Nested `describe` blocks: readable full phrase/sentence.
- `test(...)` titles: verbose sentence style.
- Step labels (`capturePageLoad`, `actionAndCapture`, redirect helpers): verbose sentence style.

## Plan files

1. `01-guidance-memory-updates.md`
2. `02-web-suite-title-sweep.md`
3. `03-management-web-suite-title-sweep.md`
4. `04-validation-and-report-smoke.md`
5. `COPY-PASTA.md`

## Primary files expected during implementation

- `.cursor/skills/e2e-readability/SKILL.md`
- `.cursor/rules/` (focused rule file if needed for enforcement clarity)
- `apps/web/e2e/*.spec.ts`
- `apps/management-web/e2e/*.spec.ts`
- Optional: `.llm/history/active/...` entries per execution step
