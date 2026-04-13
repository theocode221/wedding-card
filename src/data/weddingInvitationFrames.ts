/**
 * Wedding invitation stills in /public/wedding-invitation/ (1–3 only for cinematic intro).
 * Respects Vite `base` for GitHub Pages etc.
 */
const frameUrl = (n: number): string => {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") {
    return `/wedding-invitation/${n}.png`;
  }
  const trimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${trimmed}/wedding-invitation/${n}.png`;
};

/** Public still URLs under `/wedding-invitation/{n}.png` (for gallery, etc.). */
export function getWeddingInvitationFrameUrl(n: number): string {
  return frameUrl(n);
}

/** Cinematic intro: wide → mid → couple (1.png, 2.png, 3.png). */
export const WEDDING_INVITATION_CINEMATIC_URLS: readonly [string, string, string] = [
  frameUrl(1),
  frameUrl(2),
  frameUrl(3),
];

/** @deprecated Kept for compatibility; only first three frames are used in-app. */
export const WEDDING_INVITATION_FRAME_URLS: readonly string[] = WEDDING_INVITATION_CINEMATIC_URLS;

function loadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** All frames — used when every asset must be ready. */
export function preloadWeddingInvitationFrames(urls: readonly string[]): Promise<void> {
  return Promise.all(urls.map((src) => loadImage(src))).then(() => undefined);
}

/**
 * First cinematic still only (`urls[0]`) — fastest first paint; intro only shows 1.png.
 * Call `preloadWeddingInvitationFrames` in the background for the rest if needed.
 */
export function preloadWeddingInvitationHero(urls: readonly [string, string, string]): Promise<void> {
  return loadImage(urls[0]);
}
