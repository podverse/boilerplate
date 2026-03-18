# 02 – Form component organization audit

## Scope

Confirm that Form-related components (Input, Select, Checkbox, Textarea, and similar form
primitives) live only under `packages/ui/src/components/form/`. Move any such components that
currently live elsewhere; update exports and imports. Document that the form directory is the
single home for form controls.

## Steps

### 1. Search for form primitives outside form directory

Search the repo for component definitions or re-exports of:

- Input (text, email, etc.)
- Select / dropdown
- Checkbox / CheckboxField
- Textarea
- Radio (if present)
- Other form control primitives

Restrict to `packages/ui/src/components/` and app-level component directories. Exclude:

- Stories (they import from form/)
- Pages that only *use* form components (they import from form/)

Identify any component that *implements* a form control (or wraps one) but lives outside
`packages/ui/src/components/form/`.

### 2. Move strays into form directory

For each component found outside form/:

- Move the component (and its styles, tests, index) into an appropriate subdirectory under
  `packages/ui/src/components/form/`, following existing naming (e.g. `Input`, `Select`,
  `CheckboxField`).
- Update `packages/ui/src/index.ts` (or the relevant barrel) so the component is exported from
  the same public API as before, or from a clearer path.
- Update all imports across the repo (apps and packages) to use the new path or barrel export.

### 3. Document form directory as single home

- Add or update a short README or comment in `packages/ui/src/components/form/` stating that all
  form control components (inputs, selects, checkboxes, textareas, and form-specific layout
  like FormSection, FormContainer) live here.
- If AGENTS.md or CONTRIBUTING mentions component structure, add a note that form primitives
  belong in `packages/ui/.../form/`.

### 4. Verify exports and usage

- Ensure `packages/ui` build and exports still work; no broken imports in apps.
- Run lint and build from repo root.

## Key files

- `packages/ui/src/components/form/` (all subdirectories)
- `packages/ui/src/index.ts` (or equivalent barrel exports)
- Any app or package that imports form components (for import updates after moves)

## Verification

- No form control component (Input, Select, Checkbox, Textarea, etc.) exists outside
  `packages/ui/src/components/form/`.
- All imports resolve; `npm run build` and `npm run lint` pass.
- Form directory is documented as the single home for form controls.
