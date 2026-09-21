---
name: talos-cluster
description: Provision and configure Talos Linux Kubernetes clusters with talosctl. Use when building a new cluster (gen config, apply-config to maintenance-mode nodes, bootstrap etcd, fetch kubeconfig, verify health), joining a control plane or worker node to an existing cluster, setting up an HA control plane VIP, or changing machine config with patches (network, NTP, sysctls, extra manifests) at generation time or on live nodes.
---

# Talos Linux Cluster Management

## Preflight

Verify `talosctl` is installed (auto-installed if missing via helper):
```bash
npx --no talosctl-helper version --client
```

---

## 1. Generate Machine Configs

Generate Talos machine configurations for control plane and worker nodes along with `talosconfig`:
```bash
# Find the install disk on a node in maintenance mode (gen config defaults to /dev/sda)
npx --no talosctl-helper get disks --insecure --nodes 10.0.10.10

# Syntax: talosctl gen config <cluster-name> <cluster-endpoint-url> --output <dir>
npx --no talosctl-helper gen config "vbox-dc" "https://10.0.10.10:6443" --install-disk /dev/sda --output ./talos-config

# Validate before applying
npx --no talosctl-helper validate --config ./talos-config/controlplane.yaml --mode metal --strict
npx --no talosctl-helper validate --config ./talos-config/worker.yaml --mode metal --strict
```
*Produces `controlplane.yaml`, `worker.yaml`, and `talosconfig`. The machine configs are multi-document YAML, and `--output-dir` is deprecated in favor of `--output`.*

---

## 2. Apply Machine Config to Nodes

Apply the generated machine configs to fresh Talos nodes in maintenance mode:

```bash
# Apply to Control Plane Node (insecure initial apply before TLS PKI is active)
npx --no talosctl-helper apply-config --insecure --nodes 10.0.10.10 --file ./talos-config/controlplane.yaml

# Apply to Worker Node
npx --no talosctl-helper apply-config --insecure --nodes 10.0.20.20 --file ./talos-config/worker.yaml
```

---

## 3. Configure Local talosctl Client

Merge the generated `talosconfig` context and target the control plane endpoint:
```bash
# Merge context
npx --no talosctl-helper config merge ./talos-config/talosconfig
npx --no talosctl-helper config endpoint 10.0.10.10
npx --no talosctl-helper config node 10.0.10.10
```

---

## 4. Bootstrap etcd Cluster

Bootstrap the primary control plane node (run **once** per cluster):
```bash
npx --no talosctl-helper bootstrap --nodes 10.0.10.10
```

---

## 5. Retrieve Kubeconfig & Verify Health

Fetch cluster kubeconfig and verify Kubernetes API accessibility:
```bash
# Retrieve kubeconfig
npx --no talosctl-helper kubeconfig . --nodes 10.0.10.10

# Validate cluster health
npx --no talosctl-helper health --nodes 10.0.10.10
```

Verify with `kubectl`:
```bash
kubectl --kubeconfig ./kubeconfig get nodes -o wide
```

---

## Advanced Topics & Reference Guides
* For machine config patches, typed config documents, and HA VIP setup, see `references/config-patches.md`.

