# 03 – Management: create user (email+password or username + set-password link + buckets)

## Scope

Management API: create user accepts either (email + password) or (username only). When
username-only: create user with a random/unusable password hash, create set_password
token, return setPasswordLink in response; optional body field for initial bucket admin
assignments (bucket IDs). Management-web: create user form supports both modes; when
username-only, show bucket multi-select for “assign as admin to these buckets” and
display copyable set-password link after create.

## Steps

### 1. Management API schemas and types

- In `apps/management-api/src/schemas/users.ts`:
  - CreateUserBody: allow two shapes—either `email` + `password` (+ optional displayName),
    or `username` only (+ optional displayName). Add optional `initialBucketAdminIds?:
    string[]` (array of bucket IDs). Validation: either (email and password) or (username
    only), not both, not neither. Use Joi alternatives or custom validation.
- Export CreateUserBody type for controller and OpenAPI.

### 2. UserService.create and token generation

- In `packages/orm/src/services/UserService.ts` (from 01): create already supports
  email optional, username optional, with “at least one” and password required. For
  username-only flow, management-api will pass a random hash (so user cannot log in
  until set-password).
- In `apps/management-api/src/controllers/usersController.ts`:
  - createUser: if body has username and no email, validate username uniqueness (e.g.
    UserService.findByUsername); create user with UserService.create({ username, email:
    null, password: randomHashedPassword, displayName }). Generate set_password token
    (use same generateToken/hashToken/expiry as main API; management-api may need to
    import from a shared place or duplicate minimal logic). Save token via
    VerificationTokenService (in main app DB)—management-api has access to main DB. Build
    setPasswordLink (e.g. base URL from config + path like /set-password?token=...).
    Optionally create bucket_admin rows: for each bucketId in body.initialBucketAdminIds,
    verify bucket exists and create BucketAdminService.create({ bucketId, userId:
    newUser.id, bucketCrud, messageCrud, adminCrud }) with full CRUD or desired default.
    Return 201 with user (userToJson) and setPasswordLink (and optionally
    expiresAt). If body has email + password, keep existing flow (create with email,
    set email verified, no link).
  - Ensure management-api can call VerificationTokenService and BucketAdminService (main
    app orm). If VerificationTokenService lives in main app only, management-api must
    have access to main DB and the same token creation logic (or call main API internal
    helper—prefer same DB from management-api for simplicity).

### 3. Management API OpenAPI and routes

- In `apps/management-api/src/openapi.ts`: document create user request body with
  alternatives (email+password vs username only), optional initialBucketAdminIds; document
  response with setPasswordLink when username-only.
- Routes: no change if body validation is in controller/schema.

### 4. Management-web create user form

- In `apps/management-web/src/components/users/UserForm.tsx`:
  - Add mode toggle or radio: “Create with email and password” vs “Create with username
    (user sets password via link)”.
  - When “username only”: show username input (required), optional displayName; do not
    show password. On submit call management API create with { username, displayName,
    initialBucketAdminIds } (bucket IDs from multi-select). After success, show success
    message and the setPasswordLink (copyable). Optionally show expiry.
  - When “email + password”: keep current fields (email, password, displayName); submit
    as today; no setPasswordLink.
  - Add bucket multi-select (only visible when username-only): fetch buckets from
    management API (e.g. GET /buckets), allow selecting multiple; send selected ids as
    initialBucketAdminIds.
- In `apps/management-web/src/app/(main)/users/new/page.tsx`: ensure UserForm has
  access to buckets list or pass from server if needed.

### 5. Management API base URL for set-password link

- Set-password page is on the **main web app**, not management-web. So setPasswordLink
  must use the main web base URL (e.g. WEB_APP_URL or similar in management-api config).
  Document in plan: management-api needs a config value for “main web app base URL” to
  build the link (e.g. `https://app.example.com/set-password?token=...`). If not present,
  return link without origin or placeholder so deployer can configure.

## Key files

- `apps/management-api/src/schemas/users.ts`
- `apps/management-api/src/controllers/usersController.ts`
- `apps/management-api/src/openapi.ts`
- `apps/management-web/src/components/users/UserForm.tsx`
- `apps/management-web/src/app/(main)/users/new/page.tsx`
- `packages/orm` (UserService, VerificationTokenService, BucketAdminService)
- Main API `apps/api/src/lib/auth/verification-token.ts` (token generation) or shared
  helper

## Verification

- Create user with email + password: same behavior as before; no setPasswordLink.
- Create user with username only: user created, setPasswordLink in response; opening link
  in main web shows set-password page; after setting password user can log in with
  username. Optional: initialBucketAdminIds creates bucket_admin rows; when user logs in
  they see those buckets.
- Management-web form: both create paths work; bucket multi-select appears only for
  username-only; after create (username-only) copyable link is shown.
