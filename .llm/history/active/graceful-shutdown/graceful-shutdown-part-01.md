# Graceful Shutdown

- **Started:** 2025-03-02
- **Context:** Implement plan: API and management-api destroy TypeORM DataSources on SIGTERM/SIGINT; sidecar closes HTTP server.

### Session 1 - 2025-03-02

#### Prompt (Developer)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Single `shuttingDown` guard in api and management-api so a second SIGINT/SIGTERM does not run teardown twice.
- Teardown runs in async IIFE inside `server.close()` callback; only call `destroy()` when `isInitialized` is true.
- Management-api: destroy `managementDataSource` then `appDataSource` (sequential).
- Sidecar: no guard (no async teardown); just `server.close(() => process.exit(0))`.

#### Files Modified

- apps/api/src/index.ts
- apps/management-api/src/index.ts
- apps/web/sidecar/src/server.ts
