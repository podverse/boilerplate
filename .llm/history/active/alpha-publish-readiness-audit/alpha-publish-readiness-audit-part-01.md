### Session 1 - 2026-03-22

#### Prompt (Developer)

Alpha Publish Readiness: Boilerplate vs Podverse

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Confirmed Boilerplate alpha should publish the full app set present in this monorepo (main and
  management services), not only web-facing images.
- Expanded alpha publish matrix to include management images for parity with expected runtime
  surfaces.
- Hardened GHCR version/tag lookup with token fallback (`GHCR_REGISTRY_TOKEN` then
  `GITHUB_TOKEN`) and explicit fail-fast messaging when tag discovery is blocked.
- Added a post-publish verification job that validates both immutable version tags and rolling
  `alpha` tags exist for all expected images.
- Documented the publish-only deployment contract, GHCR auth behavior, and full image list in
  `docs/PUBLISH.md`.
- Updated local `make validate_docker` to build the same alpha image set so local validation
  mirrors publish workflow expectations.

#### Files Modified

- .github/workflows/publish-alpha.yml
- docs/PUBLISH.md
- makefiles/local/Makefile.local.validate.mk
- .llm/history/active/alpha-publish-readiness-audit/alpha-publish-readiness-audit-part-01.md

### Session 2 - 2026-03-22

#### Prompt (Developer)

create one

#### Key Decisions

- Added a Boilerplate `sync-develop-to-alpha.sh` helper in `scripts/publish/` that mirrors the
  Podverse flow: clean-worktree checks, origin sync, fast-forward-only merge, guarded push, and
  post-push branch parity verification.
- Kept script behavior aligned with existing Boilerplate publish conventions by using
  `git push --no-verify` (same bypass style used in `bump-version.sh`).
- Updated `docs/PUBLISH.md` to include the new helper as the recommended first step in alpha
  publish flow and documented PR fallback when branch protection blocks direct pushes.

#### Files Modified

- scripts/publish/sync-develop-to-alpha.sh
- docs/PUBLISH.md
- .llm/history/active/alpha-publish-readiness-audit/alpha-publish-readiness-audit-part-01.md
