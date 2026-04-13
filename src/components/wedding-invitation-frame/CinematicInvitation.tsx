import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import "../../styles/cinematic-invitation.css";

export type CinematicStage =
  | "idle"
  | "zoomFrame"
  | "textOne"
  | "textTwo"
  | "textThree"
  | "textFour"
  | "done";

export type CinematicInvitationProps = {
  urls: readonly [string, string, string];
  /** After final hold — e.g. reveal full invitation below. */
  onComplete?: () => void;
  /** When user taps "Buka Jemputan" — e.g. start music on user gesture. */
  onOpenCinematic?: () => void;
};

const COPY = [
  "Satukan Cinta",
  "Nabil & Anis",
  "Dijemput hadir ke Majlis Walimatul Urus",
  "20 Disember 2026",
] as const;

/**
 * Must match `cinematic-invitation.css` `--ci-zoom-step-ms` (single slow push on 1.png).
 * After this + settle, typography starts immediately.
 */
const ZOOM_IN_MS = 6200;
const SETTLE_AFTER_ZOOM_MS = 450;
/** Pause after a line finishes typing before the next line starts */
const PAUSE_BETWEEN_LINES_MS = 520;
/** Typing speed — higher = slower, more cinematic */
const MS_PER_CHAR = 68;
const HOLD_AFTER_TEXT_FOUR_MS = 800;
const FINAL_HOLD_MS = 3400;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

const TEXT_STAGES: CinematicStage[] = ["textOne", "textTwo", "textThree", "textFour"];

type TypewriterLineProps = {
  text: string;
  /** Currently typing this line */
  typing: boolean;
  /** Line already finished — show full string */
  complete: boolean;
  onTyped?: () => void;
};

function TypewriterLine({ text, typing, complete, onTyped }: TypewriterLineProps) {
  const [len, setLen] = useState(0);
  const onTypedRef = useRef(onTyped);
  onTypedRef.current = onTyped;
  const firedRef = useRef(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    firedRef.current = false;
    if (complete) {
      setLen(text.length);
      return;
    }
    if (!typing) {
      setLen(0);
      return;
    }
    if (reduced) {
      setLen(text.length);
      if (!firedRef.current) {
        firedRef.current = true;
        onTypedRef.current?.();
      }
      return;
    }
    setLen(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= text.length) {
        clearInterval(id);
        if (!firedRef.current) {
          firedRef.current = true;
          onTypedRef.current?.();
        }
      }
    }, MS_PER_CHAR);
    return () => clearInterval(id);
  }, [text, typing, complete, reduced]);

  const shown = complete ? text : text.slice(0, len);
  return <>{shown}</>;
}

function scheduleZoomAndFirstLine(
  setStage: (s: CinematicStage) => void,
): ReturnType<typeof setTimeout>[] {
  const ids: ReturnType<typeof setTimeout>[] = [];
  setStage("zoomFrame");
  const tText1 = ZOOM_IN_MS + SETTLE_AFTER_ZOOM_MS;
  ids.push(window.setTimeout(() => setStage("textOne"), tText1));
  return ids;
}

export function CinematicInvitation({ urls, onComplete, onOpenCinematic }: CinematicInvitationProps) {
  const [rootVisible, setRootVisible] = useState(false);
  const [stage, setStage] = useState<CinematicStage>("idle");
  const [zoomLevel, setZoomLevel] = useState<"idle" | "frame">("idle");

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  const handleLineTyped = useCallback((index: number) => {
    const pause = prefersReducedMotion() ? 120 : PAUSE_BETWEEN_LINES_MS;
    if (index < 3) {
      timersRef.current.push(window.setTimeout(() => setStage(TEXT_STAGES[index + 1]), pause));
      return;
    }
    timersRef.current.push(window.setTimeout(() => setStage("done"), HOLD_AFTER_TEXT_FOUR_MS));
    timersRef.current.push(
      window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
      }, HOLD_AFTER_TEXT_FOUR_MS + FINAL_HOLD_MS),
    );
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    completedRef.current = false;

    setZoomLevel("frame");

    if (prefersReducedMotion()) {
      setStage("zoomFrame");
      timersRef.current.push(window.setTimeout(() => setStage("textOne"), 120));
      return;
    }

    timersRef.current = scheduleZoomAndFirstLine(setStage);
  }, [clearTimers]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRootVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handleStart = useCallback(() => {
    if (stage !== "idle") return;
    onOpenCinematic?.();
    runSequence();
  }, [stage, runSequence, onOpenCinematic]);

  const heroSrc = urls[0];

  const textStageIndex = stage === "done" ? 4 : TEXT_STAGES.indexOf(stage);

  const lineVisible = (i: number) => textStageIndex >= i && textStageIndex >= 0;
  const lineTyping = (i: number) => textStageIndex === i;
  const lineComplete = (i: number) => textStageIndex > i || stage === "done";

  const started = stage !== "idle";

  return (
    <div
      className={["ci-root", rootVisible ? "ci-root--visible" : "", stage === "done" ? "ci-root--hold" : ""]
        .filter(Boolean)
        .join(" ")}
      data-stage={stage}
      role="presentation"
      style={{ "--ci-zoom-step-ms": `${ZOOM_IN_MS}ms` } as CSSProperties}
    >
      <div className="ci-viewport">
        <div
          className={["ci-camera-zoom", zoomLevel === "frame" ? "ci-camera-zoom--frame" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="ci-stack ci-stack--solo">
            <img className="ci-layer" src={heroSrc} alt="" draggable={false} decoding="async" />
          </div>
        </div>
      </div>

      <div className="ci-vignette" aria-hidden />
      <div className="ci-warm" aria-hidden />

      <div className="ci-copy" aria-live="polite">
        <div className="ci-copy-panel">
          {COPY.map((text, i) => {
            const visible = lineVisible(i);
            const typing = lineTyping(i);
            const complete = lineComplete(i);
            return (
              <p
                key={i}
                className={[
                  "ci-line",
                  i === 0 ? "ci-line--lead" : "",
                  i === 1 ? "ci-line--names" : "",
                  i === 2 ? "ci-line--body" : "",
                  i === 3 ? "ci-line--date" : "",
                  visible ? "ci-line--in" : "",
                  typing ? "ci-line--typing" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden={!visible}
              >
                <TypewriterLine
                  text={text}
                  typing={typing}
                  complete={complete}
                  onTyped={typing ? () => handleLineTyped(i) : undefined}
                />
              </p>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className={["ci-open", started ? "ci-open--hide" : ""].filter(Boolean).join(" ")}
        onClick={handleStart}
        aria-label="Buka jemputan"
      >
        Buka Jemputan
      </button>

      {started && <span className="ci-sr-only">Animasi jemputan sedang dimainkan.</span>}
    </div>
  );
}
