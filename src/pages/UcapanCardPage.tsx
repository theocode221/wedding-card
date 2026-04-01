import { useCallback, useEffect, useState } from "react";
import { DraggableLetter } from "../components/ucapan/DraggableLetter";
import { TypingText } from "../components/ucapan/TypingText";
import { publicUrl } from "../lib/publicAsset";
import "../styles/ucapan.css";

const CLOSE_SRC = publicUrl("assets/close-envelope.png");
const OPEN_SRC = publicUrl("assets/open-envelope.png");
const STAMP_SRC = publicUrl("assets/stamp.png");
const ENVELOPE_SURAT_SRC = publicUrl("assets/envelope-surat.png");
const SURAT_SRC = publicUrl("assets/surat.png");

const INTRO_LINE = "Anda menerima surat!";
const MS_AFTER_ENVELOPE_FOR_TYPING = 920;
const MS_STAMP_AFTER_TYPING = 420;

const UCAPAN_POEM = `Selamat Pengantin Baru

Dua jiwa dipertemukan dalam rahmat,
dua hati disatukan dalam kasih.
Semoga setiap langkah yang bermula hari ini
dihiasi bahagia, diselimuti sabar,
dan dipenuhi cinta hingga ke akhir usia.

Moga rumah tangga yang dibina
menjadi taman ketenangan,
mekar dengan mawaddah dan sakinah,
serta sentiasa dalam lindungan-Nya.`;

/** intro → opening (CSS phases) → envelopeSurat (drag) → revealed (full surat + ucapan) */
type FlowStage = "intro" | "opening" | "envelopeSurat" | "revealed";

export function UcapanCardPage() {
  const [stage, setStage] = useState<FlowStage>("intro");
  const [flowKey, setFlowKey] = useState(0);
  const [openingPhase, setOpeningPhase] = useState<0 | 1 | 2>(0);
  const [showIntroText, setShowIntroText] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [showUcapan, setShowUcapan] = useState(false);
  const [revealBgIn, setRevealBgIn] = useState(false);
  const [pullThreshold, setPullThreshold] = useState(140);

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

  const handleBuka = () => {
    if (stage !== "intro") return;
    setStage("opening");
  };

  const handlePullComplete = () => {
    setStage("revealed");
  };

  const handleReplay = () => {
    setStage("intro");
    setFlowKey((k) => k + 1);
  };

  const maxPull = Math.round(pullThreshold * 1.45);

  return (
    <div className="ucapan-page ucapan-page--boot">
      <div className="ucapan-page__wash" aria-hidden />
      <div className="ucapan-page__batik" aria-hidden />
      <div className="ucapan-page__floral" aria-hidden />

      <main className="ucapan-shell">
        {stage === "intro" && (
          <section key={`intro-${flowKey}`} className="ucapan-s1" aria-label="Surat untuk anda">
            {showIntroText && (
              <TypingText
                key={`intro-typing-${flowKey}`}
                text={INTRO_LINE}
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
                  <button type="button" className="ucapan-s1-stamp" onClick={handleBuka} aria-label="Buka surat">
                    <span className="ucapan-s1-stamp__motion">
                      <img className="ucapan-s1-stamp__img" src={STAMP_SRC} alt="" width={256} height={256} decoding="async" />
                      <span className="ucapan-s1-stamp__label">BUKA</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {stage === "opening" && (
          <section key={`opening-${flowKey}`} className="ucapan-opening" aria-hidden={false} aria-label="Membuka sampul">
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
          <section key={`pull-${flowKey}`} className="ucapan-pull" aria-label="Surat dalam sampul">
            <p className="ucapan-pull__hint">Tarik surat ke atas untuk membaca</p>
            <div className="ucapan-pull__scene">
              <div className="ucapan-pull__shadow" aria-hidden />
              <div className="ucapan-pull__bundle">
                <DraggableLetter
                  key={`drag-${flowKey}`}
                  suratSrc={SURAT_SRC}
                  threshold={pullThreshold}
                  maxPull={maxPull}
                  onComplete={handlePullComplete}
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
        <div key={`reveal-${flowKey}`} className="ucapan-reveal" aria-label="Ucapan">
          <div className={["ucapan-reveal__bg", revealBgIn ? "ucapan-reveal__bg--in" : ""].filter(Boolean).join(" ")}>
            <img src={SURAT_SRC} alt="" className="ucapan-reveal__bgImg" width={1200} height={1600} decoding="async" />
          </div>
          <div className="ucapan-reveal__veil" aria-hidden />
          <div className="ucapan-reveal__scroll">
            <div className="ucapan-reveal__content">
              {showUcapan && (
                <article className="ucapan-reveal__card" aria-label="Ucapan di atas surat">
                  <TypingText
                    key={`ucapan-${flowKey}`}
                    text={UCAPAN_POEM}
                    speedMs={38}
                    multiline
                    className="ucapan-reveal__typing"
                  />
                </article>
              )}
            </div>
            {showUcapan && (
              <footer className="ucapan-reveal__footer">
                <button type="button" className="ucapan-reveal__replay" onClick={handleReplay}>
                  Lihat sekali lagi
                </button>
              </footer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
