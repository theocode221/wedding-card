import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

/** Production build for cPanel subfolder deploy (default /kad/). */
const base = process.env.VITE_BASE_PATH?.trim() || "/kad/";
const env = { ...process.env, VITE_BASE_PATH: base.endsWith("/") ? base : `${base}/` };

const tsc = spawnSync(process.execPath, ["./node_modules/typescript/bin/tsc"], {
  stdio: "inherit",
  env,
  cwd: resolve(process.cwd()),
});
if (tsc.status !== 0) process.exit(tsc.status ?? 1);

const vite = spawnSync(process.execPath, ["./node_modules/vite/bin/vite.js", "build"], {
  stdio: "inherit",
  env,
  cwd: resolve(process.cwd()),
});
process.exit(vite.status ?? 1);
