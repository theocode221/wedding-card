import { publicUrl } from "../../lib/publicAsset";

/** File extension for surprise still images under `public/assets/` (per-file override in `surprisePictureSrc`). */
export type SurpriseImageFormat = "png" | "jpg" | "jpeg";

/** Set once if most of your photos use the same type; override per image in `surprisePictureSrc("pic5", "jpeg")`. */
export const DEFAULT_SURPRISE_IMAGE_FORMAT: SurpriseImageFormat = "png";

/**
 * Builds URL for `public/assets/<basename>.<format>` (png, jpg, or jpeg).
 * Respects Vite `base` / GitHub Pages via `publicUrl`.
 */
export function surprisePictureSrc(
  basename: string,
  format: SurpriseImageFormat = DEFAULT_SURPRISE_IMAGE_FORMAT,
): string {
  return publicUrl(`assets/${basename}.${format}`);
}

export interface SurprisePhotoConfig {
  /** Image/video URL — use `surprisePictureSrc("pic1", "jpg")` for stills, or `publicUrl("assets/…")` for custom paths */
  src: string;
  /** `video`: autoplay, muted, loop (required for browser autoplay). Default `image`. */
  media?: "image" | "video";
  top: string;
  /** Use `left` or `right` (omit unused) */
  left?: string;
  right?: string;
  /** CSS length, e.g. `min(22vw, 7.5rem)`. Videos are usually larger than image circles. */
  width: string;
  /** Optional extra speed (px/s) added to the base drift for this photo */
  speedPx?: number;
  /** Initial tilt in degrees */
  rotationDeg?: number;
  alt?: string;
}

/**
 * Stills: `public/assets/pic1` … with extension from `DEFAULT_SURPRISE_IMAGE_FORMAT` or per call (`"jpg"`, `"jpeg"`).
 * Videos: `surprise-video-1.mp4`, `surprise-video-2.mp4` (two only).
 */
export const SURPRISE_PHOTOS: SurprisePhotoConfig[] = [
  {
    src: surprisePictureSrc("pic1"),
    top: "8%",
    left: "3%",
    width: "min(22vw, 7.5rem)",
    speedPx: 4,
    rotationDeg: -4,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic2"),
    top: "10%",
    right: "4%",
    width: "min(21vw, 7.25rem)",
    speedPx: 0,
    rotationDeg: 3,
    alt: "",
  },
  {
    src: publicUrl("assets/surprise-video-1.mp4"),
    media: "video",
    top: "32%",
    left: "5%",
    width: "min(30vw, 10rem)",
    speedPx: 6,
    rotationDeg: -2,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic4"),
    top: "36%",
    right: "7%",
    width: "min(23vw, 7.75rem)",
    speedPx: 2,
    rotationDeg: 5,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic5"),
    top: "58%",
    left: "4%",
    width: "min(21vw, 7.25rem)",
    speedPx: 0,
    rotationDeg: -3,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic6"),
    top: "64%",
    right: "5%",
    width: "min(20vw, 7rem)",
    speedPx: 8,
    rotationDeg: 4,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic7"),
    top: "20%",
    left: "38%",
    width: "min(18vw, 6.35rem)",
    speedPx: 3,
    rotationDeg: -2,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic8"),
    top: "48%",
    left: "32%",
    width: "min(19vw, 6.6rem)",
    speedPx: 0,
    rotationDeg: 2,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic9"),
    top: "76%",
    left: "8%",
    width: "min(19vw, 6.6rem)",
    speedPx: 5,
    rotationDeg: -5,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic10"),
    top: "80%",
    right: "10%",
    width: "min(21vw, 7.1rem)",
    speedPx: 1,
    rotationDeg: 3,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic11"),
    top: "26%",
    right: "18%",
    width: "min(17vw, 6rem)",
    speedPx: 2,
    rotationDeg: -3,
    alt: "",
  },
  {
    src: publicUrl("assets/surprise-video-2.mp4"),
    media: "video",
    top: "52%",
    right: "26%",
    width: "min(27vw, 9.25rem)",
    speedPx: 4,
    rotationDeg: 4,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic13"),
    top: "14%",
    left: "50%",
    width: "min(16vw, 5.65rem)",
    speedPx: 0,
    rotationDeg: -4,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic14"),
    top: "40%",
    left: "46%",
    width: "min(17vw, 5.9rem)",
    speedPx: 6,
    rotationDeg: 2,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic15"),
    top: "68%",
    left: "44%",
    width: "min(15vw, 5.5rem)",
    speedPx: 1,
    rotationDeg: -2,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic16"),
    top: "6%",
    left: "22%",
    width: "min(16vw, 5.6rem)",
    speedPx: 5,
    rotationDeg: 3,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic17"),
    top: "86%",
    left: "20%",
    width: "min(17vw, 5.85rem)",
    speedPx: 0,
    rotationDeg: -5,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic18"),
    top: "56%",
    right: "12%",
    width: "min(17vw, 6rem)",
    speedPx: 7,
    rotationDeg: 2,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic19"),
    top: "30%",
    left: "12%",
    width: "min(16vw, 5.7rem)",
    speedPx: 3,
    rotationDeg: -1,
    alt: "",
  },
  {
    src: surprisePictureSrc("pic20"),
    top: "44%",
    right: "40%",
    width: "min(17vw, 5.95rem)",
    speedPx: 2,
    rotationDeg: 5,
    alt: "",
  },
];
