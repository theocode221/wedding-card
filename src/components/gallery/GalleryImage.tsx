import { useEffect, useRef, useState } from "react";
import { GALLERY_IMAGE_ALTS, GALLERY_IMAGE_URLS } from "../../data/galleryImages";

export type GalleryImageProps = {
  imageIndex: number;
  onOpen: () => void;
};

export function GalleryImage({ imageIndex, onOpen }: GalleryImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src = GALLERY_IMAGE_URLS[imageIndex];
  const alt = GALLERY_IMAGE_ALTS[imageIndex];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={[
        "gallery-cinematic__moment",
        visible ? "gallery-cinematic__moment--visible" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
    >
      <button type="button" className="gallery-cinematic__frame" onClick={onOpen} aria-label={`Buka gambar: ${alt}`}>
        <img
          className={["gallery-cinematic__img", loaded ? "gallery-cinematic__img--loaded" : ""]
            .filter(Boolean)
            .join(" ")}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
        />
      </button>
    </div>
  );
}
