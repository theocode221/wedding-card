/**
 * Cinematic gallery — `/public/gallery/`
 * Change `GALLERY_FILENAME_PATTERN` or list URLs manually when replacing assets.
 */

const publicAsset = (path: string): string => {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") {
    return `/${path}`;
  }
  const trimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${trimmed}/${path}`;
};

/** File naming: `1.png` … `10.png` in repo — switch to `.jpg` if you export JPEGs. */
const GALLERY_EXT = "png";
const GALLERY_COUNT = 10;

/** Flat list for lightbox navigation (indices 0 … n-1). */
export const GALLERY_IMAGE_URLS: readonly string[] = Array.from({ length: GALLERY_COUNT }, (_, i) =>
  publicAsset(`gallery/${i + 1}.${GALLERY_EXT}`),
);

export const GALLERY_IMAGE_ALTS: readonly string[] = GALLERY_IMAGE_URLS.map(
  (_, i) => `Detik majlis — foto ${i + 1}`,
);

/**
 * Vertical story flow (single column). Each image is one “moment”.
 * Quotes break the rhythm between moments.
 */
export type GalleryStoryItem =
  | { type: "image"; imageIndex: number }
  | { type: "quote"; text: string };

export const GALLERY_STORY_ITEMS: readonly GalleryStoryItem[] = [
  { type: "image", imageIndex: 0 },
  { type: "image", imageIndex: 1 },
  { type: "image", imageIndex: 2 },
  {
    type: "quote",
    text: "Cinta itu bukan sekadar bertemu,\ntetapi memilih untuk tetap bersama.",
  },
  { type: "image", imageIndex: 3 },
  { type: "image", imageIndex: 4 },
  { type: "image", imageIndex: 5 },
  {
    type: "quote",
    text: "Setiap gambar memegang bisikan hari itu — lembut, kekal, dan penuh syukur.",
  },
  { type: "image", imageIndex: 6 },
  { type: "image", imageIndex: 7 },
  { type: "image", imageIndex: 8 },
  { type: "image", imageIndex: 9 },
];
