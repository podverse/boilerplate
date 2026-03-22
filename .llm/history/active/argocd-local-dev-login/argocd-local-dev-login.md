# ArgoCD local dev default login

Started: 2025-03-19
Context: k3d + ArgoCD local; user asked for default login for localhost:8080.

## Session 1 - 2025-03-19

### Prompt (Developer)

i have boilerplate k3s pods and argocd running locally. i can go to argocd in the browser at localhost:8080

how do i log in? since this is just for local development, i would like a default user to be included in the initial start up. does a username and password already exist? if not, make localdev the username and Test!1Aa the password

### Key Decisions

- No default known user existed; ArgoCD install only creates `admin` with a random password in `argocd-initial-admin-secret`.
- Added `scripts/infra/argocd/local-dev-user.sh` to create user `localdev` with password `Test!1Aa`, set admin password to the same, and give default role admin for local dev.
- Script runs after `install.sh` in `local-up.sh`; uses ArgoCD server image to generate bcrypt hash for the new user.
- Documented login in `docs/development/K3D-ARGOCD-LOCAL.md` and added troubleshooting note for existing clusters.

### Files Created/Modified

- `scripts/infra/argocd/local-dev-user.sh` (new)
- `scripts/infra/k3d/local-up.sh` (call local-dev-user.sh after install)
- `docs/development/K3D-ARGOCD-LOCAL.md` (login credentials + troubleshooting)
