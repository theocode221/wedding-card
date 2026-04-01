/** Prefix for files in `public/` (e.g. `assets/foo.png`). Respects Vite `base` (GitHub Pages). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const p = path.replace(/^\/+/, "");
  return `${base}${p}`;
}
