---
name: talos-node
description: Manage Talos Linux nodes — inspect machine status, view service logs, reboot, upgrade, or reset nodes via talosctl. Use when checking Talos node health, viewing dmesg/logs, rebooting nodes, or upgrading Talos OS.
---

# Talos Node Operations

## Preflight

Verify `talosctl` client configuration:
```bash
node ./scripts/talosctl-helper.js version --nodes 10.0.10.10
```

---

## 1. Inspect Node Status & Services

### View Machine Services & Resources
```bash
# List running Talos machine services (etcd, kubelet, containerd, etc.)
node ./scripts/talosctl-helper.js service --nodes 10.0.10.10

# Get machine members and cluster state
node ./scripts/talosctl-helper.js get members --nodes 10.0.10.10
```

### View Logs & Kernel Messages
```bash
# View kubelet or containerd logs
node ./scripts/talosctl-helper.js logs kubelet --nodes 10.0.10.10
node ./scripts/talosctl-helper.js logs containerd --nodes 10.0.10.10

# View kernel dmesg
node ./scripts/talosctl-helper.js dmesg --nodes 10.0.10.10
```

---

## 2. Node Lifecycle Operations

### Reboot Node
```bash
node ./scripts/talosctl-helper.js reboot --nodes 10.0.10.10
```

### Upgrade Talos OS Image
Upgrade a node to a newer Talos Linux installer image:
```bash
node ./scripts/talosctl-helper.js upgrade --nodes 10.0.10.10 --image factory.talos.dev/installer/v1.9.4
```

### Reset Node (Wipe & Return to Maintenance Mode)
Wipe node data disk and reset to clean installer state:
```bash
node ./scripts/talosctl-helper.js reset --nodes 10.0.10.10 --system-labels-to-wipe STATE,EPHEMERAL --reboot
```

---

## 3. Report

Report node version, active service states, memory/CPU usage, and reboot/reset status.
