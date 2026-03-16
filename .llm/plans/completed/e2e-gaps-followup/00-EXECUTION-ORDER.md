# E2E Gaps Follow-Up – Execution Order

## Phases

| Phase | Plan file | Description |
|-------|-----------|-------------|
| 1 | [01-events-empty-state-and-admins-self-protection.md](./01-events-empty-state-and-admins-self-protection.md) | Events list empty-state test; admins list self-protection (current user row has no delete). |

Single phase. No dependencies between the two items; can be implemented in either order within 01.

## Verification

- After 01: `make e2e_test_management_web_report_spec SPEC=e2e/events-list-url-state-contract.spec.ts` and `make e2e_test_management_web_report_spec SPEC=e2e/admins-super-admin-full-crud.spec.ts` (or the spec that contains the new admins test).
