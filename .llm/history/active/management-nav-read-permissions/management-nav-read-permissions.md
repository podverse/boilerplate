# Management Web Nav Read Permissions

**Started:** 2026-03-02
**Context:** Hide nav tabs when user lacks read permission; generic handling for all tabs.

### Session 1 - 2026-03-02

#### Prompt (Developer)

Alice does not have read permissions for the admins tab, so admins should not even show up as an
option. All of the tabs. in the future should have this handling so don't tightly couple it to
admin too much. It should just be how read permissions are handled within the management web.

#### Key Decisions

- Added `lib/main-nav.ts`: defines `MAIN_NAV_ENTRIES` with optional `readPermission` (CrudPermissionKey).
  Dashboard and Events have no permission; Admins requires `adminsCrud` read (bit 2).
- Generic helpers: `hasReadPermission(permissions, key)` and `getVisibleNavItems(isSuperAdmin, permissions, t)`.
- Layout (server) calls `getServerUser()`, `getTranslations('common')`, `getVisibleNavItems()`, passes
  items to `NavTabs`. NavTabs now accepts `items` prop only (no longer builds list internally).
- Admins page: redirect to dashboard when user lacks read permission (so direct URL /admins doesn’t
  show "Failed to load admins").
- To add a new gated tab: add entry to `MAIN_NAV_ENTRIES` with `readPermission: 'adminsCrud' | 'usersCrud'`.

#### Files Created/Modified

- apps/management-web/src/lib/main-nav.ts (new)
- apps/management-web/src/app/(main)/layout.tsx
- apps/management-web/src/components/NavTabs.tsx
- apps/management-web/src/app/(main)/admins/page.tsx
