# CI db-init fix

**Started:** 2026-03-15
**Context:** The GitHub Actions `validate` job "Create test database and run init" step was failing because `$DB_PORT` (a job-level env var set to `5532`) was not reliably expanding inside the step's `run:` block when the step also defined its own `env:` block. `psql` fell back to port 5432 and failed to connect. Additionally, the step was not idempotent — `CREATE DATABASE` would fail on re-runs if the DB already existed.

---

### Session 1 - 2026-03-15

#### Prompt (Developer)

Fix CI "Create test database and run init" — port still not reaching psql

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Set `PGHOST`, `PGPORT: "5532"`, `PGUSER` in the `db-init` step `env:` block so psql reads them automatically without shell variable expansion.
- Removed `-h localhost -p $DB_PORT -U postgres` flags from all `psql` commands (7 occurrences).
- Added `DROP DATABASE IF EXISTS boilerplate_test;` and `DROP DATABASE IF EXISTS boilerplate_management_test;` before their respective `CREATE DATABASE` statements to make the step idempotent on re-runs.

#### Files Created/Modified

- `.github/workflows/ci.yml`

### Session 2 - 2026-03-16

#### Prompt (Developer)

i don't think "npm run test" is the proper command for the comment since the make e2e with api tests is more thorough

#### Key Decisions

- Updated CI reminder (step warning and bot success/failure comments) to recommend `make E2E_API_GATE_MODE=on e2e_test` (and `e2e_test_report` for reports) instead of `npm run test`.

#### Files Modified

- `.github/workflows/ci.yml`
