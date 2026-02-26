# Plan 13: Alpha publish stub

## Scope

Add a script placeholder (e.g. `scripts/publish/alpha-publish.sh`) and short documentation:
purpose, when to run, and what a "real" alpha publish would do (build images, push to
registry, etc.). No actual publish. Stub only.

## Steps

1. **Script**
   - Create `scripts/publish/alpha-publish.sh` (executable). Content: print that this is a
     stub; list the steps a real alpha would perform (e.g. run audit, build packages, build
     apps, build Docker images, push images to registry, optionally tag release). Exit 0. No
     image build or push.

2. **Documentation**
   - Add a short section in README or `docs/PUBLISH.md`: what "alpha publish" means in
     context of this repo (e.g. making a release candidate available for deployment); that
     the current script is a stub; when you would run it (e.g. before cutting a release);
     and that a real implementation would build and push images (and optionally run
     deploy). Link to script.

3. **Optional**
   - Add a Make target `alpha-publish` that runs the script; or document running
     `./scripts/publish/alpha-publish.sh` manually.

## Key files

- `scripts/publish/alpha-publish.sh`
- README or `docs/PUBLISH.md`
- Optional: Makefile target

## Verification

- Running `./scripts/publish/alpha-publish.sh` prints stub message and exits 0.
- Docs clearly state no actual publish is performed and describe what a real flow would do.
