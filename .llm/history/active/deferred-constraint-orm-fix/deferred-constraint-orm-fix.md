# Deferred constraint ORM fix

**Started:** 2026-02-28  
**Context:** Implement plan to centralize SET CONSTRAINTS DEFERRED in ORM (UserService.create, ManagementUserService.createAdmin) and add to generate-data management seed.

---

### Session 1 - 2026-02-28

#### Prompt (Developer)

Deferred constraint: scope and proper fix in ORM — Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Main ORM: run `SET CONSTRAINTS ensure_user_has_credentials DEFERRED` at start of transaction in UserService.create; updated JSDoc.
- Management ORM: run `SET CONSTRAINTS ensure_management_user_has_cred_and_bio DEFERRED` at start of transaction in createAdmin; updated JSDoc.
- Generate-data management seed: run `SET CONSTRAINTS ALL DEFERRED` at start of ensureSuperAdmin transaction and of each per-row transaction in seedManagement.

#### Files Created/Modified

- `packages/orm/src/services/UserService.ts` – SET CONSTRAINTS + JSDoc
- `packages/management-orm/src/services/ManagementUserService.ts` – SET CONSTRAINTS + JSDoc
- `tools/generate-data/src/management/seed.ts` – SET CONSTRAINTS ALL DEFERRED in both transaction callbacks
