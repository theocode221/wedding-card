import { useCallback, useEffect, useRef, useState } from "react";
import { EggRevealKadUcapan } from "./EggRevealKadUcapan";
import { getCartoonNewlywedFrameSrcs } from "./eggRevealConstants";
import {
  revealCelebrationHaptic,
  revealCheerHaptic,
  revealUiTapHaptic,
} from "./eggRevealHaptics";

type RevealCardProps = {
  visible: boolean;
  onReset: () => void;
  onStartCatchTheLove?: () => void;
  /** When true (e.g. mini-game open), close kad so it does not stack above overlays. */
  interactionSuspended?: boolean;
};

export function RevealCard({
  visible,
  onReset,
  onStartCatchTheLove,
  interactionSuspended = false,
}: RevealCardProps) {
  const [kadOpen, setKadOpen] = useState(false);
  const [cheerToken, setCheerToken] = useState<number | null>(null);
  const cheerTimerRef = useRef<number | null>(null);
  const lastTouchTapRef = useRef(0);

  const celebrationDoneRef = useRef(false);
  useEffect(() => {
    if (celebrationDoneRef.current) return;
    celebrationDoneRef.current = true;
    revealCelebrationHaptic();
  }, []);

  useEffect(() => {
    return () => {
      if (cheerTimerRef.current != null) window.clearTimeout(cheerTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (interactionSuspended) setKadOpen(false);
  }, [interactionSuspended]);

  const triggerCheer = useCallback(() => {
    revealCheerHaptic();
    const token = Date.now();
    setCheerToken(token);
    if (cheerTimerRef.current != null) window.clearTimeout(cheerTimerRef.current);
    cheerTimerRef.current = window.setTimeout(() => {
      cheerTimerRef.current = null;
      setCheerToken((t) => (t === token ? null : t));
    }, 520);
  }, []);

  const openKad = useCallback(() => {
    revealUiTapHaptic();
    setKadOpen(true);
  }, []);

  const reset = useCallback(() => {
    revealUiTapHaptic();
    onReset();
  }, [onReset]);

  const startCatch = useCallback(() => {
    revealUiTapHaptic();
    onStartCatchTheLove?.();
  }, [onStartCatchTheLove]);

  if (!visible) return null;

  const [src1, src2] = getCartoonNewlywedFrameSrcs();

  return (
    <div className="egg-reveal-panel">
      <EggRevealKadUcapan open={kadOpen} onClose={() => setKadOpen(false)} />

      <div className="egg-reveal-panel__corners" aria-hidden>
        <span className="egg-reveal-panel__bolt egg-reveal-panel__bolt--tl" />
        <span className="egg-reveal-panel__bolt egg-reveal-panel__bolt--tr" />
        <span className="egg-reveal-panel__bolt egg-reveal-panel__bolt--bl" />
        <span className="egg-reveal-panel__bolt egg-reveal-panel__bolt--br" />
      </div>

      <div
        className="egg-reveal-panel__image-wrap egg-reveal-panel__image-wrap--gif"
        role="region"
        aria-label="Kartun pengantin baru Haziq dan Laila"
      >
        <div className="egg-reveal-panel__gif-stage">
          <img
            className="egg-reveal-panel__gif-frame egg-reveal-panel__gif-frame--a"
            src={src1}
            alt=""
            width={640}
            height={800}
            decoding="async"
            draggable={false}
          />
          <img
            className="egg-reveal-panel__gif-frame egg-reveal-panel__gif-frame--b"
            src={src2}
            alt=""
            width={640}
            height={800}
            decoding="async"
            draggable={false}
          />
        </div>
        {cheerToken != null ? (
          <div key={cheerToken} className="egg-reveal-panel__gif-cheer-overlay" aria-hidden />
        ) : null}
        <button
          type="button"
          className="egg-reveal-panel__gif-hit"
          tabIndex={-1}
          aria-hidden
          title="Duik dua kali untuk sorak"
          onDoubleClick={(e) => {
            e.preventDefault();
            triggerCheer();
          }}
          onPointerUp={(e) => {
            if (e.pointerType !== "touch") return;
            const now = Date.now();
            if (now - lastTouchTapRef.current < 340) {
              e.preventDefault();
              lastTouchTapRef.current = 0;
              triggerCheer();
            } else {
              lastTouchTapRef.current = now;
            }
          }}
        />
      </div>

      <div
        className="egg-reveal-panel__reaction-meter"
        role="status"
        aria-live="polite"
        aria-label="Telur pecah — combo tiga"
      >
        <div className="egg-reveal-panel__reaction-meter__hud">
          <span className="egg-reveal-panel__reaction-meter__tag">TEPAS</span>
          <span className="egg-reveal-panel__reaction-meter__tag egg-reveal-panel__reaction-meter__tag--dim">
            ×3
          </span>
        </div>
        <div className="egg-reveal-panel__reaction-meter__track" aria-hidden>
          <span className="egg-reveal-panel__reaction-meter__star" />
          <span className="egg-reveal-panel__reaction-meter__star" />
          <span className="egg-reveal-panel__reaction-meter__star" />
        </div>
      </div>

      <div className="egg-reveal-panel__copy">
        <h1 className="egg-reveal-panel__title egg-reveal-panel__title--pop">Finally Married!</h1>
        <p className="egg-reveal-panel__tag egg-reveal-panel__tag--delay">#HaziqLaila</p>
        <p className="egg-reveal-panel__wish egg-reveal-panel__wish--delay">
          Selamat Pengantin Baru Badar dan Isteri!.
        </p>
      </div>

      <div className="egg-reveal-panel__actions">
        <button
          type="button"
          className="egg-reveal-btn egg-reveal-btn--primary egg-reveal-btn--kad"
          onClick={openKad}
        >
          Buka Kad Ucapan
        </button>
        {onStartCatchTheLove ? (
          <button
            type="button"
            className="egg-reveal-btn egg-reveal-btn--catch"
            onClick={startCatch}
          >
            Main Catch the Love 💕
          </button>
        ) : null}
        <button type="button" className="egg-reveal-btn egg-reveal-btn--ghost" onClick={reset}>
          Main Semula
        </button>
      </div>
    </div>
  );
}
