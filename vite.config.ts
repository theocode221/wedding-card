import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * GitHub Pages (project site) serves the app at:
 *   https://<user>.github.io/<REPO_NAME>/
 *
 * The GitHub Actions workflow sets:
 *   VITE_BASE_PATH=/<REPO_NAME>/
 *
 * Local dev: omit VITE_BASE_PATH → base is "/".
 *
 * Manual production build for GitHub Pages (without Actions), from repo root:
 *   VITE_BASE_PATH=/your-repo-name/ npm run build
 *
 * Replace `your-repo-name` with your actual GitHub repository name.
 */
function resolveBase(): string {
  const p = process.env.VITE_BASE_PATH;
  if (p == null || p === "") return "/";
  const withLeading = p.startsWith("/") ? p : `/${p}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
});
