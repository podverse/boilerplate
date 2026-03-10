# E2E Remaining Major Gaps – Fix Plan

## Overview

Address the highest-impact E2E gaps still listed in the CRUD/state/auth matrices and hardening follow-up: delete cancel path (web role), owner-protection assertions (bucket admins), remaining false-pass hardening (real IDs for deny tests, events own-only), and deterministic empty-state or validation coverage.

## Plan Files

- [01-web-role-delete-cancel-and-owner-protection.md](./01-web-role-delete-cancel-and-owner-protection.md)
- [02-hardening-deny-tests-and-events.md](./02-hardening-deny-tests-and-events.md)
- [03-empty-state-and-invite-expired.md](./03-empty-state-and-invite-expired.md)

## Execution Order

1. **01** – Web role delete cancel path; bucket admin owner-protection assertions.
2. **02** – Deny tests with real IDs; events own-only stronger assertions.
3. **03** – One empty-state test; invite expired token (or defer).

## References

- [Web CRUD/State/Auth Matrix](../../../docs/testing/E2E-CRUD-STATE-AUTH-MATRIX-WEB.md)
- [Management-web CRUD/State/Auth Matrix](../../../docs/testing/E2E-CRUD-STATE-AUTH-MATRIX-MANAGEMENT-WEB.md)
- [E2E Hardening Follow-up](../e2e-hardening-followup/00-SUMMARY.md)
