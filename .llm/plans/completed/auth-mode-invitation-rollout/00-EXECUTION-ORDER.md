# Auth mode invitation rollout - Execution Order

Run phases sequentially. Inside a phase, run steps in order unless marked parallel.

## Plan location

All plan files are in `.llm/plans/active/auth-mode-invitation-rollout/`.

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope, matrix, dependencies, and decisions |
| [01-auth-capability-matrix-and-env-contract.md](01-auth-capability-matrix-and-env-contract.md) | Auth mode matrix and startup invariants |
| [02-api-auth-mode-enforcement.md](02-api-auth-mode-enforcement.md) | API auth route/controller behavior by mode |
| [03-management-api-invite-link-ttl-and-mode-rules.md](03-management-api-invite-link-ttl-and-mode-rules.md) | Management create-user invite behavior and TTL |
| [04-web-mode-aware-auth-surface.md](04-web-mode-aware-auth-surface.md) | Web auth page visibility/access by mode |
| [05-set-password-flow-extension-by-mode.md](05-set-password-flow-extension-by-mode.md) | Extend set-password invite completion fields |
| [06-openapi-docs-and-env-examples.md](06-openapi-docs-and-env-examples.md) | API/OpenAPI/docs/env docs updates |
| [07-api-integration-test-matrix.md](07-api-integration-test-matrix.md) | API + management-api integration matrix |
| [08-web-e2e-mode-matrix.md](08-web-e2e-mode-matrix.md) | Web E2E matrix and mode-specific runs |
| [COPY-PASTA.md](COPY-PASTA.md) | Copy-paste execution prompts |

## Phase 1: contract and API core

1. Run **01** first to lock the capability matrix and startup requirements.
2. Run **02** second to enforce matrix behavior in API auth routes/controllers.

## Phase 2: app surfaces (parallel)

After Phase 1 is complete, run these in parallel:

- **03** management-api invite link rules and TTL.
- **04** web auth surface visibility and access behavior.

Wait for both 03 and 04 to finish before Phase 3.

## Phase 3: invitation completion flow

3. Run **05** after 02 and 03 complete.

Reason: 05 relies on finalized mode capability rules and management invite behavior.

## Phase 4: tests (parallel)

After Phase 3 is complete, run these in parallel:

- **07** API integration test matrix.
- **08** web E2E matrix.

Wait for both test plans to finish before Phase 5.

## Phase 5: docs and contract publication

4. Run **06** last, after implementation and tests are green.

Reason: OpenAPI/docs/env examples should reflect final behavior and test-verified outcomes.

## Rules

- Do not implement outside the current numbered plan being executed.
- Keep behavior deterministic by mode; no dual-outcome tests.
- If a step changes endpoint behavior, update tests in the same plan step.
- Keep this plan set in `active/` during work, move to `completed/` when all files are done.
