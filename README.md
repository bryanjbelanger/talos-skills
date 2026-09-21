# Talos Linux Skills Suite for Pi

A complete **Pi Skills** suite for managing immutable [Talos Linux](https://www.talos.dev) Kubernetes clusters and machine nodes directly via `talosctl`.

---

## Included Skills

| Skill | Description | Usage Command |
| :--- | :--- | :--- |
| **`talos-cluster`** | Building a new cluster (`gen config`, `apply-config`, etcd bootstrap, `kubeconfig`, health check), joining nodes, HA control plane VIP, and machine config patches. | `/skill:talos-cluster` |
| **`talos-node`** | Troubleshooting a NotReady node or failing service (logs, `dmesg`, processes, disks, network, debug container, support bundle), reboots, Talos OS and Kubernetes upgrades, rollback, node reset, and etcd backup and restore. | `/skill:talos-node` |

---

## Prerequisites

* **Node.js v20.6+**
* `talosctl` CLI (automatically downloaded and configured on first use if absent).

---

## Installation & Usage

### Install via npm package
In any project:
```bash
npm install --save-dev @bryanjbelanger/talos-skills
```
And add to `.pi/settings.json`:
```json
{
  "skills": ["node_modules/@bryanjbelanger/talos-skills"]
}
```

---

## License

MIT License
