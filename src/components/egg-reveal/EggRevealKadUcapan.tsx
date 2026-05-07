import { useEffect, useId, useRef } from "react";
import {
  EGG_REVEAL_FROM_LINE,
  EGG_REVEAL_KAD_UCAPAN_PARAS,
  EGG_REVEAL_KAD_UCAPAN_TITLE,
} from "./eggRevealUcapanCopy";

type EggRevealKadUcapanProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  paras?: readonly string[];
  fromLine?: string;
};

export function EggRevealKadUcapan({
  open,
  onClose,
  title = EGG_REVEAL_KAD_UCAPAN_TITLE,
  paras = EGG_REVEAL_KAD_UCAPAN_PARAS,
  fromLine = EGG_REVEAL_FROM_LINE,
}: EggRevealKadUcapanProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="egg-reveal-kad" role="presentation">
      <button
        type="button"
        className="egg-reveal-kad__backdrop"
        aria-label="Tutup kad ucapan"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="egg-reveal-kad__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="egg-reveal-kad__badge" aria-hidden>
          <span className="egg-reveal-kad__badge-star">★</span>
          <span>SPECIAL</span>
        </div>
        <p id={titleId} className="egg-reveal-kad__title">
          {title}
        </p>
        <div className="egg-reveal-kad__bubble">
          <div className="egg-reveal-kad__bubble-inner">
            {paras.map((para, i) => (
              <p key={i} className="egg-reveal-kad__speech">
                {para}
              </p>
            ))}
          </div>
        </div>
        <p className="egg-reveal-kad__signoff">{fromLine}</p>
        <button type="button" className="egg-reveal-kad__close" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
