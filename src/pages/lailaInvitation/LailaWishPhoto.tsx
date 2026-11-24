import { useMemo, useState, type ImgHTMLAttributes } from "react";
import { wishImageFallbackUrls } from "./lailaWishImageUrl";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  imageUrl?: string;
};

/** Uploaded wish photos — tries lh3, Drive thumbnail, then Apps Script proxy. */
export function LailaWishPhoto({ imageUrl, onError, alt = "", ...rest }: Props) {
  const sources = useMemo(() => wishImageFallbackUrls(imageUrl), [imageUrl]);
  const [index, setIndex] = useState(0);
  const src = sources[index];

  if (!src) return null;

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (index < sources.length - 1) {
          setIndex((i) => i + 1);
          return;
        }
        onError?.(event);
      }}
    />
  );
}