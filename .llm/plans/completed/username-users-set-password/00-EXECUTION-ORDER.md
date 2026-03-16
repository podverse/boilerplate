# Username users and set-password – execution order

## Phase 1: Schema and ORM (sequential)

- **01** – Database migration and ORM: add `username` (unique, nullable), make `email` nullable
  in `user_credentials`; constraint at least one of email/username set; add
  `set_password` token kind and expiry helper; UserService.create/update/find
  (findByUsername, findByEmailOrUsername); VerificationTokenService already supports
  kind, add usage for set_password.

## Phase 2: Auth (sequential after Phase 1)

- **02** – Main API auth: login by email or username (single identifier field); PublicUser and
  userToJson include username (optional) and email (optional); add POST /auth/set-password
  (public, body: token, newPassword); generate set_password token in verification-token.ts;
  consume in authController; JWT payload can keep sub, add username/email for display.

## Phase 3: Management create user and invite (sequential after Phase 2)

- **03** – Management API: create user accepts either (email + password) or (username only);
  when username-only: create user with random password hash, create set_password token,
  return setPasswordLink in response; optional body field initialBucketAdminIds (bucket
  IDs); create bucket_admin rows for new user. Management-web: create user form supports
  “email + password” vs “username only (send set-password link)”; when username-only,
  show bucket multi-select for initial admin assignment and copyable set-password link
  after create.

## Phase 4: Settings username (sequential after Phase 2)

- **04** – Web settings profile: add username field (editable); PATCH /auth/me accepts
  username; API endpoint GET /auth/username-available?username=... (or similar) for
  async check; settings UI: username input with onBlur uniqueness check and “username
  not available” error.

## Phase 5: Signup username (sequential after Phase 2)

- **05** – Signup: add required username field; validate format and uniqueness at submit;
  signupSchema and authController.signup; i18n for username label and errors.

## Phase 6: Bucket display (sequential after Phase 2)

- **06** – Everywhere owner/admins are displayed: use “username (displayName)” or
  “username” (no displayName) instead of email. Update management-api
  formatOwnerDisplayName; apps/web bucket detail (and related) pages; packages/ui
  BucketAdminsView; NavBar user label; ensure API responses (userToJson, bucket admins
  list) include username so clients can render consistently.
