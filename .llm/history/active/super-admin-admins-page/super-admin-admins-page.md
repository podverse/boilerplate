# Super admin on admins page

**Started:** 2025-03-03

## Context

Super admin was excluded from the admins list and from get/update. Requirements: super admin
should appear on the admins page; no one can delete or create a new super admin; super admin
can read and update their own record (self).

### Session 1 - 2025-03-03

#### Prompt (Developer)

It seems like the super admin is excluded from appearing in the admins page in management web.
Identify if there is special handling preventing it from appearing. No one should be able to
delete the super admin through the management web portal Nor should they be able to create a
new super admin. But the super admin should be able to read and update the super admin.

#### Key Decisions

- **ORM** `listAdminsPaginated`: Removed `isSuperAdmin: false` filter so list includes all
  management users (super admin + admins). Updated `updateAdmin` to allow super admin updates
  for email, displayName, passwordHash only (no permission changes).
- **API** `getAdmin`: Return 200 when admin exists (removed 404 for isSuperAdmin). `updateAdmin`:
  allow when target is super admin only if actor.id === admin.id (self); strip permission
  fields for super admin self-update; return 403 if super admin tries to change own permissions.
  `deleteAdmin`: unchanged (404 for super admin).
- **management-web**: Added `isSuperAdmin` to admins table rows; added `getRowActions` to
  ResourceTableWithFilter for per-row Edit/Delete; super admin row shows Edit only for self,
  never Delete. Edit page allows access when target is super admin and current user is that
  super admin.

#### Files Modified

- packages/management-orm/src/services/ManagementUserService.ts
- apps/management-api/src/controllers/adminsController.ts
- apps/management-web/src/components/ResourceTableWithFilter.tsx
- apps/management-web/src/components/AdminsTableWithFilter.tsx
- apps/management-web/src/app/(main)/admins/page.tsx
- apps/management-web/src/app/(main)/admins/[id]/edit/page.tsx
