# GitOps K8s env render (alpha / beta / prod) — see docs/development/K8S-ENV-RENDER.md
# Included from makefiles/local/Makefile.local.mk. Targets write ConfigMaps + plain Secrets into the output repo.
#
#   alpha_env_prepare       Seed ~/.config/boilerplate/alpha-env-overrides/*.env from dev/env-overrides/examples/*.env.example (when missing)
#   alpha_env_link          Symlink dev/env-overrides/alpha/*.env → home (durable store)
#   alpha_env_prepare_link  prepare + link (same idea as local_env_prepare + local_env_link)
#   alpha_env_render        Write ConfigMaps + plain Secrets (requires BOILERPLATE_K8S_OUTPUT_REPO)
#   alpha_env_render_dry_run  Print rendered YAML without writing files (no output repo required)
#   alpha_env_validate      validate-classification.sh + validate-k8s-env-drift.sh (requires BOILERPLATE_K8S_OUTPUT_REPO)
#
# Generic: set K8S_ENV=beta|prod for k8s_env_* targets.
# Required for render/validate: export BOILERPLATE_K8S_OUTPUT_REPO=/path/to/gitops-repo
#
.PHONY: alpha_env_prepare alpha_env_link alpha_env_prepare_link
.PHONY: alpha_env_render alpha_env_render_dry_run alpha_env_validate
.PHONY: k8s_env_prepare k8s_env_link k8s_env_prepare_link
.PHONY: k8s_env_render k8s_env_render_dry_run k8s_env_validate

# Default environment for convenience targets
K8S_ENV ?= alpha

alpha_env_prepare:
	bash scripts/k8s-env/prepare-k8s-env-overrides.sh --env alpha

alpha_env_link:
	bash scripts/k8s-env/link-k8s-env-overrides.sh --env alpha

alpha_env_prepare_link: alpha_env_prepare alpha_env_link

alpha_env_render:
	$(if $(BOILERPLATE_K8S_OUTPUT_REPO),,$(error BOILERPLATE_K8S_OUTPUT_REPO is required for alpha_env_render — set to the GitOps repo root))
	bash scripts/k8s-env/render-k8s-env.sh --env alpha --output-repo "$(BOILERPLATE_K8S_OUTPUT_REPO)"

alpha_env_render_dry_run:
	bash scripts/k8s-env/render-k8s-env.sh --env alpha --dry-run $(if $(BOILERPLATE_K8S_OUTPUT_REPO),--output-repo "$(BOILERPLATE_K8S_OUTPUT_REPO)",)

alpha_env_validate:
	$(if $(BOILERPLATE_K8S_OUTPUT_REPO),,$(error BOILERPLATE_K8S_OUTPUT_REPO is required for alpha_env_validate — set to the GitOps repo root))
	bash scripts/k8s-env/validate-classification.sh
	bash scripts/k8s-env/validate-k8s-env-drift.sh --env alpha --output-repo "$(BOILERPLATE_K8S_OUTPUT_REPO)"

# Generic targets (set K8S_ENV=beta or K8S_ENV=prod)
k8s_env_prepare:
	bash scripts/k8s-env/prepare-k8s-env-overrides.sh --env $(K8S_ENV)

k8s_env_link:
	bash scripts/k8s-env/link-k8s-env-overrides.sh --env $(K8S_ENV)

k8s_env_prepare_link: k8s_env_prepare k8s_env_link

k8s_env_render:
	$(if $(BOILERPLATE_K8S_OUTPUT_REPO),,$(error BOILERPLATE_K8S_OUTPUT_REPO is required for k8s_env_render — set to the GitOps repo root))
	bash scripts/k8s-env/render-k8s-env.sh --env $(K8S_ENV) --output-repo "$(BOILERPLATE_K8S_OUTPUT_REPO)"

k8s_env_render_dry_run:
	bash scripts/k8s-env/render-k8s-env.sh --env $(K8S_ENV) --dry-run $(if $(BOILERPLATE_K8S_OUTPUT_REPO),--output-repo "$(BOILERPLATE_K8S_OUTPUT_REPO)",)

k8s_env_validate:
	$(if $(BOILERPLATE_K8S_OUTPUT_REPO),,$(error BOILERPLATE_K8S_OUTPUT_REPO is required for k8s_env_validate — set to the GitOps repo root))
	bash scripts/k8s-env/validate-classification.sh
	bash scripts/k8s-env/validate-k8s-env-drift.sh --env $(K8S_ENV) --output-repo "$(BOILERPLATE_K8S_OUTPUT_REPO)"
