import { publicUrl } from "../../lib/publicAsset";

/**
 * Two-frame “GIF” under `public/`. Change these paths if files are renamed.
 * Expected: `public/assets/cartoon-newlywed1.png`, `public/assets/cartoon-newlywed2.png`
 */
export const CARTOON_NEWLYWED_FRAME_1_PUBLIC_PATH = "assets/cartoon-newlywed1.png";
export const CARTOON_NEWLYWED_FRAME_2_PUBLIC_PATH = "assets/cartoon-newlywed2.png";

export function getCartoonNewlywedFrameSrcs(): readonly [string, string] {
  return [
    publicUrl(CARTOON_NEWLYWED_FRAME_1_PUBLIC_PATH),
    publicUrl(CARTOON_NEWLYWED_FRAME_2_PUBLIC_PATH),
  ] as const;
}

/** `cartoon-newlywed2` — shown inside egg + “born” burst. */
export function getCartoonNewlywedEggInnerSrc(): string {
  return publicUrl(CARTOON_NEWLYWED_FRAME_2_PUBLIC_PATH);
}
