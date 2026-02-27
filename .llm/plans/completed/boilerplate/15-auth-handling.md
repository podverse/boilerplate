# Plan 15: Auth handling

## Scope

Implement auth flow with two supported modes:

- **Mailer mode** (when mailer is configured): Self-service signup, login, logout. Future: email verification, reset password. Store users in Postgres via @boilerplate/orm (plan 12).
- **No-mailer mode** (when mailer is not required): No self-service signup. A required **admin user** is created at startup. That admin can create non-admin users (email as username, password). Admin-created users must set a new password on first login. Login, logout, and change-password apply.

Use JWT; protect routes that require auth. No OAuth for boilerplate unless specified.

## Mode detection

- **No-mailer**: When mailer-related env is not configured (e.g. no SMTP), or when `AUTH_MODE=admin_only`. In this mode, admin bootstrap is required and public signup is disabled.
- **Mailer**: When mailer is configured; self-service signup is available (and future email flows).

## Steps (common)

1. **JWT; design for revocable API keys later**
   - Use **JWT** for browser/auth flows: sign with a secret from env (JWT_SECRET); set expiry (e.g. 7d); accept in Authorization header (Bearer) or cookie. Document in the repo README (single README at repo root).
   - **Revocable API keys:** Design the auth layer so that later you can add an api_keys table and middleware that accepts either `Authorization: Bearer <jwt>` or `Authorization: ApiKey <key>`. Do not implement API keys in this plan; only ensure requireAuth middleware and route structure do not block adding them.

2. **Login**
   - POST `/auth/login`. Validate body (email, password). Find user by email; compare password with hash; if valid, issue JWT. Return 200 with token and user info. **Include `mustChangePassword: boolean`** in the response (and in any "current user" endpoint) so the client can prompt for password change on first login. On invalid credentials return 401.

3. **Protected routes**
   - Middleware that checks JWT; if missing/invalid return 401; otherwise attach user (or userId) to req and call next(). Apply to routes that require auth.

4. **Logout**
   - POST `/auth/logout`: client discards JWT; optional server-side blocklist. Return 204 or 200.

5. **Password hashing**
   - Use bcrypt (or similar) in api; store only hash in User entity. Do not log or return passwords.

6. **Startup validation**
   - Require JWT_SECRET in API startup validation. Fail fast if missing.

## Steps (mailer mode)

7. **Signup**
   - POST `/auth/signup`. Validate body (plan 14: email, password). Check user does not exist (by email); hash password; create User via ORM; return 201 with user id and optionally token. On duplicate email return 409.

## Steps (no-mailer mode)

8. **Admin bootstrap at startup**
   - When no-mailer mode is active, require `ADMIN_EMAIL` and `ADMIN_PASSWORD` in startup validation. After DB init, ensure an admin user exists: if no user with that email exists, create one with hashed password and `isAdmin: true`. If the admin user already exists, **do not overwrite** their password from env (safe default). Fail startup if admin env is missing in no-mailer mode.

9. **User entity extensions (ORM)**
   - Add to User: `isAdmin` (boolean, default false), `mustChangePassword` (boolean, default false). Admin-created users get `mustChangePassword: true`. Migration or init script as needed; extend UserService.create to accept these, and add a startup helper (e.g. ensureAdminUser) used by the API.

10. **Admin-only: create user**
    - POST `/admin/users`. Body: `{ email, password }`. Creates a non-admin user with that email (username) and hashed password, and `mustChangePassword: true`. Protected by middleware: requireAuth then requireAdmin (403 if !user.isAdmin). Return 201 with user id (no password). Duplicate email returns 409.

11. **Change password (first-login or normal)**
    - POST `/auth/change-password`. Body: `{ currentPassword, newPassword }`. Requires authenticated user. Verify currentPassword; set newPassword and clear `mustChangePassword` on success. Return 204 or 200. 401 if current password wrong.

12. **Signup disabled in no-mailer mode**
    - When mailer is disabled, do not mount public signup or return 403/503 with a clear message that registration is by admin only.

13. **requireAdmin middleware**
    - After requireAuth, requireAdmin returns 403 if `!req.user.isAdmin`. Use for POST `/admin/users`.

## Key files

- `apps/api/src/routes/auth.ts` (login, logout, change-password; signup when mailer mode)
- `apps/api/src/routes/admin.ts` (or under auth: POST /admin/users)
- `apps/api/src` middleware: requireAuth.ts, requireAdmin.ts
- `apps/api` dependency on @boilerplate/orm, bcrypt, jsonwebtoken
- `packages/orm/src/entities/User.ts` (add isAdmin, mustChangePassword)
- `packages/orm/src/services/UserService.ts` (create with isAdmin/mustChangePassword; ensureAdminUser for startup)
- API startup: after appDataSource.initialize(), if no-mailer then ensure admin user exists
- Env: JWT_SECRET (required); ADMIN_EMAIL, ADMIN_PASSWORD (required when no-mailer); config for mailer vs no-mailer

## When management is present

When the **Management API** (plan 32) is implemented, the main API should **not** expose
admin-only user creation: remove or disable POST `/admin/users` and admin bootstrap when
management is enabled (e.g. env `MANAGEMENT_ENABLED=true`). The Management API is then the
canonical place for creating/deleting main users and managing admins. The no-mailer path
above is for **setups without management** only.

## Verification

- **Mailer mode:** Signup with valid email/password creates user and returns success; duplicate email returns 409. Login returns token and user info. Protected routes require auth. Logout discards token.
- **No-mailer mode:** Startup fails without ADMIN_EMAIL/ADMIN_PASSWORD when no-mailer; with them, admin user exists after startup. Admin can POST /admin/users; duplicate email returns 409. New user can login; response includes `mustChangePassword: true`. After POST /auth/change-password, next login has `mustChangePassword: false`. Non-admin gets 403 on POST /admin/users. Public signup disabled or returns 403/503.
