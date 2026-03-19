.PHONY: local_k3d_up local_k3d_down local_argocd_port_forward local_k3d_status

local_k3d_up:
	bash scripts/infra/k3d/local-up.sh

local_k3d_down:
	bash scripts/infra/k3d/local-down.sh

local_argocd_port_forward:
	kubectl -n argocd port-forward svc/argocd-server 8080:443

local_k3d_status:
	kubectl -n boilerplate-local get pods,svc
