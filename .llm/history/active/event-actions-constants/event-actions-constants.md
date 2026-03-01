# Event action constants

**Started:** 2025-02-28  
**Context:** Centralize management event action strings in a constants object and use them where events are recorded or seeded.

---

### Session 1 - 2025-02-28

#### Prompt (Developer)

action: 'admin_deleted',

all the event action types should be in a constants object and imported and used where needed

{
 ...
  admin: {
    ...
    deleted: 'admin_deleted'
  }
}

#### Key Decisions

- Added `EVENT_ACTIONS` in `@boilerplate/management-orm` with nested `admin` and `user` keys (created, updated, deleted, passwordChanged).
- Controllers and seed tool import and use these constants instead of string literals.

#### Files Created/Modified

- packages/management-orm/src/event-actions.ts (new)
- packages/management-orm/src/index.ts (export EVENT_ACTIONS)
- apps/management-api/src/controllers/adminsController.ts (use EVENT_ACTIONS.admin.*)
- apps/management-api/src/controllers/usersController.ts (use EVENT_ACTIONS.user.*)
- tools/generate-data/src/management/seed.ts (use EVENT_ACTIONS for MANAGEMENT_EVENT_ACTIONS)

---

### Session 2 - 2025-02-28

#### Prompt (Developer)

targetType: 'admin',

targetType should also have a reusable constant object similarly

#### Key Decisions

- Added `EVENT_TARGET_TYPES` in `@boilerplate/management-orm` (event-actions.ts) with `admin` and `user` keys.
- Controllers and seed tool use these constants for `targetType` when recording or seeding events.

#### Files Created/Modified

- packages/management-orm/src/event-actions.ts (EVENT_TARGET_TYPES)
- packages/management-orm/src/index.ts (export EVENT_TARGET_TYPES)
- apps/management-api/src/controllers/adminsController.ts (targetType: EVENT_TARGET_TYPES.admin)
- apps/management-api/src/controllers/usersController.ts (targetType: EVENT_TARGET_TYPES.user)
- tools/generate-data/src/management/seed.ts (TARGET_TYPES array from EVENT_TARGET_TYPES)
