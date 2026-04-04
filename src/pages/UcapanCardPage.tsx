import { useCallback, useEffect, useRef, useState } from "react";
import { DraggableLetter } from "../components/ucapan/DraggableLetter";
import { SurpriseStage } from "../components/ucapan/SurpriseStage";
import { SURPRISE_PHOTOS } from "../components/ucapan/surprisePhotos";
import { TypingText } from "../components/ucapan/TypingText";
import { useUcapanCopy } from "../context/UcapanCopyContext";
import { publicUrl } from "../lib/publicAsset";
import "../styles/ucapan.css";

const CLOSE_SRC = publicUrl("assets/close-envelope.png");
const OPEN_SRC = publicUrl("assets/open-envelope.png");
const STAMP_SRC = publicUrl("assets/stamp.png");
const ENVELOPE_SURAT_SRC = publicUrl("assets/envelope-surat.png");
const SURAT_SRC = publicUrl("assets/surat.png");

/** Same track as congratulation page — add file at `public/music/congratulation.mp3` */
const MUSIC_SRC = publicUrl("music/congratulation.mp3");

const MS_AFTER_ENVELOPE_FOR_TYPING = 920;
const MS_STAMP_AFTER_TYPING = 420;

/** intro → opening (CSS phases) → envelopeSurat (drag) → revealed (full surat + ucapan) */
type FlowStage = "intro" | "opening" | "envelopeSurat" | "revealed";

export function UcapanCardPage() {
  const { copy } = useUcapanCopy();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stage, setStage] = useState<FlowStage>("intro");
  const [flowKey, setFlowKey] = useState(0);
  const [openingPhase, setOpeningPhase] = useState<0 | 1 | 2>(0);
  const [showIntroText, setShowIntroText] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [showUcapan, setShowUcapan] = useState(false);
  const [revealBgIn, setRevealBgIn] = useState(false);
  const [pullThreshold, setPullThreshold] = useState(140);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [surpriseExiting, setSurpriseExiting] = useState(false);

  useEffect(() => {
    const update = () => {
      setPullThreshold(Math.min(172, Math.round(window.innerHeight * 0.22)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Stage 1 timing */
  useEffect(() => {
    if (stage !== "intro") return;
    setShowIntroText(false);
    setShowStamp(false);
    const id = window.setTimeout(() => setShowIntroText(true), MS_AFTER_ENVELOPE_FOR_TYPING);
    return () => window.clearTimeout(id);
  }, [stage, flowKey]);

  const handleIntroTypingComplete = useCallback(() => {
    window.setTimeout(() => setShowStamp(true), MS_STAMP_AFTER_TYPING);
  }, []);

  /* Stage 2: closed → open → envelope-surat */
  useEffect(() => {
    if (stage !== "opening") return;
    setOpeningPhase(0);
    let innerRaf = 0;
    const outerRaf = window.requestAnimationFrame(() => {
      innerRaf = window.requestAnimationFrame(() => setOpeningPhase(1));
    });
    const t1 = window.setTimeout(() => setOpeningPhase(2), 1180);
    const t2 = window.setTimeout(() => setStage("envelopeSurat"), 2380);
    return () => {
      window.cancelAnimationFrame(outerRaf);
      window.cancelAnimationFrame(innerRaf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [stage, flowKey]);

  /* Stage 4–5: full surat background, then type ucapan */
  useEffect(() => {
    if (stage !== "revealed") {
      setShowUcapan(false);
      setRevealBgIn(false);
      return;
    }
    setRevealBgIn(false);
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setRevealBgIn(true));
    });
    const t = window.setTimeout(() => setShowUcapan(true), 1050);
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
      window.clearTimeout(t);
    };
  }, [stage, flowKey]);

  /* Background music when ucapan typing is shown (user has already interacted — stamp / drag) */
  useEffect(() => {
    if (stage !== "revealed" || !showUcapan) {
      const el = audioRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
      return;
    }
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.35;
    void el.play().catch(() => {
      /* Autoplay blocked or missing file — ignore */
    });
    return () => {
      el.pause();
    };
  }, [stage, showUcapan]);

  const handleBuka = () => {
    if (stage !== "intro") return;
    setStage("opening");
  };

  const handlePullComplete = () => {
    setStage("revealed");
  };

  const handleReplay = () => {
    setSurpriseOpen(false);
    setSurpriseExiting(false);
    setStage("intro");
    setFlowKey((k) => k + 1);
  };

  const SURPRISE_EXIT_MS = 520;

  const openSurprise = () => {
    setSurpriseExiting(false);
    setSurpriseOpen(true);
  };

  const closeSurprise = () => {
    setSurpriseExiting(true);
    window.setTimeout(() => {
      setSurpriseOpen(false);
      setSurpriseExiting(false);
    }, SURPRISE_EXIT_MS);
  };

  const maxPull = Math.round(pullThreshold * 1.45);

  return (
    <div className="ucapan-page ucapan-page--boot">
      <div className="ucapan-page__wash" aria-hidden />
      <div className="ucapan-page__batik" aria-hidden />
      <div className="ucapan-page__floral" aria-hidden />

      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      <main className="ucapan-shell">
        {stage === "intro" && (
          <section key={`intro-${flowKey}`} className="ucapan-s1" aria-label={copy.introSectionAriaLabel}>
            {showIntroText && (
              <TypingText
                key={`intro-typing-${flowKey}`}
                text={copy.introLine}
                speedMs={46}
                onComplete={handleIntroTypingComplete}
                className="ucapan-s1-typing"
              />
            )}

            <div className="ucapan-s1-envelope">
              <div className="ucapan-s1-envelope__bundle">
                <div className="ucapan-s1-envelope__shadow" aria-hidden />
                <img
                  className="ucapan-s1-envelope__img"
                  src={CLOSE_SRC}
                  alt=""
                  width={640}
                  height={480}
                  decoding="async"
                />
                {showStamp && (
                  <button type="button" className="ucapan-s1-stamp" onClick={handleBuka} aria-label={copy.stampButtonAriaLabel}>
                    <span className="ucapan-s1-stamp__motion">
                      <img className="ucapan-s1-stamp__img" src={STAMP_SRC} alt="" width={256} height={256} decoding="async" />
                      <span className="ucapan-s1-stamp__label">{copy.stampLabel}</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {stage === "opening" && (
          <section key={`opening-${flowKey}`} className="ucapan-opening" aria-hidden={false} aria-label={copy.openingSectionAriaLabel}>
            <div
              className={[
                "ucapan-opening__scene",
                openingPhase >= 1 ? "ucapan-opening__scene--phase1" : "",
                openingPhase >= 2 ? "ucapan-opening__scene--phase2" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="ucapan-opening__shadow" aria-hidden />
              <div className="ucapan-opening__layer ucapan-opening__layer--closed">
                <img src={CLOSE_SRC} alt="" className="ucapan-opening__img" width={640} height={480} decoding="async" />
              </div>
              <div className="ucapan-opening__layer ucapan-opening__layer--open">
                <img src={OPEN_SRC} alt="" className="ucapan-opening__img" width={640} height={480} decoding="async" />
              </div>
              <div className="ucapan-opening__layer ucapan-opening__layer--envsurat">
                <img src={ENVELOPE_SURAT_SRC} alt="" className="ucapan-opening__img" width={640} height={480} decoding="async" />
              </div>
            </div>
          </section>
        )}

        {stage === "envelopeSurat" && (
          <section key={`pull-${flowKey}`} className="ucapan-pull" aria-label={copy.pullSectionAriaLabel}>
            <p className="ucapan-pull__hint">{copy.pullHint}</p>
            <div className="ucapan-pull__scene">
              <div className="ucapan-pull__shadow" aria-hidden />
              <div className="ucapan-pull__bundle">
                <DraggableLetter
                  key={`drag-${flowKey}`}
                  suratSrc={SURAT_SRC}
                  threshold={pullThreshold}
                  maxPull={maxPull}
                  onComplete={handlePullComplete}
                  dragAriaLabel={copy.pullDragHitAriaLabel}
                  envelopeOverlay={
                    <img
                      className="ucapan-pull__envelope"
                      src={ENVELOPE_SURAT_SRC}
                      alt=""
                      width={640}
                      height={480}
                      decoding="async"
                    />
                  }
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {stage === "revealed" && (
        <div key={`reveal-${flowKey}`} className="ucapan-reveal" aria-label={copy.revealSectionAriaLabel}>
          <div className={["ucapan-reveal__bg", revealBgIn ? "ucapan-reveal__bg--in" : ""].filter(Boolean).join(" ")}>
            <img src={SURAT_SRC} alt="" className="ucapan-reveal__bgImg" width={1200} height={1600} decoding="async" />
          </div>
          <div className="ucapan-reveal__veil" aria-hidden />
          <div className="ucapan-reveal__scroll">
            <div className="ucapan-reveal__content">
              {showUcapan && (
                <article className="ucapan-reveal__card" aria-label={copy.revealArticleAriaLabel}>
                  <TypingText
                    key={`ucapan-${flowKey}`}
                    text={copy.mainUcapanText}
                    speedMs={38}
                    multiline
                    className="ucapan-reveal__typing"
                  />
                </article>
              )}
            </div>
            {showUcapan && (
              <footer className="ucapan-reveal__footer">
                <button type="button" className="ucapan-reveal__surprise" onClick={openSurprise}>
                  {copy.buttonSurprise}
                </button>
                <button type="button" className="ucapan-reveal__replay" onClick={handleReplay}>
                  {copy.buttonReplay}
                </button>
              </footer>
            )}
          </div>
        </div>
      )}

      {surpriseOpen && (
        <SurpriseStage photos={SURPRISE_PHOTOS} exiting={surpriseExiting} onClose={closeSurprise} />
      )}
    </div>
  );
}
