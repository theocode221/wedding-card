/**
 * Injects full `url("...")` values for public-folder images used in plain CSS.
 * Run synchronously in main.tsx before React render so backgrounds resolve on first paint.
 */
export function setupPublicAssets(): void {
  const base = import.meta.env.BASE_URL;
  const u = (path: string) => {
    const clean = path.replace(/^\/+/, "");
    return `url("${base}${clean}")`;
  };
  const root = document.documentElement;
  root.style.setProperty("--url-assets-batik", u("assets/batik.jpg"));
  root.style.setProperty("--url-assets-flower2", u("assets/flower2.png"));
  root.style.setProperty("--url-assets-flower4", u("assets/flower4.png"));
}
