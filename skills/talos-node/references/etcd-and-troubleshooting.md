# Talos Etcd Operations, Containers & Troubleshooting

## Etcd Maintenance & Backup

### 1. Etcd Status & Health
```bash
# Check etcd members and health
talosctl etcd members --nodes 10.0.10.10
talosctl etcd status --nodes 10.0.10.10
talosctl etcd alarm list --nodes 10.0.10.10
```

### 2. Etcd Snapshot, Defrag & Restore
```bash
# Take etcd snapshot
talosctl etcd snapshot ./etcd-backup.snapshot --nodes 10.0.10.10

# Defrag etcd database (one control plane node at a time)
talosctl etcd defrag --nodes 10.0.10.10

# Disaster recovery: bootstrap a fresh control plane node from a snapshot
talosctl bootstrap --nodes 10.0.10.10 --recover-from ./etcd-backup.snapshot
```

---

## Machine Inspection & Diagnostics

### 1. Running Containers & Processes
`--namespace` selects `system` (Talos services, default) or `cri` (Kubernetes workloads). `--kubernetes` is deprecated.
```bash
# List containers on node
talosctl containers --nodes 10.0.10.10
talosctl containers --nodes 10.0.10.10 --namespace cri

# Inspect processes and resource usage
talosctl processes --nodes 10.0.10.10 --sort cpu
talosctl stats --nodes 10.0.10.10 --namespace cri
talosctl memory --nodes 10.0.10.10 --verbose

# cgroup v2 usage, presets: cpu cpuset io memory process psi swap
talosctl cgroups --nodes 10.0.10.10 --preset memory
```

### 2. Disks & Mounts
`talosctl disks` is deprecated. Use resources instead:
```bash
talosctl get disks --nodes 10.0.10.10
talosctl get systemdisk --nodes 10.0.10.10
talosctl get discoveredvolumes --nodes 10.0.10.10
talosctl mounts --nodes 10.0.10.10
```

### 3. Network
```bash
# Listening TCP sockets with owning process
talosctl netstat --nodes 10.0.10.10 --listening --tcp --programs

# Links and addresses
talosctl get links --nodes 10.0.10.10
talosctl get addresses --nodes 10.0.10.10
```

### 4. Read Machine Configuration & Files
```bash
# Retrieve live running machine configuration (table output omits the config body)
talosctl get machineconfig --nodes 10.0.10.10 --output yaml

# List every resource type available to `get`
talosctl get rd --nodes 10.0.10.10

# Read file from node filesystem
talosctl read /etc/hosts --nodes 10.0.10.10
```

### 5. Debug Container & Support Bundle
```bash
# Run a throwaway debug container on the node (Talos has no SSH or shell)
talosctl debug docker.io/library/alpine:latest --nodes 10.0.10.10 --args /bin/sh

# Collect logs and resources into an archive. By default the bundle is encrypted
# so that only Sidero Labs can read it. Use --no-encryption for local analysis.
talosctl support --nodes 10.0.10.10 --no-encryption --output ./support.zip
```
