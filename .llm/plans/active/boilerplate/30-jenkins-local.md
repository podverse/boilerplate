# Plan 30: Jenkins local (deployment-only)

## Scope

Run **after all other phases** (depends on 29). Deliver a **local Jenkins** instance that the user can spin up, log into (pre-populated user), and use to trigger **deployment** jobs. If management-api and management-web exist, document them as optional apps (e.g. in JENKINS-LOCAL.md or pipeline paths) so deployment jobs can include them when present. All setup is **programmatic**. Jenkins is **deployment-only**: Jenkinsfiles never publish (publishing stays in GitHub Actions / Plan 13).

## Goals

- **Local Jenkins:** Run in a container (e.g. Docker Compose service or `infra/docker/local/jenkins` Compose file / Make target). `make jenkins-up` or equivalent brings up Jenkins (e.g. port 8080).
- **Programmatic setup:** Pre-populated user (e.g. `admin` with documented default password/token), folder named **`local`**, and jobs imported from repo. Use JCasC and/or Groovy init scripts, or clear doc to run import script once after first start.
- **Folder `local`:** Contains all pipeline jobs for deployments (Jenkinsfiles + setup/import process). No publish jobs.
- **Git/workspace:** Sparse checkout into an **isolated workspace** so Jenkins never operates on the developer’s host checkout; no collision when jobs run "git pull".

## Steps

1. **Jenkins service**
   - Add Jenkins as a container (e.g. new Compose file `infra/docker/local/docker-compose.jenkins.yml` or service in existing compose). Optional Make target `jenkins-up` / `jenkins-setup`.
   - Document how to start and stop (e.g. `docker compose -f infra/docker/local/docker-compose.jenkins.yml up`).

2. **Programmatic setup**
   - Pre-populated user so the user can log in without manual "Unlock Jenkins" / create admin. Use JCasC and/or Groovy init script (e.g. in image or mounted at startup).
   - Create folder **`local`** (via REST/CLI or init script).
   - Run **import script** so all jobs from the repo are created/updated in folder `local` (either automated after first start or documented one-time step).

3. **Pipeline definitions under `infra/pipelines/jenkins/local/`**
   - **Jenkinsfile.*** – One file per job. **Deployment-only:** no publish jobs. Include only deployment-related jobs, e.g.:
     - `Jenkinsfile.git_pull` – sparse checkout + checkout branch + git pull (update workspace for deploy).
     - `Jenkinsfile.validate` – run validate (audit, build:packages, lint, type-check, build:apps) as a pre-deploy check.
     - Other jobs only if they are deployment operations (e.g. deploy/compose for the target environment). Do **not** add jobs for bump_version, alpha_publish, or other non-deployment commands.
   - **setup/import.sh** – Creates folder `local` and creates/updates Pipeline jobs from each `Jenkinsfile.*` (Jenkins CLI or REST; substitute `REPLACE_SCRIPT_PATH` in job template). Same pattern as Podverse `infra/pipelines/jenkins/alpha/setup/import.sh`.
   - **scm-job.xml** – Job template with SCM (Git) and **sparse checkout** paths (e.g. `infra/pipelines/jenkins/`, `infra/docker/`, `infra/config/`, `scripts/`, `Makefile`; add root `package.json` if needed). Placeholder `REPLACE_SCRIPT_PATH` for import script.

4. **Git / workspace strategy**
   - Jenkins runs in Docker; jobs use a **dedicated workspace path** (e.g. job workspace or fixed path). No full monorepo in that environment; only what’s needed for pipelines (same as Podverse).
   - All jobs that need repo content use **Pipeline from SCM** with **sparse checkout**. The Jenkins workspace is a **separate clone**; "git pull" in a job updates only that workspace. The developer’s host checkout is **never** used by Jenkins.
   - Document in plan and in `docs/pipelines/JENKINS-LOCAL.md`: "git pull" in a job updates only the Jenkins workspace, not the developer’s directory.

5. **Documentation**
   - Add `docs/pipelines/JENKINS-LOCAL.md`: how to start local Jenkins, how to run setup/import, that the folder is named `local` and contains deployment jobs only (no publish), and that git operations use sparse checkout in an isolated workspace.

## Key files

- `infra/pipelines/jenkins/local/` – Jenkinsfiles, `setup/import.sh`, `scm-job.xml`; optional `PIPELINES-JENKINS-LOCAL.md`.
- Jenkins service: Compose file or service + optional Make target `jenkins-up` / `jenkins-setup`.
- JCasC or init script for pre-populated user (and optionally folder + job import).
- `docs/pipelines/JENKINS-LOCAL.md`.

## Verification

- `docker compose up` (or `make jenkins-up`) starts Jenkins; user can log in with the pre-populated account.
- Folder `local` exists and contains the imported jobs (after running import script if not automated).
- Triggering a job (e.g. validate or git_pull) runs in an isolated workspace with sparse checkout; no collision with host repo.
