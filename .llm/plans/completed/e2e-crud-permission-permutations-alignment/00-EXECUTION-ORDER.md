# E2E Permission Alignment – Management-Web Execution Order

Run the following prompts **in order**. Each phase implements one sub-plan and updates the main plan table and history. After all three phases, management-web alignment is complete.

---

## Phase 1 – Bucket edit/detail (5 features)

Implement bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit, and bucket-edit for management-web.

**Copy-pasta prompt:**

```
Implement the plan in .llm/plans/completed/e2e-crud-permission-permutations-alignment/01-mgmt-web-bucket-edit-detail.md. Add any missing list→edit, Cancel→list, and invalid id tests for management-web bucket-role-edit, bucket-role-new, bucket-settings, bucket-message-edit, and bucket-edit. Update the main plan table in .llm/plans/completed/e2e-crud-permission-permutations-alignment.md and the history file in .llm/history/active/e2e-crud-permission-permutations-alignment/.
```

---

## Phase 2 – Admin and user edit/detail (5 features)

Implement admin-edit, admin-detail, admin-role-new, user-edit, and user-detail for management-web.

**Copy-pasta prompt:**

```
Implement the plan in .llm/plans/completed/e2e-crud-permission-permutations-alignment/02-mgmt-web-admin-user-edit-detail.md. Add any missing list→edit, Cancel→list, and invalid id tests for management-web admin-edit, admin-detail, admin-role-new, user-edit, and user-detail. Update the main plan table in .llm/plans/completed/e2e-crud-permission-permutations-alignment.md and the history file in .llm/history/active/e2e-crud-permission-permutations-alignment/.
```

---

## Phase 3 – List, create, and auth (14 features)

Implement bucket-child-new, bucket-messages, bucket-detail, buckets-new, buckets, admins-new, admins, users-new, users, profile, settings, events, dashboard, and home for management-web.

**Copy-pasta prompt:**

```
Implement the plan in .llm/plans/completed/e2e-crud-permission-permutations-alignment/03-mgmt-web-list-create-auth.md. Bring each listed management-web feature to Aligned: add missing role specs, list→edit, Cancel→list, or invalid id tests as needed. Update the main plan table in .llm/plans/completed/e2e-crud-permission-permutations-alignment.md and the history file in .llm/history/active/e2e-crud-permission-permutations-alignment/.
```
