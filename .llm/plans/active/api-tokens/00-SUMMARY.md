# API tokens for web app users – Summary

## Scope

- **Who:** Users of the main web app (apps/web), from their settings page.
- **What:** Create and revoke API tokens to call the main API (apps/api) programmatically with
  `Authorization: Bearer <token>` instead of (or in addition to) session/cookie auth.
- **Token attributes:** Name (user-defined), user-set expiration, permissions (CRUD + which
  endpoints/resources).
- **UX:** One-time display of raw token after create, with copy-to-clipboard and a clear
  “store it now” message; list/revoke existing tokens (no raw value shown).
- **Permissions:** CRUD permissioning aligned with management API conventions: same CrudOp
  (create, read, update, delete) and bitmask style (see
  `packages/management-orm/src/entities/AdminPermissions.ts`). Users pick which resources
  (endpoint groups) the token can access and which CRUD ops per resource. Default for new
  token: read only selected.
- **UI:** Top-level checkboxes for Create, Read, Update, Delete; plus selection of which
  endpoints/resources the token can access. Reusable components in `@boilerplate/ui` so
  management-web and web can both use the same API-token settings block.
- **Alignment:** Main API and web aligned via shared packages (e.g. `@boilerplate/helpers`
  for CRUD/permission constants and types).

## Plan files

| ID | File | Description |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Phase order and pointers |
| – | 00-SUMMARY.md | This file |
| 01 | 01-api-tokens-backend.md | DB, ORM, API routes, auth middleware |
| 02 | 02-api-tokens-settings-ui.md | Reusable UI components; settings integration |
| 03 | 03-api-tokens-shared-and-docs.md | Shared types, i18n, skill, docs |

## Dependency map

- **03** (shared types + i18n): No plan dependencies; required by 01 and 02.
- **01**: Depends on shared types and resource list (from 03 or helpers).
- **02**: Depends on i18n keys (03) and on 01 for API contract.
- **Phase 5** (skill + docs): Depends on 01 and 02 being implemented.

## Key decisions

- **Token format:** Opaque string (e.g. `bp_` + 32 bytes hex); stored as SHA-256 hash; same
  hash length domain as verification tokens where applicable.
- **Permissions:** JSONB `Record<Resource, number>` (CRUD bitmask per resource). Default for
  new token: read-only (e.g. `{ me: 2, auth: 2 }`).
- **Auth order:** Try JWT first; if not JWT, treat as API token lookup. API token requests
  get `req.user` + `req.apiTokenPermissions` and are restricted by middleware per route.
- **Management API alignment:** Use same CrudOp names and bitmask values as
  `packages/management-orm`; document that main API token permissions mirror this convention.
- **Resources (initial):** e.g. `me` (GET/PATCH me), `auth` (change-password,
  request-email-change, etc.). Document route → resource + op mapping for consistency.
- **Token management (create/list/revoke) is JWT-only:** API tokens cannot create, list, or
  revoke tokens; reject with 403 if an API token is used on those routes.
- **Permissions validation:** The permissions object may contain only keys from
  MAIN_API_RESOURCES; reject unknown keys with 400. Token name max length 50
  (`SHORT_TEXT_MAX_LENGTH`).
- **Expiration:** No maximum token lifetime in this plan; user can set any future
  expiration. Optionally add a cap (e.g. 1 year) in implementation if desired.
