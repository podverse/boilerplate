# Execution Order

## Phase 1 – Permissions model

1. **01-permissions-model.md**  
   Add `bucketsCrud` and `messagesCrud` to admin permissions (entity, migration, schemas, API create/update, defaults 0). Update management-web types and admin create/edit UI.

## Phase 2 – API and shared UI (can run in parallel after Phase 1)

2. **02-management-api-buckets-messages.md**  
   Management API: bucket list/create/get/update/delete and message list/create/get/update/delete (or minimal set); enforce `bucketsCrud` / `messagesCrud`; decide how management-api gets bucket/message data (main DB connection vs calling main API).

3. **03-shared-bucket-ui.md**  
   Extract or add shared bucket (and messages) UI so apps/web and apps/management-web can render the same bucket detail and messages experience. May live in `packages/ui` or a new package.

## Phase 3 – Management-web pages

4. **04-management-web-buckets-list.md**  
   Management-web: buckets list page (FilterTablePageLayout, table with filter, add bucket, view/edit/delete per row; nav entry gated by bucketsCrud read).

5. **05-management-web-bucket-detail-and-messages.md**  
   Bucket detail page in management-web using shared UI; Messages link and route visible/accessible only when messagesCrud read is set; block or redirect when read is disabled.

---

Execute in order: Phase 1 → Phase 2 (02 and 03 in parallel if desired) → Phase 3 (04 then 05, or 04 and 05 in parallel after 02 and 03 are done).
