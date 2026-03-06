# Management username-only auth

**Started:** 2026-03-06  
**Context:** Management-web has no email as auth option; only username. After reset/init, super admin should be created with username "superadmin", not superadmin@example.com.

## Session 1 - 2026-03-06

### Prompt (Developer)

There should NOT even be a "superadmin@example.com" because email does not exist as an auth option in management-web. There should only be a superadmin username after reset and init make command.

### Key Decisions

- Management auth is username-only: credentials table has `username` (varchar_short), no `email`.
- Migration 0006 adds `username`, backfills from existing `email` (split_part), drops `email`.
- Login body: `username` + `password`; API and UI use username throughout.
- create-super-admin prompts for username (default "superadmin"), inserts username into credentials.
- E2E seed uses username `e2e-superadmin`. Test helper createSuperAdminForTest uses username `test-super-admin`.
- Profile (PATCH /auth/me): displayName only; email removed from updateProfile.
- Admins API: CreateAdminBody/UpdateAdminBody and PublicManagementUser use `username`; list/detail/edit UI and AdminForm use username.

### Files Created/Modified

- infra/management-database/migrations/0006_credentials_username_only.sql (new)
- infra/management-database/combined/init_management_database.sql (regenerated)
- packages/management-orm: ManagementUserCredentials (email→username), ManagementUserService (findByUsername, CreateAdminData/UpdateAdminData username, listAdminsPaginated username, updateUsername)
- apps/management-api: authController (login by username, updateProfile no email), schemas/auth (loginSchema username, updateProfileSchema displayName only), managementUserToJson (username), schemas/admins (username), adminsController (username)
- packages/helpers-requests: management-admin-types (PublicManagementUser, CreateAdminBody, UpdateAdminBody username), management-web/auth (login username, updateProfile displayName only)
- scripts/management-api/create-super-admin.mjs (username prompt/insert), tools/management-web/seed-e2e.mjs (username), makefiles (comments)
- apps/management-web: AuthContext (AuthUser username, login(username, password), parseUser username), login page (username state), server-auth (ServerUser username, parse), proxy (username), dashboard (displayName fallback username), types/management-api (ManagementUser username), admins list/detail/edit (username), AdminForm (username, i18n), i18n originals (adminsTable.username, adminForm.username, usernameRequired, usernameInvalid)
- apps/management-api/src/test: createSuperAdminForTest (username), management-api.test.ts (superAdminUsername, adminUsername, all login/admin bodies and assertions)
