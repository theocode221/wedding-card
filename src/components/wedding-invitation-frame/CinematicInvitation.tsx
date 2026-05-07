import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { CINEMATIC_COPY } from "../../data/cinematicInvitationCopy";
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
  /** User taps through after typography (e.g. reveal invitation below). */
  onComplete?: () => void;
  /** When user taps "Buka Jemputan" — e.g. start music on user gesture. */
  onOpenCinematic?: () => void;
  /** Fixed-position decor between scene wash and copy (e.g. maroon glitter). */
  decorMidLayer?: ReactNode;
};

/**
 * Must match `cinematic-invitation.css` `--ci-zoom-step-ms` (single slow push on 1.png).
 * After this + settle, typography starts immediately.
 */
const ZOOM_IN_MS = 6200;
const SETTLE_AFTER_ZOOM_MS = 450;
/** Pause after a line finishes typing before the next line starts */
const PAUSE_BETWEEN_LINES_MS = 720;
/** Typewriter — higher = slower “pen” cadence */
const MS_PER_CHAR = 108;
/** Handwriting — Latin char mode; keep near ink animation length for stroke feel */
const MS_PER_CHAR_HAND = 118;
const HOLD_AFTER_LAST_LINE_MS = 800;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

const TEXT_STAGES: CinematicStage[] = ["textOne", "textTwo", "textThree", "textFour"];

type TypewriterLineProps = {
  text: string;
  typing: boolean;
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

type HandwritingLineProps = {
  text: string;
  typing: boolean;
  complete: boolean;
  onTyped?: () => void;
};

/** Per-character ink-in for Latin script masthead */
function HandwritingLine({ text, typing, complete, onTyped }: HandwritingLineProps) {
  const [len, setLen] = useState(0);
  const onTypedRef = useRef(onTyped);
  onTypedRef.current = onTyped;
  const firedRef = useRef(false);
  const reduced = prefersReducedMotion();

  const latinRows = useMemo(() => text.split("\n").map((row) => [...row]), [text]);
  const latinFlatCount = useMemo(
    () => latinRows.reduce((n, row) => n + row.length, 0),
    [latinRows],
  );
  const rowStarts = useMemo(() => {
    let o = 0;
    return latinRows.map((row) => {
      const start = o;
      o += row.length;
      return start;
    });
  }, [latinRows]);

  useEffect(() => {
    firedRef.current = false;
    if (complete) {
      setLen(latinFlatCount);
      return;
    }
    if (!typing) {
      setLen(0);
      return;
    }
    if (reduced) {
      setLen(latinFlatCount);
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
      if (i >= latinFlatCount) {
        clearInterval(id);
        if (!firedRef.current) {
          firedRef.current = true;
          onTypedRef.current?.();
        }
      }
    }, MS_PER_CHAR_HAND);
    return () => clearInterval(id);
  }, [text, typing, complete, reduced, latinFlatCount]);

  return (
    <span className="ci-hand-stack">
      {latinRows.map((charsInRow, rowIdx) => (
        <span key={rowIdx} className="ci-hand-row">
          {charsInRow.map((ch, j) => {
            const idx = rowStarts[rowIdx] + j;
            const on = complete || idx < len;
            return (
              <span
                key={idx}
                className={["ci-hand-char", on ? "ci-hand-char--on" : "ci-hand-char--off"].join(" ")}
                style={{ ["--ci-hand-tilt" as string]: `${((idx % 7) - 3) * 0.65}deg` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
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

export function CinematicInvitation({
  urls,
  onComplete,
  onOpenCinematic,
  decorMidLayer,
}: CinematicInvitationProps) {
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
    const nextStage = TEXT_STAGES[index + 1];
    if (nextStage !== undefined) {
      timersRef.current.push(window.setTimeout(() => setStage(nextStage), pause));
      return;
    }
    timersRef.current.push(window.setTimeout(() => setStage("done"), HOLD_AFTER_LAST_LINE_MS));
  }, []);

  const handleShowDetails = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
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

  const textStageIndex = stage === "done" ? TEXT_STAGES.length : TEXT_STAGES.indexOf(stage);

  const lineVisible = (i: number) => textStageIndex >= i && textStageIndex >= 0;
  const lineTyping = (i: number) => textStageIndex === i;
  const lineComplete = (i: number) => textStageIndex > i || stage === "done";

  const started = stage !== "idle";

  const taglineVisible = lineVisible(0);
  const taglineTyping = lineTyping(0);
  const taglineComplete = lineComplete(0);
  const namesVisible = lineVisible(1);
  const namesTyping = lineTyping(1);
  const namesComplete = lineComplete(1);
  const subVisible = lineVisible(2);

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

      {decorMidLayer}

      <div className="ci-copy" aria-live="polite">
        <div className="ci-copy-masthead">
          <p
            dir="ltr"
            lang="ms"
            className={[
              "ci-line",
              "ci-line--masthead-tagline",
              taglineVisible ? "ci-line--in" : "",
              taglineTyping ? "ci-line--typing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!taglineVisible}
          >
            <TypewriterLine
              text={CINEMATIC_COPY[0]}
              typing={taglineTyping}
              complete={taglineComplete}
              onTyped={taglineTyping ? () => handleLineTyped(0) : undefined}
            />
          </p>
          <p
            dir="ltr"
            lang="ms"
            className={[
              "ci-line",
              "ci-line--lead",
              "ci-line--hand",
              namesVisible ? "ci-line--in" : "",
              namesTyping ? "ci-line--typing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!namesVisible}
          >
            <HandwritingLine
              text={CINEMATIC_COPY[1]}
              typing={namesTyping}
              complete={namesComplete}
              onTyped={namesTyping ? () => handleLineTyped(1) : undefined}
            />
          </p>
          <div
            className={["ci-copy-sub", subVisible ? "ci-copy-sub--visible" : ""].filter(Boolean).join(" ")}
          >
            {CINEMATIC_COPY.slice(2).map((text, j) => {
              const i = j + 2;
              const visible = lineVisible(i);
              const typing = lineTyping(i);
              const complete = lineComplete(i);
              return (
                <p
                  key={`line-${i}`}
                  dir="ltr"
                  lang="ms"
                  className={[
                    "ci-line",
                    "ci-line--on-scrim",
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
      </div>

      <button
        type="button"
        className={["ci-open", started ? "ci-open--hide" : ""].filter(Boolean).join(" ")}
        onClick={handleStart}
        aria-label="Buka jemputan"
      >
        Buka Jemputan
      </button>

      {started && stage === "done" && (
        <button
          type="button"
          className="ci-details-cta"
          onClick={handleShowDetails}
          aria-label="Lihat butiran majlis"
        >
          Lihat butiran
        </button>
      )}

      {started && stage !== "done" && (
        <span className="ci-sr-only">Animasi jemputan sedang dimainkan.</span>
      )}
      {started && stage === "done" && (
        <span className="ci-sr-only">Animasi tamat — tekan Lihat butiran untuk meneruskan.</span>
      )}
    </div>
  );
}
