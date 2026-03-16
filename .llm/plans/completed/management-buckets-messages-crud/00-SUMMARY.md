# Management Web: Buckets & Messages CRUD – Summary

## Scope

- **Management-web** supports CRUD for **buckets** and **messages** (list, view, create, edit, delete), similar to how it supports users.
- **Buckets list page** in management-web follows the **users page** pattern (filter table, add bucket, view/edit/delete per row, permission-gated).
- **Bucket detail** in management-web shows the **same experience the owner sees** in the main web app (same UI); this may require shared bucket-related pages/components in a shareable package (e.g. `packages/ui` or a dedicated package) used by both apps/web and apps/management-web.
- **Visibility and access** for management admins are controlled by **CRUD permissions**: `bucketsCrud` and `messagesCrud` (bitmasks). **Buckets and messages CRUD are disabled by default** when an admin is created.
- **Messages read:** If an admin does **not** have read permission for messages, they must not see the Messages button/link for buckets in management-web and must not be able to navigate to private/non-public messages pages (redirect or 403).

## Plan files

| File | Purpose |
|------|---------|
| 00-EXECUTION-ORDER.md | Phase order and pointers |
| 01-permissions-model.md | Add bucketsCrud, messagesCrud to admin permissions; defaults; migration |
| 02-management-api-buckets-messages.md | Management API: bucket/message endpoints and permission checks |
| 03-shared-bucket-ui.md | Shareable bucket (and messages) UI for web + management-web |
| 04-management-web-buckets-list.md | Management-web: buckets list page (like users) |
| 05-management-web-bucket-detail-and-messages.md | Bucket detail (shared UI); Messages visibility and route gating by messagesCrud |

## Dependency map

- 01 → 02 (permissions before API checks)
- 02 and 03 can proceed after 01 (API and shared UI in parallel if desired)
- 04 depends on 02 (and optionally 03 if list reuses shared pieces)
- 05 depends on 02 and 03 (detail + messages use shared UI and API)

## Key decisions

- **Default permissions:** New admins get `bucketsCrud: 0` and `messagesCrud: 0` (all disabled). Super-admin bypasses checks.
- **Same experience as owner:** Bucket detail (and messages) in management-web must look and behave like the owner view in web; achieve via shared components/routes in a package both apps depend on.
- **Messages read gating:** No Messages button and no access to messages routes when `messagesCrud` read bit is 0; API returns 403 for non-public messages when read is disabled.
