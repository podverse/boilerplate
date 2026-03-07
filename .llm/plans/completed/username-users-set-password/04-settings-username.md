# 04 – Settings: username field and async uniqueness check

## Scope

Web app settings (profile tab): add editable **username** field. PATCH /auth/me accepts
username. Provide an endpoint for async username availability check (e.g. GET
/auth/username-available?username=... or POST with body). On blur of username input, call
the check and show “Username not available” if taken (or invalid). Save username via
existing profile update (PATCH /auth/me).

## Steps

### 1. Main API: PATCH /auth/me and username

- In `apps/api` auth routes: PATCH /auth/me (or equivalent update profile) already
  exists. Extend request body to accept `username?: string | null`. Validate format
  (length, allowed characters if any) and uniqueness (except current user). Call
  UserService.updateUsername(req.user.id, username). If username is being set, ensure
  it does not conflict with another user (findByUsername; if found and id !== req.user.id
  return 409).
- In `apps/api` schemas: add username to update profile schema (optional string, max
  length, trim).

### 2. Username availability endpoint

- Add GET /auth/username-available?username=... (or POST /auth/check-username with body
  { username }). Public or authenticated; if authenticated, exclude current user’s
  username from “taken” check. Return 200 with { available: true } or { available: false
  } (and optional message). Rate-limit to avoid abuse. Use UserService.findByUsername;
  if found and (no auth or found.userId !== req.user?.id) then available: false.

### 3. Web settings profile tab

- In `apps/web/src/app/(main)/settings/SettingsPageContent.tsx` (or equivalent profile
  section):
  - Add state for username (initial from initialUser.username or '').
  - Add input for username. On blur: call username-available endpoint. If response
    available: false, set local error “Username not available” (or use i18n key). If
    available: true, clear error. Do not block submit on blur—submit still sends
    username and server will return 409 if race condition; show that error in submit
    error state.
  - On profile save (PATCH /auth/me), include username in payload. On 409 (username
    taken), show “Username not available” or server message.
  - Ensure displayName and other existing fields still work.

### 4. i18n

- Add translation keys for “Username”, “Username not available”, and any validation
  messages (e.g. “Username is required” if you make it required in settings). Use in
  profile tab and any shared validation.

### 5. helpers-requests and types

- In `packages/helpers-requests` (or web auth helpers): add method to call
  username-available endpoint; add username to updateProfile payload type so TypeScript
  and API stay in sync.

## Key files

- `apps/api/src/routes/auth.ts` (PATCH /auth/me, GET /auth/username-available)
- `apps/api/src/controllers/authController.ts` (updateProfile, usernameAvailable)
- `apps/api/src/schemas/auth.ts` (update profile body with username)
- `packages/orm/src/services/UserService.ts` (updateUsername, findByUsername)
- `apps/web/src/app/(main)/settings/SettingsPageContent.tsx`
- `packages/helpers-requests` (webAuth.updateProfile, usernameAvailable)
- i18n files for profile/settings (e.g. apps/web/i18n or packages/ui)

## Verification

- Changing username in settings and saving updates the user; after refresh, new username
  is shown. Logging in with new username works.
- Typing an already-used username and blurring shows “Username not available”. Typing
  own username or an available one clears the error.
- Submitting with a username that became taken after blur shows 409 and error message in
  UI.
