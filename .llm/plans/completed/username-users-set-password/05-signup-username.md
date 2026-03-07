# 05 – Signup: require username

## Scope

Web signup keeps email required and adds a **required username** field. Validate username
format and uniqueness at submit. Signup creates user with email, password, and username.
i18n for username label and validation errors.

## Steps

### 1. Main API signup schema and controller

- In `apps/api/src/schemas/auth.ts`: add `username` to signupSchema (required string,
  max length from helpers, trim; optional pattern if you restrict characters). Order:
  email, username, password, displayName.
- In `apps/api/src/controllers/authController.ts` signup:
  - Check username uniqueness: UserService.findByUsername(body.username). If found,
    return 409 “Username already in use” (or i18n message).
  - Call UserService.create with email, username, password, displayName. Rest of flow
    (set email verified if needed, send verification email if mailer enabled, set
    session cookies, return user) unchanged.
  - Ensure created user has both email and username set.

### 2. helpers-requests and types

- In `packages/helpers-requests`: SignupBody (or equivalent) add `username: string`. So
  signup request has email, username, password, displayName (optional).

### 3. Web signup form

- In signup page/form (e.g. apps/web): add username input (required). Validate client-
  side: non-empty, length, optional format. On submit send email, username, password,
  displayName. Show server error for 409 (username already in use) with clear message.
  Optionally: async blur check for username availability (same as settings) to give
  immediate feedback; still validate on submit.

### 4. i18n

- Add keys for “Username”, “Username already in use”, “Username is required”, and any
  format/length errors. Use in signup form and API response if localized.

### 5. OpenAPI / docs

- Update main API OpenAPI spec: signup request body includes username (required);
  document 409 for username already in use.

## Key files

- `apps/api/src/schemas/auth.ts`
- `apps/api/src/controllers/authController.ts`
- `packages/helpers-requests` (SignupBody, signup request)
- Signup page/form in `apps/web` (e.g. app/(main)/signup or auth route)
- i18n originals/overrides for signup and auth messages

## Verification

- Signup with email, username, password (and optional displayName) creates user with all
  three; user can log in with email or username.
- Signup with duplicate username returns 409 and message “Username already in use” (or
  localized).
- Signup without username (if client allows) returns 400 validation error.
