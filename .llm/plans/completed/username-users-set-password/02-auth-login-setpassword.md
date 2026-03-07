# 02 – Auth: login by email or username, set-password flow

## Scope

Main API: login accepts a single identifier (email or username); resolve user via
UserService.findByEmailOrUsername. PublicUser and userToJson include optional username
and optional email. Add POST /auth/set-password (public) that consumes a set_password
token and sets the user’s password. JWT payload can include username/email for display
where needed.

## Steps

### 1. PublicUser and userToJson

- In `apps/api/src/lib/userToJson.ts` (and any shared type in helpers-requests):
  - Extend PublicUser to `email: string | null`, `username: string | null` (both
    optional for backward compatibility).
  - userToJson: set `email: user.credentials.email ?? null`,
    `username: user.credentials.username ?? null`. Keep id, shortId, displayName.
- Ensure all API responses that return “user” use this shape (login, me, signup,
  bucket admins list, etc.).

### 2. Login body and resolution

- In `apps/api/src/schemas/auth.ts`: login schema uses a single field, e.g. `identifier`
  (string, required) instead of `email`, or keep `email` as the key but document that it
  accepts email or username. Alternatively add `loginIdentifier` and keep backward
  compatibility by accepting either `email` or `loginIdentifier` in body.
- In `apps/api/src/controllers/authController.ts` login handler:
  - Read identifier from body (email or loginIdentifier).
  - Replace `UserService.findByEmail(identifier)` with
    `UserService.findByEmailOrUsername(identifier)`.
  - Rest unchanged (compare password, issue tokens, return user).

### 3. Set-password endpoint

- In `apps/api/src/lib/auth/verification-token.ts`: add `getSetPasswordExpiry()` (e.g. 7
  days) if not already added in 01.
- In `apps/api/src/controllers/authController.ts`:
  - Add `setPassword(req, res)`: body `{ token, newPassword }`. Validate newPassword with
    validatePassword (same as reset-password). Hash token, call
    VerificationTokenService.consumeToken(tokenHash, 'set_password'). On success get
    userId from result, call UserService.updatePassword(userId, hashedPassword). Return
    204 or 200 with success message. On invalid/expired token return 400 with clear
    message.
- In `apps/api/src/routes/auth.ts`: add POST /auth/set-password (no auth middleware),
  validate body (token, newPassword), call setPassword. Rate-limit if desired (same as
  reset-password).

### 4. JWT payload (optional)

- In `apps/api/src/lib/auth/jwt.ts`: payload currently has sub, email. Add username when
  present (optional) so clients can display “logged in as username” without loading /me.
  Ensure verifyToken still returns payload with sub; middleware loads user by sub, so
  optional email/username in JWT is for convenience only.

### 5. helpers-requests and OpenAPI

- In `packages/helpers-requests` (or equivalent): update LoginBody to single identifier
  if changed; update PublicUser type to include username (optional) and email optional.
- Main API OpenAPI/spec: document POST /auth/set-password (request body token +
  newPassword); document login request as accepting identifier (email or username).

## Key files

- `apps/api/src/lib/userToJson.ts`
- `packages/helpers-requests` (PublicUser, LoginBody if defined there)
- `apps/api/src/schemas/auth.ts`
- `apps/api/src/controllers/authController.ts`
- `apps/api/src/routes/auth.ts`
- `apps/api/src/lib/auth/jwt.ts`
- `apps/api/src/lib/auth/verification-token.ts`

## Verification

- Login with email works; login with username (for a user that has username set) works;
  same invalid credentials message for wrong password or unknown identifier.
- POST /auth/set-password with valid token and valid new password updates password and
  consumes token; user can then log in with username (and new password). Invalid or
  expired token returns 4xx with clear message.
- PublicUser in login/me/signup and in bucket admins list includes username and email
  (nullable where applicable).
