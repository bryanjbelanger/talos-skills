---
name: talos-cluster
description: Create, configure, bootstrap, and validate Talos Linux Kubernetes clusters using talosctl. Use when generating machine configs, applying node configs, bootstrapping etcd, fetching kubeconfig, or checking cluster health.
---

# Talos Linux Cluster Management

## Preflight

Verify `talosctl` is installed (auto-installed if missing via helper):
```bash
node ./scripts/talosctl-helper.js version --client
```

---

## 1. Generate Machine Configs

Generate Talos machine configurations for control plane and worker nodes along with `talosconfig`:
```bash
# Syntax: talosctl gen config <cluster-name> <cluster-endpoint-url> --output-dir <dir>
node ./scripts/talosctl-helper.js gen config "vbox-dc" "https://10.0.10.10:6443" --output-dir ./talos-config
```
*Produces `controlplane.yaml`, `worker.yaml`, and `talosconfig`.*

---

## 2. Apply Machine Config to Nodes

Apply the generated machine configs to fresh Talos nodes in maintenance mode:

```bash
# Apply to Control Plane Node (insecure initial apply before TLS PKI is active)
node ./scripts/talosctl-helper.js apply-config --insecure --nodes 10.0.10.10 --file ./talos-config/controlplane.yaml

# Apply to Worker Node
node ./scripts/talosctl-helper.js apply-config --insecure --nodes 10.0.20.20 --file ./talos-config/worker.yaml
```

---

## 3. Configure Local talosctl Client

Merge the generated `talosconfig` context and target the control plane endpoint:
```bash
# Merge context
node ./scripts/talosctl-helper.js config merge ./talos-config/talosconfig
node ./scripts/talosctl-helper.js config endpoint 10.0.10.10
node ./scripts/talosctl-helper.js config node 10.0.10.10
```

---

## 4. Bootstrap etcd Cluster

Bootstrap the primary control plane node (run **once** per cluster):
```bash
node ./scripts/talosctl-helper.js bootstrap --nodes 10.0.10.10
```

---

## 5. Retrieve Kubeconfig & Verify Health

Fetch cluster kubeconfig and verify Kubernetes API accessibility:
```bash
# Retrieve kubeconfig
node ./scripts/talosctl-helper.js kubeconfig . --nodes 10.0.10.10

# Validate cluster health
node ./scripts/talosctl-helper.js health --nodes 10.0.10.10
```

Verify with `kubectl`:
```bash
kubectl --kubeconfig ./kubeconfig get nodes -o wide
```

---

## 6. Report

Report cluster name, endpoint, node IP addresses, etcd status, and `kubeconfig` location.
