import { useCallback, useEffect, useRef, useState } from "react";
import { CatchTheLoveGame } from "../components/egg-reveal/CatchTheLoveGame";
import { CrackableEgg, type EggCrackStage } from "../components/egg-reveal/CrackableEgg";
import { getCartoonNewlywedFrameSrcs } from "../components/egg-reveal/eggRevealConstants";
import { EggRevealPageDecor } from "../components/egg-reveal/EggRevealPageDecor";
import { GameResult } from "../components/egg-reveal/GameResult";
import { eggCrackHapticTap } from "../components/egg-reveal/eggRevealHaptics";
import {
  getEggRevealSfxMuted,
  primeEggRevealSfx,
  toggleEggRevealSfxMuted,
} from "../components/egg-reveal/eggRevealSfx";
import { RevealCard } from "../components/egg-reveal/RevealCard";
import "../styles/egg-reveal-card.css";

type PostRevealPanel = "card" | "game" | "result";

/** Delay after burst animation before showing the reveal screen. */
const REVEAL_AFTER_BURST_MS = 1680;

function eggCrackFill(stage: EggCrackStage): 0 | 1 | 2 | 3 {
  if (stage === "idle") return 0;
  if (stage === "step1") return 1;
  if (stage === "step2") return 2;
  return 3;
}

export function EggRevealCardPage() {
  const [revealed, setRevealed] = useState(false);
  const [eggStage, setEggStage] = useState<EggCrackStage>("idle");
  const [postRevealPanel, setPostRevealPanel] = useState<PostRevealPanel>("card");
  const [catchScore, setCatchScore] = useState(0);
  const [catchSession, setCatchSession] = useState(0);
  const [sfxMuted, setSfxMuted] = useState(getEggRevealSfxMuted);
  const timersRef = useRef<number[]>([]);
  const burstRevealScheduledRef = useRef(false);

  const clearCrackTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearCrackTimers();
    };
  }, [clearCrackTimers]);

  useEffect(() => {
    if (!revealed) setPostRevealPanel("card");
  }, [revealed]);

  useEffect(() => {
    const wake = () => primeEggRevealSfx();
    window.addEventListener("pointerdown", wake, { passive: true, once: true });
    window.addEventListener("keydown", wake, { once: true });
    return () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  const preloadImage = useCallback(() => {
    for (const src of getCartoonNewlywedFrameSrcs()) {
      const img = new Image();
      img.src = src;
    }
  }, []);

  const handleEggTap = useCallback(() => {
    if (revealed) return;

    if (eggStage === "idle") {
      eggCrackHapticTap(1);
      preloadImage();
      setEggStage("step1");
      return;
    }

    if (eggStage === "step1") {
      eggCrackHapticTap(2);
      setEggStage("step2");
      return;
    }

    if (eggStage === "step2") {
      if (burstRevealScheduledRef.current) return;
      eggCrackHapticTap(3);
      burstRevealScheduledRef.current = true;
      clearCrackTimers();
      setEggStage("step3");
      timersRef.current.push(
        window.setTimeout(() => {
          burstRevealScheduledRef.current = false;
          setRevealed(true);
          setEggStage("idle");
        }, REVEAL_AFTER_BURST_MS),
      );
    }
  }, [revealed, eggStage, preloadImage, clearCrackTimers]);

  const handleReset = useCallback(() => {
    clearCrackTimers();
    burstRevealScheduledRef.current = false;
    setRevealed(false);
    setEggStage("idle");
    setPostRevealPanel("card");
  }, [clearCrackTimers]);

  const handleCatchGameComplete = useCallback((finalScore: number) => {
    setCatchScore(finalScore);
    setPostRevealPanel("result");
  }, []);

  const handleCatchPlayAgain = useCallback(() => {
    setCatchSession((k) => k + 1);
    setPostRevealPanel("game");
  }, []);

  const showEggUi = !revealed;

  return (
    <main className="egg-reveal-page">
      <div className="egg-reveal-page__bg" aria-hidden />
      <div className="egg-reveal-page__grain" aria-hidden />

      <div className="egg-reveal-page__inner">
        {showEggUi && eggStage !== "step3" ? (
          <header className="egg-reveal-page__intro">
            <h1 className="egg-reveal-page__heading">
              {eggStage === "idle"
                ? "PECAHKAN TELUR!"
                : eggStage === "step1"
                  ? "Lagi!"
                  : "Sikit lagi!"}
            </h1>
            <p className="egg-reveal-page__sub">
              {eggStage === "idle"
                ? "Ada sesurprisee"
                : eggStage === "step1"
                  ? "Telur dah retak."
                  : "Pecahkan untuk lihat surprise!"}
            </p>
          </header>
        ) : null}

        {showEggUi ? (
          <div
            className={`egg-reveal-crack-meter ${eggStage === "step3" ? "egg-reveal-crack-meter--burst" : ""}`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={eggCrackFill(eggStage)}
            aria-label="Pecahan telur: tiga tap untuk pecahkan"
          >
            <div className="egg-reveal-crack-meter__hud">
              <span className="egg-reveal-crack-meter__tag">CRACK</span>
              <span className="egg-reveal-crack-meter__tag egg-reveal-crack-meter__tag--dim">3× TAP</span>
            </div>
            <div className="egg-reveal-crack-meter__track">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`egg-reveal-crack-meter__cell ${eggCrackFill(eggStage) > i ? "egg-reveal-crack-meter__cell--on" : ""}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <CrackableEgg
          stage={eggStage}
          visible={showEggUi}
          onActivate={handleEggTap}
        />

        {revealed ? (
          <div
            className="egg-reveal-card-slot"
            style={{ display: postRevealPanel === "card" ? "contents" : "none" }}
            aria-hidden={postRevealPanel !== "card"}
          >
            <RevealCard
              visible
              interactionSuspended={postRevealPanel !== "card"}
              onReset={handleReset}
              onStartCatchTheLove={() => setPostRevealPanel("game")}
            />
          </div>
        ) : null}
      </div>

      {revealed && postRevealPanel === "game" ? (
        <CatchTheLoveGame key={catchSession} onComplete={handleCatchGameComplete} />
      ) : null}

      {revealed && postRevealPanel === "result" ? (
        <GameResult
          score={catchScore}
          onPlayAgain={handleCatchPlayAgain}
          onBackToCard={() => setPostRevealPanel("card")}
        />
      ) : null}

      <button
        type="button"
        className={`egg-reveal-sfx-toggle ${sfxMuted ? "egg-reveal-sfx-toggle--muted" : ""}`}
        onClick={() => setSfxMuted(toggleEggRevealSfxMuted())}
        aria-label={sfxMuted ? "Buka bunyi kesan" : "Tutup bunyi kesan"}
        title={sfxMuted ? "Bunyi: Off" : "Bunyi: On"}
      >
        {sfxMuted ? "SFX: OFF" : "SFX: ON"}
      </button>

      <EggRevealPageDecor />
    </main>
  );
}
