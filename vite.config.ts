import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
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
 * cPanel (domain root): npm run build:cpanel  → upload dist/ (includes .htaccess)
 * cPanel (subfolder):   npm run build:cpanel:sub  → see deploy-cpanel.txt
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

/** Absolute origin for link-preview URLs (WhatsApp, Facebook, etc. need absolute og:image). */
const SITE_ORIGIN = (process.env.VITE_SITE_ORIGIN || "https://theocode221.github.io").replace(/\/$/, "");

type LinkPreview = {
  /** Route without leading slash, e.g. "suhailah-hazziq" */
  path: string;
  title: string;
  description: string;
  /** File in public/, e.g. "og/suhailah-hazziq.jpg" (1200×630) */
  image: string;
};

const LAILA_PREVIEW = {
  title: "Walimatul Urus Suhailah & Hazziq | Sabtu 12.12.2026",
  description: "Tekan pautan untuk lihat jemputan.",
  image: "og/suhailah-hazziq.jpg",
};

const LINK_PREVIEWS: readonly LinkPreview[] = [
  { path: "suhailah-hazziq", ...LAILA_PREVIEW },
  { path: "suhailah-hazziq/rsvp", ...LAILA_PREVIEW },
  { path: "suhailah-hazziq/galeri", ...LAILA_PREVIEW },
  {
    path: "suhailah-hazziq/dashboard",
    ...LAILA_PREVIEW,
    title: "RSVP Dashboard — Suhailah & Hazziq",
    description: "Private RSVP and guest wishes dashboard.",
  },
];

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Link-preview crawlers don't run JS and GitHub Pages answers unknown routes with 404.html (status 404),
 * so write `<route>.html` per shared link: served as 200 at the clean URL, with Open Graph tags baked in.
 */
function linkPreviewPagesPlugin() {
  return {
    name: "link-preview-pages",
    closeBundle() {
      const dist = resolve(process.cwd(), "dist");
      const indexHtml = resolve(dist, "index.html");
      if (!existsSync(indexHtml)) return;
      const template = readFileSync(indexHtml, "utf8");
      const base = resolveBase();
      for (const page of LINK_PREVIEWS) {
        const url = `${SITE_ORIGIN}${base}${page.path}`;
        const image = `${SITE_ORIGIN}${base}${encodeURI(page.image)}`;
        const meta = [
          `<meta name="description" content="${escapeAttr(page.description)}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="Theocode Wedding" />`,
          `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
          `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
          `<meta property="og:url" content="${escapeAttr(url)}" />`,
          `<meta property="og:image" content="${escapeAttr(image)}" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
        ].join("\n    ");
        const html = template.replace(
          /<title>[\s\S]*?<\/title>/,
          `<title>${escapeAttr(page.title)}</title>\n    ${meta}`,
        );
        const out = resolve(dist, `${page.path}.html`);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, html);
      }
    },
  };
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react(), spaFallback404Plugin(), linkPreviewPagesPlugin()],
});
