#!/usr/bin/env node
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const TALOS_VERSION = "v1.9.4";

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
    const binDir = path.join(process.env.HOME || "", ".local", "bin");
    const localBinary = path.join(binDir, process.platform === "win32" ? "talosctl.exe" : "talosctl");
    if (fs.existsSync(localBinary)) {
      return localBinary;
    }

    fs.mkdirSync(binDir, { recursive: true });
    const { osName, archName } = getPlatform();
    const downloadUrl = `https://github.com/siderolabs/talos/releases/download/${TALOS_VERSION}/talosctl-${osName}-${archName}`;

    console.log(`Downloading talosctl ${TALOS_VERSION} for ${osName}/${archName}...`);
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`Failed to download talosctl from ${downloadUrl}: ${res.statusText}`);

    const fileStream = fs.createWriteStream(localBinary);
    const reader = res.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fileStream.write(value);
    }
    fileStream.end();

    if (process.platform !== "win32") {
      fs.chmodSync(localBinary, 0o755);
    }

    console.log(`talosctl installed to ${localBinary}`);
    return localBinary;
  }
}

async function main() {
  const binary = await ensureTalosctl();
  const args = process.argv.slice(2);
  if (args.length > 0) {
    try {
      const output = execSync(`"${binary}" ${args.join(" ")}`, { encoding: "utf-8" });
      console.log(output);
    } catch (err) {
      console.error(err.stdout || err.stderr || err.message);
      process.exit(err.status || 1);
    }
  } else {
    console.log(`talosctl binary ready: ${binary}`);
  }
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
