# E2E Remaining Gaps (plan implementation)

**Started:** 2025-03-10  
**Context:** Plan `.llm/plans/active/e2e-remaining-gaps/` — 01 role delete cancel + owner protection, 02 deny/events hardening, 03 empty-state + invite expired.

---

### Session 1 - 2025-03-10

#### Prompt (Developer)

if the plan calls for work to be completed, then implement the plan

#### Key Decisions

- 01: Added role delete cancel test in bucket-role-edit-seeded-bucket-owner.spec.ts (create role → click delete → dismiss dialog → assert role still visible). Added owner-protection test in bucket-settings-seeded-bucket-owner.spec.ts (admins tab: owner row has no delete button).
- 02: Web message-edit deny specs already use real message IDs via createMessageAndGetId; no change. Management-web events-limited-admin: added assertion that "E2E Super Admin" has count 0 to strengthen own-only.
- 03: Empty-state already covered by buckets-seeded-bucket-owner.spec.ts (search=nonexistentbucketxyz999, empty message + add-bucket link). Invite: added file-level comment deferring expired-token check until seed/API supports it.

#### Files Created/Modified

- apps/web/e2e/bucket-role-edit-seeded-bucket-owner.spec.ts (role delete cancel test)
- apps/web/e2e/bucket-settings-seeded-bucket-owner.spec.ts (owner row no-delete test)
- apps/management-web/e2e/events-limited-admin-no-buckets-events-own-only.spec.ts (E2E Super Admin count 0)
- apps/web/e2e/invite-seeded-bucket-owner.spec.ts (deferral comment for expired token)
