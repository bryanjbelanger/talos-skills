# Talos Etcd Operations, Containers & Troubleshooting

## Etcd Maintenance & Backup

### 1. Etcd Status & Health
```bash
# Check etcd members and health
talosctl etcd members --nodes 10.0.10.10
talosctl etcd status --nodes 10.0.10.10
talosctl etcd alarm list --nodes 10.0.10.10
```

### 2. Etcd Snapshot Backup & Restore
```bash
# Take etcd snapshot
talosctl etcd snapshot ./etcd-backup.snapshot --nodes 10.0.10.10

# Defrag etcd database
talosctl etcd defrag --nodes 10.0.10.10
```

---

## Machine Inspection & Diagnostics

### 1. Running Containers & Processes
```bash
# List all running CRI containers on node
talosctl containers --nodes 10.0.10.10
talosctl containers --nodes 10.0.10.10 --kubernetes

# Inspect processes and resource usage
talosctl processes --nodes 10.0.10.10
talosctl stats --nodes 10.0.10.10
talosctl memory --nodes 10.0.10.10
```

### 2. Disks & Mounts
```bash
# List disks and partition layout
talosctl disks --nodes 10.0.10.10
talosctl mounts --nodes 10.0.10.10
```

### 3. Read Machine Configuration & Files
```bash
# Retrieve live running machine configuration
talosctl get machineconfig --nodes 10.0.10.10

# Read file from node filesystem
talosctl read /etc/hosts --nodes 10.0.10.10
```
