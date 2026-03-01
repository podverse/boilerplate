# Plan 24: OpenAPI docs and interactive test UI

## Scope

Document the API using **OpenAPI 3.x** (open standard) and serve an interactive docs page
(e.g. **Swagger UI**) so developers can read and try requests from the browser. The spec
is the single source of truth for available endpoints, request/response shapes, and auth;
the test UI is deployable with the API. If the Management API exists (plan 32), document it
with a separate OpenAPI spec (e.g. `apps/management-api/openapi.yaml`) or a dedicated
section so management endpoints are described and testable independently from the main API.

## Why OpenAPI + Swagger UI

- **OpenAPI 3.x** is the standard for describing REST APIs (JSON or YAML); tooling and
  codegen are widely supported.
- **Swagger UI** (or ReDoc) consumes an OpenAPI spec and renders a page with "Try it out"
  so you can send real requests. Served from the API app so it stays in sync and is
  available in every environment (local, Docker, deployed).

## Steps

1. **OpenAPI spec**
   - Add an OpenAPI 3.x document (e.g. `apps/api/src/openapi.yaml` or
     `apps/api/openapi.yaml`). Describe: servers (e.g. http://localhost:4000), paths,
     request bodies, responses, and security (e.g. bearerAuth for JWT).
   - Include all implemented routes: health (if any), auth (signup, login, logout),
     messages (POST /api/messages, GET /api/messages), optional PATCH /api/me for
     profile visibility. Use schemas for request/response bodies (align with Joi or DTOs
     from plans 14, 15, 22).
   - Document security: `securitySchemes` with bearerAuth (JWT). Mark protected paths with
     `security: [{ bearerAuth: [] }]`.

2. **Serve the spec**
   - Expose the spec as JSON or YAML over HTTP (e.g. GET /api-docs/openapi.json or
     /openapi.yaml) so Swagger UI can load it. Either serve the static file or generate
     it from the same source.

3. **Swagger UI (or ReDoc)**
   - Add a dependency (e.g. `swagger-ui-express` for Express) and mount the UI at a
     route such as `/api-docs` or `/docs`. Point it at the spec URL (same origin or
     absolute path). In development and Docker, the page should load and "Try it out"
     should hit the same API (same port or document the base URL).
   - Optional: disable Swagger UI in production or restrict by env (e.g. only when
     NODE_ENV !== production or when ENABLE_API_DOCS=true). For a boilerplate, leaving
     it on is acceptable; document in README.

4. **Auth in the test UI**
   - Swagger UI supports "Authorize" with Bearer token. Document in the spec how to get a
     token (e.g. call POST /auth/login, copy the token, paste into Authorize). Optional:
     add a short note in the UI or in README (e.g. "Log in via POST /auth/login, then
     Authorize with the returned token").

5. **Keep spec in sync**
   - Prefer maintaining the spec by hand (or from a single source) so it stays the
     contract. When adding or changing routes (auth, messages, etc.), update the OpenAPI
     file. Optionally add a CI or script that validates the spec (e.g. openapi lint) or
     that the server's routes match the spec; for boilerplate, manual sync is fine if
     documented.

6. **Documentation**
   - README or docs: "API documentation and testing: run the API and open
     http://localhost:4000/api-docs (or /docs)." Mention that the spec is OpenAPI 3.x
     and can be imported into Postman, Insomnia, or other tools.

## Key files

- `apps/api/openapi.yaml` (or `apps/api/src/openapi.yaml`)
- `apps/api` route that serves the spec (e.g. GET /api-docs/openapi.json)
- `apps/api` route that serves Swagger UI (e.g. GET /api-docs) using swagger-ui-express
- `apps/api/package.json` (add swagger-ui-express and possibly a type for the spec)
- README or docs/DEVELOPMENT.md (link to /api-docs)

## Verification

- Start the API; open /api-docs in the browser; Swagger UI loads and shows all paths.
- Use "Try it out" on a public route (e.g. health or signup); request succeeds.
- Use "Authorize" with a JWT from login; "Try it out" on a protected route (e.g. GET
  /api/messages) succeeds with 200.

## Dependencies

- Plans 14, 15, 22 (API routes and auth) must be implemented so the spec and UI describe
  real endpoints. Run this plan after Phase 6 and after plan 22 (messages API).
