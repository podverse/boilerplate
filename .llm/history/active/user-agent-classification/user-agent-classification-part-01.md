# user-agent-classification

### Session 1 - 2026-03-24

#### Prompt (Developer)

USER_AGENT: drop runtime generation, use classification defaults

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Ran `npm run prettier:write` on touched TS/MD sources after first lint (AGENTS.md prettier warning was pre-existing).
- Set full `USER_AGENT` defaults in `base.yaml`; `remote_k8s` overlay uses `Bot Production/...` for API and management-api.
- API `USER_AGENT` uses `brand` anchor; `setup.sh` applies optional `USER_AGENT` and `MANAGEMENT_USER_AGENT` for management-api env files.
- Removed `getEffectiveUserAgent` and `packages/helpers/src/userAgent.ts`; validation reads trimmed `USER_AGENT` only.
- Test setup files include valid `USER_AGENT` for api and management-api integration tests.

#### Files Created/Modified

- infra/env/classification/base.yaml
- infra/env/overrides/remote-k8s.yaml
- scripts/local-env/setup.sh
- dev/env-overrides/examples/brand.env.example
- docs/development/LOCAL-ENV-OVERRIDES.md
- docs/development/ENV-REFERENCE.md
- apps/api/src/config/index.ts
- apps/api/src/lib/startup/validation.ts
- apps/api/src/test/setup.ts
- apps/management-api/src/config/index.ts
- apps/management-api/src/lib/startup/validation.ts
- apps/management-api/src/test/setup.ts
- packages/helpers/src/index.ts
- packages/helpers/src/userAgent.ts (deleted)
