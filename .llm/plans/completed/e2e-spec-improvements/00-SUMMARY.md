# E2E Spec Improvement Plans – Per-Page

## Scope

Review all 48 E2E spec files against the bucket-admin-edit reference and skill criteria. One plan file per spec under this directory so each page's tests can be improved and run one by one.

## Reference standard

- **Well-constructed example:** [apps/management-web/e2e/bucket-admin-edit.spec.ts](../../../apps/management-web/e2e/bucket-admin-edit.spec.ts)
- **Full actor-matrix reference:** [apps/web/e2e/bucket-admin-edit.spec.ts](../../../apps/web/e2e/bucket-admin-edit.spec.ts)

Skills: e2e-readability, e2e-permission-actor-matrix, e2e-authz-matrix, e2e-crud-state-matrix, e2e-url-state-contracts, e2e-page-tests.

## Related plans

- [e2e-crud-permission-permutations-alignment.md](../e2e-crud-permission-permutations-alignment.md) – alignment snapshot per spec
- [e2e-bulletproof-matrices/](../e2e-bulletproof-matrices/) – CRUD/state/auth matrices for web and management-web

## Plan files (48)

### apps/web (22)

| File | Spec |
|------|------|
| web-bucket-admin-edit.md | bucket-admin-edit.spec.ts |
| web-bucket-role-edit.md | bucket-role-edit.spec.ts |
| web-bucket-role-new.md | bucket-role-new.spec.ts |
| web-bucket-settings.md | bucket-settings.spec.ts |
| web-bucket-message-edit.md | bucket-message-edit.spec.ts |
| web-bucket-messages.md | bucket-messages.spec.ts |
| web-bucket-detail.md | bucket-detail.spec.ts |
| web-bucket-child-new.md | bucket-child-new.spec.ts |
| web-bucket-nested-new.md | bucket-nested-new.spec.ts |
| web-buckets-new.md | buckets-new.spec.ts |
| web-buckets.md | buckets.spec.ts |
| web-short-bucket.md | short-bucket.spec.ts |
| web-send-message.md | send-message.spec.ts |
| web-invite.md | invite.spec.ts |
| web-profile.md | profile.spec.ts |
| web-settings.md | settings.spec.ts |
| web-login.md | login.spec.ts |
| web-signup.md | signup.spec.ts |
| web-forgot-password.md | forgot-password.spec.ts |
| web-reset-password.md | reset-password.spec.ts |
| web-dashboard.md | dashboard.spec.ts |
| web-home.md | home.spec.ts |

### apps/management-web (26)

| File | Spec |
|------|------|
| mgmt-bucket-admin-edit.md | bucket-admin-edit.spec.ts |
| mgmt-bucket-role-edit.md | bucket-role-edit.spec.ts |
| mgmt-bucket-role-new.md | bucket-role-new.spec.ts |
| mgmt-bucket-settings.md | bucket-settings.spec.ts |
| mgmt-bucket-message-edit.md | bucket-message-edit.spec.ts |
| mgmt-bucket-messages.md | bucket-messages.spec.ts |
| mgmt-bucket-detail.md | bucket-detail.spec.ts |
| mgmt-bucket-edit.md | bucket-edit.spec.ts |
| mgmt-bucket-child-new.md | bucket-child-new.spec.ts |
| mgmt-buckets-new.md | buckets-new.spec.ts |
| mgmt-buckets.md | buckets.spec.ts |
| mgmt-admin-edit.md | admin-edit.spec.ts |
| mgmt-admin-detail.md | admin-detail.spec.ts |
| mgmt-admin-role-new.md | admin-role-new.spec.ts |
| mgmt-admins-new.md | admins-new.spec.ts |
| mgmt-admins.md | admins.spec.ts |
| mgmt-user-edit.md | user-edit.spec.ts |
| mgmt-user-detail.md | user-detail.spec.ts |
| mgmt-users-new.md | users-new.spec.ts |
| mgmt-users.md | users.spec.ts |
| mgmt-profile.md | profile.spec.ts |
| mgmt-settings.md | settings.spec.ts |
| mgmt-events.md | events.spec.ts |
| mgmt-login.md | login.spec.ts |
| mgmt-dashboard.md | dashboard.spec.ts |
| mgmt-home.md | home.spec.ts |
