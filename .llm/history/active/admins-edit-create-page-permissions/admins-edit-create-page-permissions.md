# Admins Edit/Create Page Permission Guards

**Started:** 2026-03-02
**Context:** Edit and New Admin pages only allowed super-admins; users with CRUD bits (create=1, update=4) were redirected to admins list.

### Session 1 - 2026-03-02

#### Prompt (Developer)

i gave boilerplate admin user named Alice create read and update permissions but when I press when I log into Alice and press edit on Alice's username in the admins page it attempts to load the edit page it looks like but it just stays on the admin page. Is there something wrong with the edit permission? I did not give delete permission, but I did give create, read, and update permissions to Alice and then logged in with that user

#### Key Decisions

- Edit page (`admins/[id]/edit/page.tsx`) was guarding with `if (!user.isSuperAdmin) redirect(ROUTES.ADMINS)`.
  Replaced with check for update permission: `(adminsCrud & 4) !== 0` so users with update bit can access edit.
- New admin page (`admins/new/page.tsx`) had the same super-admin-only guard. Replaced with create
  permission check: `(adminsCrud & 1) !== 0` so users with create bit can access add-admin page.

#### Files Created/Modified

- apps/management-web/src/app/(main)/admins/[id]/edit/page.tsx
- apps/management-web/src/app/(main)/admins/new/page.tsx

### Session 2 - 2026-03-02

#### Prompt (Developer)

If an admin has create or update permissions for admins, then they should be able to change the cRUD permissions for other users. The only user that no one should be able to change the permissions for is The Super Admin

#### Key Decisions

- API: allow permission updates (adminsCrud, usersCrud, eventVisibility) when actor has create (1) or update (4) on adminsCrud, not only when actor is super admin. 403 message: "Create or update permission required to change admin permissions". Super admin target is already unreachable (GET/PATCH return 404 for super admin).
- AdminForm: added `canEditPermissions` and `targetIsSuperAdmin`; show permissions section and include permission fields in create/update when canEditPermissions && (create mode or !targetIsSuperAdmin). Super admin's permissions never editable (targetIsSuperAdmin hides section).
- Edit page: pass canEditPermissions = isSuperAdmin || (adminsCrud & 5) !== 0, targetIsSuperAdmin = admin.isSuperAdmin. New page: pass canEditPermissions same.
- Test: "PATCH /admins/:id permission update returns 403..." changed to expect 200 and verify permissions updated when actor has update permission; removed redundant read-only test (middleware returns 403 before controller).

#### Files Created/Modified

- apps/management-api/src/controllers/adminsController.ts
- apps/management-api/src/test/management-admins-permissions.test.ts
- apps/management-web/src/components/admins/AdminForm.tsx
- apps/management-web/src/app/(main)/admins/[id]/edit/page.tsx
- apps/management-web/src/app/(main)/admins/new/page.tsx
