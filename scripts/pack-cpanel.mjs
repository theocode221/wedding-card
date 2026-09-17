import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { spawnSync } from "node:child_process";

const root = cwd();
const dist = resolve(root, "dist");
const outDir = resolve(root, "deploy");
const zipPath = resolve(outDir, "wedding-card-cpanel.zip");

if (!existsSync(dist)) {
  console.error("Missing dist/. Run npm run build:cpanel first.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

// Prefer PowerShell Compress-Archive on Windows; fall back to tar if available.
const ps = spawnSync(
  "powershell",
  [
    "-NoProfile",
    "-Command",
    `if (Test-Path -LiteralPath '${zipPath}') { Remove-Item -LiteralPath '${zipPath}' -Force }; Compress-Archive -Path '${dist}\\*' -DestinationPath '${zipPath}' -Force`,
  ],
  { stdio: "inherit" },
);

if (ps.status !== 0) {
  const tar = spawnSync("tar", ["-a", "-cf", zipPath, "-C", dist, "."], { stdio: "inherit" });
  if (tar.status !== 0) {
    console.error("Could not create zip. Upload the dist/ folder manually.");
    process.exit(1);
  }
}

console.log(`\nCreated ${zipPath}`);
console.log("Upload this zip in cPanel File Manager and extract into public_html/ (or your subdomain root).");
