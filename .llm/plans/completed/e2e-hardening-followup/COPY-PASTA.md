# COPY-PASTA Prompts - E2E Hardening Follow-up

Use prompts in the execution order defined by [00-EXECUTION-ORDER.md](./00-EXECUTION-ORDER.md).

## Phase 1 (parallel)

### Prompt A (Web)

Plan file: `.llm/plans/active/e2e-hardening-followup/01-web-e2e-false-pass-and-authz-contracts.md`

Implement the plan as specified. Do not edit the plan file itself. Complete all steps, run the verification commands listed in the plan, and report what changed.

### Prompt B (Management-Web)

Plan file: `.llm/plans/active/e2e-hardening-followup/02-management-web-e2e-authz-and-events-matrix.md`

Implement the plan as specified. Do not edit the plan file itself. Complete all steps, run the verification commands listed in the plan, and report what changed.

## Phase 2 (after A and B finish)

### Prompt C (Shared hardening)

Plan file: `.llm/plans/active/e2e-hardening-followup/03-shared-e2e-helper-selector-hardening.md`

Implement the plan as specified. Do not edit the plan file itself. Complete all steps, run the verification commands listed in the plan, and report what changed.
