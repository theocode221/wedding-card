import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  getCopyForScript,
  persistScript,
  readScriptFromSearch,
  resolveInitialScript,
  type CinematicScript,
} from "../../data/cinematicInvitationCopy";
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
/** Typewriter (Majlis / tarikh) — higher = slower “pen” cadence */
const MS_PER_CHAR = 108;
/** Handwriting lead — Latin char mode; keep near ink animation length for stroke feel */
const MS_PER_CHAR_HAND = 118;
/** Jawi lead — interval between strokes (clip animation runs concurrently; overlaps feel natural). */
const MS_PER_WORD_HAND = 820;
const HOLD_AFTER_LAST_LINE_MS = 800;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

const TEXT_STAGES: CinematicStage[] = ["textOne", "textTwo", "textThree", "textFour"];

/** Jawi / Arabic block (avoids `\p{Script=Arabic}` for older tooling). */
const JAWI_CHARS_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

/** Polyfill-free grapheme count for stroke duration (≈ letters in Jawi). */
function jawiGraphemeCount(s: string): number {
  return Array.from(s).length;
}

function jawiStrokeDurationMs(word: string): number {
  const len = jawiGraphemeCount(word);
  return Math.min(2400, 580 + len * 170);
}

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

type HandwritingLineProps = {
  text: string;
  typing: boolean;
  complete: boolean;
  onTyped?: () => void;
};

/** Per-character (Latin) or per-word (Jawi) ink-in — avoids breaking Arabic shaping. */
function HandwritingLine({ text, typing, complete, onTyped }: HandwritingLineProps) {
  const jawiMode = useMemo(() => JAWI_CHARS_RE.test(text), [text]);

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

  const jawiRows = useMemo(() => text.split("\n").map((line) => line.trim().split(/\s+/).filter(Boolean)), [text]);
  const jawiWordCount = useMemo(() => jawiRows.reduce((n, row) => n + row.length, 0), [jawiRows]);
  const jawiRowsKeyed = useMemo(() => {
    let ti = 0;
    return jawiRows.map((words, ri) =>
      words.map((word, wi) => ({ word, ti: ti++, ri, wi })),
    );
  }, [jawiRows]);

  const flatCount = jawiMode ? jawiWordCount : latinFlatCount;
  const intervalMs = jawiMode ? MS_PER_WORD_HAND : MS_PER_CHAR_HAND;

  useEffect(() => {
    firedRef.current = false;
    if (complete) {
      setLen(flatCount);
      return;
    }
    if (!typing) {
      setLen(0);
      return;
    }
    if (reduced) {
      setLen(flatCount);
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
      if (i >= flatCount) {
        clearInterval(id);
        if (!firedRef.current) {
          firedRef.current = true;
          onTypedRef.current?.();
        }
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [text, typing, complete, reduced, flatCount, intervalMs]);

  if (jawiMode) {
    return (
      <span className="ci-hand-stack ci-hand-stack--jawi">
        {jawiRowsKeyed.map((cells, ri) => (
          <span key={ri} className="ci-hand-row ci-hand-row--jawi">
            {cells.map(({ word, ti, wi }) => {
              const on = complete || ti < len;
              const ms = jawiStrokeDurationMs(word);
              return (
                <span key={`${ri}-${wi}-${ti}`} className="ci-hand-jawi-word">
                  <span
                    className={[
                      "ci-hand-jawi-stroke",
                      "ci-hand-char",
                      on ? "ci-hand-char--on" : "ci-hand-char--off",
                    ].join(" ")}
                    style={
                      {
                        ["--ci-jawi-write-ms" as string]: `${ms}ms`,
                        ["--ci-hand-tilt" as string]: `${((ti % 7) - 3) * 0.35}deg`,
                      } satisfies CSSProperties
                    }
                  >
                    {word}
                  </span>
                  {wi < cells.length - 1 ? "\u00a0" : null}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    );
  }

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
  const [writingScript, setWritingScript] = useState<CinematicScript>(() =>
    resolveInitialScript(typeof window !== "undefined" ? window.location.search : ""),
  );

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
    const fromUrl = readScriptFromSearch(window.location.search);
    if (fromUrl) {
      setWritingScript(fromUrl);
      persistScript(fromUrl);
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const copy = useMemo(() => getCopyForScript(writingScript), [writingScript]);
  const isJawi = writingScript === "jawi";

  const chooseScript = useCallback((next: CinematicScript) => {
    if (stage !== "idle") return;
    setWritingScript(next);
    persistScript(next);
  }, [stage]);

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
      data-script={writingScript}
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

      {!started && (
        <div className="ci-script-toggle" role="group" aria-label="Pilih tulisan jemputan">
          <button
            type="button"
            className={["ci-script-toggle__btn", writingScript === "jawi" ? "ci-script-toggle__btn--active" : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => chooseScript("jawi")}
            aria-pressed={writingScript === "jawi"}
          >
            Jawi
          </button>
          <button
            type="button"
            className={["ci-script-toggle__btn", writingScript === "rumi" ? "ci-script-toggle__btn--active" : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => chooseScript("rumi")}
            aria-pressed={writingScript === "rumi"}
          >
            Rumi
          </button>
        </div>
      )}

      <div className="ci-copy" aria-live="polite">
        <div className="ci-copy-masthead">
          <p
            dir={isJawi ? "rtl" : "ltr"}
            lang={isJawi ? "ms-Arab" : "ms"}
            className={[
              "ci-line",
              "ci-line--masthead-tagline",
              isJawi ? "ci-line--jawi" : "",
              taglineVisible ? "ci-line--in" : "",
              taglineTyping ? "ci-line--typing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!taglineVisible}
          >
            <TypewriterLine
              text={copy[0]}
              typing={taglineTyping}
              complete={taglineComplete}
              onTyped={taglineTyping ? () => handleLineTyped(0) : undefined}
            />
          </p>
          <p
            dir={isJawi ? "rtl" : "ltr"}
            lang={isJawi ? "ms-Arab" : "ms"}
            className={[
              "ci-line",
              "ci-line--lead",
              "ci-line--hand",
              isJawi ? "ci-line--jawi" : "",
              namesVisible ? "ci-line--in" : "",
              namesTyping ? "ci-line--typing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!namesVisible}
          >
            <HandwritingLine
              text={copy[1]}
              typing={namesTyping}
              complete={namesComplete}
              onTyped={namesTyping ? () => handleLineTyped(1) : undefined}
            />
          </p>
          <div
            className={["ci-copy-sub", subVisible ? "ci-copy-sub--visible" : ""].filter(Boolean).join(" ")}
          >
            {copy.slice(2).map((text, j) => {
              const i = j + 2;
              const visible = lineVisible(i);
              const typing = lineTyping(i);
              const complete = lineComplete(i);
              return (
                <p
                  key={`${writingScript}-${i}`}
                  dir={isJawi ? (i === 3 ? "ltr" : "rtl") : "ltr"}
                  lang={isJawi ? (i === 3 ? "ms" : "ms-Arab") : "ms"}
                  className={[
                    "ci-line",
                    "ci-line--on-scrim",
                    i === 2 ? "ci-line--body" : "",
                    i === 3 ? "ci-line--date" : "",
                    isJawi && (i === 2 || i === 3) ? "ci-line--jawi" : "",
                    isJawi && i === 3 ? "ci-line--date-ltr-nums" : "",
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
