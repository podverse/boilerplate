### Session 4 - 2026-03-18

#### Prompt (Developer)

Add @next/swc Linux Binary Preflight

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- Even with `.mjs` config, Next.js 16 requires `@next/swc-linux-x64-gnu` at startup on Linux.
- Add a `Verify @next/swc native binding` step after the parcel watcher step in both boilerplate
  CI workflows, using the same bash subprocess pattern.

#### Files Modified

- .github/workflows/publish-alpha.yml
- .github/workflows/ci.yml
- .llm/history/active/ci-native-binding/ci-native-binding-part-01.md

### Session 3 - 2026-03-18

#### Prompt (Developer)

implement

#### Key Decisions

- Podverse run #34 identified the real root cause: `next.config.ts` requires `@next/swc-linux-x64-gnu`
  (Rust SWC compiler) to load TypeScript. That Linux binary is absent from the macOS lockfile.
- Fix: convert all four `next.config.ts` files (both boilerplate apps) to `.mjs`. Plain ESM — no native
  bindings needed.
- Revert `--webpack` from build scripts in both boilerplate apps (wrong workaround, `next build` uses
  Webpack by default). No `webpack` dep to remove (was never added in boilerplate).

#### Files Modified

- apps/web/next.config.mjs (new, replaces next.config.ts)
- apps/management-web/next.config.mjs (new, replaces next.config.ts)
- apps/web/package.json
- apps/management-web/package.json
- .llm/history/active/ci-native-binding/ci-native-binding-part-01.md

### Session 2 - 2026-03-18

#### Prompt (Developer)

Fix Node.js require-cache Bug in Watcher Preflight

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- Root cause identified in Podverse CI (Run #33): the fallback `npm install --no-save` installed the Linux
  binary successfully but the second `canLoad()` call in the same Node process returned the cached failure
  from the first attempt — Node.js `require` caches module load failures within a process.
- Fix: replace single `node -e "..."` one-liner with bash-controlled flow using separate `node` subprocess
  calls. Each subprocess has a fresh `require.cache` so the post-install check is genuine.
- Applied same fix here in boilerplate to keep both repos consistent.

#### Files Modified

- .github/workflows/publish-alpha.yml
- .github/workflows/ci.yml
- .llm/history/active/ci-native-binding/ci-native-binding-part-01.md

### Session 1 - 2026-03-18

#### Prompt (Developer)

implement. also consider that boilerplate may need similar fixes since it is a next js project too

#### Key Decisions

- Mirror the CI dependency install and watcher runtime preflight hardening pattern used in Podverse to Boilerplate workflows that run Next.js builds.

#### Files Modified

- .github/workflows/publish-alpha.yml
- .github/workflows/ci.yml
- .llm/history/active/ci-native-binding/ci-native-binding-part-01.md
