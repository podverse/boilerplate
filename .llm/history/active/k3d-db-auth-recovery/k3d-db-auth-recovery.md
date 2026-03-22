# Feature: k3d-db-auth-recovery

## Metadata
- Started: 2026-03-20
- Context: Fix "password authentication failed for user boilerplate_app_read" in k3d by documenting recovery and adding local_k3d_postgres_reset Make target.

## Sessions

### Session 1 - 2026-03-20

#### Prompt (Developer)

Fix k3d "password authentication failed for user boilerplate_app_read". Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Document recovery in K3D-ARGOCD-LOCAL.md Troubleshooting (password auth failure + make local_k3d_postgres_reset).
- Add Make target local_k3d_postgres_reset in Makefile.local.k3d.mk (delete PVC and postgres pod so init re-runs with current secrets).
- Cross-reference from LOCAL-ENV-OVERRIDES.md to k3d doc; add local_k3d_postgres_reset to Makefile.local.mk comment list.

#### Files Created/Modified

- docs/development/K3D-ARGOCD-LOCAL.md
- docs/development/LOCAL-ENV-OVERRIDES.md
- makefiles/local/Makefile.local.k3d.mk
- makefiles/local/Makefile.local.mk
- .llm/history/active/k3d-db-auth-recovery/k3d-db-auth-recovery.md

### Session 2 - 2026-03-20

#### Prompt (Developer)

i don't have to require using Ctrl+C this process should work cleanly and exit after finished with doing that

#### Key Decisions

- Make `local_k3d_postgres_reset` non-blocking by removing pod deletion from the target.
- Keep the essential operation (`delete pvc`) so Postgres re-initializes on fresh storage.
- Update the target message to clarify deployment will recreate Postgres pod and that API services should be restarted afterward.

#### Files Created/Modified

- makefiles/local/Makefile.local.k3d.mk
- .llm/history/active/k3d-db-auth-recovery/k3d-db-auth-recovery.md

### Session 3 - 2026-03-20

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/35.txt it still seems to be hanging. i exited with Ctrl+C. why? how to fix? 

#### Key Decisions

- Enter debug mode and add runtime instrumentation to `local_k3d_postgres_reset` before changing behavior.
- Log target entry, cluster-check result, PVC state before delete, and result after delete into the session debug NDJSON log.
- Ask user to rerun once and use runtime evidence to confirm whether `kubectl delete pvc` is blocking.

#### Files Created/Modified

- makefiles/local/Makefile.local.k3d.mk
- .llm/history/active/k3d-db-auth-recovery/k3d-db-auth-recovery.md

### Session 4 - 2026-03-20

#### Prompt (Developer)

Issue reproduced, please proceed.

#### Key Decisions

- Runtime logs confirmed `kubectl delete pvc` is the blocking command; it waited until user interrupt.
- Keep instrumentation active and change PVC delete to non-blocking with `--wait=false`.
- Continue to next run for post-fix verification before removing instrumentation.

#### Files Created/Modified

- makefiles/local/Makefile.local.k3d.mk
- .llm/history/active/k3d-db-auth-recovery/k3d-db-auth-recovery.md

### Session 5 - 2026-03-20

#### Prompt (Developer)

The issue has been fixed. Please clean up the instrumentation.

#### Key Decisions

- Remove all debug instrumentation from `local_k3d_postgres_reset` now that the user confirmed success.
- Keep the proven non-blocking fix (`kubectl delete pvc ... --wait=false`) intact.

#### Files Created/Modified

- makefiles/local/Makefile.local.k3d.mk
- .llm/history/active/k3d-db-auth-recovery/k3d-db-auth-recovery.md

### Session 6 - 2026-03-20

#### Prompt (Developer)

=== Environment Variable Validation ===
[Auth]
  ✓ AUTH_MODE - Set to admin_only_username
[Auth & Security]
  ✓ USER_AGENT - Valid format
[Main DB]
  ✓ DB_HOST - Set
  ✓ DB_PORT - Set to 5432
  ✓ DB_NAME - Set
  ✓ DB_READ_USERNAME - Set
  ✓ DB_READ_PASSWORD - Set
  ✓ DB_READ_WRITE_USERNAME - Set
  ✓ DB_READ_WRITE_PASSWORD - Set
[Management API]
  ✓ MANAGEMENT_API_PORT - Set to 4100
  ✓ BRAND_NAME - Set
  ✓ MANAGEMENT_JWT_SECRET - Set (length and strength OK)
[Management DB]
  ✓ MANAGEMENT_DB_HOST - Set
  ✓ MANAGEMENT_DB_PORT - Set to 5432
  ✓ MANAGEMENT_DB_NAME - Set
  ✓ MANAGEMENT_DB_USERNAME - Set
  ✓ MANAGEMENT_DB_PASSWORD - Set
[Management session cookies]
  ✓ MANAGEMENT_SESSION_COOKIE_NAME - Set
  ✓ MANAGEMENT_REFRESH_COOKIE_NAME - Set
  ✓ MANAGEMENT_JWT_ACCESS_EXPIRY_SECONDS - Set to 3600
  ✓ MANAGEMENT_JWT_REFRESH_EXPIRY_SECONDS - Set to 3600
  ✓ MANAGEMENT_COOKIE_SAME_SITE - Set
[Management users]
  ✓ USER_INVITATION_TTL_HOURS - Set to 24
=== Validation Summary ===
Total: 23, Passed: 23, Failed: 0
Required missing: 0
Startup validation completed successfully.
error: password authentication failed for user "boilerplate_app_read"
    at parseErrorMessage (/app/node_modules/pg-protocol/dist/parser.js:305:11)
    at Parser.handlePacket (/app/node_modules/pg-protocol/dist/parser.js:143:27)
    at Parser.parse (/app/node_modules/pg-protocol/dist/parser.js:37:38)
    at Socket.<anonymous> (/app/node_modules/pg-protocol/dist/index.js:11:42)
    at Socket.emit (node:events:508:28)
    at addChunk (node:internal/streams/readable:563:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)
    at Readable.push (node:internal/streams/readable:394:5)
    at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
  length: 116,
  severity: 'FATAL',
  code: '28P01',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'auth.c',
  line: '317',
  routine: 'auth_failed'
}

whyis this error happening? what is not aligned, or what step is missing? @/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/35.txt

The issue has been fixed. Please clean up the instrumentation.

#### Key Decisions

- Confirmed with runtime evidence that API and DB secrets are aligned, but Postgres role `boilerplate_app_read` does not exist.
- Confirmed Postgres logs: "Database directory appears to contain a database; Skipping initialization", so init scripts that create roles are not re-running.
- Replace PVC-only reset with robust sequence: scale Postgres down, wait pod deletion, delete/wait PVC deletion, scale up, wait rollout.

#### Files Created/Modified

- makefiles/local/Makefile.local.k3d.mk
- .llm/history/active/k3d-db-auth-recovery/k3d-db-auth-recovery.md

### Session 7 - 2026-03-20

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/35.txt it seems like this may have stalled

#### Key Decisions

- Use runtime pod scheduling evidence to diagnose stall during `rollout status`.
- Confirmed root cause: postgres deployment was scaled up before recreating `boilerplate-postgres-data` PVC.
- Update reset target to recreate PVC and wait for `Bound` before scaling postgres back up.

#### Files Created/Modified

- makefiles/local/Makefile.local.k3d.mk
- .llm/history/active/k3d-db-auth-recovery/k3d-db-auth-recovery.md
