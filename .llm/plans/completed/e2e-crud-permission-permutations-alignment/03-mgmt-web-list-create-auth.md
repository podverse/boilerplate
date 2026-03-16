# Management-Web: List, Create, and Auth Alignment (Phase 3)

## Purpose

Bring management-web list, create, and auth-only features to Aligned: full role matrix and flow tests per main plan. Main plan: [.llm/plans/completed/e2e-crud-permission-permutations-alignment.md](../e2e-crud-permission-permutations-alignment.md).

## Reference

- **Pattern:** [apps/management-web/e2e/bucket-admin-edit-admin-with-bucket-admins-crud.spec.ts](../../../apps/management-web/e2e/bucket-admin-edit-admin-with-bucket-admins-crud.spec.ts) for flow tests; list/detail/create specs use role-specific visibility and invalid id.
- **Skill:** e2e-permission-actor-matrix; e2e-authz-matrix for visibility by role.

## Scope (14 features)

| Feature | Current status | What to do |
|--------|----------------|------------|
| bucket-child-new | Needs alignment | Ensure unauthenticated, super-admin, admin-with-create, limited-admin (no create) specs; list→new, Cancel→list, invalid bucket id → not found for permitted roles. |
| bucket-messages | Partial | Add or complete: invalid bucket id → not found; list→messages or detail→messages flow for super-admin and admin-with-permission. Mark Aligned when full role matrix and flows present. |
| bucket-detail | Partial | Add invalid bucket id → not found; list→detail flow for super-admin and admin-with-permission. Mark Aligned. |
| buckets-new | Partial | Ensure unauthenticated, super-admin, admin-with-create, restricted (no create) specs; list→new, Cancel→list. Mark Aligned. |
| buckets | Partial | Ensure unauthenticated, super-admin, admin-with-buckets-read, limited-admin (no buckets) list visibility. Add list→detail flow if missing. Mark Aligned. |
| admins-new | Partial | Ensure unauthenticated, super-admin, restricted (no admins-crud) specs; list→new, Cancel→list for super-admin. Mark Aligned. |
| admins | Partial | Ensure unauthenticated, super-admin, limited-admin-admins-read, restricted specs; list visibility; list→detail or list→edit flow. Mark Aligned. |
| users-new | Partial | Ensure unauthenticated, super-admin, restricted (no users-crud) specs; list→new, Cancel→list for super-admin. Mark Aligned. |
| users | Partial | Ensure unauthenticated, super-admin, limited-admin-users-read, restricted specs; list visibility; list→detail or list→edit flow. Mark Aligned. |
| profile | Partial | Unauthenticated redirect; at least one authenticated role (e.g. super-admin) sees own profile. Add non-admin or limited-admin if applicable. Mark Aligned. |
| settings | Partial | Unauthenticated redirect; authenticated role(s) see settings. Mark Aligned. |
| events | Partial | Unauthenticated redirect; visibility by role (super-admin vs limited). Add invalid id or flow if applicable. Mark Aligned. |
| dashboard | Partial | Unauthenticated redirect; authenticated role(s) see dashboard. Mark Aligned. |
| home | Partial | Unauthenticated vs authenticated content or redirect. Mark Aligned. |

## Implementation notes

- For each feature: open existing spec files under [apps/management-web/e2e/](../../../apps/management-web/e2e/), add missing tests (invalid id, list→target, Cancel→list) for the roles that have permission; ensure restricted roles get not found or equivalent.
- Use helpers from [apps/management-web/e2e/helpers/](../../../apps/management-web/e2e/helpers/).
- After each feature (or batch): update the main plan table — set status to **Aligned** and Notes. Update [.llm/history/active/e2e-crud-permission-permutations-alignment/](../../../.llm/history/active/e2e-crud-permission-permutations-alignment/).

## Completion

When all 14 features are done, the main plan table (management-web section) shall show every list/create/auth feature as **Aligned** with brief notes. The full E2E CRUD permission permutations alignment plan will then be complete for management-web.
