# Management-Web: Bucket Edit/Detail Alignment (Phase 1)

## Purpose

Bring management-web bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit, and bucket-edit into alignment with the e2e-permission-actor-matrix process. Main plan: [.llm/plans/completed/e2e-crud-permission-permutations-alignment.md](../e2e-crud-permission-permutations-alignment.md).

## Reference

- **Pattern:** [apps/management-web/e2e/bucket-admin-edit-admin-with-bucket-admins-crud.spec.ts](../../../apps/management-web/e2e/bucket-admin-edit-admin-with-bucket-admins-crud.spec.ts) (already Aligned): list→edit (settings?tab=admins → edit link), Cancel→list, invalid admin id → not found for admin-with-permission.
- **Skill:** e2e-permission-actor-matrix (full actor × outcome, flow tests: list→edit, Cancel→list, Save→list where relevant, invalid id → not found).

## Scope (5 features)

| Feature | Existing spec files | What's missing | What to add |
|--------|----------------------|----------------|-------------|
| bucket-role-edit | unauthenticated, super-admin-full-crud, admin-with-buckets-read-bucket-admins-permission, limited-admin-no-buckets-read | Admin-with-permission: Cancel→list (from role-edit back to settings?tab=roles). Super-admin may already have list→edit and Cancel→list. | In admin-with-buckets-read-bucket-admins-permission: add test "clicks Cancel on role-edit and returns to settings?tab=roles". Ensure invalid role id → not found for admin-with-permission if missing. |
| bucket-role-new | unauthenticated, super-admin-full-crud, admin-with-buckets-read-bucket-admins-permission, limited-admin-no-buckets-read | Admin-with-permission: list→new (settings roles tab → new role), Cancel→list; invalid bucket id → not found. | In admin-with-buckets-read-bucket-admins-permission: add list→new flow (goto settings?tab=roles, click new/add role, see form); Cancel→list (from new page cancel to settings?tab=roles); invalid bucket id → not found. |
| bucket-settings | unauthenticated, super-admin-full-crud, admin-with-buckets-read-bucket-admins-permission, limited-admin-no-buckets-read | Admin-with-permission: invalid bucket id → not found; tab=admins and tab=roles access. | In admin-with-buckets-read-bucket-admins-permission: invalid bucket id → not found; tests for tab=admins and tab=roles if not present. |
| bucket-message-edit | unauthenticated, super-admin-full-crud, admin-with-buckets-read-no-message-update, limited-admin-no-buckets-read | Admin **with** message-update permission spec may be missing; super-admin has list→edit, Cancel→detail. | If no admin-with-message-update spec: add one (or reuse admin-with-buckets-read and add message-edit flow). For admin with message update: list→edit, Cancel→detail, invalid id → not found. Restricted (no message update) and limited-admin already have not found. |
| bucket-edit | unauthenticated, super-admin-full-crud, admin-with-buckets-read-bucket-admins-permission, limited-admin-no-buckets-read | Admin-with-permission: list→edit (buckets list or settings → bucket edit), Cancel→list; invalid bucket id → not found. | In admin-with-buckets-read-bucket-admins-permission: list→edit (navigate to bucket edit from list/settings); Cancel→list; invalid bucket id → not found. |

## Implementation notes

- Use helpers from [apps/management-web/e2e/helpers/](../../../apps/management-web/e2e/helpers/): `expectInvalidRouteShowsNotFound`, `actionAndCapture`, `capturePageLoad`, `setE2EUserContext`, login helpers from `advancedFixtures`.
- IDs: E2E_BUCKET1_ID = `22222222-2222-4222-a222-222222222222` (see existing specs).
- After implementing each feature, update the main plan table: set the feature row status to **Aligned** and set Notes (e.g. "Full role matrix; list→edit, Cancel→list, invalid id for super-admin and admin-with-permission.").
- Update [.llm/history/active/e2e-crud-permission-permutations-alignment/](../../../.llm/history/active/e2e-crud-permission-permutations-alignment/) with session, prompt, key decisions, files modified.

## Completion

When all five features are done, the main plan table (management-web section) shall show bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit, and bucket-edit as **Aligned** with brief notes.
