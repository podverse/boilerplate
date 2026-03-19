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

---

### Session 3 - 2026-03-18

#### Prompt (Developer)

https://github.com/podverse/boilerplate/pull/40 implement the changes needed for PR and be aware
of migration issues. do not commit the changes, i want to run them locally when you are finished

#### Key Decisions

- Bumped `@fortawesome/fontawesome-free` from ^6.7.2 to ^7.2.0 in packages/ui, apps/web,
  apps/management-web. No code changes required: v7 keeps `css/all.min.css` and existing icon
  class names (fa-solid fa-*) work; icons used (circle-info, angles-left, chevron-*, filter,
  user, spinner) are unchanged/aliased in v7.
- Migration notes: v7 uses fixed-width icons by default (fa-fw equivalent); sr-only removed (we
  use aria-hidden). No SCSS/Less/jQuery usage of Font Awesome in this repo.

#### Files Created/Modified

- `packages/ui/package.json` (@fortawesome/fontawesome-free ^7.2.0)
- `apps/web/package.json` (@fortawesome/fontawesome-free ^7.2.0)
- `apps/management-web/package.json` (@fortawesome/fontawesome-free ^7.2.0)
- `package-lock.json` (updated by npm install)

---

### Session 4 - 2026-03-18

#### Prompt (Developer)

https://github.com/podverse/boilerplate/pull/39 implement the changes needed for PR and be aware of
migration issues. do not commit the changes, i want to run them locally when you are finished

#### Key Decisions

- Bumped `nanoid` from ^3.3.11 to ^5.1.7 in packages/helpers (only direct dependency). No code
  changes: `customAlphabet(alphabet, defaultSize)` API is unchanged in nanoid 5; repo uses ESM and
  Node 24, and does not use async nanoid.
- Migration notes: v4 is ESM-only (we use "type": "module"); v5 removed async API and uses Web
  Crypto; Node 14/16 dropped (we use 24).

#### Files Created/Modified

- `packages/helpers/package.json` (nanoid ^5.1.7)
- `package-lock.json` (updated by npm install)

---

### Session 5 - 2026-03-18

#### Prompt (Developer)

https://github.com/podverse/boilerplate/pull/38 implement the changes needed for PR and be aware
of migration issues. do not commit the changes, i want to run them locally when you are finished

#### Key Decisions

- Bumped `express-rate-limit` from ^7.2.0 to ^8.3.1 in packages/helpers-backend-api. Updated
  rateLimit.ts: import and use `ipKeyGenerator` from express-rate-limit in `ipAndPathKeyGenerator`
  so custom keyGenerators satisfy v8 `keyGeneratorIpFallback` validation and IPv6 addresses get
  default /56 subnet masking; pass `req.ip ?? ''` to ipKeyGenerator to satisfy string type.
- v8 breaking: IPv6 now masked with /56 by default; custom keyGenerators that use req.ip should
  use ipKeyGenerator (docs). No change to limit/windowMs/handler/requestPropertyName API.

#### Files Created/Modified

- `packages/helpers-backend-api/package.json` (express-rate-limit ^8.3.1)
- `packages/helpers-backend-api/src/rateLimit.ts` (ipKeyGenerator import and usage)
- `package-lock.json` (updated by npm install)
