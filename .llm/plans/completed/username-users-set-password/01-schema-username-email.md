# 01 – Schema: username and optional email

## Scope

Add `username` to user credentials (unique, nullable). Make `email` nullable. Enforce that
at least one of email or username is set. Add `set_password` verification token kind and
expiry. Extend UserService and VerificationTokenService so the rest of the plan can create
username-only users and set-password tokens.

## Steps

### 1. Helpers: username length

- In `packages/helpers/src/db/field-lengths.ts` add `USERNAME_MAX_LENGTH` (e.g. 50, same as
  SHORT_TEXT_MAX_LENGTH or a dedicated constant). Export from `packages/helpers` so ORM
  and APIs use it.

### 2. Database migration

- New migration in `infra/database/migrations/` (e.g. `0004_user_credentials_username.sql`):
  - Add column `username VARCHAR(n)` (use length matching USERNAME_MAX_LENGTH), UNIQUE,
    NULLABLE.
  - Alter `user_credentials.email` to be NULLable (drop NOT NULL).
  - Add CHECK constraint: `(email IS NOT NULL OR username IS NOT NULL)`.
  - Ensure existing rows keep email set (no data change required if all current rows have
    email).
- Regenerate `infra/database/combined/init_database.sql` via
  `scripts/database/combine-migrations.sh` (or project equivalent).

### 3. ORM: UserCredentials entity

- In `packages/orm/src/entities/UserCredentials.ts`:
  - Add `username?: string | null` with `@Column`, length from helpers, unique: true,
    nullable: true.
  - Change `email` to `nullable: true` and keep unique.
- Update TypeORM so both email and username are optional at the type level; application
  logic enforces “at least one set” on create/update.

### 4. UserService

- In `packages/orm/src/services/UserService.ts`:
  - Add `findByUsername(username: string): Promise<UserWithRelations | null>` (look up by
    credentials.username).
  - Add `findByEmailOrUsername(identifier: string): Promise<UserWithRelations | null>`:
    try email first, then username (or single query with OR).
  - Update `create(data)`: accept `email?: string | null`, `username?: string | null`,
    `password: string`, `displayName?: string | null`. Validate that at least one of
    email or username is provided. For username-only, allow password to be a placeholder
    hash (caller responsibility). Insert credentials with email/username as provided.
  - Add `updateUsername(userId: string, username: string | null): Promise<void>` (update
    user_credentials.username).
  - Keep `updateEmail`; ensure any “at least one” invariant is maintained when updating
    email or username (e.g. do not allow clearing both).

### 5. VerificationTokenService and set_password kind

- In `apps/api/src/lib/auth/verification-token.ts` add
  `getSetPasswordExpiry(): Date` (e.g. 7 days). Use same pattern as
  getPasswordResetExpiry.
- `packages/orm` VerificationTokenService already creates/consumes by kind; ensure kind
  `set_password` is allowed (no schema change if kind is a string/varchar).
- Document in this plan: set_password token is created by management-api when creating a
  username-only user; consumed by main API POST /auth/set-password (see 02).

## Key files

- `packages/helpers/src/db/field-lengths.ts`
- `packages/helpers/src/index.ts` (export USERNAME_MAX_LENGTH)
- `infra/database/migrations/0004_user_credentials_username.sql` (new)
- `infra/database/combined/init_database.sql` (regenerated)
- `packages/orm/src/entities/UserCredentials.ts`
- `packages/orm/src/services/UserService.ts`
- `apps/api/src/lib/auth/verification-token.ts`

## Verification

- Migration applies cleanly; existing users still have email set; new row can have
  username only (email NULL) or email only (username NULL) or both; constraint rejects
  both NULL.
- UserService.findByUsername and findByEmailOrUsername return correct user.
- UserService.create with username only and a password hash succeeds; create with neither
  email nor username fails (or is validated in API layer and never called that way).
