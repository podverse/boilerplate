# Improvements Checklist – Copy-pasta prompts

Use these prompts to ask an agent to execute each plan. Run phases in order; within a phase you
can run multiple prompts in parallel (e.g. different chats). Wait for each step to complete before
starting the next phase.

---

## Phase 1 (parallel)

**01 – Styles (inline to CSS and unused)**  
Execute the plan in `.llm/plans/active/improvements-checklist/01-styles-inline-to-css-and-unused.md`. Replace inline styles with CSS classes and remove unused styles/classes. Do not change product behavior; only styles and class names.

**02 – Form component organization audit**  
Execute the plan in `.llm/plans/active/improvements-checklist/02-form-component-organization-audit.md`. Audit form components and ensure they live only under the form directory; move any strays and update imports.

**04 – Imports hierarchy and alphabetize**  
Execute the plan in `.llm/plans/active/improvements-checklist/04-imports-hierarchy-and-alphabetize.md`. Enforce import order and hierarchy; fix violations and document the rule.

**06 – Schemas grouping audit**  
Execute the plan in `.llm/plans/active/improvements-checklist/06-schemas-grouping-audit.md`. Confirm schemas are grouped per app and document the layout; move or add index only if needed.

---

## Phase 2 (parallel)

**03 – Reusable elements review**  
Execute the plan in `.llm/plans/active/improvements-checklist/03-reusable-elements-review.md`. Review and consolidate mixins, primitives, UI structure, types, and state→hooks; document and remove duplicates.

**05 – Constants (entity lengths and routes)**  
Execute the plan in `.llm/plans/active/improvements-checklist/05-constants-entity-lengths-routes.md`. Extract entity length constants and route/path constants; use them in ORM entities and validation schemas.

**07 – i18n improvements**  
Execute the plan in `.llm/plans/active/improvements-checklist/07-i18n-improvements.md`. Fix missing translations, consolidate i18n keys, and audit placeholders; follow the i18n skill.

---

## Phase 3 (parallel)

**08 – Performance review**  
Execute the plan in `.llm/plans/active/improvements-checklist/08-performance-review.md`. Review front end and back end for performance; document findings and implement low-effort wins.

**09 – Testing improvements**  
Execute the plan in `.llm/plans/active/improvements-checklist/09-testing-improvements.md`. Add or improve integration and E2E tests for under-tested routes and flows; document test setup.

**10a – Dependencies**  
Execute the plan in `.llm/plans/active/improvements-checklist/10a-dependencies.md`. Check dependency versions, update lockfile, and fix any breaking changes.

**10b – Storybook**  
Execute the plan in `.llm/plans/active/improvements-checklist/10b-storybook.md`. Update Storybook stories to align with current components; document props and key states.

---

## Phase 4 (parallel)

**11 – CRUD permission helpers refactor**  
Execute the plan in `.llm/plans/active/improvements-checklist/11-crud-permission-helpers-refactor.md`. Group permission helpers and consider higher-order “can” functions; keep behavior identical and update call sites.

**12 – Skills and Cursor rules review**  
Execute the plan in `.llm/plans/active/improvements-checklist/12-skills-cursor-rules-review.md`. Review and align SKILLS and Cursor rules; remove duplicates, fill gaps, and update AGENTS.md.
