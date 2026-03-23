# sidecar-validation-podverse

### Session 1 - 2026-03-22

#### Prompt (Developer)

Align Boilerplate sidecar validation with Podverse

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Added `packages/helpers/src/auth/auth-mode-constants.ts` as single source for AUTH_MODE allow-list; API and management-api `validateAuthMode` delegate to `validateAuthMode` from helpers.
- Extended `packages/helpers/src/startup/validation.ts` with Podverse-style validators (`validateOptional`, `validatePositiveNumber`, locale/supported-locales, URLs, API version path, `validateAuthMode` / `validateNextPublicAuthMode` alias), `ValidationSummary.skipped` / `defaultsUsed`, and updated `displayValidationResults` / `buildSummary`.
- Web and management-web sidecars: `requiredKeys`/`optionalKeys` synced to runtime-config types, startup validation + `process.exit(1)` on failure, `normalizeEnvValue`, `GET /runtime-config` returns 500 with `missingKeys` when required values missing.
- Optional `NEXT_PUBLIC_APP_TITLE_ICON` only on web (and management) sidecars.
- Docs: `LOCAL-ENV-OVERRIDES.md` note; sidecar `.env.example` PORT comment and management default `NEXT_PUBLIC_BRAND_NAME`.

#### Files Modified

- packages/helpers/src/auth/auth-mode-constants.ts
- packages/helpers/src/startup/validation.ts
- packages/helpers/src/index.ts
- apps/api/src/lib/startup/validation.ts
- apps/management-api/src/lib/startup/validation.ts
- apps/web/sidecar/src/server.ts
- apps/management-web/sidecar/src/server.ts
- apps/web/sidecar/.env.example
- apps/management-web/sidecar/.env.example
- docs/development/LOCAL-ENV-OVERRIDES.md
