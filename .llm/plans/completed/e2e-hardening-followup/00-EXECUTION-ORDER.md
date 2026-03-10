# E2E Hardening Follow-up Execution Order

## Phase 1 (Parallel)

- Run [01-web-e2e-false-pass-and-authz-contracts.md](./01-web-e2e-false-pass-and-authz-contracts.md)
- Run [02-management-web-e2e-authz-and-events-matrix.md](./02-management-web-e2e-authz-and-events-matrix.md)

Wait for both plans to complete before starting Phase 2.

## Phase 2 (Sequential)

- Run [03-shared-e2e-helper-selector-hardening.md](./03-shared-e2e-helper-selector-hardening.md)

## Verification Gate

After Phase 2:

- Run scoped report targets for changed web specs.
- Run scoped report targets for changed management-web specs.
- Run full report only if any shared helper or cross-suite contract changes were made.
