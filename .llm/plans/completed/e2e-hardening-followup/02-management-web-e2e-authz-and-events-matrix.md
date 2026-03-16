# Plan 02 - Management-Web E2E Authz and Events Matrix

## Scope

Close management-web authz false-pass gaps by asserting deny behavior against real records and expanding events actor matrix confidence.

## Steps

1. Replace fabricated-ID deny checks with seeded real-record deny checks in bucket-message edit permission scenarios.
2. Strengthen limited-admin bucket-admin-edit deny assertions beyond URL-only checks (assert protected content is absent).
3. Tighten events own-only tests to verify exclusion of non-owned records with deterministic seeded data assertions.
4. Add missing admin-tier permutations for events (read/write combinations where applicable).
5. Harden broad table-or-empty branches with explicit expected-state checks when seed data guarantees visibility.
6. Run scoped management-web report commands and stabilize any flaky selectors.

## Key Files

- [apps/management-web/e2e/bucket-message-edit-admin-with-buckets-read-no-message-update.spec.ts](apps/management-web/e2e/bucket-message-edit-admin-with-buckets-read-no-message-update.spec.ts)
- [apps/management-web/e2e/bucket-admin-edit-limited-admin-no-buckets-read.spec.ts](apps/management-web/e2e/bucket-admin-edit-limited-admin-no-buckets-read.spec.ts)
- [apps/management-web/e2e/events-limited-admin-no-buckets-events-own-only.spec.ts](apps/management-web/e2e/events-limited-admin-no-buckets-events-own-only.spec.ts)
- [apps/management-web/e2e/events-super-admin-full-crud.spec.ts](apps/management-web/e2e/events-super-admin-full-crud.spec.ts)
- [apps/management-web/e2e/events-unauthenticated.spec.ts](apps/management-web/e2e/events-unauthenticated.spec.ts)
- [apps/management-web/e2e/buckets-super-admin-full-crud.spec.ts](apps/management-web/e2e/buckets-super-admin-full-crud.spec.ts)
- [apps/management-web/e2e/buckets-new-super-admin-full-crud.spec.ts](apps/management-web/e2e/buckets-new-super-admin-full-crud.spec.ts)

## Verification

- Run scoped management-web report commands for changed specs.
- Confirm deny-path tests fail if permission checks are intentionally loosened.
- Confirm own-only events tests prove non-owned records are absent.
