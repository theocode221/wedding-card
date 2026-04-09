/**
 * JPEGs in /public/blessing-wheel/ named `{segmentId}` + extension.
 * Tries several extensions (Windows often uses `.JPG`; code used to ask for `.jpg` only).
 *
 * `segmentId` matches `BlessingSegment.id` in blessings.ts (e.g. anep, din).
 */
const PORTRAIT_EXTENSIONS = [".jpg", ".jpeg", ".JPG", ".JPEG"] as const;

function blessingWheelFolderPrefix(): string {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") {
    return "/blessing-wheel/";
  }
  const trimmed = base.endsWith("/") ? base : `${base}/`;
  return `${trimmed}blessing-wheel/`.replace(/([^:])\/{2,}/g, "$1/");
}

/** Ordered URLs to try until one loads (handles .jpg vs .JPG on disk). */
export function blessingPortraitCandidateUrls(segmentId: string): readonly string[] {
  const prefix = blessingWheelFolderPrefix();
  return PORTRAIT_EXTENSIONS.map((ext) => `${prefix}${segmentId}${ext}`);
}

/** First candidate only — prefer `blessingPortraitCandidateUrls` in UI with fallback. */
export function blessingWheelImageSrc(segmentId: string): string {
  return blessingPortraitCandidateUrls(segmentId)[0];
}
