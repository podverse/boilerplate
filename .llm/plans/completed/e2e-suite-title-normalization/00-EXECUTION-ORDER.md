# E2E suite-title normalization - Execution order

Implement in phases so the scope stays manageable.

## Phase 1 (sequential)

1. `01-guidance-memory-updates.md`
2. `02-web-suite-title-sweep.md`

## Phase 2 (sequential)

3. `03-management-web-suite-title-sweep.md`
4. `04-validation-and-report-smoke.md`

## Notes

- Goal: top-level `test.describe(...)` titles are concise phrases.
- Keep verbose sentence style for nested `describe`, `test(...)`, and step labels.
- Apply uniformly to both `apps/web/e2e` and `apps/management-web/e2e`.
- During implementation, do not run E2E verification commands in-agent; provide exact
  user-run `make` commands in the final handoff.
