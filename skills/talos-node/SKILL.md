---
name: talos-node
description: Operate and troubleshoot running Talos Linux nodes with talosctl. Use when a node is NotReady or a service or pod is failing (service status, kubelet, containerd and container logs, dmesg, processes, memory, disks, network, debug container, support bundle), rebooting with a drain, upgrading Talos OS or Kubernetes, rolling back an upgrade, resetting or decommissioning a node, backing up, defragmenting, or restoring etcd, or reading a node's live machine config.
---

# Talos Node Operations

## Preflight

Verify `talosctl` client configuration:
```bash
npx --no talosctl-helper version --nodes 10.0.10.10
```

---

## 1. Inspect Node Status & Services

### View Machine Services & Resources
```bash
# List running Talos machine services (etcd, kubelet, containerd, etc.)
npx --no talosctl-helper service --nodes 10.0.10.10

# Get machine members and cluster state
npx --no talosctl-helper get members --nodes 10.0.10.10
```

### View Logs & Kernel Messages
```bash
# View kubelet or containerd logs (--tail limits output; without it the full log is returned)
npx --no talosctl-helper logs kubelet --nodes 10.0.10.10 --tail 200
npx --no talosctl-helper logs containerd --nodes 10.0.10.10 --tail 200

# View logs of a Kubernetes workload container (ID from `containers --namespace cri`)
npx --no talosctl-helper logs --namespace cri <container-id> --nodes 10.0.10.10 --tail 200

# View kernel dmesg
npx --no talosctl-helper dmesg --nodes 10.0.10.10
```

---

## 2. Node Lifecycle Operations

### Reboot Node
```bash
# --drain cordons the node and evicts pods first (off by default for reboot)
npx --no talosctl-helper reboot --nodes 10.0.10.10 --drain
```

### Upgrade Talos OS Image
Upgrade one node at a time. The image format is `factory.talos.dev/metal-installer/<schematic-id>:<version>`. Reuse the node's current schematic ID so its system extensions are kept. Without `--image`, talosctl v1.14.1 uses the schematic with no extensions. `upgrade` drains the node by default.
```bash
# The schematic ID is listed by the "schematic" entry
npx --no talosctl-helper get extensions --nodes 10.0.10.10

npx --no talosctl-helper upgrade --nodes 10.0.10.10 --image factory.talos.dev/metal-installer/<schematic-id>:v1.14.1

# Return to the previous installation if the new one misbehaves
npx --no talosctl-helper rollback --nodes 10.0.10.10
```

### Upgrade Kubernetes
```bash
# Show the plan first, then run without --dry-run
npx --no talosctl-helper upgrade-k8s --nodes 10.0.10.10 --to 1.37.0 --dry-run
```

### Reset Node (Wipe & Return to Maintenance Mode)
Wipe node data disk and reset to clean installer state:
```bash
npx --no talosctl-helper reset --nodes 10.0.10.10 --system-labels-to-wipe STATE,EPHEMERAL --reboot
```

---

## Advanced Topics & Reference Guides
* For etcd snapshots, restores, process/memory stats, container inspection, and disk layouts, see `references/etcd-and-troubleshooting.md`.

