# Plan 03 - Shared E2E Helper and Selector Hardening

## Scope

Reduce cross-suite flake and permissive assertion risk by tightening helper contracts and selector strategy after Plan 01 and Plan 02 complete.

## Steps

1. Refactor modal-confirm delete helper to rely on stable, semantic anchors (role/test-id/text) instead of class-fragment matching and `.first()` fallbacks.
2. Replace over-broad URL regex checks with pathname-first assertions where route contracts are strict.
3. Replace generic error regex checks with route-specific and message-specific expectations.
4. Remove optional branches that mask regressions when expected controls should always render in seeded scenarios.
5. Standardize helper usage patterns across both suites and document the contract in helper comments.
6. Run final targeted reports for both suites, then run full report if shared helpers changed.

## Key Files

- [apps/management-web/e2e/helpers/flowHelpers.ts](apps/management-web/e2e/helpers/flowHelpers.ts)
- [apps/management-web/e2e/helpers/authAssertions.ts](apps/management-web/e2e/helpers/authAssertions.ts)
- [apps/web/e2e/helpers/flowHelpers.ts](apps/web/e2e/helpers/flowHelpers.ts)
- [apps/management-web/e2e/login-unauthenticated.spec.ts](apps/management-web/e2e/login-unauthenticated.spec.ts)
- [apps/web/e2e/bucket-messages-seeded-bucket-owner.spec.ts](apps/web/e2e/bucket-messages-seeded-bucket-owner.spec.ts)
- [apps/web/e2e/bucket-messages-seeded-bucket-admin.spec.ts](apps/web/e2e/bucket-messages-seeded-bucket-admin.spec.ts)

## Verification

- Execute suite-scoped report commands for web and management-web.
- If helper files changed, run full cross-app report once.
- Ensure no new skips/fixmes are introduced.
