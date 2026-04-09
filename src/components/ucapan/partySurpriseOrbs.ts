import type { SurprisePhotoConfig } from "./surprisePhotos";
import { SURPRISE_PHOTOS } from "./surprisePhotos";

/** SVG gradient orb as data URI — no raster files. */
function orbDataUri(hue: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g" cx="32%" cy="28%"><stop offset="0%" stop-color="hsl(${hue},95%,78%)"/><stop offset="45%" stop-color="hsl(${hue},88%,58%)"/><stop offset="100%" stop-color="hsl(${(hue + 48) % 360},72%,38%)"/></radialGradient></defs><circle cx="50" cy="50" r="47" fill="url(#g)"/><ellipse cx="36" cy="34" rx="16" ry="11" fill="rgba(255,255,255,0.32)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Same layout as photo surprise, but every item is a generated orb (no pic/video files). */
export const PARTY_SURPRISE_ORBS: SurprisePhotoConfig[] = SURPRISE_PHOTOS.filter((p) => p.media !== "video").map(
  (p, i) => ({
    ...p,
    src: orbDataUri((i * 53 + 312) % 360),
    alt: "",
  }),
);
