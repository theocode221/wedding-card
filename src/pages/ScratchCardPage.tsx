import { useCallback, useId, useState } from "react";
import { Link } from "react-router-dom";
import { DoaDoaButton, RevealActions } from "../components/scratch/RevealActions";
import { ScratchRevealCard } from "../components/scratch/ScratchRevealCard";
import "../styles/scratch-card.css";

const MAIN_LINES = `Ikhlas daripada Haniff, Hafizi, Din dan Nabil!!`;

const EXTRA_LINES = `Tahniah menjadi Xtrobois pertama berkahwin `;

const BLESSING_WORDS = ["Bahagia", "🌧️","Cinta", "💕" ,"✨","Berkat", "🤲","Sakinah", "Rahmat", "Mawaddah"];

type BlessingParticle = {
  id: number;
  word: string;
  left: string;
  delay: number;
  duration: number;
};

let blessingId = 0;

export function ScratchCardPage() {
  const mainId = useId();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showExtraMessage, setShowExtraMessage] = useState(false);
  const [showBlessingEffect, setShowBlessingEffect] = useState(false);
  const [blessingParticles, setBlessingParticles] = useState<BlessingParticle[]>([]);
  const [resetSignal, setResetSignal] = useState(0);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleReplay = useCallback(() => {
    setIsRevealed(false);
    setShowExtraMessage(false);
    setShowBlessingEffect(false);
    setBlessingParticles([]);
    setResetSignal((n) => n + 1);
  }, []);

  const handleBlessing = useCallback(() => {
    setShowBlessingEffect(true);
    const next: BlessingParticle[] = [];
    for (let i = 0; i < 18; i += 1) {
      blessingId += 1;
      next.push({
        id: blessingId,
        word: BLESSING_WORDS[i % BLESSING_WORDS.length],
        left: `${6 + Math.random() * 88}%`,
        delay: Math.random() * 0.4,
        duration: 4.5 + Math.random() * 2.5,
      });
    }
    setBlessingParticles((p) => [...p, ...next]);
    window.setTimeout(
      () => {
        setBlessingParticles((p) => p.filter((x) => !next.some((n) => n.id === x.id)));
      },
      Math.max(...next.map((x) => (x.delay + x.duration) * 1000)) + 400,
    );
  }, []);

  return (
    <div className="scratch-page">
      <div className="scratch-page__ambient" aria-hidden />

      {showBlessingEffect && (
        <div className="scratch-page__blessing-layer" aria-hidden>
          {blessingParticles.map((b) => (
            <span
              key={b.id}
              className="scratch-page__blessing-word"
              style={{
                left: b.left,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
              }}
            >
              {b.word}
            </span>
          ))}
          <div className="scratch-page__blessing-sparkles" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="scratch-page__sparkle" style={{ left: `${(i * 7.5) % 100}%`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>
      )}

      <div className="scratch-page__inner">
        <header className="scratch-page__header">
          <h1 className="scratch-page__title">GORES DAN MENANG</h1>
          <p className="scratch-page__subtitle">Gosok perlahan untuk membukanya</p>
        </header>

        <div className={["scratch-page__card", isRevealed ? "scratch-page__card--revealed" : ""].filter(Boolean).join(" ")}>
          <div className="scratch-page__cardFrame">
            <ScratchRevealCard resetSignal={resetSignal} isRevealed={isRevealed} onReveal={handleReveal}>
              <div className="scratch-message" id={mainId}>
                <p className="scratch-message__kicker">Dengan penuh sukacita</p>
                <h2 className="scratch-message__headline scratch-message__headline--celebrate">
                  SELAMAT PENGANTIN BARU
                  <br />
                  TENUK DAN ISTERI!
                </h2>
                <p className="scratch-message__body">{MAIN_LINES}</p>
                <div className={["scratch-message__extra", showExtraMessage ? "scratch-message__extra--open" : ""].filter(Boolean).join(" ")}>
                  <p className="scratch-message__extraInner">{EXTRA_LINES}</p>
                </div>
              </div>
            </ScratchRevealCard>
          </div>
        </div>

        {isRevealed && (
          <>
            <button
              type="button"
              className="reveal-actions__btn reveal-actions__btn--primary scratch-page__bacaTop"
              onClick={() => setShowExtraMessage((v) => !v)}
            >
              {showExtraMessage ? "Tutup ayat tambahan" : "Baca Lagi"}
            </button>
            <DoaDoaButton onBlessing={handleBlessing} />
            <Link to="/roda-doa" className="scratch-page__wheelCta">
              teruskan ke putar putar
            </Link>
            <RevealActions onReplay={handleReplay} />
          </>
        )}
      </div>
    </div>
  );
}
