import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getCatchTheLoveResultTitle } from "./catchTheLoveUtils";
import { shareEggRevealHappiness } from "./eggRevealShare";
import { revealUiTapHaptic } from "./eggRevealHaptics";
import { gameResultSfx } from "./eggRevealSfx";

type GameResultProps = {
  score: number;
  onPlayAgain: () => void;
  onBackToCard: () => void;
};

export function GameResult({ score, onPlayAgain, onBackToCard }: GameResultProps) {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const safeScore = useMemo(() => Math.max(0, Math.round(score)), [score]);

  useLayoutEffect(() => {
    const body = document.body;
    const prevBody = body.style.overflow;
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      body.style.overflow = prevBody;
    };
  }, []);

  useLayoutEffect(() => {
    gameResultSfx(safeScore);
  }, [safeScore]);

  const title = getCatchTheLoveResultTitle(safeScore);

  const handleShare = useCallback(async () => {
    revealUiTapHaptic();
    const { ok, message } = await shareEggRevealHappiness();
    if (!message) return;
    setShareNote(message);
    window.setTimeout(() => setShareNote(null), ok ? 2400 : 4200);
  }, []);

  const playAgain = useCallback(() => {
    revealUiTapHaptic();
    onPlayAgain();
  }, [onPlayAgain]);

  const back = useCallback(() => {
    revealUiTapHaptic();
    onBackToCard();
  }, [onBackToCard]);

  const ui = (
    <div className="ctl-result" role="dialog" aria-modal="true" aria-labelledby="ctl-result-title">
      <div className="ctl-result__burst" aria-hidden />
      <div className="ctl-result__halftone" aria-hidden />

      <div className="ctl-result__panel">
        <p className="ctl-result__eyebrow">GAME SET</p>
        <h2 id="ctl-result-title" className="ctl-result__scoreline">
          Skor: <span className="ctl-result__scorenum">{safeScore}</span>
        </h2>
        <p className="ctl-result__flair">{title}</p>
        <p className="ctl-result__wish">Selamat Pengantin Baru!</p>

        {shareNote ? (
          <p className="ctl-result__toast" role="status">
            {shareNote}
          </p>
        ) : null}

        <div className="ctl-result__actions">
          <button type="button" className="ctl-result-btn ctl-result-btn--primary" onClick={playAgain}>
            Main Lagi
          </button>
          <button type="button" className="ctl-result-btn ctl-result-btn--ghost" onClick={back}>
            Kembali ke Kad
          </button>
          <button type="button" className="ctl-result-btn ctl-result-btn--share" onClick={handleShare}>
            Share Happiness 💕
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
