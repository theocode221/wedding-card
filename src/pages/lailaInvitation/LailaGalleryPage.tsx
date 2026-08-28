import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lightbox } from "../../components/gallery/Lightbox";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { LailaPageDecor } from "./LailaPageDecor";
import {
  LAILA_DETAILS_TO,
  LAILA_GALLERY_IMAGE_URLS,
  lailaCoupleLabel,
  lailaInviteForPreview,
} from "./lailaInviteData";
import "../../styles/gallery.css";
import "./laila-invitation.css";

const QUOTES = [
  "Cinta itu bukan sekadar bertemu,\ntetapi memilih untuk tetap bersama.",
  "Setiap gambar memegang bisikan hari itu —\nlembut, kekal, dan penuh syukur.",
  "Dalam senyuman ini tersimpan doa,\nsupaya kasih ini berkekalan.",
  "Detik yang fana, dikenang sebagai janji.",
] as const;

type StoryItem =
  | { type: "image"; index: number }
  | { type: "quote"; text: string };

function buildStory(count: number): StoryItem[] {
  const items: StoryItem[] = [];
  let quoteAt = 0;
  for (let i = 0; i < count; i += 1) {
    items.push({ type: "image", index: i });
    if ((i + 1) % 2 === 0 && i < count - 1) {
      items.push({ type: "quote", text: QUOTES[quoteAt % QUOTES.length] });
      quoteAt += 1;
    }
  }
  return items;
}

function LailaGalleryMoment({
  src,
  alt,
  tilt,
  onOpen,
}: {
  src: string;
  alt: string;
  tilt: "left" | "right";
  onOpen: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={[
        "laila-memory",
        `laila-memory--${tilt}`,
        visible ? "is-in" : "",
        visible && loaded ? "is-painted" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="laila-memory__frame"
        onClick={onOpen}
        aria-label={`Buka gambar: ${alt}`}
      >
        <span className="laila-memory__stage">
          <img
            className={["laila-memory__img", loaded ? "is-loaded" : ""].filter(Boolean).join(" ")}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setLoaded(true)}
          />
        </span>
      </button>
    </div>
  );
}

function LailaGalleryQuote({ text }: { text: string }) {
  const rootRef = useRef<HTMLQuoteElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <blockquote ref={rootRef} className={["laila-memory-quote", visible ? "is-in" : ""].filter(Boolean).join(" ")}>
      <p className="laila-memory-quote__text">{text}</p>
    </blockquote>
  );
}

export function LailaGalleryPage() {
  const location = useLocation();
  const { isPreview } = usePortfolioPreviewMode();
  const invite = lailaInviteForPreview(isPreview);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = LAILA_GALLERY_IMAGE_URLS;
  const names = lailaCoupleLabel(invite);
  const detailsTo = withPortfolioSearch(LAILA_DETAILS_TO, location.search);
  const alts = useMemo(
    () => images.map((_, i) => `Galeri ${names} — foto ${i + 1}`),
    [images, names],
  );
  const story = useMemo(() => buildStory(images.length), [images.length]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onNavigate = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <div className="laila-page laila-satellite laila-gallery-page" lang="ms">
      <PortfolioBackToCatalog />
      <LailaPageDecor />
      <div className="laila-satellite__inner laila-gallery-page__inner">
        <Link to={detailsTo} className="laila-satellite__back laila-satellite__back--top">
          ← Kembali
        </Link>

        <header className="laila-gallery__head">
          <p className="laila-kicker">Kenangan</p>
          <h1 className="laila-title">Galeri hati</h1>
          <p className="laila-gallery__names">{names}</p>
          <p className="laila-prose">Detik indah yang dirakam, supaya kasih ini dikenang selamanya.</p>
        </header>

        {images.length === 0 ? (
          <p className="laila-gallery__empty">
            Foto galeri akan muncul di sini apabila gambar diletakkan dalam folder gallery.
          </p>
        ) : (
          <div className="laila-gallery__story">
            {story.map((item, i) =>
              item.type === "quote" ? (
                <LailaGalleryQuote key={`q-${i}`} text={item.text} />
              ) : (
                <LailaGalleryMoment
                  key={images[item.index]}
                  src={images[item.index]}
                  alt={alts[item.index]}
                  tilt={item.index % 2 === 0 ? "left" : "right"}
                  onOpen={() => setLightboxIndex(item.index)}
                />
              ),
            )}
          </div>
        )}

        <footer className="laila-gallery__close">
          <p className="laila-gallery__close-text">
            Terima kasih kerana menjadi sebahagian daripada kisah kami.
          </p>
          <p className="laila-gallery__names">{names}</p>
          <Link to={detailsTo} className="laila-satellite__back laila-gallery__back-bottom">
            ← Kembali
          </Link>
        </footer>
      </div>

      <Lightbox
        images={images}
        alts={alts}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
