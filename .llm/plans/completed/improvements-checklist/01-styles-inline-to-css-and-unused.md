# 01 – Inline styles to CSS classes and unused styles cleanup

## Scope

Replace inline `style={{ ... }}` usage with CSS classes (SCSS modules or shared classes). Remove
unused styles and class names. App code should not rely on inline styles; Storybook stories may
keep minimal inline styles for demo layout only where documented.

## Steps

### 1. List files with inline styles

Search for inline styles (e.g. `style={{` or `style={`) in:

- **apps/web**: `apps/web/src/app/(auth)/login/page.tsx`, `apps/web/src/app/(main)/bucket/[id]/loading.tsx`,
  `apps/web/src/app/(main)/bucket/[id]/EditMessageForm.tsx`, `apps/web/src/app/(main)/bucket/[id]/BucketRolesClient.tsx`
- **packages/ui**: `packages/ui/src/components/form/Textarea/Textarea.tsx`,
  `packages/ui/src/components/form/FormSection/FormSection.stories.tsx`,
  `packages/ui/src/components/layout/CenterInViewport/CenterInViewport.tsx`,
  `packages/ui/src/components/feedback/Tooltip/Tooltip.tsx`,
  `packages/ui/src/components/navigation/BackToButton/BackToButton.stories.tsx`
- **apps/management-web**: Include `apps/management-web/src/` in the search so any inline
  styles there are not missed.

Document each occurrence: file, line, and purpose (layout, spacing, override, etc.).

### 2. Replace inline styles in app code

For each app file (excluding stories):

- Add a SCSS module (or use an existing one) for the component/page.
- Define classes for the styles currently inline (e.g. margin, flex, list reset).
- Replace `style={{ ... }}` with `className={styles.xyz}` (or shared utility class).
- Ensure no visual regressions; check responsive behavior if relevant.

**Login page**: e.g. `style={{ marginBottom: '1rem' }}` → class in page or shared layout SCSS.

**Bucket loading**: loading skeleton styles → component or page SCSS module.

**EditMessageForm / BucketRolesClient**: flex, list, spacing → local module or shared layout classes.

### 3. Replace or allow inline styles in packages/ui

- **Textarea**: `--textarea-min-rows` CSS variable is a valid use of inline style for a dynamic
  prop; keep or move to a data attribute + CSS if preferred.
- **CenterInViewport**: `style` prop may be intentional for consumer override; document or replace
  with className + modifier classes.
- **Tooltip**: positioning styles may be dynamic; keep or refactor to CSS variables + class.
- **Stories**: Either move demo layout to classes in the story file or document that stories may
  use inline styles for one-off demo layout only. Prefer classes for consistency.

### 4. Audit unused styles and classes

- Run a pass over SCSS/CSS files (apps and packages/ui): identify selectors/classes that are never
  used (dead code).
- Remove unused rules and class names; ensure no references in TS/TSX to removed classes.
- Optionally use a lint or build-time check for unused exports/classes if available.

### 5. Document and verify

- Update any style guide or component docs that mention inline styles.
- Confirm no inline styles remain in app code (stories optional per above).

## Key files

- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/app/(main)/bucket/[id]/loading.tsx`
- `apps/web/src/app/(main)/bucket/[id]/EditMessageForm.tsx`
- `apps/web/src/app/(main)/bucket/[id]/BucketRolesClient.tsx`
- `packages/ui/src/components/form/Textarea/Textarea.tsx`
- `packages/ui/src/components/form/FormSection/FormSection.stories.tsx`
- `packages/ui/src/components/layout/CenterInViewport/CenterInViewport.tsx`
- `packages/ui/src/components/feedback/Tooltip/Tooltip.tsx`
- `packages/ui/src/components/navigation/BackToButton/BackToButton.stories.tsx`
- Relevant SCSS modules and global/layout styles

## Verification

- No inline `style={{ ... }}` in app code (excluding any documented exception, e.g. dynamic
  Tooltip position).
- Stories: either no inline styles or documented exception for demo layout.
- Unused styles/classes removed; `npm run lint` and `npm run build` pass.
- Visual check of login, bucket detail, bucket roles, and loading states.
