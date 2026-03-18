# improvements-checklist

**Started:** 2026-03-17  
**Context:** Plan set under `.llm/plans/active/improvements-checklist/` (01–12, COPY-PASTA). This history tracks execution of those plans.

---

### Session 1 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:11-12 go

#### Key Decisions

- Executed plan 01 (Styles: inline to CSS and unused). Replaced all inline `style={{ ... }}` in apps/web and apps/management-web with SCSS module classes.
- Added one SCSS module per page/component; did not change packages/ui (Textarea CSS var, CenterInViewport/Tooltip style props, stories left as-is per plan).
- Fixed one additional file not in original list: `apps/web/src/app/(main)/b/PublicSubmitForm.tsx` (same checkbox-row pattern).
- Unused-styles audit deferred (no automated check in repo; new modules are all used).

#### Files Created/Modified

- apps/web: page.module.scss (login), loading.module.scss, EditMessageForm.module.scss, BucketRolesClient.module.scss, PublicSubmitForm.module.scss; corresponding TSX updates (login page, loading, EditMessageForm, BucketRolesClient, PublicSubmitForm).
- apps/management-web: loading.module.scss, settings/BucketRolesClient.module.scss, BucketMessagesClient.module.scss; corresponding TSX updates (loading, BucketRolesClient, BucketMessagesClient).

---

### Session 2 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:14-15 go

#### Key Decisions

- Executed plan 02 (Form component organization audit). Audited packages/ui: all form primitives (Input, Select, CheckboxField, Textarea, PasswordStrengthMeter) and form layout (FormContainer, FormSection, FormActions, Form, Button, ButtonLink, CrudButtons, CrudCheckboxes, AuthForms) already live under `packages/ui/src/components/form/`. No strays to move. EditBucketAdminForm under bucket/ is a composed feature form that uses form controls; left in place per “form controls and form layout” scope.
- Documented form directory as single home: added `packages/ui/src/components/form/README.md` and a bullet in AGENTS.md Structure.

#### Files Created/Modified

- packages/ui/src/components/form/README.md (new)
- AGENTS.md (Structure: note on packages/ui form directory)

---

### Session 3 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:17-18 go

#### Key Decisions

- Executed plan 04 (Imports hierarchy and alphabetize). Added ESLint rule for import order: tried eslint-plugin-import first; it is incompatible with ESLint 10 (getTokenOrCommentAfter error). Switched to eslint-plugin-perfectionist and enabled `perfectionist/sort-imports` with groups: type, builtin+external, internal (@boilerplate/*), parent/sibling/index, style, unknown; internalPattern `^@boilerplate/`, newlinesBetween: 'always', alphabetical order. Ran `npm run lint:fix` to fix all violations across the repo.
- Documented import order in AGENTS.md (Code Quality § Import order) and referenced the rule name.

#### Files Created/Modified

- package.json (devDependency eslint-plugin-perfectionist)
- eslint.config.mjs (perfectionist plugin and sort-imports rule)
- AGENTS.md (Import order subsection)
- Many TS/TSX files (import order auto-fixed by lint:fix)

---

### Session 4 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:20-21 go

#### Key Decisions

- Executed plan 06 (Schemas grouping audit). Confirmed all Joi validation schemas live under apps/api/src/schemas/ (auth, buckets) and apps/management-api/src/schemas/ (auth, admins, buckets, events, messages, users). No ad-hoc schemas in controllers or routes; they only import from schemas/ or shared packages. Did not add index.ts: management-api has export name collisions (e.g. changePasswordSchema in auth and admins, changeUserPasswordSchema in users and admins), so a single re-export barrel would be ambiguous; left consumers importing from specific files as they do today.
- Documented layout in per-app schemas/README.md and in AGENTS.md (Structure).

#### Files Created/Modified

- apps/api/src/schemas/README.md (new)
- apps/management-api/src/schemas/README.md (new)
- AGENTS.md (Structure: validation schemas bullet)

---

### Session 5 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:27-28 go

#### Key Decisions

- Executed plan 03 (Reusable elements review). Audited SCSS mixins: single source in packages/ui/src/styles/_mixins.scss; no mixins in apps; no duplicates. Design tokens single source in _variables.scss. Documented mixin usage (focus-ring, disabled-state, at-least-sm in use; clearfix, truncate, at-least-md/lg available). Confirmed packages/ui component groups (form, layout, modal, navigation, table, feedback, bucket) and documented in new packages/ui/README.md with table and hooks (useDeleteModal, useTableFilterState, useAuthValidation). Did not consolidate shared types (no obvious duplicate DTOs found in quick scan; helpers-requests and helpers are canonical). Did not add new hooks; documented when to use existing ones. AGENTS.md Structure updated to point at packages/ui/README.md.
- No moves or removals: structure already correct; no duplicate mixins to merge.

#### Files Created/Modified

- packages/ui/README.md (new: styles/tokens/mixins, component structure, hooks)
- AGENTS.md (Structure: packages/ui bullet expanded with link to README)

---

### Session 6 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:30-31 go

#### Key Decisions

- Executed plan 05 (Constants: entity lengths and routes). Added length constants in packages/helpers/src/db/field-lengths.ts: SHORT_ID_LENGTH (12), SHORT_ID_INPUT_MIN_LENGTH (10), UUID_LENGTH (36), INVITATION_TOKEN_LENGTH (64), INVITATION_STATUS_MAX_LENGTH (20). Re-exported from db/index and helpers index. Resolved clash with existing shortId.ts SHORT_ID_LENGTH (10): removed SHORT_ID_LENGTH from shortId export; shortId now uses internal SHORT_ID_GENERATED_LENGTH = 10 for generateShortId; single SHORT_ID_LENGTH (12) exported from db for column/schema use. ORM entities User, Bucket, BucketAdminInvitation use these constants; apps/api createBucketAdminSchema uses SHORT_ID_INPUT_MIN_LENGTH and UUID_LENGTH for userId validation. Skipped schema/migration version constants (none found). Skipped API/management-api route path constants (paths not duplicated; plan optional).
- No route/path constant files added; web ROUTES unchanged.

#### Files Created/Modified

- packages/helpers/src/db/field-lengths.ts (new constants)
- packages/helpers/src/db/index.ts, packages/helpers/src/index.ts (exports)
- packages/helpers/src/shortId.ts (SHORT_ID_LENGTH → internal SHORT_ID_GENERATED_LENGTH; no longer export SHORT_ID_LENGTH)
- packages/orm/src/entities/User.ts, Bucket.ts, BucketAdminInvitation.ts (use length constants)
- apps/api/src/schemas/buckets.ts (userId min/max use SHORT_ID_INPUT_MIN_LENGTH, UUID_LENGTH)

---

### Session 7 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:33-34 go

#### Key Decisions

- Executed plan 07 (i18n improvements). Ran i18n:validate (passed). Found one missing key: ui.passwordStrength.hint used by packages/ui useAuthValidation (t('passwordStrength.hint', { minLength })); documented in I18N-KEYS.md but missing from apps’ originals. Added hint to apps/web and apps/management-web i18n/originals/en-US.json; ran i18n:sync; added Spanish translation for hint in both apps’ es.json. Ran i18n:compile and i18n:validate (all pass). Consolidation: compared web, management-web, helpers-i18n; no same-meaning differently-named keys found; ui namespace already shared and aligned. Placeholder audit: placeholders ({name}, {email}, {theme}, {field}, {count}, {minLength}, {time}, {max}, etc.) match what code passes; no typos found.
- Skipped moving shared strings to helpers-i18n (scope; apps own full ui copy per I18N-KEYS).

#### Files Created/Modified

- apps/web/i18n/originals/en-US.json (ui.passwordStrength.hint)
- apps/web/i18n/originals/es.json (hint Spanish translation after sync)
- apps/management-web/i18n/originals/en-US.json (ui.passwordStrength.hint)
- apps/management-web/i18n/originals/es.json (hint Spanish translation after sync)

---

### Session 8 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:40-41 go

#### Key Decisions

- Executed plan 08 (Performance review). Front-end: no dynamic imports or React.lazy in apps; bundle analyzer not present. Back-end: BucketService.findAncestry loads each parent in a loop (N+1); listBuckets already batches parent loads by unique parentId. DB indexes reviewed (init_database.sql)—indexes on owner_id, parent_bucket_id, short_id, bucket_admin, bucket_message, etc. List payloads use DTOs. Documented all findings in docs/performance/PERFORMANCE.md with prioritized table. Implemented low-effort: (1) Added @next/bundle-analyzer to apps/web and wrapped next.config when ANALYZE=true; (2) Added npm run build:analyze:web at root; (3) Created docs/performance/PERFORMANCE.md. Deferred: findAncestry N+1 fix (medium), dynamic imports (low–medium), response caching (medium).
- No behavior change; tests not run per agent rules (user may run).

#### Files Created/Modified

- docs/performance/PERFORMANCE.md (new: findings, bundle analysis instructions, backlog)
- apps/web/package.json (devDependency @next/bundle-analyzer)
- apps/web/next.config.ts (withBundleAnalyzer when ANALYZE=true)
- package.json (script build:analyze:web)

---

### Session 9 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:43-44 go

#### Key Decisions

- Executed plan 09 (Testing improvements). Added API integration tests for buckets CRUD: new file `apps/api/src/test/buckets.test.ts` covering GET /buckets (401, 200), POST /buckets (401, 400 missing name, 201), GET /buckets/:id (401, 404, 200), PATCH /buckets/:id (401, 404, 200), DELETE /buckets/:id (401, 404, 204). Used same patterns as bucket-admins.test.ts (createApiTestApp, createApiLoginAgent, FILE_PREFIX, destroyApiTestDataSources); response shapes use res.body.bucket / res.body.buckets per bucketsController. Did not add bucket-admin-invitations integration tests (scope). E2E: no new specs added (critical flows already covered by existing E2E). Documented test setup in new docs/testing/TEST-SETUP.md: prerequisites (make test_deps, help_test), integration test commands (npm run test, single-file vitest), route → test file tables for API and management-api, E2E make targets and API gate, pointers to AGENTS.md and E2E-PAGE-TESTING.md.

#### Files Created/Modified

- apps/api/src/test/buckets.test.ts (new)
- docs/testing/TEST-SETUP.md (new)

---

### Session 10 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:46-47 go

#### Key Decisions

- Executed plan 10a (Dependencies). Ran `npm outdated`: applied patch/minor updates only. Bumped next ^16.1.6 → ^16.1.7 (apps/web, apps/management-web, packages/ui peer and devDep), typescript-eslint ^8.57.0 → ^8.57.1 (root). Did not upgrade major versions (@faker-js/faker, @fortawesome/fontawesome-free, @types/node, dotenv, eslint-plugin-perfectionist, express-rate-limit, lint-staged, nanoid) to avoid breaking changes in this pass. Ran `npm install` (lockfile updated, 14 packages changed). Build and lint verified; fixed Prettier formatting in 5 files (unrelated to deps). Documented upgrade policy in AGENTS.md § Dependencies: patch/minor routinely, major separately with migration and testing; commit lockfile.

#### Files Created/Modified

- package.json (typescript-eslint ^8.57.1)
- apps/web/package.json, apps/management-web/package.json, packages/ui/package.json (next ^16.1.7)
- package-lock.json (refreshed)
- AGENTS.md (Dependencies § upgrade policy)
- apps/api/src/schemas/buckets.ts, apps/api/src/test/buckets.test.ts, docs/performance/PERFORMANCE.md, docs/testing/TEST-SETUP.md, packages/orm/src/entities/BucketAdminInvitation.ts (Prettier)

---

### Session 11 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:49-50 go

#### Key Decisions

- Executed plan 10b (Storybook). Inventoried packages/ui components vs *.stories.tsx: added stories for Divider, FormContainer, Tooltip, CopyLinkBox, PasswordStrengthMeter, ConfirmDeleteModal, CrudButtons. Each new story uses CSF (meta + named stories), tags: ['autodocs'], and argTypes where useful. PasswordStrengthMeter and ConfirmDeleteModal wrapped in NextIntlClientProvider with minimal inline messages so translations work in Storybook. Stories cover default and key states (Empty/TooShort/Weak/Fair/Good/Strong for PasswordStrengthMeter; Closed/Open/ConfirmLoading/Interactive for ConfirmDeleteModal; DeleteOnly/ViewAndDelete/ViewEditAndDelete for CrudButtons). Did not add stories for bucket/* page compositions or layout wrappers that depend on router/context. Verified Storybook build succeeds. Updated PACKAGES-UI.md to note that primitive/shared components have stories and composed page-level components may not.

#### Files Created/Modified

- packages/ui/src/components/layout/Divider/Divider.stories.tsx (new)
- packages/ui/src/components/form/FormContainer/FormContainer.stories.tsx (new)
- packages/ui/src/components/feedback/Tooltip/Tooltip.stories.tsx (new)
- packages/ui/src/components/layout/CopyLinkBox/CopyLinkBox.stories.tsx (new)
- packages/ui/src/components/form/PasswordStrengthMeter/PasswordStrengthMeter.stories.tsx (new)
- packages/ui/src/components/modal/ConfirmDeleteModal/ConfirmDeleteModal.stories.tsx (new)
- packages/ui/src/components/form/CrudButtons/CrudButtons.stories.tsx (new)
- packages/ui/PACKAGES-UI.md (Where stories live: note on primitive vs composed components)

---

### Session 12 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:56-57 go

#### Key Decisions

- Executed plan 11 (CRUD permission helpers refactor). **API (bucket-policy.ts):** Introduced internal factories makeCanBucketCrud(bit) and makeCanMessageCrud(bit); exported canReadBucket, canCreateBucket, canUpdateBucket, canDeleteBucket, canManageBucketAdmins, canManageBucketRoles as makeCanBucketCrud(CRUD_BITS.*); canCreateMessage, canUpdateMessage, canDeleteMessage as makeCanMessageCrud(CRUD_BITS.*). Left canReadMessage as a standalone function (isPublic check then read bit). All call sites unchanged (bucketsController, bucketMessagesController, bucketAdminsController, bucketRolesController). **Web (bucket-authz.ts):** Added internal checkBucketCrud(bucketId, bucketOwnerId, user, bit) and checkBucketMessagesCrud(..., bit); canViewBucketSettings, canCreateBucketRoles, canCreateChildBuckets now delegate to checkBucketCrud with appropriate bit; canEditBucketMessages delegates to checkBucketMessagesCrud(..., CRUD_BITS.update). canEditBucketRoles remains owner-only (unchanged). No shared package: API stays server-only with entity types; web stays async with ServerUser and API fetch. Documented helpers and call sites in apps/api/src/lib/BUCKET-POLICY.md; noted alignment with web bucket-authz.

#### Files Created/Modified

- apps/api/src/lib/bucket-policy.ts (factory refactor; same exports)
- apps/web/src/lib/bucket-authz.ts (checkBucketCrud, checkBucketMessagesCrud; public API unchanged)
- apps/api/src/lib/BUCKET-POLICY.md (new: helpers, call sites, alignment with web)

---

### Session 13 - 2026-03-17

#### Prompt (Developer)

@boilerplate/.llm/plans/active/improvements-checklist/COPY-PASTA.md:59-60 go

#### Key Decisions

- Executed plan 12 (Skills and Cursor rules review). Listed 47 skills and 16 rules; no duplicate skills (api vs api-testing are distinct; path-casing skill and rule are complementary). Added **AGENTS.md § When to use which skill**: table mapping task area (history/plans, API, web/E2E, i18n, forms/UI, DB/ORM, imports) to skills and rules; explicit note that file-modifying work must update history per llm-history and llm-history-tracking, and multi-step plans use plan-files-convention and .llm/plans/active/. Strengthened **LLM History** section to state the llm-history-tracking rule requires history update on any file-modifying response. Updated **plan-creation.mdc** to point at plan-files-convention skill for file layout (00-EXECUTION-ORDER, COPY-PASTA). Added **.cursor/skills/README.md** with quick-reference table and pointer to AGENTS.md for full task → skill mapping. No skills or rules removed; gaps filled by documentation.

#### Files Created/Modified

- AGENTS.md (When to use which skill table; LLM History + rule reference)
- .cursor/rules/plan-creation.mdc (link to plan-files-convention skill)
- .cursor/skills/README.md (new: quick reference, pointer to AGENTS.md)
