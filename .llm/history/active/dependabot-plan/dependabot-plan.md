# Dependabot plan (Plan 29)

**Started:** 2025-03-01  
**Context:** Implement Dependabot for boilerplate; align with Podverse monorepo; Node LTS ≥ 24 only.

---

### Session 1 - 2025-03-01

#### Prompt (Developer)

implement the dependabot plan. it should align in boilerplate repo with the podverse monorepo
dependabot. only node LTS >=24

#### Key Decisions

- Added `.github/dependabot.yml`: npm (root, same groups as Podverse), Docker for
  `infra/docker/local/{api,web,web-sidecar,management-api,management-web}`, github-actions.
- Node LTS ≥ 24 only: ignore `@types/node` and Docker `node` versions 18.x–23.x and odd
  (25.x, 27.x, 29.x); only 24.x, 26.x, 28.x allowed.
- Added `docs/repo-management/DEPENDABOT.md`; linked from GITHUB-SETUP.md (section 6) and
  README.

#### Files Created/Modified

- `.github/dependabot.yml` (new)
- `docs/repo-management/DEPENDABOT.md` (new)
- `docs/repo-management/GITHUB-SETUP.md` (section 6 Dependabot)
- `README.md` (link to DEPENDABOT.md)

#### Follow-up (same day)

- Plan 29 moved to completed: `.llm/plans/completed/boilerplate/29-dependabot.md`; removed from
  active; `00-EXECUTION-ORDER.md` and `00-SUMMARY.md` updated to mark Phase 14 (29) completed.

---

### Session 2 - 2025-03-15

#### Prompt (Developer)

implement the dependabot prs one after another

#### Key Decisions

- PRs 29 and 21 were already done (prior session). This session applied PRs 26, 28, 27 (Docker
  actions in `.github/workflows/publish-alpha.yml`), then 11, 13, 18, 12, 15, 14, 16, 17 in order.
- For PR #15 (uuid 13): added `uuid` to `apps/management-api` devDependencies so
  `createSuperAdminForTest.ts` resolves the module; orm, management-orm, generate-data already
  had uuid and were bumped to ^13.0.0.
- No code changes for joi 18, vitest 4, eslint 10, or @eslint/js 10; existing usage and flat
  config were compatible.

#### Files Created/Modified

- `.github/workflows/publish-alpha.yml` (setup-buildx v4, login v4, build-push v7)
- `apps/api/package.json` (@types/nodemailer, @types/bcrypt, @types/supertest, joi, vitest)
- `apps/management-api/package.json` (@types/bcrypt, @types/supertest, joi, vitest, uuid)
- `packages/orm/package.json` (uuid)
- `packages/management-orm/package.json` (uuid)
- `tools/generate-data/package.json` (uuid)
- `package.json` (root: eslint, @eslint/js)
