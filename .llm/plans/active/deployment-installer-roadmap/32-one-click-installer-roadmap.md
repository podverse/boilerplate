---
name: Boilerplate One Click Installer
overview: Design the first one-click deployment workflow that is DigitalOcean-first yet portable to other providers by standardizing on cloud-init and declarative configuration.
todos: []
isProject: false
---

# Boilerplate One-Click Installer Roadmap

## Goal

Create a configurable one-click install path that starts with DigitalOcean and can be adapted to providers that support cloud-init or marketplace images.

## Recommended Productization Strategy

- Use a **single installer contract** (`deploy-config.yaml`) as the stable interface.
- Keep provider specifics thin (DigitalOcean bootstrap first, others as adapters).
- Treat marketplace publishing as phase 2+ after installer hardening.

## Provider Compatibility Model

- DigitalOcean: Droplet creation + cloud-init user-data bootstrap.
- Vultr/Hetzner-style platforms: same cloud-init/bootstrap with minor metadata adapter changes.
- Future marketplace images: reuse same bootstrap scripts and config contract.

## Proposed Deliverables

1. `deploy-config schema`
   - Domain config (public hosts, management hosts)
   - TLS/DNS provider token refs
   - Tailscale settings (tailnet auth key strategy, tags)
   - Resource profile (small/medium presets)
2. `bootstrap entrypoint`
   - Installs k3s, cert-manager, Tailscale components
   - Applies manifests in deterministic order
   - Validates rollout and prints access URLs
3. `post-install checks`
   - Public TLS health for `web`/`api`
   - VPN-only reachability checks for management
   - Core app and DB connectivity checks
4. `operator docs`
   - Minimal quickstart
   - Config reference
   - Troubleshooting and recovery guide

## Suggested Repo Additions (High Level)

- New deployment docs root under [infra/INFRA.md](/Users/mitcheldowney/repos/pv/boilerplate/infra/INFRA.md)
- New k8s tree under `infra/k8s/` (base + env overlays)
- New bootstrap scripts under `scripts/deploy/`
- New sample config under `infra/config/deploy/deploy-config.example.yaml`

## Phase Plan

1. `MVP installer` (DigitalOcean-only path, manually launched)
2. `Portable adapters` (provider wrappers around same cloud-init/bootstrap)
3. `Marketplace track` (packaged image + listing automation)
4. `UX polish` (single command + preflight + guided output)

## Success Criteria

- One documented command path can bootstrap a working environment end-to-end.
- Config changes are centralized in one file, not spread across scripts.
- Same bootstrap logic runs across at least two providers with minimal adapter differences.
- Future marketplace support does not require re-architecting core deployment logic.
