import { useCallback } from "react";
import { useScratchCard } from "../../hooks/useScratchCard";

export type ScratchRevealCardProps = {
  resetSignal: number;
  isRevealed: boolean;
  onReveal: () => void;
  onProgress?: (ratio: number) => void;
  children: React.ReactNode;
};

export function ScratchRevealCard({
  resetSignal,
  isRevealed,
  onReveal,
  onProgress,
  children,
}: ScratchRevealCardProps) {
  const { canvasRef, wrapRef, progress, drawingRef, scratchAt, endStroke } = useScratchCard({
    onReveal,
    onProgress,
    resetSignal,
  });

  const coordsFromEvent = useCallback((clientX: number, clientY: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return null;
    const r = wrap.getBoundingClientRect();
    return {
      x: clientX - r.left,
      y: clientY - r.top,
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (isRevealed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = coordsFromEvent(e.clientX, e.clientY);
    if (p) scratchAt(p.x, p.y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current || isRevealed) return;
    const p = coordsFromEvent(e.clientX, e.clientY);
    if (p) scratchAt(p.x, p.y);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    drawingRef.current = false;
    endStroke();
  };

  const hintPercent = Math.min(100, Math.round(progress * 100));

  return (
    <div className="scratch-reveal">
      <div ref={wrapRef} className="scratch-reveal__viewport">
        <div className="scratch-reveal__under" aria-hidden={!isRevealed}>
          {children}
        </div>
        <canvas
          ref={canvasRef}
          className={["scratch-reveal__canvas", isRevealed ? "scratch-reveal__canvas--gone" : ""].filter(Boolean).join(" ")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="presentation"
        />
        {!isRevealed && <div className="scratch-reveal__shimmer" aria-hidden />}
      </div>
      {!isRevealed && (
        <p className="scratch-reveal__hint" aria-live="polite">
          {hintPercent < 8 ? "Gosok permukaan kad…" : `${hintPercent}% terbuka`}
        </p>
      )}
    </div>
  );
}
