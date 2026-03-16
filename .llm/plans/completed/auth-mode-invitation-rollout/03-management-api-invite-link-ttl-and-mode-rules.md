# 03 - Management API invite link TTL and mode rules

## Scope

Update management-api create-user behavior to issue invitation links only in admin-only modes,
with configurable expiration and deterministic response shape.

## Steps

1. Add a management-api env variable for invite expiration:
   - `USER_INVITATION_TTL_HOURS`
   - default value in `.env.example`: `24`
2. Validate the env value at startup:
   - integer
   - positive
   - clear validation error message when invalid
3. Update create-user policy by auth mode:
   - `admin_only_username`: return invitation/set-password link
   - `admin_only_email`: return invitation/set-password link
   - `user_signup_email`: do not return invitation link
4. Keep authorization constraints intact:
   - only management superadmin/admin roles that currently can create users can trigger flow.
5. Ensure returned link TTL uses the new env value and is testable.

## Key files

- `apps/management-api/src/controllers/usersController.ts`
- `apps/management-api/src/config/index.ts`
- `apps/management-api/src/lib/startup/validation.ts`
- `apps/management-api/src/schemas/users.ts`
- `apps/management-api/.env.example`

## Acceptance criteria

- Invite links are emitted only when mode is admin-only.
- Invite expiration is configurable by env and defaults to 24 hours in examples.
- `user_signup_email` create-user flow omits invite link data consistently.
- No regression in create-user authorization behavior.

## Verification

From repo root:

```bash
./scripts/nix/with-env npm run build
./scripts/nix/with-env npm run lint
./scripts/nix/with-env npm run test -- apps/management-api/src/test
```

Full behavior validation for mode combinations is completed in plan 07.
