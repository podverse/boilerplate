# Jenkins local – Copy-Pasta

## Agent: Jenkins local

Read and execute `.llm/plans/active/jenkins-local/30-jenkins-local.md`. Add local Jenkins
(Docker Compose or Make target), pre-populated user, folder named `local`, and
deployment-only pipeline jobs (Jenkinsfiles + setup/import.sh + scm-job.xml with sparse
checkout). Document in `docs/pipelines/JENKINS-LOCAL.md`. Jenkins is deployment-only; no
publish jobs. Verify Jenkins starts, user can log in, folder `local` has jobs, and jobs
use isolated workspace (no collision with host repo).
