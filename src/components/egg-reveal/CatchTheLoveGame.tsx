import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import type { CatchFloatingEffect, FallingItem, FallingItemType } from "./catchTheLoveTypes";
import {
  CATCH_LOVE_DURATION_SEC,
  createFallingItem,
  nextSpawnDelayMs,
  pickCatchLabel,
} from "./catchTheLoveUtils";
import { gameBombHaptic, gameCatchGoodHaptic } from "./eggRevealHaptics";

const ITEM_EMOJI: Record<FallingItemType, string> = {
  heart: "❤️",
  ring: "💍",
  star: "⭐",
  bomb: "💣",
};

type CatchTheLoveGameProps = {
  onComplete: (finalScore: number) => void;
};

export function CatchTheLoveGame({ onComplete }: CatchTheLoveGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CATCH_LOVE_DURATION_SEC);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [effects, setEffects] = useState<CatchFloatingEffect[]>([]);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);

  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const canSpawnRef = useRef(true);
  const spawnTimeoutRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /** Lock page scroll + jump to top; sync fall distance to playfield (portal avoids main overflow clipping fixed UI). */
  useLayoutEffect(() => {
    const body = document.body;
    const prevBodyOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const el = fieldRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return () => {
        body.style.overflow = prevBodyOverflow;
      };
    }

    const syncFallDist = () => {
      const h = el.getBoundingClientRect().height;
      el.style.setProperty("--ctl-fall-dist", `${Math.max(Math.round(h), 220)}px`);
    };
    syncFallDist();
    const ro = new ResizeObserver(syncFallDist);
    ro.observe(el);

    return () => {
      ro.disconnect();
      el.style.removeProperty("--ctl-fall-dist");
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);

  const clearSpawnTimer = useCallback(() => {
    if (spawnTimeoutRef.current != null) {
      window.clearTimeout(spawnTimeoutRef.current);
      spawnTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          canSpawnRef.current = false;
          if (spawnTimeoutRef.current != null) {
            window.clearTimeout(spawnTimeoutRef.current);
            spawnTimeoutRef.current = null;
          }
          queueMicrotask(() => {
            if (endedRef.current) return;
            endedRef.current = true;
            onCompleteRef.current(scoreRef.current);
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    canSpawnRef.current = true;
    endedRef.current = false;
    const schedule = () => {
      spawnTimeoutRef.current = window.setTimeout(() => {
        if (!canSpawnRef.current || endedRef.current) return;
        setItems((prev) => [...prev, createFallingItem()]);
        schedule();
      }, nextSpawnDelayMs());
    };
    schedule();
    return () => {
      canSpawnRef.current = false;
      clearSpawnTimer();
    };
  }, [clearSpawnTimer]);

  const pushEffect = useCallback((leftPct: number, topPct: number, label: string, tone: "good" | "bad") => {
    const eid = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setEffects((prev) => [...prev, { id: eid, leftPct, topPct, label, tone }]);
    window.setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== eid));
    }, 900);
  }, []);

  const handleCatch = useCallback(
    (item: FallingItem, clientX: number, clientY: number) => {
      const field = fieldRef.current;
      let leftPct = item.x;
      let topPct = 42;
      if (field) {
        const r = field.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          leftPct = ((clientX - r.left) / r.width) * 100;
          topPct = ((clientY - r.top) / r.height) * 100;
        }
      }

      if (item.type === "bomb") {
        gameBombHaptic();
        setShake(true);
        window.setTimeout(() => setShake(false), 380);
        comboRef.current = 0;
        setCombo(0);
        setScore((s) => {
          const next = s + item.points;
          scoreRef.current = next;
          return next;
        });
        pushEffect(leftPct, topPct, pickCatchLabel(item.points, item.type), "bad");
      } else {
        gameCatchGoodHaptic();
        const nextCombo = comboRef.current + 1;
        comboRef.current = nextCombo;
        setCombo(nextCombo);
        setScore((s) => {
          const next = s + item.points;
          scoreRef.current = next;
          return next;
        });
        pushEffect(leftPct, topPct, pickCatchLabel(item.points, item.type), "good");
      }

      setItems((prev) => prev.filter((i) => i.id !== item.id));
    },
    [pushEffect],
  );

  const handleMiss = useCallback((id: string) => {
    setItems((prev) => {
      const still = prev.some((i) => i.id === id);
      if (!still) return prev;
      comboRef.current = 0;
      setCombo(0);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const onItemAnimEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>, id: string) => {
      if (!e.animationName.includes("ctl-item-fall")) return;
      handleMiss(id);
    },
    [handleMiss],
  );

  const ui = (
    <div className={`ctl-overlay${shake ? " ctl-overlay--shake" : ""}`}>
      <div className="ctl-root" role="application" aria-label="Catch the Love — permainan mini">
        <div className="ctl-bg-burst" aria-hidden />
        <div className="ctl-bg-halftone" aria-hidden />

        <header className="ctl-hud">
          <div className="ctl-hud__title-block">
            <h1 className="ctl-hud__title">Catch the Love!</h1>
            <p className="ctl-hud__hint">Tap hati dan cincin sebelum jatuh!</p>
          </div>
          <div className="ctl-hud__stats" aria-live="polite">
            <div className="ctl-hud__pill">
              <span className="ctl-hud__pill-icon" aria-hidden>
                ⏱
              </span>
              <span className="ctl-hud__pill-val">{timeLeft}s</span>
            </div>
            <div className="ctl-hud__pill ctl-hud__pill--score">
              <span className="ctl-hud__pill-icon" aria-hidden>
                ❤️
              </span>
              <span className="ctl-hud__pill-label">Score:</span>
              <span className="ctl-hud__pill-val">{score}</span>
            </div>
          </div>
          {combo >= 2 ? (
            <p className="ctl-hud__combo" role="status">
              COMBO ×{combo}
            </p>
          ) : null}
        </header>

        <div className="ctl-field-outer">
          <div id="ctl-play-field" ref={fieldRef} className="ctl-field">
            {effects.map((fx) => (
              <span
                key={fx.id}
                className={`ctl-float${fx.tone === "bad" ? " ctl-float--bad" : ""}`}
                style={{ left: `${fx.leftPct}%`, top: `${fx.topPct}%` }}
              >
                {fx.label}
              </span>
            ))}
            {items.map((item) => (
              <div
                key={item.id}
                className="ctl-item-track"
                style={
                  {
                    left: `${item.x}%`,
                    ["--ctl-fall-ms" as string]: `${item.speed}ms`,
                  } as CSSProperties
                }
                onAnimationEnd={(e) => onItemAnimEnd(e, item.id)}
              >
                <button
                  type="button"
                  className={`ctl-item ctl-item--${item.type}`}
                  aria-label={
                    item.type === "bomb"
                      ? "Elak bom"
                      : `Tangkap ${item.type === "heart" ? "hati" : item.type === "ring" ? "cincin" : "bintang"}`
                  }
                  onPointerDown={(ev) => {
                    if (ev.button !== 0) return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    handleCatch(item, ev.clientX, ev.clientY);
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key !== "Enter" && ev.key !== " ") return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    const r = ev.currentTarget.getBoundingClientRect();
                    handleCatch(item, r.left + r.width / 2, r.top + r.height / 2);
                  }}
                >
                  <span className="ctl-item__emoji" aria-hidden>
                    {ITEM_EMOJI[item.type]}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
