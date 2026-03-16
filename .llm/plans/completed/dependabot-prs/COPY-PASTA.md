# Copy-pasta prompts – Dependabot PRs

Use these prompts **one at a time** in the order given in **00-EXECUTION-ORDER.md**. Wait for each
implementation to complete (lint, build, test pass) before running the next.

---

## Phase 1

**1. Production patch (PR #29)**

```
Implement the plan in .llm/plans/active/dependabot-prs/29-production-patch.md. Update dedent, pg,
and nodemailer versions across the repo, run npm install, then verify with type-check, build, lint,
and test.
```

**2. Dev deps (PR #21)**

```
Implement the plan in .llm/plans/active/dependabot-prs/21-dev-deps.md. Update @types/node,
storybook, globals, and related dev deps to the versions in the plan; run npm install and verify.
```

---

## Phase 2 – Docker actions

**3. docker/setup-buildx (PR #26)**

```
Implement the plan in .llm/plans/active/dependabot-prs/26-docker-setup-buildx.md. Bump
docker/setup-buildx-action to v4 in .github/workflows/publish-alpha.yml.
```

**4. docker/login (PR #28)**

```
Implement the plan in .llm/plans/active/dependabot-prs/28-docker-login.md. Bump docker/login-action
to v4 in .github/workflows/publish-alpha.yml.
```

**5. docker/build-push (PR #27)**

```
Implement the plan in .llm/plans/active/dependabot-prs/27-docker-build-push.md. Bump
docker/build-push-action to v7 in .github/workflows/publish-alpha.yml.
```

---

## Phase 3 – Types only

**6. @types/nodemailer (PR #11)**

```
Implement the plan in .llm/plans/active/dependabot-prs/11-types-nodemailer.md. Bump
@types/nodemailer to ^7.0.11 in apps/api and verify.
```

**7. @types/bcrypt (PR #13)**

```
Implement the plan in .llm/plans/active/dependabot-prs/13-types-bcrypt.md. Bump @types/bcrypt to
^6.0.0 in api and management-api and verify.
```

**8. @types/supertest (PR #18)**

```
Implement the plan in .llm/plans/active/dependabot-prs/18-types-supertest.md. Bump
@types/supertest to ^7.2.0 in api and management-api and verify.
```

---

## Phase 4 – Major upgrades

**9. joi (PR #12)**

```
Implement the plan in .llm/plans/active/dependabot-prs/12-joi.md. Bump joi to ^18.0.2 in api and
management-api; fix any breaking changes and run full verification.
```

**10. uuid (PR #15)**

```
Implement the plan in .llm/plans/active/dependabot-prs/15-uuid.md. Bump uuid to ^13.0.0 in orm,
management-orm, and generate-data; fix imports/usage if needed and verify.
```

**11. vitest (PR #14)**

```
Implement the plan in .llm/plans/active/dependabot-prs/14-vitest.md. Bump vitest to ^4.0.18 in api
and management-api; fix config or tests for Vitest 4 and verify.
```

**12. eslint (PR #16)**

```
Implement the plan in .llm/plans/active/dependabot-prs/16-eslint.md. Bump eslint to ^10.0.2;
update eslint.config.mjs if needed and fix any new lint issues.
```

**13. @eslint/js (PR #17)**

```
Implement the plan in .llm/plans/active/dependabot-prs/17-eslint-js.md. Bump @eslint/js to ^10.0.1
after eslint 10 is in place; verify lint and build.
```
