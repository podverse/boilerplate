# Bucket Owner Roles (main app)

**Started:** 2026-03-05  
**Context:** Super admin sees Roles in management app; bucket owner (e.g. local dev at example.com) did not see Roles. Requirement: bucket owner can perform all CRUD for that bucket, including roles.

### Session 1 - 2026-03-05

#### Prompt (Developer)

I see roles when I log in as the super admin, but I don't see roles when I log in as local dev at example. Dot com. The owner of a bucket should be able to perform all possible crud operations for that bucket, including rolls

#### Key Decisions

- Implemented bucket roles in **main API** and **main web app** so bucket owners (and admins with bucket update) can manage roles without needing management app or global permissions.
- Policy: `canManageBucketRoles(userId, bucket, bucketAdmin)` — same as bucket admins: owner or admin with bucket update.
- Main app: Roles tab under Bucket Settings, list/create/edit/delete custom roles; breadcrumbs show Settings → Roles → Create role / Edit role when on role pages.
- Fixed import paths: new role page uses 3 levels to `BucketRoleFormClient` and 7 levels to `lib/`; edit role page uses 4 levels to form and 8 levels to `lib/`.

#### Files Created/Modified

- apps/web/src/app/(main)/bucket/[id]/settings/BucketSettingsLayoutClient.tsx — detect role paths, set currentPageLabel and pass isRolePage, rolesHref, rolesLabel to breadcrumbs.
- apps/web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx — corrected imports (../../../ for form, ../../../../../../../ for lib).
- apps/web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx — corrected lib imports (8 levels).
