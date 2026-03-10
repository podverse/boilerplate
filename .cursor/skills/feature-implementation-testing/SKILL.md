---
name: feature-implementation-testing
description: When creating or implementing plans for features that touch api, management-api, web, or management-web, include the corresponding tests—integration tests for api/mgmt-api, E2E tests for web/mgmt-web.
version: 1.0.0
---

# Feature Implementation Testing Requirement

When **creating or implementing plans** for features that touch `apps/api`, `apps/management-api`, `apps/web`, or `apps/management-web`, adding or updating the corresponding tests is a **requirement**, not optional.

**Terminology:** **Integration tests** = api/management-api (Vitest, no browser). **E2E tests** = web/management-web (Playwright, browser).

## Requirement by app

- **api / management-api**: Add or update **integration tests** (see **api-testing**). If the change affects UI in web or management-web, also add or update the relevant **E2E tests** (see **e2e-page-tests**).
- **web / management-web**: Add or update **E2E tests** (see **e2e-page-tests**, **e2e-crud-state-matrix**, **e2e-permission-actor-matrix** as applicable).

## When this applies

- Implementing a plan file that touches any of the four apps.
- Implementing a feature (with or without a plan) that makes meaningful changes to api, management-api, web, or management-web.

Apply the relevant skill for _how_ to write the tests (api-testing for integration tests, e2e-page-tests and related E2E skills for Playwright specs).
