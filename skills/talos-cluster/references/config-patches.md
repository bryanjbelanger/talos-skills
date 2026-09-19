# Talos Machine Config Patches & HA Clusters

## Machine Config Patches

Talos v1.14 machine configs are multi-document YAML: a slim legacy `machine:`/`cluster:` document plus typed documents (`HostnameConfig`, `Layer2VIPConfig`, `TimeSyncConfig`, ...). Patch them with strategic merge patches. JSON (RFC 6902) patches are rejected with `JSON6902 patches are not supported for multi-document machine configuration`.

`gen config` scopes patches by flag: `--config-patch` (all nodes), `--config-patch-control-plane`, `--config-patch-worker`.

### 1. Define Patches
Control plane only (`cp-patch.yaml`): shared VIP for the HA control plane. A VIP on a worker fails validation, so never pass this file with `--config-patch`. Find the link name with `talosctl get links --insecure --nodes <ip>`.

```yaml
apiVersion: v1alpha1
kind: Layer2VIPConfig
name: 10.0.10.100
link: eth0
---
apiVersion: v1alpha1
kind: DHCPv4Config
name: eth0
```

All nodes (`all-patch.yaml`): settings that remain in the legacy document.

```yaml
machine:
  sysctls:
    net.ipv4.ip_forward: "1"
cluster:
  extraManifests:
    - https://raw.githubusercontent.com/alex1989hu/kubelet-serving-cert-approver/main/deploy/ha-install.yaml
```

### 2. Apply Patches During Config Generation
```bash
talosctl gen config "vbox-dc" "https://10.0.10.100:6443" \
  --config-patch @all-patch.yaml \
  --config-patch-control-plane @cp-patch.yaml \
  --output ./talos-config

talosctl validate --config ./talos-config/controlplane.yaml --mode metal --strict
talosctl validate --config ./talos-config/worker.yaml --mode metal --strict
```

Patch an existing config file offline:
```bash
talosctl machineconfig patch ./talos-config/controlplane.yaml --patch @cp-patch.yaml --output ./controlplane-patched.yaml
```

### 3. Patching Live Nodes
Example `time-patch.yaml`:
```yaml
apiVersion: v1alpha1
kind: TimeSyncConfig
ntp:
  servers:
    - pool.ntp.org
```

Preview with `--dry-run`, then apply. Add `--mode try` to have the node roll the change back after `--timeout` (default 1m).
```bash
talosctl patch machineconfig --nodes 10.0.10.10 --patch @time-patch.yaml --dry-run
talosctl patch machineconfig --nodes 10.0.10.10 --patch @time-patch.yaml
```
