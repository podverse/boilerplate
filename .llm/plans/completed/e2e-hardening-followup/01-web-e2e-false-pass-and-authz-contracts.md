# Plan 01 - Web E2E False-Pass and Authz Contracts

## Scope

Harden web E2E specs so permission and invite flows cannot pass on generic 404/invalid states.

## Steps

1. Tighten invite helper logic so valid-token scenarios do not accept invalid-token terminal states.
2. Align "read-only/no-create" scenarios with true negative assertions (no create form/button, deny behavior on direct navigation).
3. Replace invalid-resource-ID deny tests with real seeded resources for permission-route checks.
4. Fill missing admin deny-path coverage for role-edit/message-edit using valid existing IDs.
5. Tighten route and content assertions where URL regexes are permissive.
6. Run targeted web scoped specs and fix flake-prone selectors (`nth`) with stable locators.

## Key Files

- [apps/web/e2e/invite-seeded-bucket-owner.spec.ts](apps/web/e2e/invite-seeded-bucket-owner.spec.ts)
- [apps/web/e2e/invite-seeded-bucket-admin.spec.ts](apps/web/e2e/invite-seeded-bucket-admin.spec.ts)
- [apps/web/e2e/invite-non-admin.spec.ts](apps/web/e2e/invite-non-admin.spec.ts)
- [apps/web/e2e/bucket-child-new-non-owner-admin-read-only-no-create.spec.ts](apps/web/e2e/bucket-child-new-non-owner-admin-read-only-no-create.spec.ts)
- [apps/web/e2e/bucket-nested-new-non-owner-admin-read-only-no-create.spec.ts](apps/web/e2e/bucket-nested-new-non-owner-admin-read-only-no-create.spec.ts)
- [apps/web/e2e/bucket-role-edit-admin-without-permission.spec.ts](apps/web/e2e/bucket-role-edit-admin-without-permission.spec.ts)
- [apps/web/e2e/bucket-role-edit-non-admin.spec.ts](apps/web/e2e/bucket-role-edit-non-admin.spec.ts)
- [apps/web/e2e/bucket-message-edit-admin-without-permission.spec.ts](apps/web/e2e/bucket-message-edit-admin-without-permission.spec.ts)
- [apps/web/e2e/bucket-message-edit-non-admin.spec.ts](apps/web/e2e/bucket-message-edit-non-admin.spec.ts)
- [apps/web/e2e/bucket-messages-seeded-bucket-owner.spec.ts](apps/web/e2e/bucket-messages-seeded-bucket-owner.spec.ts)
- [apps/web/e2e/bucket-messages-seeded-bucket-admin.spec.ts](apps/web/e2e/bucket-messages-seeded-bucket-admin.spec.ts)
- [apps/web/e2e/bucket-role-new-seeded-bucket-owner.spec.ts](apps/web/e2e/bucket-role-new-seeded-bucket-owner.spec.ts)

## Verification

- Run web-only scoped report commands for changed specs first.
- Confirm denied actors fail via authz route behavior (not just invalid ID 404).
- Confirm invite valid-token tests fail when token is intentionally corrupted.
