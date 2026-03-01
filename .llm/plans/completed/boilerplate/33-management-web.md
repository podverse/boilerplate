# Plan 33: Management Web

## Scope

Next.js (or same stack as `apps/web`) app `apps/management-web`: login to management API,
UI for super admin and admins based on permissions. **Events / Activity page** that
displays the audit log (main apps do not have this). Consumes the **shared UI package**
(`@boilerplate/ui`) for components and styles so there is no duplicate component code.

## Steps

1. **App scaffold**
   - Create `apps/management-web`; add dependency on shared UI package (plans 16–19).
   - Login page (calls management API login).

2. **Permission-based UI**
   - After login, show only actions allowed by current user's permissions. Super admin:
     full UI (create/delete admins with permission checkboxes and **event_visibility**,
     create/delete main users, change any password, assign permissions to admins). Admins:
     scoped UI (e.g. only "manage users" or "change passwords" as per their flags).

3. **Events page**
   - One page that displays the audit log (data from GET /events). **Super admin** sees
     every event. **Admins** see events according to their configured **event_visibility**
     (own / all_admins / all). Use shared UI package for table/card and layout.

4. **Shared package**
   - Import Button, Input, Card, layout, and styles from `@boilerplate/ui` (or
     equivalent). Do not duplicate component or style code in management-web.

5. **i18n (optional)**
   - Share same i18n layout (plan 21) or use a dedicated namespace for management UI;
     keep keys consistent if shared.

## Key files

- `apps/management-web/` (pages, components that wrap shared UI)
- Dependency on `@boilerplate/ui` in package.json
- Events/Activity page and list or table component

## Dependencies

- Plan 32 (management API)
- Shared UI package (from plans 16–19); both apps/web and apps/management-web depend on it

## Verification

- Super admin and admins can log in and see only allowed actions. Events page shows
  audit log with correct visibility. Management-web uses shared package for components
  and styles; no duplicate UI code.
