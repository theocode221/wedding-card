import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLailaRsvpRows, pickUcapanSpotlight, type LailaUcapanSnippet } from "./lailaRsvpApi";

const ROTATE_MS = 4000;
const SWIPE_MIN = 36;
const MAX_ITEMS = 4;

export function LailaUcapanSpotlight() {
  const [items, setItems] = useState<LailaUcapanSnippet[]>([]);
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
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    timerRef.current = window.setInterval(() => {
      setSlideDir(1);
      setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
  }, [items.length]);

  useEffect(() => {
    let cancelled = false;
    fetchLailaRsvpRows()
      .then((rows) => {
        if (cancelled) return;
        setItems(pickUcapanSpotlight(rows, MAX_ITEMS));
        setIndex(0);
        setSlideDir(1);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (items.length <= 1) return;
    swipeRef.current = { x: event.clientX, y: event.clientY, tracking: true };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeRef.current.tracking) return;
    swipeRef.current.tracking = false;
    handleSwipeEnd(event.clientX - swipeRef.current.x, event.clientY - swipeRef.current.y);
  };

  const onPointerCancel = () => {
    swipeRef.current.tracking = false;
  };

  if (items.length === 0) return null;

  const current = items[index];
  const slideClass =
    slideDir === 1 ? "laila-ucapan-spot__quote--next" : "laila-ucapan-spot__quote--prev";

  return (
    <section className="laila-ucapan-spot" aria-label="Ucapan tetamu">
      <div className="laila-ucapan-spot__frame">
        <p className="laila-ucapan-spot__kicker">Ucapan</p>

        <div
          className="laila-ucapan-spot__stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          aria-live="polite"
        >
          <blockquote key={index} className={`laila-ucapan-spot__quote ${slideClass}`}>
            <p className="laila-ucapan-spot__text">{current.message}</p>
            <footer className="laila-ucapan-spot__from">— {current.name}</footer>
          </blockquote>
        </div>

        {items.length > 1 ? (
          <div className="laila-ucapan-spot__dots" aria-hidden>
            {items.map((_, i) => (
              <span key={i} className={i === index ? "is-active" : undefined} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
