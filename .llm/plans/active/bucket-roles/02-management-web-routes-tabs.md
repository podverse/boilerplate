# Management-web: routes, tabs, role pages

## 2.1 Routes

In `apps/management-web/src/lib/routes.ts`:

- Extend `BucketSettingsTab` to `'general' | 'admins' | 'roles'`.
- Add:
  - `bucketSettingsRolesRoute(bucketId)` → `/bucket/:id/settings?tab=roles`
  - `bucketSettingsRoleNewRoute(bucketId)` → `/bucket/:id/settings/roles/new`
  - `bucketSettingsRoleEditRoute(bucketId, roleId)` → `/bucket/:id/settings/roles/:roleId/edit`
- Optional: support `returnUrl` query param on role new/edit (e.g. back to admins tab).

## 2.2 Bucket settings page and tabs

- **Bucket settings page** (`apps/management-web/src/app/(main)/bucket/[id]/settings/page.tsx`):
  - Read `tab=roles` from searchParams; `activeTab` can be `'roles'`.
  - When `activeTab === 'roles'`, render a new client component (e.g. `BucketRolesClient`).
- **BucketSettingsTabs** (in `packages/ui`): Extend to support a third tab: e.g. `rolesHref` and
  `rolesLabel`. Ensure active tab is correct when `tab=roles`.

## 2.3 Roles tab content – BucketRolesClient

- Lists **predefined roles** (read-only; no edit/delete).
- Lists **custom roles** for the bucket with Edit (→ role edit page) and Delete (confirm).
- "Create role" button → `bucketSettingsRoleNewRoute(bucketId)` (optionally with
  `returnUrl` to current page).

## 2.4 Role create page

- Path: `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx`.
- Form: name (required) + three CrudCheckboxes (bucket, message, admin; admin read forced).
- On submit: POST to create role, then redirect to `returnUrl` or Roles tab.

## 2.5 Role edit page

- Path: `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx`.
- Load custom role by bucketId + roleId; 404 if not found or predefined.
- Same form as create; PATCH on submit; redirect to `returnUrl` or Roles tab.
- Predefined roles are not editable (only custom roles get Edit in the list).
