# Auth mode invitation rollout - Copy-Pasta prompts

## Execution rules

- Phases are sequential. Do not start next phase until current phase is complete.
- In parallel phases, start only after all prior sequential steps are done.
- For each prompt below, paste it to an agent and let it execute fully before continuing.

## Phase 1 (sequential)

### Agent 1A - Capability matrix and env contract

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/01-auth-capability-matrix-and-env-contract.md`.
Implement exactly that plan, update related tests when required by the plan, and report changes.

### Agent 1B - API mode enforcement (after 1A)

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/02-api-auth-mode-enforcement.md`.
Implement exactly that plan, keep outcomes deterministic by mode, and report verification results.

## Phase 2 (parallel after Phase 1)

Run 2A and 2B in parallel. Wait for both to finish.

### Agent 2A - Management invite TTL and mode rules

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/03-management-api-invite-link-ttl-and-mode-rules.md`.
Implement exactly that plan, including env validation and integration tests.

### Agent 2B - Web mode-aware auth surface

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/04-web-mode-aware-auth-surface.md`.
Implement exactly that plan, including E2E updates for changed behavior.

## Phase 3 (sequential)

### Agent 3 - Set-password flow extension by mode

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/05-set-password-flow-extension-by-mode.md`.
Implement exactly that plan using existing set-password invitation flow, and add required tests.

## Phase 4 (parallel after Phase 3)

Run 4A and 4B in parallel. Wait for both to finish.

### Agent 4A - API integration test matrix

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/07-api-integration-test-matrix.md`.
Implement the mode matrix test coverage across api and management-api exactly as specified.

### Agent 4B - Web E2E mode matrix

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/08-web-e2e-mode-matrix.md`.
Implement deterministic E2E mode coverage and update make targets/spec ordering as needed.

## Phase 5 (sequential finalization)

### Agent 5 - OpenAPI/docs/env examples

Read and execute `.llm/plans/active/auth-mode-invitation-rollout/06-openapi-docs-and-env-examples.md`.
Update OpenAPI, env examples, and testing docs to match implemented behavior and tests.
