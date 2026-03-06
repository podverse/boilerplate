# Username users and set-password – summary

## Scope

- **Username-only users**: Management-web admins can create main-app users with a username
  only (no email). No admin-set password; backend generates a **set-password link**
  (secure token) for the user to set their password.
- **Bucket assignment at create**: When creating a username-only user, admin can assign
  **bucket admin** roles so the user sees those buckets when they log in.
- **Settings**: Users can change **username** in settings; **async uniqueness check on
  blur** with “username not available” error.
- **Signup**: Web signup keeps email required and adds **required username** (unique).
- **Bucket/owner display**: Show **username (displayName)** or **username** instead of
  email everywhere owners and admins are shown.

## Plan files

| ID | File | Phase |
| -- | ---- | ----- |
| – | 00-EXECUTION-ORDER.md | Meta |
| – | 00-SUMMARY.md | Meta |
| 01 | 01-schema-username-email.md | 1 |
| 02 | 02-auth-login-setpassword.md | 2 |
| 03 | 03-management-create-user-invite.md | 3 |
| 04 | 04-settings-username.md | 4 |
| 05 | 05-signup-username.md | 5 |
| 06 | 06-bucket-display-username.md | 6 |
| – | COPY-PASTA.md | Prompts |

## Dependency map

- **01** → 02, 03, 04, 05, 06 (schema and ORM must be in place first).
- **02** → 03, 04, 05, 06 (auth and PublicUser shape used by management, settings, signup,
  and any client that displays user).
- **03** depends on 01, 02 (create user with username, set_password token, bucket_admin).
- **04** depends on 02 (PATCH /auth/me, username availability check).
- **05** depends on 02 (signup schema and login by username).
- **06** depends on 02 (userToJson/PublicUser includes username; display helpers).

## Key files (global)

- DB: `infra/database/combined/init_database.sql`, new migration for user_credentials.
- ORM: `packages/orm` (UserCredentials, UserService, VerificationTokenService).
- Helpers: `packages/helpers` (field length for username).
- Main API: `apps/api` (authController, auth routes, userToJson, verification-token).
- Management API: `apps/management-api` (usersController, users schemas, buckets).
- Management-web: `apps/management-web` (UserForm, users new page).
- Web: `apps/web` (settings, signup, bucket pages).
- UI: `packages/ui` (BucketAdminsView, NavBar).

## Decisions (recorded)

- **Login identifier**: Single field that accepts either email or username; backend
  resolves via UserService.findByEmailOrUsername(identifier).
- **Credentials constraint**: At least one of email or username must be set (DB check
  and app logic).
- **Set-password token**: Reuse `verification_token` with kind `set_password`; expiry
  e.g. 7 days (configurable).
- **Display format**: “username (displayName)” when displayName set, else “username”;
  for users without username (legacy), keep “email (displayName)” or “email”.
