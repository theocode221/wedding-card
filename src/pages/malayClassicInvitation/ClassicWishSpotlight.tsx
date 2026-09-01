import { useCallback, useEffect, useRef, useState } from "react";
import { CLASSIC_DEMO_WISHES, type ClassicWish } from "./classicInviteData";

const ROTATE_MS = 4200;
const SWIPE_MIN = 36;

/** Guest wish spotlight — demo data for now; wire to live RSVP later. */
export function ClassicWishSpotlight({ wishes = CLASSIC_DEMO_WISHES }: { wishes?: readonly ClassicWish[] }) {
  const items = wishes;
  const [index, setIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const swipeRef = useRef({ x: 0, y: 0, tracking: false });
  const timerRef = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (items.length <= 1) return;
      setSlideDir(dir);
      setIndex((i) => (i + dir + items.length) % items.length);
    },
    [items.length],
  );

  const startAuto = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (items.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = window.setInterval(() => {
      setSlideDir(1);
      setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
  }, [items.length]);

  useEffect(() => {
    startAuto();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [startAuto]);

  const handleSwipeEnd = useCallback(
    (dx: number, dy: number) => {
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
      go(dx < 0 ? 1 : -1);
      startAuto();
    },
    [go, startAuto],
  );

  if (items.length === 0) return null;

  const current = items[index];
  const slideClass =
    slideDir === 1 ? "classic-wish__quote--next" : "classic-wish__quote--prev";

  return (
    <section className="classic-wish" aria-label="Ucapan tetamu">
      <p className="classic-kicker">Ucapan</p>
      <h2 className="classic-title">Doa &amp; ucapan</h2>
      <div
        className="classic-wish__stage"
        onPointerDown={(event) => {
          if (items.length <= 1) return;
          swipeRef.current = { x: event.clientX, y: event.clientY, tracking: true };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (!swipeRef.current.tracking) return;
          swipeRef.current.tracking = false;
          handleSwipeEnd(event.clientX - swipeRef.current.x, event.clientY - swipeRef.current.y);
        }}
        onPointerCancel={() => {
          swipeRef.current.tracking = false;
        }}
      >
        <blockquote key={`${index}-${slideDir}`} className={`classic-wish__quote ${slideClass}`}>
          <p className="classic-wish__text">“{current.message}”</p>
          <footer className="classic-wish__name">— {current.name}</footer>
        </blockquote>
        {items.length > 1 ? (
          <div className="classic-wish__dots" aria-hidden>
            {items.map((_, i) => (
              <span key={i} className={`classic-wish__dot${i === index ? " is-on" : ""}`} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
