import { publicUrl } from "../../lib/publicAsset";

export interface SurprisePhotoConfig {
  /** Path under `public/` — image (`.png` …) or video (`.mp4` / `.webm` when `media` is `video`) */
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
 * Add images under `public/assets/` as `pic1.png` … `pic20.png` (except slots used as video).
 * Add three clips: `surprise-video-1.mp4`, `surprise-video-2.mp4`, `surprise-video-3.mp4`.
 */
export const SURPRISE_PHOTOS: SurprisePhotoConfig[] = [
  {
    src: publicUrl("assets/pic1.png"),
    top: "8%",
    left: "3%",
    width: "min(22vw, 7.5rem)",
    speedPx: 4,
    rotationDeg: -4,
    alt: "",
  },
  {
    src: publicUrl("assets/pic2.png"),
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
    src: publicUrl("assets/pic4.png"),
    top: "36%",
    right: "7%",
    width: "min(23vw, 7.75rem)",
    speedPx: 2,
    rotationDeg: 5,
    alt: "",
  },
  {
    src: publicUrl("assets/pic5.png"),
    top: "58%",
    left: "4%",
    width: "min(21vw, 7.25rem)",
    speedPx: 0,
    rotationDeg: -3,
    alt: "",
  },
  {
    src: publicUrl("assets/pic6.png"),
    top: "64%",
    right: "5%",
    width: "min(20vw, 7rem)",
    speedPx: 8,
    rotationDeg: 4,
    alt: "",
  },
  {
    src: publicUrl("assets/pic7.png"),
    top: "20%",
    left: "38%",
    width: "min(18vw, 6.35rem)",
    speedPx: 3,
    rotationDeg: -2,
    alt: "",
  },
  {
    src: publicUrl("assets/pic8.png"),
    top: "48%",
    left: "32%",
    width: "min(19vw, 6.6rem)",
    speedPx: 0,
    rotationDeg: 2,
    alt: "",
  },
  {
    src: publicUrl("assets/pic9.png"),
    top: "76%",
    left: "8%",
    width: "min(19vw, 6.6rem)",
    speedPx: 5,
    rotationDeg: -5,
    alt: "",
  },
  {
    src: publicUrl("assets/pic10.png"),
    top: "80%",
    right: "10%",
    width: "min(21vw, 7.1rem)",
    speedPx: 1,
    rotationDeg: 3,
    alt: "",
  },
  {
    src: publicUrl("assets/pic11.png"),
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
    src: publicUrl("assets/pic13.png"),
    top: "14%",
    left: "50%",
    width: "min(16vw, 5.65rem)",
    speedPx: 0,
    rotationDeg: -4,
    alt: "",
  },
  {
    src: publicUrl("assets/pic14.png"),
    top: "40%",
    left: "46%",
    width: "min(17vw, 5.9rem)",
    speedPx: 6,
    rotationDeg: 2,
    alt: "",
  },
  {
    src: publicUrl("assets/pic15.png"),
    top: "68%",
    left: "44%",
    width: "min(15vw, 5.5rem)",
    speedPx: 1,
    rotationDeg: -2,
    alt: "",
  },
  {
    src: publicUrl("assets/pic16.png"),
    top: "6%",
    left: "22%",
    width: "min(16vw, 5.6rem)",
    speedPx: 5,
    rotationDeg: 3,
    alt: "",
  },
  {
    src: publicUrl("assets/pic17.png"),
    top: "86%",
    left: "20%",
    width: "min(17vw, 5.85rem)",
    speedPx: 0,
    rotationDeg: -5,
    alt: "",
  },
  {
    src: publicUrl("assets/surprise-video-3.mp4"),
    media: "video",
    top: "56%",
    right: "12%",
    width: "min(26vw, 9rem)",
    speedPx: 7,
    rotationDeg: 2,
    alt: "",
  },
  {
    src: publicUrl("assets/pic19.png"),
    top: "30%",
    left: "12%",
    width: "min(16vw, 5.7rem)",
    speedPx: 3,
    rotationDeg: -1,
    alt: "",
  },
  {
    src: publicUrl("assets/pic20.png"),
    top: "44%",
    right: "40%",
    width: "min(17vw, 5.95rem)",
    speedPx: 2,
    rotationDeg: 5,
    alt: "",
  },
];
