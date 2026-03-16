# E2E Gaps Follow-Up (Post e2e-gaps-2025)

## Overview

After e2e-remaining-gaps and e2e-gaps-2025 were implemented, a pass over the CRUD matrices and current specs found two **remaining major gaps** that are scoped and implementable:

1. **Management-web events list empty state** – The events page supports a `search` param and shows `emptyMessage` when `events.length === 0` (see `apps/management-web/src/app/(main)/events/page.tsx`). Users list has an empty-state test; events list does not. Add one deterministic test: navigate to `/events?search=nomatchever123`, assert URL and empty-state message (e.g. noEvents) visible.
2. **Management-web admins list self-protection** – The admins page passes `currentUserId={user.id}` to the table (and `canDeleteAdmin`). The UI likely hides or disables delete for the current user's row so a super-admin cannot delete themselves. Add one test: as super-admin, open admins list, find the row for the logged-in admin (e2e-superadmin), assert that row has no delete button (or delete is disabled).

No other **major** gaps were identified that are both high-impact and clearly scoped without product/API changes. Remaining matrix items (e.g. "request failure branches", "action visibility by CRUD flags" for every surface) are either lower priority or require test infrastructure (e.g. API mocking) to implement deterministically.

## Plan Files

- [00-EXECUTION-ORDER.md](./00-EXECUTION-ORDER.md) – Phase order.
- [01-events-empty-state-and-admins-self-protection.md](./01-events-empty-state-and-admins-self-protection.md) – Events empty-state test; admins list self-protection assertion.

## Execution Order

1. **01** – Add events-list empty-state test; add admins-list self-protection test.

## References

- [Management-web CRUD/State/Auth Matrix](../../../docs/testing/E2E-CRUD-STATE-AUTH-MATRIX-MANAGEMENT-WEB.md)
- [E2E Gaps 2025 (implemented)](../e2e-gaps-2025/00-SUMMARY.md)
