import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BlessingResultCard } from "../components/blessing-wheel/BlessingResultCard";
import { BlessingWheel } from "../components/blessing-wheel/BlessingWheel";
import { WheelActions } from "../components/blessing-wheel/WheelActions";
import {
  availableSegmentIndices,
  BLESSING_SEGMENTS,
  computeNextRotation,
  SEGMENT_COUNT,
  segmentIndexAtPointer,
  type BlessingSegment,
} from "../data/blessings";
import "../styles/blessing-wheel.css";

/** Slightly longer than CSS spin (4.2s) so we still complete if `transitionend` never fires. */
const SPIN_FALLBACK_MS = 4800;

/** Countdown after “Pusing Lagi” before the wheel spins automatically (no second button). */
const SPIN_READY_MS = 3000;
const SPIN_READY_MS_REDUCED = 450;

const FLOAT_WORDS = ["Bahagia", "Berkat", "Kasih", "Tenang", "ANEP", "DIN", "HAFIZI", "NABIL"];

type FloatParticle = {
  id: number;
  word: string;
  left: string;
  delay: number;
  duration: number;
};

let floatId = 0;

export function BlessingWheelPage() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedBlessing, setSelectedBlessing] = useState<BlessingSegment | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showBlessingEffect, setShowBlessingEffect] = useState(false);
  const [particles, setParticles] = useState<FloatParticle[]>([]);
  const [pointerBounce, setPointerBounce] = useState(false);
  const [resultPulse, setResultPulse] = useState(false);
  /** Indices landed this round; cleared when “Pusing Lagi” after all names picked. */
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  /** After dismissing a result, brief wait + progress bar before next spin. */
  const [spinReadyLoading, setSpinReadyLoading] = useState(false);
  const [spinReadyBarKey, setSpinReadyBarKey] = useState(0);
  const [spinReadyDurationMs, setSpinReadyDurationMs] = useState(SPIN_READY_MS);

  const targetIndexRef = useRef<number | null>(null);
  const rotationRef = useRef(rotation);
  const pickedRef = useRef(pickedIndices);
  const spinningRef = useRef(false);
  const spinFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinReadyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    pickedRef.current = pickedIndices;
  }, [pickedIndices]);

  useEffect(() => {
    return () => {
      if (spinFallbackTimerRef.current != null) {
        clearTimeout(spinFallbackTimerRef.current);
      }
      if (spinReadyTimerRef.current != null) {
        clearTimeout(spinReadyTimerRef.current);
      }
    };
  }, []);

  const clearSpinFallback = useCallback(() => {
    if (spinFallbackTimerRef.current != null) {
      clearTimeout(spinFallbackTimerRef.current);
      spinFallbackTimerRef.current = null;
    }
  }, []);

  const onSpinTransitionEnd = useCallback(() => {
    if (!spinningRef.current) return;
    clearSpinFallback();
    spinningRef.current = false;
    setIsSpinning(false);
    const idx = targetIndexRef.current;
    targetIndexRef.current = null;
    const resolved = idx ?? segmentIndexAtPointer(rotationRef.current);
    const seg = BLESSING_SEGMENTS[resolved];
    setPickedIndices((prev) => (prev.includes(resolved) ? prev : [...prev, resolved]));
    setSelectedIndex(resolved);
    setSelectedBlessing(seg);
    setShowResult(true);
    setPointerBounce(true);
    setResultPulse(true);
    window.setTimeout(() => setPointerBounce(false), 700);
    window.setTimeout(() => setResultPulse(false), 2200);
  }, [clearSpinFallback]);

  const internalStartSpin = useCallback(() => {
    if (spinningRef.current) return;
    const pool = availableSegmentIndices(pickedRef.current);
    if (pool.length === 0) return;

    setShowResult(false);
    setSelectedBlessing(null);
    setSelectedIndex(null);
    setResultPulse(false);

    const target = pool[Math.floor(Math.random() * pool.length)];
    targetIndexRef.current = target;
    const next = computeNextRotation(rotationRef.current, target);
    spinningRef.current = true;
    setIsSpinning(true);
    clearSpinFallback();
    spinFallbackTimerRef.current = window.setTimeout(() => {
      spinFallbackTimerRef.current = null;
      onSpinTransitionEnd();
    }, SPIN_FALLBACK_MS);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRotation(next);
      });
    });
  }, [clearSpinFallback, onSpinTransitionEnd]);

  const handleFirstSpinClick = useCallback(() => {
    if (spinReadyLoading) return;
    internalStartSpin();
  }, [internalStartSpin, spinReadyLoading]);

  const handlePrayAgain = useCallback(() => {
    setShowBlessingEffect(true);
    const batch: FloatParticle[] = [];
    for (let i = 0; i < 16; i += 1) {
      floatId += 1;
      batch.push({
        id: floatId,
        word: FLOAT_WORDS[i % FLOAT_WORDS.length],
        left: `${5 + Math.random() * 90}%`,
        delay: Math.random() * 0.35,
        duration: 4 + Math.random() * 2.2,
      });
    }
    setParticles((p) => [...p, ...batch]);
    window.setTimeout(
      () => setParticles((p) => p.filter((x) => !batch.some((b) => b.id === x.id))),
      Math.max(...batch.map((b) => (b.delay + b.duration) * 1000)) + 500,
    );
  }, []);

  const handlePrepareNextSpin = useCallback(() => {
    clearSpinFallback();
    if (pickedRef.current.length >= SEGMENT_COUNT) {
      setPickedIndices([]);
      setRotation((r) => ((r % 360) + 360) % 360);
    }
    setShowResult(false);
    setSelectedBlessing(null);
    setSelectedIndex(null);
    setResultPulse(false);
    setPointerBounce(false);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
    const ms = reduced ? SPIN_READY_MS_REDUCED : SPIN_READY_MS;
    if (spinReadyTimerRef.current != null) {
      clearTimeout(spinReadyTimerRef.current);
    }
    setSpinReadyDurationMs(ms);
    setSpinReadyBarKey((k) => k + 1);
    setSpinReadyLoading(true);
    spinReadyTimerRef.current = window.setTimeout(() => {
      spinReadyTimerRef.current = null;
      setSpinReadyLoading(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          internalStartSpin();
        });
      });
    }, ms);
  }, [clearSpinFallback, internalStartSpin]);

  return (
    <div className="blessing-page">
      <div className="blessing-page__ambient" aria-hidden />

      {showBlessingEffect && (
        <div className="blessing-page__float-layer" aria-hidden>
          {particles.map((p) => (
            <span
              key={p.id}
              className="blessing-page__float-word"
              style={{
                left: p.left,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            >
              {p.word}
            </span>
          ))}
        </div>
      )}

      <div className="blessing-page__inner">
        <Link to="/kad-gosok" className="blessing-page__back">
          ← Gores dan menang
        </Link>

        <header className="blessing-page__header">
          <h1 className="blessing-page__title">Pusing roda doa</h1>
          <p className="blessing-page__subtitle">Satu putaran, satu keberkatan</p>
        </header>

        <div
          className={["blessing-page__wheelWrap", showResult ? "blessing-page__wheelWrap--withResult" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <BlessingWheel
            rotation={rotation}
            isSpinning={isSpinning}
            selectedIndex={showResult ? selectedIndex : null}
            pickedIndices={pickedIndices}
            showIdleShimmer={!showResult}
            pointerBounce={pointerBounce}
            onSpinTransitionEnd={onSpinTransitionEnd}
          />

          {!showResult && spinReadyLoading && (
            <div className="blessing-page__spinPrep" role="status" aria-live="polite" aria-busy="true">
              <p className="blessing-page__spinPrepLabel">Menyediakan roda…</p>
              <div className="blessing-page__spinPrepTrack" aria-hidden>
                <div
                  key={spinReadyBarKey}
                  className="blessing-page__spinPrepBar"
                  style={{ animationDuration: `${spinReadyDurationMs}ms` }}
                />
              </div>
            </div>
          )}

          {!showResult && pickedIndices.length > 0 && !spinReadyLoading && isSpinning && (
            <p className="blessing-page__spinningHint" aria-live="polite">
              Memutar…
            </p>
          )}

          {!showResult && pickedIndices.length === 0 && !spinReadyLoading && (
            <button type="button" className="blessing-page__spinBtn" onClick={handleFirstSpinClick} disabled={isSpinning}>
              {isSpinning ? "Memutar…" : "Pusing Sekarang"}
            </button>
          )}
        </div>

        <BlessingResultCard blessing={selectedBlessing} visible={showResult} pulse={resultPulse} />

        {showResult && (
          <WheelActions onPrayAgain={handlePrayAgain} onSpinMore={handlePrepareNextSpin} />
        )}

        {showResult && pickedIndices.length >= SEGMENT_COUNT && (
          <p className="blessing-page__roundDone" role="status">
            Semua nama telah dipilih. Tekan <strong>Pusing Lagi</strong> untuk mula pusingan baharu.
          </p>
        )}
      </div>
    </div>
  );
}
