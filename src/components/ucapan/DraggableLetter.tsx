import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";

export type DraggableLetterProps = {
  suratSrc: string;
  /** Pull distance (px) required to complete */
  threshold: number;
  /** Max visual pull (px) */
  maxPull: number;
  onComplete: () => void;
  className?: string;
  /** Rendered above surat, below hit layer (e.g. envelope-surat); use pointer-events: none on artwork */
  envelopeOverlay: ReactNode;
  /** Accessible name for the drag hit target (keyboard / screen readers) */
  dragAriaLabel?: string;
};

/**
 * Letter peek that follows vertical drag (mouse + touch via Pointer Events).
 * Pull upward (positive delta) increases offset; releasing below threshold snaps back.
 */
export function DraggableLetter({
  suratSrc,
  threshold,
  maxPull,
  onComplete,
  className = "",
  envelopeOverlay,
  dragAriaLabel = "Tarik surat ke atas untuk membaca",
}: DraggableLetterProps) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef(0);
  const startRef = useRef({ y: 0, base: 0 });
  const completedRef = useRef(false);
  const draggingRef = useRef(false);

  const applyOffset = useCallback((next: number) => {
    const clamped = Math.min(maxPull, Math.max(0, next));
    offsetRef.current = clamped;
    setOffset(clamped);
  }, [maxPull]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (completedRef.current) return;
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    startRef.current = { y: e.clientY, base: offsetRef.current };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || completedRef.current) return;
    const pull = startRef.current.y - e.clientY;
    applyOffset(startRef.current.base + pull);
  };

  const endDrag = useCallback(() => {
    draggingRef.current = false;
    setDragging(false);
    if (completedRef.current) return;
    if (offsetRef.current >= threshold) {
      completedRef.current = true;
      onComplete();
      return;
    }
    offsetRef.current = 0;
    setOffset(0);
  }, [onComplete, threshold]);

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    endDrag();
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    draggingRef.current = false;
    setDragging(false);
    if (!completedRef.current) {
      offsetRef.current = 0;
      setOffset(0);
    }
  };

  return (
    <div className={["ucapan-pull__stack", className].filter(Boolean).join(" ")}>
      <div className="ucapan-pull__dragZone ucapan-pull__dragZone--letter">
        <div
          className={["ucapan-pull__letterLayer", dragging ? "ucapan-pull__letterLayer--dragging" : ""]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translate3d(-50%, ${-offset}px, 0)` }}
          aria-hidden
        >
          <img className="ucapan-pull__suratPeek" src={suratSrc} alt="" width={480} height={640} decoding="async" draggable={false} />
        </div>
      </div>
      <div className="ucapan-pull__envelopeSlot">{envelopeOverlay}</div>
      <div className="ucapan-pull__dragZone ucapan-pull__dragZone--hit">
        <div
          role="button"
          tabIndex={0}
          className="ucapan-pull__hit"
          aria-label={dragAriaLabel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!completedRef.current && offsetRef.current < threshold) {
                applyOffset(threshold);
                completedRef.current = true;
                onComplete();
              }
            }
          }}
        />
      </div>
    </div>
  );
}
