# E2E Testing Gaps – Fix Plan (2025)

## Overview

After the e2e-remaining-gaps plan was implemented, a fresh pass over the E2E matrices and specs identified these **major remaining gaps**:

1. **Management-web buckets delete cancel** – Users and admins list specs have delete-cancel tests (open modal → click Cancel → assert row remains). The buckets list has no such test; add it for consistency and to avoid false confidence on delete flows.
2. **Management-web deterministic empty state** – Web has a buckets-list empty-state test (search with no match). Management-web has no equivalent for users or events list. Add one deterministic empty-list test (e.g. users or events with a no-match search, assert empty message and optional CTA).
3. **Web settings tab/control state** – The CRUD matrix calls out "Gap (tab active state + control enable/disable transitions)" for settings. Add at least one deterministic assertion for settings (e.g. tab active state when navigating with `?tab=password` or visibility of a control state).
4. **429 / rate-limit** – Both matrices list "Gap (429/rate-limit where feasible)" for auth screens. E2E seed/API does not currently support triggering 429 deterministically. **Defer**: add a short comment in the plan or in the login/signup spec that 429 coverage is deferred until test infrastructure supports it.

Edit-persistence is already covered (user-edit, admin-edit, bucket-edit, etc. assert "after save" on list/detail). Unauthenticated redirect coverage is present for both apps. Owner-protection and role delete cancel were added in the previous plan.

## Plan Files

- [00-EXECUTION-ORDER.md](./00-EXECUTION-ORDER.md) – Phase order and dependencies.
- [01-management-buckets-delete-cancel-and-empty-state.md](./01-management-buckets-delete-cancel-and-empty-state.md) – Buckets delete cancel + one management empty-state test.
- [02-web-settings-and-429-deferral.md](./02-web-settings-and-429-deferral.md) – Web settings tab/control assertion + 429 deferral comment.

## Execution Order

1. **01** – Management-web: buckets delete cancel; users or events list empty-state test.
2. **02** – Web: settings tab or control state assertion; document 429 deferral.

## References

- [Web CRUD/State/Auth Matrix](../../../docs/testing/E2E-CRUD-STATE-AUTH-MATRIX-WEB.md)
- [Management-web CRUD/State/Auth Matrix](../../../docs/testing/E2E-CRUD-STATE-AUTH-MATRIX-MANAGEMENT-WEB.md)
- [E2E Remaining Gaps (completed)](../e2e-remaining-gaps/00-SUMMARY.md)
