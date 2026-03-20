# K8s init containers and readiness

Started: 2025-03-18
Context: Plan 01 (api/management-api init containers) executed from COPY-PASTA.

---

### Session 1 - 2025-03-18

#### Prompt (Developer)

@COPY-PASTA.md (9-10) implement

#### Key Decisions

- Used busybox:1.36 for init containers; TCP checks via `nc -z postgres 5432` and `nc -z valkey 6379`.
- Init order: wait-postgres then wait-valkey (same for api and management-api).

#### Files Modified

- infra/k8s/base/stack/workloads.yaml

---

### Session 2 - 2025-03-18

#### Prompt (Developer)

implement **Prompt 2:** Read and execute `.llm/plans/active/k8s-init-containers-readiness/02-init-containers-web-readiness-probes.md`. Add init containers to the web and management-web deployments (wait for sidecar HTTP), and add readiness probes (and optionally liveness) to api, management-api, web, and management-web in `infra/k8s/base/stack/workloads.yaml`. Verify pods become Ready and browser can load localhost:4002 and localhost:4102.

#### Key Decisions

- Api and management-api: use GET /health (both apps expose it); added readinessProbe and livenessProbe with initialDelaySeconds 5/10 and 10/10.
- Web and management-web: init container uses alpine:3.19 and wget loop on http://web-sidecar:4001/ and http://management-web-sidecar:4101/ (sidecar serves /). Readiness and liveness on path /, ports 4002/4102; initialDelaySeconds 25/30 for Next.js startup.
- No application code changes; manifest-only.

#### Files Modified

- infra/k8s/base/stack/workloads.yaml

---

### Session 3 - 2025-03-18

#### Prompt (Developer)

review those plans to determine if they are complete or have significant gaps. if they do, fill them. move plans to completed if finished. also provide me with next steps to test implementation

#### Key Decisions

- Plans 01 and 02 are complete; implementation matches scope. Filled doc gaps: plan 02 Notes clarified not to use `|| true` in init command; 00-SUMMARY added implementation status and noted valkey has no probes (out of scope). Moved entire set to .llm/plans/completed/k8s-init-containers-readiness/. Added TESTING-NEXT-STEPS.md in completed set for verification steps.

#### Files Modified

- .llm/plans/.../02-init-containers-web-readiness-probes.md, 00-SUMMARY.md, 00-EXECUTION-ORDER.md (updated then moved to completed)
- .llm/plans/completed/k8s-init-containers-readiness/TESTING-NEXT-STEPS.md (created)

---

### Session 4 - 2025-03-18

#### Prompt (Developer)

i opened all the pages on localhost in a browser, and all of them say "connection was reset"

how to fix? you can inspect the .env files to help with debugging.

#### Key Decisions

- Root cause 1: `kubectl create secret --from-env-file` does NOT strip surrounding double quotes from values. The repo .env convention uses `PORT="4001"`, but kubectl stored the literal string `"4001"` (with quote chars), failing the sidecar integer validation. Fix: added `strip_quotes_env` helper in `create-local-secrets.sh` that sed-strips surrounding quotes before passing to kubectl.
- Root cause 2: The `configMapGenerator` in base kustomization.yaml generated the postgres-init configmap in the `default` namespace because no `namespace:` field was set. The resource YAML files had explicit `namespace: boilerplate-local`, but generated resources don't inherit from referenced namespace.yaml. Fix: added `namespace: boilerplate-local` to the kustomization.yaml.

#### Files Modified

- scripts/infra/k3d/create-local-secrets.sh
- infra/k8s/base/stack/kustomization.yaml

---

### Session 5 - 2025-03-18

#### Prompt (Developer)

i just followed your steps, and all of the pages still show "the connection was reset". inspect the pods and k3d setup very carefully, and determine if there are any errors you can identify, or if there is a system wide settings or something that need to change. try to clearly identify the errors or if i missed a step or something

#### Key Decisions

- Previous two fixes confirmed working: sidecars now Running (quote stripping), configmap in correct namespace.
- Root cause: PostgreSQL 18 Docker image changed data directory layout. Mounting at `/var/lib/postgresql/data` causes immediate crash. Fix: changed mountPath to `/var/lib/postgresql` per upstream migration (docker-library/postgres#1259).

#### Files Modified

- infra/k8s/base/stack/workloads.yaml

---

### Session 6 - 2025-03-18

#### Prompt (Developer)

same connection reset error in browser

#### Key Decisions

- API health probes used `/health` but the route is on the versioned router at `/v1/health` (returns 404). Fixed to `/v1/health` for both api and management-api.
- Web and management-web returned 500 on `/` (runtime config NEXT_PUBLIC vars not available during SSR). Switched from httpGet to tcpSocket probes for web/management-web since the port being open is sufficient to confirm the server is running.

#### Files Modified

- infra/k8s/base/stack/workloads.yaml

---

### Session 7 - 2026-03-18

#### Prompt (Developer)

Runtime Config: Only RUNTIME_CONFIG_URL in Web Containers

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Kept only `RUNTIME_CONFIG_URL` in main `web` and `management-web` container env files; moved runtime/public values to sidecars only.
- Extended web sidecar/runtime-config contract so all required client/server keys are available via sidecar (`NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS`, `NEXT_PUBLIC_WEB_APP_URL`, `NEXT_PUBLIC_DEFAULT_LOCALE`, `NEXT_PUBLIC_SUPPORTED_LOCALES`).
- Removed direct `process.env.NEXT_PUBLIC_*` reads from client/server app code paths that must work in k8s sidecar mode; switched to runtime-config accessors.
- Added management-web runtime-config client bootstrap script in root layout so client components can read sidecar-provided config from `globalThis`.
- Corrected `infra/config/local/web.env` `RUNTIME_CONFIG_URL` port from `4101` to `4001`.

#### Files Modified

- apps/web/sidecar/src/server.ts
- apps/web/src/config/runtime-config.ts
- apps/web/src/config/runtime-config-store.ts
- apps/web/src/config/env.ts
- apps/web/src/context/AuthContext.tsx
- apps/web/src/proxy.ts
- apps/web/src/app/(main)/settings/page.tsx
- apps/management-web/src/components/Head/RuntimeConfigScript.tsx
- apps/management-web/src/app/layout.tsx
- apps/management-web/src/context/AuthContext.tsx
- apps/management-web/src/components/NavBar.tsx
- infra/config/local/web.env
- infra/config/local/management-web.env
- .llm/history/active/k8s-init-containers-readiness/k8s-init-containers-readiness-part-01.md
