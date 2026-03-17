### Session 1 - 2026-03-16

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/17.txt:7-463 i am getting frustrated with seemingly random socket hang up errors. what can we do to help prevent these? do we need to slow the tests down somehow? do we need to remove parallel test running? (i thought they are already sequential). please help

add your recommendations

#### Key Decisions

- Confirmed API integration tests are already sequential (`fileParallelism: false`, `maxWorkers: 1`), so no parallelism change was applied.
- Added a targeted transient network retry helper for setup/login requests that intermittently fail with socket reset errors.
- Applied retries to the flaky `bucketAdminsCrud permission` setup flow and initial suite bootstrap login/user seed.
- Added process-level diagnostics in management-api test setup for `unhandledRejection` and `uncaughtException`.
- Enabled single retry in management-api Vitest config to reduce random one-off socket-reset failures.

#### Files Modified

- .llm/history/active/management-api-socket-hangup-stability/management-api-socket-hangup-stability-part-01.md
- apps/management-api/src/test/helpers/retry-transient-network.ts
- apps/management-api/src/test/management-buckets-messages.test.ts
- apps/management-api/src/test/setup.ts
- apps/management-api/vitest.config.ts

### Session 2 - 2026-03-16

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/17.txt debug

#### Key Decisions

- Identified the immediate blocker in terminal output as a TypeScript compile error in `apps/management-api/src/test/helpers/retry-transient-network.ts`, not E2E setup logic.
- Fixed type narrowing for optional `error.code` by using `'code' in error` and string type check before set membership lookup.

#### Files Modified

- .llm/history/active/management-api-socket-hangup-stability/management-api-socket-hangup-stability-part-01.md
- apps/management-api/src/test/helpers/retry-transient-network.ts
