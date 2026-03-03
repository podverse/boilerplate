# Profile (web + management-web)

**Started:** 2025-03-02  
**Context:** Profile page reachable from navbar avatar dropdown; logged-in user can edit display name, email (via request-email-change on web), and password.

---

### Session 1 - 2025-03-02

#### Prompt (Developer)

There should be a profile page on web and management web for boilerplate that is accessible through the Navbar Avatar drop-down menu. And it lets you change your meaning the logged in users relevant fields. like display name, email, password, and anything else I may be missing

#### Key Decisions

- Main API: Added `UserService.updateDisplayName`, PATCH /auth/me with body `{ displayName }`, and auth controller `updateProfile`. Existing POST /auth/change-password and POST /auth/request-email-change used for password and email change.
- helpers-requests: Added `UpdateProfileBody` type; web auth `changePassword`, `updateProfile`, `requestEmailChange`; management-web auth `changePassword`, `updateProfile`.
- Management API: Added POST /auth/change-password and PATCH /auth/me (update profile display name) for logged-in user; `ManagementUserService.updateDisplayName`.
- Web profile: Route PROFILE='/profile', nav item in avatar dropdown, page + ProfileContent (display name, email read-only, change password, request email change). Auth context `setSession` used after profile update.
- Management-web profile: Same pattern; profile has display name, email read-only, change password only (no email-change flow).
- Disabled email Input still requires `onChange`; passed no-op `() => {}`.

#### Files Created/Modified

- packages/orm: UserService.updateDisplayName.
- packages/helpers-requests: types UpdateProfileBody; web auth changePassword, updateProfile, requestEmailChange; management-web auth changePassword, updateProfile; index export UpdateProfileBody.
- packages/management-orm: ManagementUserService.updateDisplayName.
- apps/api: schemas updateProfileSchema, authController updateProfile, routes PATCH /me.
- apps/management-api: schemas changePasswordSchema, updateProfileSchema; authController changePassword, updateProfile; routes POST change-password, PATCH me.
- apps/web: routes PROFILE; AppHeader nav Profile; i18n common.profile, profile.*; app/(main)/profile/page.tsx, ProfileContent.tsx.
- apps/management-web: routes PROFILE; AppHeader nav Profile; i18n common.profile, profile.*; app/(main)/profile/page.tsx, ProfileContent.tsx.
