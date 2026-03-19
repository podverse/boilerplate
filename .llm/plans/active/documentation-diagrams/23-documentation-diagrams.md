# Plan 23: Documentation and diagrams

## Scope

Add documentation and diagrams: repo overview, dev flow (install, run api/web, docker, env
vars), infra (postgres, valkey, docker), and architecture (data flow web → api → orm/Valkey).
Diagrams: high-level architecture, request flow, optional DB/Valkey schema. Place under
`docs/` with clear naming. Can be started in parallel with Phase 7 and updated as features
land.

## Steps

1. **Repo overview**
   - Document in README or `docs/README.md`: what boilerplate is (hello-world boilerplate
     aligned with podverse); main features (signup, login, messages, dashboard, privacy);
     stack (Node 24, Next.js, Express, Postgres, Valkey). Link to podverse where
     relevant.

2. **Dev flow**
   - `docs/DEVELOPMENT.md` or section in README: clone, npm install, copy env examples
     (apps/api/.env.example, apps/web/.env.example or infra/config), run api (npm run
     dev:api), run web (npm run dev:web or dev:all), run with docker (make local_* targets).
   - List required env vars and where they are documented (e.g. ENV.md in apps/api).
   - Link to API documentation: when the API is running, OpenAPI docs and interactive
     testing are at /api-docs (see plan 24).

3. **Infra**
   - `docs/INFRASTRUCTURE.md`: postgres and valkey (what they're for, how to start with
     docker, env vars); docker layout (api, web, sidecar, postgres, valkey); no k8s.
   - Point to infra/config and infra/database.

4. **Architecture**
   - `docs/ARCHITECTURE.md`: high-level data flow: browser → Next.js (web) → API (Express) →
     Postgres (users, auth) and Valkey (messages). Optional: role of sidecar (runtime
     config).

5. **Diagrams**
   - High-level: boxes for Web App, API, Postgres, Valkey, Sidecar; arrows for "HTTP" or
     "config". Use Mermaid (in Markdown) or a small image. Place in docs/ (e.g.
     `docs/architecture-overview.md` or `docs/diagrams/overview.mmd`).
   - Request flow: e.g. "Login: Web → POST /auth/login → API → ORM → Postgres"; "Post
     message: Web → POST /api/messages → API → Valkey."
   - Optional: DB schema (users table); Valkey key layout (messages:{userId}).

6. **Naming**
   - Use clear filenames: DEVELOPMENT.md, INFRASTRUCTURE.md, ARCHITECTURE.md; diagrams
     named by content (overview, request-flow, schema). Follow project docs conventions
     if any (e.g. podverse documentation-conventions skill).

## Key files

- `README.md` (overview and links)
- `docs/DEVELOPMENT.md` (or README section)
- `docs/INFRASTRUCTURE.md`
- `docs/ARCHITECTURE.md`
- `docs/` diagram files (Mermaid or image)

## Verification

- New contributor can follow DEVELOPMENT.md to install and run api + web + docker.
- INFRASTRUCTURE and ARCHITECTURE explain where data lives and how requests flow. Diagrams
  render (e.g. in GitHub or in a viewer) and match the described flow.
