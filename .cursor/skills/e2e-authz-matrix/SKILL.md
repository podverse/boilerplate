---
name: e2e-authz-matrix
description: Adds authorization matrix coverage to Playwright specs. Use when testing pages with role or ownership rules so tests assert visible, hidden, disabled, and forbidden action states.
version: 1.0.0
---

# E2E AuthZ Matrix

Use this skill for permission-sensitive routes and controls.

## Required role/ownership matrix

For each protected surface, include at least:

- Unauthenticated user
- Fully privileged user
- Restricted user or restricted row/entity condition (owner/self/superadmin cases)

## Required assertions

- Redirect or forbidden behavior for unauthenticated requests.
- Action visibility differences (`visible` vs `not rendered`) by role.
- Action interactivity differences (`enabled` vs `disabled`) by role/row state.
- Forbidden mutation attempts return stable UI feedback (error banner/toast/message) when applicable.

## Management-web specifics

- Prefer row-level assertions in resource tables for `view/edit/delete` action gating.
- Include superadmin/self-protection behavior when relevant.

## Completion checklist

- [ ] At least one non-happy-path authZ assertion exists for each permission-sensitive flow touched.
- [ ] Visibility and disabled-state checks are both present where UI supports both.
- [ ] No authZ scenario is marked complete with only route-load assertions.
