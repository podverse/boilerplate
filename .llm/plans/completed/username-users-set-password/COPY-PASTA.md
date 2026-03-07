# Copy-pasta prompts for execution

Use these prompts to execute each plan file in order. Run one phase at a time; wait for
completion before starting the next.

---

## Phase 1 – 01 only

**Prompt:** Execute the plan in
`.llm/plans/active/username-users-set-password/01-schema-username-email.md`. Do the
schema and ORM changes: add username to user_credentials (unique, nullable), make email
nullable, constraint, UserService findByUsername/findByEmailOrUsername and create
update, set_password token expiry helper. Run migration/regenerate combined init if
needed. Do not change auth or UI yet.

---

## Phase 2 – 02 only

**Prompt:** Execute the plan in
`.llm/plans/active/username-users-set-password/02-auth-login-setpassword.md`. Implement
login by email or username, PublicUser/userToJson with username and optional email, POST
/auth/set-password, and JWT/helpers-requests updates. Depends on 01 being done.

---

## Phase 3 – 03 only

**Prompt:** Execute the plan in
`.llm/plans/active/username-users-set-password/03-management-create-user-invite.md`.
Management API create user: email+password OR username-only with set-password link and
optional initialBucketAdminIds. Management-web create user form: toggle and bucket
multi-select, show setPasswordLink after create. Depends on 01 and 02.

---

## Phase 4 – 04 only

**Prompt:** Execute the plan in
`.llm/plans/active/username-users-set-password/04-settings-username.md`. Add username
field to web settings profile, PATCH /auth/me and GET /auth/username-available, onBlur
uniqueness check and “Username not available” error. Depends on 02.

---

## Phase 5 – 05 only

**Prompt:** Execute the plan in
`.llm/plans/active/username-users-set-password/05-signup-username.md`. Add required
username to signup (API schema and controller, web form, i18n). Depends on 02.

---

## Phase 6 – 06 only

**Prompt:** Execute the plan in
`.llm/plans/active/username-users-set-password/06-bucket-display-username.md`. Use
username (displayName) instead of email everywhere owners/admins are shown:
formatUserLabel helper, management-api formatOwnerDisplayName, web bucket pages,
BucketAdminsView, NavBar. Depends on 02.
