---
name: e2e-crud-state-matrix
description: Enforces a strict CRUD and UI-state matrix for Playwright tests in apps/web and apps/management-web. Use when adding or reviewing E2E specs for create/read/update/delete, validation, show/hide, enable/disable, and empty/loading/error branches.
version: 1.0.0
---

# E2E CRUD State Matrix

Use this skill before marking E2E work complete.

## Required matrix per surface

For each tested page/component surface, explicitly track:

- Create
- Read
- Update
- Delete
- Show/hide controls by state
- Enable/disable transitions (including submit loading state)
- Validation (required fields, invalid input, server error text)
- Empty/loading/error states

## Quality bar

- Prefer deterministic assertions over broad fallback assertions.
- Do not accept “route loads” as sufficient for edit/delete flows.
- For update/delete, assert both action result and post-action persistence.
- For forms, assert button/input state transitions before and after submit.

## Minimum assertion patterns

- **Create**: submit valid form -> redirect/result -> row/detail visible.
- **Update**: edit field -> save -> revisit list/detail -> updated value visible.
- **Delete**: confirm dialog path -> row removed; cancel path -> row unchanged.
- **Validation**: empty/invalid submit -> remains on form -> validation visible.
- **State branches**: explicit assertions for each reachable empty/loading/error branch.

## Completion checklist

- [ ] Every modified surface has CRUD row status (`covered` or `deferred`).
- [ ] Deferred rows include rationale in the active plan/history.
- [ ] Changed specs pass targeted runs.
- [ ] Full relevant app E2E run passes.
