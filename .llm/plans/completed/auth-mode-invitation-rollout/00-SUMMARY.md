# Auth mode invitation rollout - Summary

## Scope

- Migrate auth behavior to exactly three modes:
  - `admin_only_username`
  - `admin_only_email`
  - `user_signup_email`
- Remove `MAILER_ENABLED` as a runtime behavior toggle; behavior derives from `AUTH_MODE`.
- Keep using the existing set-password invitation link flow for admin-created users.
- Add invite-link expiration env configuration (default 24 hours in env examples).
- Align API, management-api, web, OpenAPI/docs, integration tests, and E2E tests.

## Capability matrix

| Capability | admin_only_username | admin_only_email | user_signup_email |
| --- | --- | --- | --- |
| Public `/auth/signup` endpoint | Disabled | Disabled | Enabled |
| Signup page accessible | Disabled | Disabled | Enabled |
| Forgot/reset password | Disabled | Enabled | Enabled |
| Request/confirm email change | Disabled | Enabled | Enabled |
| Verify email flow | Disabled | Enabled | Enabled |
| Mgmt create-user returns invite link | Enabled | Enabled | Disabled |
| Invite completion required fields | username + password | email + username + password | N/A (no invite link) |
| Mailer-backed startup requirements | Must be absent/unused | Required | Required |

## Startup invariants

- `AUTH_MODE` must be one of the three supported values.
- For `admin_only_username`, startup fails if email/mailer-specific flows are configured as active.
- For `admin_only_email` and `user_signup_email`, startup requires mailer-related env inputs
  already validated by startup validation (SMTP host/port/from, app base URL).
- Runtime route gating must use a centralized capability resolver, not scattered env checks.

## Plan files

| ID | File | Purpose |
| --- | --- | --- |
| 01 | [01-auth-capability-matrix-and-env-contract.md](01-auth-capability-matrix-and-env-contract.md) | Lock behavior matrix and startup contract |
| 02 | [02-api-auth-mode-enforcement.md](02-api-auth-mode-enforcement.md) | API route/controller enforcement |
| 03 | [03-management-api-invite-link-ttl-and-mode-rules.md](03-management-api-invite-link-ttl-and-mode-rules.md) | Invite link policy and TTL in management-api |
| 04 | [04-web-mode-aware-auth-surface.md](04-web-mode-aware-auth-surface.md) | Web page/link visibility and route handling |
| 05 | [05-set-password-flow-extension-by-mode.md](05-set-password-flow-extension-by-mode.md) | Extend set-password completion fields by mode |
| 06 | [06-openapi-docs-and-env-examples.md](06-openapi-docs-and-env-examples.md) | OpenAPI/docs/env contract updates |
| 07 | [07-api-integration-test-matrix.md](07-api-integration-test-matrix.md) | API integration test matrix |
| 08 | [08-web-e2e-mode-matrix.md](08-web-e2e-mode-matrix.md) | Web E2E mode matrix |

## Dependency map

- **01** is foundational; all other plans depend on it.
- **02** depends on 01 and unlocks app behavior for 03/04/05.
- **03** depends on 01 and partially on 02 (shared mode resolver contract).
- **04** depends on 01 and 02 (UI visibility must reflect API capabilities).
- **05** depends on 01, 02, and 03 (set-password completion + invite issuance contract).
- **07** depends on 02, 03, and 05.
- **08** depends on 02, 04, and 05.
- **06** is final documentation pass after 07 and 08 are complete.

## Key decisions

- No backward compatibility alias for old `AUTH_MODE=admin_only`.
- No new `/signup-by-invitation` route; extend existing set-password invite flow.
- Mode-specific behavior is enforced both in API responses and web navigation surface.
- Invite links are only generated where public signup is disabled.
- Tests are split by deterministic mode outcome; no dual expected result in a single test.
