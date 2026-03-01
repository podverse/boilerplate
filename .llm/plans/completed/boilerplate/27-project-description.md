# Plan 27: Project description (Boilerplate-specific)

## Goal

Update the project description so it is clearly **Boilerplate**-specific and lists concrete implementation details. This makes the repo self-describing for contributors and LLMs.

## Scope

- **Root `package.json`**: Set `description` to a short, Boilerplate-specific sentence that reflects the actual stack and purpose (not generic "HTTP API and Next.js app").
- **README (or primary docs)**: Add or expand a "Project description" / "What is Boilerplate?" section that:
  - States that this is the **Boilerplate** monorepo (hello-world aligned with Podverse structure).
  - Lists **implementation details**, for example:
    - **Stack**: Node 24+, TypeScript, npm workspaces; Express API, Next.js web app, optional sidecar; Postgres (auth, init script), Valkey (messages).
    - **Features**: Signup, login, JWT auth; post messages; real-time dashboard; messages stored in Valkey; privacy toggle (messages visible only to user unless "viewable by anyone"); settings (locale, theme); i18n; SCSS, responsive layout, dark/light themes; OpenAPI spec and Swagger UI at `/api-docs`.
    - **Structure**: `apps/api`, `apps/web`, `apps/web/sidecar`; `packages/helpers`, `packages/orm`, optional `packages/ui` (shared components/styles); `infra/` (env templates, Docker, Postgres init, no k8s); `tools/` (placeholder with .gitkeep); scripts (validate, audit, bump-version, git hooks, labels); CI (Gitflow, `/test`); Makefile targets for validate, docker, local run. **Optional:** Management API and Management Web (`apps/management-api`, `apps/management-web`) for separate admin powers, audit events, and Events page; they consume the shared UI package when present.
- Keep the description accurate to what the plans actually implement; avoid promising features not yet built.

## Tasks

1. Update root `package.json` `description` to a single line that is Boilerplate-specific (e.g. "Boilerplate monorepo: Express API + Next.js app with auth, real-time messages (Valkey), Postgres, and Podverse-aligned structure" or similar).
2. In README.md (or the doc that serves as project overview):
   - Add or rewrite a **Project description** (or **What is Boilerplate?**) subsection.
   - Under it, add an **Implementation details** (or **What's included**) list covering:
     - Stack (Node, TS, Express, Next.js, Postgres, Valkey, etc.).
     - Features (auth, messages, dashboard, settings, i18n, themes, OpenAPI/Swagger).
     - Repo structure (apps, packages, infra, tools, scripts, CI, Makefile).
3. Ensure any existing high-level README intro aligns with the new description (no contradictory wording).

## Verification

- Root `package.json` has a `description` that clearly identifies the project as Boilerplate and hints at the stack.
- README (or main doc) has a dedicated section that describes Boilerplate and lists the implementation details above.
- Wording is consistent and accurate relative to the implemented plans (01–26).

## Dependencies

- Run after plans 01–26 are complete (or at least after docs and structure exist: 23, README, package.json). No technical dependency; can run in Phase 12 after git hooks (26).
