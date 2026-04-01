import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
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

/** GitHub Pages: duplicate index.html as 404.html so client-side routes work on refresh / deep links. */
function spaFallback404Plugin() {
  return {
    name: "spa-fallback-404",
    closeBundle() {
      const dist = resolve(process.cwd(), "dist");
      const indexHtml = resolve(dist, "index.html");
      const notFound = resolve(dist, "404.html");
      if (existsSync(indexHtml)) copyFileSync(indexHtml, notFound);
    },
  };
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react(), spaFallback404Plugin()],
});
