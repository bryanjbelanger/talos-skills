# Talos Machine Config Patches & HA Clusters

## Machine Config Patches

Talos uses JSON/YAML Strategic Merge Patches (`--config-patch`) or inline JSON patches (`--config-patch-control-plane`) when generating machine configurations.

### 1. Define Patch (`patch.yaml`)
Example: Enable VIP (Virtual IP) for HA Control Plane and enable extra kernel arguments:

```yaml
machine:
  network:
    interfaces:
      - interface: eth0
        dhcp: true
        vip:
          ip: 10.0.10.100
  sysctls:
    net.ipv4.ip_forward: "1"
cluster:
  extraManifests:
    - https://raw.githubusercontent.com/alex1989hu/kubelet-serving-cert-approver/main/deploy/ha-control-plane-k8s-1.27.yaml
```

### 2. Apply Patch During Config Generation
```bash
talosctl gen config "vbox-dc" "https://10.0.10.100:6443" \
  --config-patch @patch.yaml \
  --output-dir ./talos-config
```

### 3. Patching Live Nodes
Apply patches to live running nodes without full reconfiguration:
```bash
talosctl patch machineconfig --nodes 10.0.10.10 --patch '[{"op": "replace", "path": "/machine/time/servers/0", "value": "pool.ntp.org"}]'
```
