# Talos Linux Skills Suite for Pi

A complete **Pi Skills** suite for managing immutable [Talos Linux](https://www.talos.dev) Kubernetes clusters and machine nodes directly via `talosctl`.

---

## Included Skills

| Skill | Description | Usage Command |
| :--- | :--- | :--- |
| **`talos-cluster`** | Generating configs, applying node configurations, bootstrapping etcd, fetching `kubeconfig`, and validating cluster health. | `/skill:talos-cluster` |
| **`talos-node`** | Inspecting machine services, viewing logs (`kubelet`, `dmesg`), rebooting, OS upgrades, and node resets. | `/skill:talos-node` |

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
