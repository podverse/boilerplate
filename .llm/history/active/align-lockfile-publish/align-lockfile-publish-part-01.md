### Session 1 - 2026-03-18

#### Prompt (Agent)

Align Boilerplate lockfile and publish with Podverse. Implement the plan as specified.

#### Key Decisions

- Moved lockfile script to `scripts/development/update-lockfile-linux.sh`; delete lock first, use `--platform linux/amd64`.
- Bump-version: audit `--audit-level=moderate`, call new script path, stage `package.json package-lock.json`, success message "✓ Version bumped to $VERSION and pushed".
- Updated all doc references to `./scripts/development/update-lockfile-linux.sh` and Linux x64 wording.

#### Files Created/Modified

- scripts/development/update-lockfile-linux.sh (created)
- scripts/update-lockfile-linux.sh (deleted)
- scripts/publish/bump-version.sh
- docs/development/LOCKFILE-LINUX.md
- AGENTS.md
- docs/PUBLISH.md
- docs/QUICK-START.md
