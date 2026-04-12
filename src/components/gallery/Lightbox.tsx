import { useEffect, useRef } from "react";

export type LightboxProps = {
  images: readonly string[];
  alts?: readonly string[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ images, alts, activeIndex, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const open = activeIndex !== null && activeIndex >= 0 && activeIndex < images.length;
  const index = open ? activeIndex! : 0;
  const total = images.length;

  const goPrev = () => {
    if (!open) return;
    onNavigate(index <= 0 ? total - 1 : index - 1);
  };

  const goNext = () => {
    if (!open) return;
    onNavigate(index >= total - 1 ? 0 : index + 1);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate(activeIndex <= 0 ? total - 1 : activeIndex - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate(activeIndex >= total - 1 ? 0 : activeIndex + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeIndex, total, onClose, onNavigate]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    if (Math.abs(dx) < 50) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  if (!open) return null;

  const alt = alts?.[index] ?? "";

  return (
    <div
      className="glb"
      role="dialog"
      aria-modal="true"
      aria-label="Pratonton gambar penuh"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button type="button" className="glb__backdrop" aria-label="Tutup" onClick={onClose} />

      <div className="glb__chrome">
        <button
          ref={closeRef}
          type="button"
          className="glb__close"
          onClick={onClose}
          aria-label="Tutup pratonton"
        >
          <span aria-hidden>×</span>
        </button>
        <p className="glb__counter" aria-live="polite">
          {index + 1} <span className="glb__counter-sep">/</span> {total}
        </p>
      </div>

      <div className="glb__stage">
        <button
          type="button"
          className="glb__nav glb__nav--prev"
          onClick={goPrev}
          aria-label="Gambar sebelumnya"
        >
          <span aria-hidden>‹</span>
        </button>

        <figure className="glb__figure" key={index}>
          <img className="glb__img" src={images[index]} alt={alt} draggable={false} />
        </figure>

        <button type="button" className="glb__nav glb__nav--next" onClick={goNext} aria-label="Gambar seterusnya">
          <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}
