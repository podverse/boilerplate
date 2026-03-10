# E2E Gaps 2025 – Execution Order

## Phases

| Phase | Plan file | Description |
|-------|-----------|-------------|
| 1 | [01-management-buckets-delete-cancel-and-empty-state.md](./01-management-buckets-delete-cancel-and-empty-state.md) | Buckets delete cancel (management-web); one management empty-state test (users or events). |
| 2 | [02-web-settings-and-429-deferral.md](./02-web-settings-and-429-deferral.md) | Web settings tab/control assertion; 429 deferral comment. |

Execute in order: 01 then 02. No parallelization required.

## Verification

- After 01: `make e2e_test_management_web_report_spec SPEC=e2e/buckets-super-admin-full-crud.spec.ts` and the new/updated empty-state spec.
- After 02: `make e2e_test_web_report_spec` for the settings spec; no new run for 429 (comment only).
