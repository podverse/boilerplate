# Buckets / Topics / Messages – Execution Order

Execute phases sequentially. Do not start Phase N+1 until Phase N is complete.

## Phase 1 – Data model and migrations

- **Plan file:** `01-data-model-and-migrations.md`
- **Deliverables:** SQL migrations for `bucket`, `bucket_admin`, `bucket_message`; ORM entities and services; combined init script updated.
- **Verification:** Migrations apply; ORM builds; test that creates bucket, topic, message, bucket admin.

## Phase 2 – Permissions and policy

- **Plan file:** `02-permissions-and-policy.md`
- **Deliverables:** Policy helpers (e.g. `canReadBucket`, `canUpdateBucket`, `canReadMessage`, …); used by API and (via API) by web.
- **Verification:** Document permission matrix; tests for 403/404 on disallowed access.

## Phase 3 – API endpoints

- **Plan file:** `03-api-endpoints.md`
- **Deliverables:** All bucket, topic, bucket-admin, and message endpoints; public submit and public read by slug.
- **Verification:** Integration tests; 401/403/404 where expected; public endpoints work without auth.

## Phase 4 – Web app: buckets UI

- **Plan file:** `04-web-app-buckets-ui.md`
- **Deliverables:** List/create/edit buckets and topics; bucket detail; bucket admins management; reuse management-web patterns where possible.
- **Verification:** Manual run; create bucket, topic, bucket admin; confirm permissions.

## Phase 5 – Web app: messages and public pages

- **Plan file:** `05-web-app-messages-and-public.md`
- **Deliverables:** Authenticated message list/detail; public bucket page; public submit form; public paths configured.
- **Verification:** Public page shows only public messages; submit works without login; 404 for non-public bucket.

---

**Rules**

- Execute incrementally when the user requests (e.g. “Implement Phase 1” or “Do 01 – Data model”).
- 04 and 05 can be executed in parallel by different agents/sessions after Phase 3 is done; use COPY-PASTA.md for prompts.
