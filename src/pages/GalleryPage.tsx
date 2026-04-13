import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryImage } from "../components/gallery/GalleryImage";
import { Lightbox } from "../components/gallery/Lightbox";
import { WhatsAppContactLink } from "../components/shared/WhatsAppContactLink";
import {
  GALLERY_IMAGE_ALTS,
  GALLERY_IMAGE_URLS,
  GALLERY_STORY_ITEMS,
} from "../data/galleryImages";
import "../styles/gallery.css";

export function GalleryPage() {
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [pageReady, setPageReady] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    GALLERY_IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const onNavigate = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleBack = useCallback(() => {
    navigate("/jemputan-frame", {
      state: { skipCinematic: true, scrollTo: "details" as const },
    });
  }, [navigate]);

  return (
    <div className={["gallery-page", pageReady ? "gallery-page--in" : ""].filter(Boolean).join(" ")}>
      <button type="button" className="gallery-page__back" onClick={handleBack}>
        ← Kembali
      </button>

      <header className="gallery-page__header">
        <h1 className="gallery-page__title">Galeri Kenangan</h1>
        <p className="gallery-page__subtitle">Detik indah yang dirakam untuk dikenang selamanya.</p>
      </header>

      <div className="gallery-cinematic__story">
        {GALLERY_STORY_ITEMS.map((item, i) => {
          if (item.type === "quote") {
            return (
              <blockquote key={`quote-${i}`} className="gallery-cinematic__quote">
                <p className="gallery-cinematic__quote-text">{item.text}</p>
              </blockquote>
            );
          }
          return (
            <GalleryImage
              key={`img-${item.imageIndex}`}
              imageIndex={item.imageIndex}
              onOpen={() => setLightboxIndex(item.imageIndex)}
            />
          );
        })}
      </div>

      <footer className="gallery-page__footer">
        <p className="gallery-page__footer-text">
          Dengan penuh sayang — terima kasih kerana menjadi sebahagian dari kisah kami.
        </p>
        <div className="gallery-page__contact">
          <WhatsAppContactLink />
        </div>
      </footer>

      <Lightbox
        images={GALLERY_IMAGE_URLS}
        alts={GALLERY_IMAGE_ALTS}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
