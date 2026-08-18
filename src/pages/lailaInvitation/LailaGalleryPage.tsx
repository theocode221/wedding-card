import { useCallback, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lightbox } from "../../components/gallery/Lightbox";
import { LailaPageDecor } from "./LailaPageDecor";
import { LAILA_DETAILS_TO, LAILA_GALLERY_IMAGE_URLS, lailaCoupleLabel } from "./lailaInviteData";
import "../../styles/gallery.css";
import "./laila-invitation.css";

const ALTS = LAILA_GALLERY_IMAGE_URLS.map((_, i) => `Galeri ${lailaCoupleLabel()} — foto ${i + 1}`);

export function LailaGalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = LAILA_GALLERY_IMAGE_URLS;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onNavigate = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <div className="laila-page laila-satellite" lang="ms">
      <LailaPageDecor />
      <div className="laila-satellite__inner">
            <Link to={LAILA_DETAILS_TO} className="laila-satellite__back laila-satellite__back--top">
              ← Kembali
            </Link>
        <header className="laila-gallery__head">
          <p className="laila-kicker">Kenangan</p>
          <h1 className="laila-title">Galeri</h1>
          <p className="laila-prose">Detik indah yang dirakam untuk dikenang selamanya.</p>
        </header>

        {images.length === 0 ? (
          <p className="laila-gallery__empty">
            Foto galeri akan dimuat naik dari Google Drive tidak lama lagi.
          </p>
        ) : (
          <div className="laila-gallery__grid">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                className="laila-gallery__item"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={src} alt={ALTS[i]} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={images}
        alts={ALTS}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
