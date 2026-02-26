# --- Pre-push validation and Docker image build. ---

.PHONY: validate validate_docker

# Pre-push validation: audit, build packages, lint, type-check, env setup, build apps (plan 05).
# Step 2 builds packages (helpers, orm); step 6 builds apps (api, web, sidecar). Exits non-zero on first failure.
validate:
	@echo "============================================"
	@echo "  Running Pre-Push Validation"
	@echo "============================================"
	@echo ""
	@echo "Step 1/6: Security audit..."
	npm audit --omit=dev
	@echo ""
	@echo "Step 2/6: Building packages..."
	npm run build:packages
	@echo ""
	@echo "Step 3/6: Linting..."
	npm run lint
	@echo ""
	@echo "Step 4/6: Type checking..."
	npm run type-check
	@echo ""
	@echo "Step 5/6: Setting up env for web (Next.js .env.local)..."
	@cp -n apps/web/.env.example apps/web/.env.local 2>/dev/null || true
	@echo "  (apps/web/.env.local from .env.example if missing)"
	@echo ""
	@echo "Step 6/6: Building apps..."
	npm run build:apps
	@echo ""
	@echo "============================================"
	@echo "  All checks passed!"
	@echo "============================================"

# Optional: after validate, build Docker images for boilerplate-api, boilerplate-web, boilerplate-web-sidecar.
# Uses infra/docker/local/* Dockerfiles. No workers or management apps.
validate_docker: validate
	@echo ""
	@echo "============================================"
	@echo "  Building Docker Images (Local Test)"
	@echo "============================================"
	@echo ""
	@echo "Building boilerplate-api..."
	docker build -f infra/docker/local/api/Dockerfile -t boilerplate-api:test .
	@echo ""
	@echo "Building boilerplate-web..."
	docker build -f infra/docker/local/web/Dockerfile -t boilerplate-web:test .
	@echo ""
	@echo "Building boilerplate-web-sidecar..."
	docker build -f infra/docker/local/web-sidecar/Dockerfile -t boilerplate-web-sidecar:test .
	@echo ""
	@echo "============================================"
	@echo "  All Docker images built successfully!"
	@echo "============================================"
