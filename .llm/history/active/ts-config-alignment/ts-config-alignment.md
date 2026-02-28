# TS config alignment with Podverse and modern options

**Started:** 2026-02-27  
**Context:** Implement plan "Boilerplate TypeScript config: alignment with Podverse and modern options" so boilerplate TS configs are as modern as possible and aligned with Podverse.

### Session 1 - 2026-02-27

#### Prompt (Developer)

Boilerplate TypeScript config: alignment with Podverse and modern options

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Pretty-printed `tsconfig.base.json` to match Podverse style (multi-line).
- Next apps (web, management-web): set `target` to `ES2022` and `lib` to `["DOM", "DOM.Iterable", "ES2022"]`.
- Added `verbatimModuleSyntax: true` to base. UI package extends base but is consumed only by bundlers (Next, Storybook); to keep type-check passing without adding .js to all UI imports, overrode `packages/ui/tsconfig.json` with `module: "ESNext"` and `moduleResolution: "bundler"` so extensionless imports are allowed there.

#### Files Created/Modified

- tsconfig.base.json (pretty-print, verbatimModuleSyntax)
- apps/web/tsconfig.json (target ES2022, lib DOM/DOM.Iterable/ES2022)
- apps/management-web/tsconfig.json (target ES2022, lib DOM/DOM.Iterable/ES2022)
- packages/ui/tsconfig.json (module ESNext, moduleResolution bundler; formatted)
