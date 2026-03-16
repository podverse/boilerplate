# Copy-paste prompts for phased execution

Use these one at a time after the previous phase is done (or in parallel where noted).

---

**Phase 1 – Permissions**

> Implement plan 01-permissions-model.md in this repo: add bucketsCrud and messagesCrud to management admin permissions (migration, entity, schemas, API, management-web types and admin create/edit UI, main nav). Defaults 0 for new admins. Follow .llm/plans/active/management-buckets-messages-crud/01-permissions-model.md.

---

**Phase 2a – Management API (after Phase 1)**

> Implement plan 02-management-api-buckets-messages.md: add management API bucket and message endpoints (list/get/create/update/delete) with bucketsCrud and messagesCrud checks. Decide how management-api gets bucket/message data (main DB vs main API). Update OpenAPI and add tests. Follow .llm/plans/active/management-buckets-messages-crud/02-management-api-buckets-messages.md.

---

**Phase 2b – Shared UI (can run in parallel with 2a after Phase 1)**

> Implement plan 03-shared-bucket-ui.md: extract shared bucket detail and messages UI into a package used by apps/web and apps/management-web so both show the same owner-style experience. Follow .llm/plans/active/management-buckets-messages-crud/03-shared-bucket-ui.md.

---

**Phase 3a – Buckets list (after 02 and optionally 03)**

> Implement plan 04-management-web-buckets-list.md: add Buckets list page in management-web (like users: filter table, add bucket, view/edit/delete; nav gated by bucketsCrud read). Follow .llm/plans/active/management-buckets-messages-crud/04-management-web-buckets-list.md.

---

**Phase 3b – Bucket detail and messages (after 02 and 03)**

> Implement plan 05-management-web-bucket-detail-and-messages.md: bucket detail page in management-web using shared UI; Messages link and route only when messagesCrud read; block access otherwise. Follow .llm/plans/active/management-buckets-messages-crud/05-management-web-bucket-detail-and-messages.md.
