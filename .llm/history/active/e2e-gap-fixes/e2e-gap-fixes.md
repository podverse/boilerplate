# E2E Gap Fixes (Boilerplate E2E Testing Gap Fixes plan)

**Started:** 2025-03-10  
**Context:** Plan "Boilerplate E2E Testing Gap Fixes" — URL-state contract tests, skill reference updates, hardening, CRUD/state matrix.

---

### Session 1 - 2025-03-10

#### Prompt (Developer)

Boilerplate E2E Testing Gap Fixes. Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Phase 1: e2e-permission-actor-matrix and e2e-authz-matrix skills already referenced the split bucket-admin-edit specs (from prior work); confirmed and left as-is.
- Phase 2: Added URL-state contract specs for web bucket-detail, management-web bucket-detail, management-web buckets-list (existing), plus management-web users-list, events-list, and web buckets-list to satisfy plan 2.3 and 2.4.
- Phase 3: Invite valid-token assertion and flowHelpers URL-assertion comments were already in place; no further changes.
- Phase 4: Admin delete-cancel test was already added in admins-super-admin-full-crud; edit persistence and validation coverage confirmed present.

#### Files Created/Modified

- apps/web/e2e/buckets-list-url-state-contract.spec.ts (created)
- apps/management-web/e2e/users-list-url-state-contract.spec.ts (created)
- apps/management-web/e2e/events-list-url-state-contract.spec.ts (created)
- apps/web/e2e/buckets-list-url-state-contract.spec.ts: assertion aligned with existing buckets spec (add-bucket link visible).
