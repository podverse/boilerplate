# 08 - i18n and docs terminology

## Scope

Remove topic wording from UI/docs and add copy explaining inherited governance behavior.

## Steps

1. Replace topic labels/messages in both web apps and shared UI text.
2. Add explicit inherited-governance copy where settings/admins are root-scoped.
3. Remove obsolete translation keys and update locale parity.
4. Update developer/user docs for recursive bucket URLs and root-only governance.

## Key files

- `apps/web/i18n/originals/en-US.json`
- `apps/web/i18n/originals/es.json`
- `apps/management-web/i18n/originals/en-US.json`
- `apps/management-web/i18n/originals/es.json`
- `docs/**` (bucket/topic-related docs)

## Verification

- No UI copy references “topic” as a separate concept.
- i18n validation passes and no missing-key runtime errors.
