# Management-Web: Admin and User Edit/Detail Alignment (Phase 2)

## Purpose

Bring management-web admin-edit, admin-detail, admin-role-new, user-edit, and user-detail into alignment with the e2e-permission-actor-matrix process. Main plan: [.llm/plans/completed/e2e-crud-permission-permutations-alignment.md](../e2e-crud-permission-permutations-alignment.md).

## Reference

- **Pattern:** [apps/management-web/e2e/bucket-admin-edit-admin-with-bucket-admins-crud.spec.ts](../../../apps/management-web/e2e/bucket-admin-edit-admin-with-bucket-admins-crud.spec.ts): list→edit, Cancel→list, invalid id for admin-with-permission.
- **Skill:** e2e-permission-actor-matrix (full actor × outcome, flow tests: list→edit, Cancel→list, Save→list where relevant, invalid id → not found).

## Scope (5 features)

| Feature | Existing spec files | What's missing | What to add |
|--------|----------------------|----------------|-------------|
| admin-edit | unauthenticated, super-admin-full-crud, admin-with-buckets-read-no-admins-crud | Super-admin: ensure list→edit (admins list → edit link), Cancel→list; invalid admin id → not found. Restricted (no admins-crud) already has not found. | In super-admin-full-crud: list→edit (goto admins, click edit for an admin); Cancel→list (from edit page cancel back to admins list); invalid admin id → not found if missing. |
| admin-detail | unauthenticated, super-admin-full-crud, admin-with-buckets-read-no-admins-crud, limited-admin-admins-read | Super-admin and limited-admin (read): list→detail, invalid id → not found. | In super-admin and limited-admin-admins-read: list→detail (admins list → click admin → detail); invalid admin id → not found. Cancel not applicable (detail page; back/list link if any). |
| admin-role-new | unauthenticated, super-admin-full-crud, admin-with-buckets-read-no-admins-crud | Super-admin: list→new (admins or roles → new role), Cancel→list; invalid id if applicable. Restricted has not found. | In super-admin-full-crud: list→new (navigate to new admin role page from list); Cancel→list (cancel returns to list); invalid id → not found where applicable. |
| user-edit | unauthenticated, super-admin-full-crud, admin-with-buckets-read-no-users-crud | Super-admin: list→edit (users list → edit), Cancel→list; invalid user id → not found. Restricted has not found. | In super-admin-full-crud: list→edit (users → edit user); Cancel→list; invalid user id → not found. If admin-with-users-crud spec exists, add same flows there. |
| user-detail | unauthenticated, super-admin-full-crud, admin-with-buckets-read-no-users-crud, limited-admin-users-read | Super-admin and limited-admin (read): list→detail, invalid id → not found. | In super-admin and limited-admin-users-read: list→detail (users list → user detail); invalid user id → not found. |

## Implementation notes

- Use helpers from [apps/management-web/e2e/helpers/](../../../apps/management-web/e2e/helpers/): `expectInvalidRouteShowsNotFound`, `actionAndCapture`, `capturePageLoad`, `setE2EUserContext`, login helpers from `advancedFixtures`.
- Management routes: admins list/detail/edit under `/admins`, admin roles under `/admin-roles` or similar; users under `/users`. Confirm exact paths from existing specs.
- After implementing each feature, update the main plan table: set the feature row status to **Aligned** and set Notes.
- Update [.llm/history/active/e2e-crud-permission-permutations-alignment/](../../../.llm/history/active/e2e-crud-permission-permutations-alignment/) with session, prompt, key decisions, files modified.

## Completion

When all five features are done, the main plan table (management-web section) shall show admin-edit, admin-detail, admin-role-new, user-edit, and user-detail as **Aligned** with brief notes.
