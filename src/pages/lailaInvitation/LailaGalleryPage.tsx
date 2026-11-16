import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lightbox } from "../../components/gallery/Lightbox";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { LailaButterflies } from "./LailaButterflies";
import { LailaGalleryAtmosphere } from "./LailaGalleryAtmosphere";
import {
  LAILA_GALLERY_IMAGE_URLS,
  lailaCoupleLabel,
  lailaDetailsDestination,
  lailaInviteForPreview,
} from "./lailaInviteData";
import "../../styles/gallery.css";
import "./laila-invitation.css";

const CHAPTERS = [
  {
    title: "Pertemuan",
    quote: "Cinta itu bukan sekadar bertemu,\ntetapi memilih untuk tetap bersama.",
  },
  {
    title: "Ikatan",
    quote: "Setiap gambar memegang bisikan hari itu,\nlembut, kekal, dan penuh syukur.",
  },
  {
    title: "Janji",
    quote: "Dalam senyuman ini tersimpan doa,\nsupaya kasih ini berkekalan.",
  },
  {
    title: "Selamanya",
    quote: "Detik yang fana,\ndikenang sebagai janji.",
  },
] as const;

const PHOTOS_PER_CHAPTER = 3;

type Chapter = (typeof CHAPTERS)[number];

type StoryItem =
  | { type: "image"; index: number }
  | { type: "chapter"; chapter: Chapter };

function buildStory(count: number): StoryItem[] {
  const items: StoryItem[] = [];
  for (let i = 0; i < count; i += 1) {
    if (i % PHOTOS_PER_CHAPTER === 0) {
      const chapter = CHAPTERS[Math.floor(i / PHOTOS_PER_CHAPTER) % CHAPTERS.length];
      items.push({ type: "chapter", chapter });
    }
    items.push({ type: "image", index: i });
  }
  return items;
}

function LailaGalleryMoment({
  src,
  alt,
  tilt,
  number,
  total,
  onOpen,
}: {
  src: string;
  alt: string;
  tilt: "left" | "right";
  number: number;
  total: number;
  onOpen: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);

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
        ratio !== null && ratio < 1 ? "laila-memory--portrait" : "",
        visible ? "is-in" : "",
        visible && loaded ? "is-painted" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={ratio ? ({ "--laila-memory-ratio": ratio } as CSSProperties) : undefined}
    >
      <button
        type="button"
        className="laila-memory__frame"
        onClick={onOpen}
        aria-label={`Buka gambar: ${alt}`}
      >
        <span className="laila-memory__stage" style={ratio ? { aspectRatio: String(ratio) } : undefined}>
          <img
            className={["laila-memory__img", loaded ? "is-loaded" : ""].filter(Boolean).join(" ")}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              if (w > 0 && h > 0) setRatio(w / h);
              setLoaded(true);
            }}
          />
          <span className="laila-memory__film" aria-hidden />
        </span>
        <span className="laila-memory__caption" aria-hidden>
          {number}/{total}
        </span>
      </button>
    </div>
  );
}

function LailaGalleryChapter({ chapter }: { chapter: Chapter }) {
  const rootRef = useRef<HTMLDivElement>(null);
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
    <div ref={rootRef} className={["laila-memory-chapter", visible ? "is-in" : ""].filter(Boolean).join(" ")}>
      <h2 className="laila-memory-chapter__title">{chapter.title}</h2>
      <LailaGalleryQuote text={chapter.quote} />
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
  const detailsTo = withPortfolioSearch(lailaDetailsDestination(location.search), location.search);
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
      <div className="laila-gallery-page__decor" aria-hidden>
        <LailaButterflies density="full" accent="maroon" />
      </div>
      <LailaGalleryAtmosphere />
      <div className="laila-satellite__inner laila-gallery-page__inner">
        <Link to={detailsTo} className="laila-satellite__back laila-satellite__back--top">
          ← Kembali
        </Link>

        <header className="laila-gallery__head">
          <h1 className="laila-gallery__names">{names}</h1>
        </header>

        {images.length === 0 ? (
          <p className="laila-gallery__empty">
            Foto galeri akan muncul di sini apabila gambar diletakkan dalam folder gallery.
          </p>
        ) : (
          <div className="laila-gallery__story">
            {story.map((item, i) =>
              item.type === "chapter" ? (
                <LailaGalleryChapter key={`c-${i}`} chapter={item.chapter} />
              ) : (
                <LailaGalleryMoment
                  key={images[item.index]}
                  src={images[item.index]}
                  alt={alts[item.index]}
                  tilt={item.index % 2 === 0 ? "left" : "right"}
                  number={item.index + 1}
                  total={images.length}
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
