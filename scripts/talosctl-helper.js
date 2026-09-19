#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { execSync, execFileSync } from "child_process";

const TALOS_VERSION = "v1.14.1";

// SHA-256 of each release asset, copied from sha256sum.txt of the TALOS_VERSION release.
// Update together with TALOS_VERSION.
const TALOSCTL_SHA256 = {
  "talosctl-darwin-amd64": "8cb8654c7af2be501667fccb6a4879b91c213101d83b49fe59e1a1e4e70ed5f4",
  "talosctl-darwin-arm64": "8335917a3c3eb7ad466cc4b834defcbd4948d51312a6e47de11113d7c399a8f8",
  "talosctl-linux-amd64": "7233ece94c94296a033a6ddb5efe0baf508a94c71de7e6c7b286500705924208",
  "talosctl-linux-arm64": "812406cfc3bd83a937108d5f4872a48645b96de3c01e1f3d82445e8cbd1e7a21",
  "talosctl-windows-amd64.exe": "76b5431c5deb89caa9b4b6e2acbff142bfa8e98bf680c35a766d9011a70e3fad",
  "talosctl-windows-arm64.exe": "47934bdc185592c53ba6c39dcbd56b27102101e318f1469227847c479e9de81e",
};

function getPlatform() {
  const platform = os.platform();
  const arch = os.arch();
  let osName = platform;
  if (platform === "darwin") osName = "darwin";
  else if (platform === "linux") osName = "linux";
  else if (platform === "win32") osName = "windows";

  let archName = arch;
  if (arch === "x64") archName = "amd64";
  else if (arch === "arm64") archName = "arm64";

  return { osName, archName };
}

async function ensureTalosctl() {
  try {
    execSync("talosctl version --client --short", { stdio: "ignore" });
    return "talosctl";
  } catch {
    // Check local bin fallback
    const binDir = path.join(os.homedir(), ".local", "bin");
    const localBinary = path.join(binDir, process.platform === "win32" ? "talosctl.exe" : "talosctl");
    if (fs.existsSync(localBinary)) {
      return localBinary;
    }

    const { osName, archName } = getPlatform();
    const asset = `talosctl-${osName}-${archName}${osName === "windows" ? ".exe" : ""}`;
    const expectedHash = TALOSCTL_SHA256[asset];
    if (!expectedHash) throw new Error(`No talosctl ${TALOS_VERSION} build is known for ${osName}/${archName}`);
    const downloadUrl = `https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/${asset}`;

    console.log(`Downloading talosctl ${TALOS_VERSION} for ${osName}/${archName}...`);
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`Failed to download talosctl from ${downloadUrl}: ${res.statusText}`);

    // Verify in memory so an unverified or partial binary never reaches disk
    const data = Buffer.from(await res.arrayBuffer());
    const actualHash = crypto.createHash("sha256").update(data).digest("hex");
    if (actualHash !== expectedHash) {
      throw new Error(`Checksum mismatch for ${asset}: expected ${expectedHash}, got ${actualHash}`);
    }

    fs.mkdirSync(binDir, { recursive: true });
    const tmpBinary = `${localBinary}.download`;
    fs.writeFileSync(tmpBinary, data, { mode: 0o755 });
    fs.renameSync(tmpBinary, localBinary);

    console.log(`talosctl installed to ${localBinary}`);
    return localBinary;
  }
}

async function main() {
  const binary = await ensureTalosctl();
  const args = process.argv.slice(2);
  if (args.length > 0) {
    try {
      execFileSync(binary, args, { stdio: "inherit" });
    } catch (err) {
      // talosctl already wrote its own output; only report failures to launch it
      if (err.status == null) console.error(err.message);
      process.exit(err.status ?? 1);
    }
  } else {
    console.log(`talosctl binary ready: ${binary}`);
  }
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
