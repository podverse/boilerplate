# Navbar dropdown alignment (management-web ↔ web)

**Started:** 2025-03-03

## Context

Align how the navbar dropdown works in management-web with boilerplate web (same UIAppHeader usage and props).

### Session 1 - 2025-03-03

#### Prompt (Developer)

align how the navbar dropdown works in management web with how it works in boilerplate web

#### Key Decisions

- Management-web now passes `user` directly to `UIAppHeader` (same as web); `AppHeaderUser` is satisfied by auth context user shape (`displayName`, `email`).
- Added `loginHref={ROUTES.LOGIN}` so unauthenticated users see "Log in" in the header (same as web).
- Removed explicit `LinkComponent={Link}` so the default UI Link is used (same as web).

#### Files Modified

- apps/management-web/src/components/AppHeader.tsx

### Session 2 - 2025-03-03

#### Prompt (Developer)

merge the tabs in management-web with navbar dropdown. the dashboard will be accessible by
clicking the navbar brand

#### Key Decisions

- Main nav items (Admins, Users, Events; permission-filtered) are passed from layout to
  AppHeader as `mainNavItems`; Dashboard is excluded (brand links to HOME = /dashboard).
- AppHeader merges `mainNavItems` with Profile and Settings for the dropdown; order is
  main nav links first, then Profile, Settings, then Log out.
- NavTabs removed from layout; single navbar with brand → dashboard and user dropdown
  containing all nav + account links.

#### Files Modified

- apps/management-web/src/app/(main)/layout.tsx
- apps/management-web/src/components/AppHeader.tsx
