import type { CSSProperties } from "react";
import { getCartoonNewlywedEggInnerSrc } from "./eggRevealConstants";

export type EggCrackStage = "idle" | "step1" | "step2" | "step3";

type CrackableEggProps = {
  stage: EggCrackStage;
  visible: boolean;
  onActivate: () => void;
};

const SHARDS: { tx: number; ty: number; rot: number; delay: number }[] = [
  { tx: -100, ty: -85, rot: -38, delay: 0.02 },
  { tx: 110, ty: -70, rot: 22, delay: 0.04 },
  { tx: -40, ty: -120, rot: 8, delay: 0.01 },
  { tx: 95, ty: 40, rot: 55, delay: 0.05 },
  { tx: -115, ty: 35, rot: -52, delay: 0.03 },
  { tx: 30, ty: 105, rot: 18, delay: 0.06 },
  { tx: -70, ty: 95, rot: -25, delay: 0.02 },
  { tx: 75, ty: -100, rot: 40, delay: 0.05 },
];

export function CrackableEgg({ stage, visible, onActivate }: CrackableEggProps) {
  if (!visible) return null;

  const isIdle = stage === "idle";
  const showBurst = stage === "step3";
  const canTap = stage !== "step3";
  const innerPreviewSrc = getCartoonNewlywedEggInnerSrc();

  return (
    <div
      className={`egg-reveal-egg-wrap ${isIdle ? "egg-reveal-egg-wrap--float" : ""}`}
      data-stage={stage}
    >
      <button
        type="button"
        className="egg-reveal-egg-hit"
        onClick={onActivate}
        disabled={!canTap}
        aria-label={
          stage === "idle"
            ? "Pecahkan telur — tap pertama"
            : stage === "step1"
              ? "Tap lagi untuk retakkan"
              : stage === "step2"
                ? "Tap sekali lagi untuk pecahkan"
                : "Telur sedang pecah"
        }
      >
        <span className="egg-reveal-egg-hit__ring" aria-hidden />
        <div className={`egg-reveal-egg ${showBurst ? "egg-reveal-egg--burst" : ""}`}>
          {!showBurst ? (
            <div className="egg-reveal-egg__mono">
              <div className="egg-reveal-egg__core-clip" aria-hidden>
                <div className="egg-reveal-egg__glow" />
                <div className="egg-reveal-egg__hatch">
                  <img
                    className="egg-reveal-egg__hatch-img"
                    src={innerPreviewSrc}
                    alt=""
                    width={200}
                    height={200}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="egg-reveal-egg__body" />
              <svg
                className={`egg-reveal-egg__cracks egg-reveal-egg__cracks--a ${stage !== "idle" ? "egg-reveal-egg__cracks--show" : ""}`}
                viewBox="0 0 100 140"
                aria-hidden
              >
                <path
                  className="egg-reveal-egg__crack-path"
                  d="M50 18 L48 38 L52 58 L46 78 L54 98"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  className="egg-reveal-egg__crack-path egg-reveal-egg__crack-path--b"
                  d="M50 22 L58 44 L52 66 L60 88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                className={`egg-reveal-egg__cracks egg-reveal-egg__cracks--b ${stage === "step2" ? "egg-reveal-egg__cracks--spread" : ""}`}
                viewBox="0 0 100 140"
                aria-hidden
              >
                <path
                  className="egg-reveal-egg__crack-path"
                  d="M32 50 L50 62 L68 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <path
                  className="egg-reveal-egg__crack-path"
                  d="M28 88 L50 76 L72 92"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : (
            <div className="egg-reveal-egg__burst">
              <div className="egg-reveal-egg__burst-light" aria-hidden />
              <img
                className="egg-reveal-egg__born-img"
                src={innerPreviewSrc}
                alt=""
                width={200}
                height={200}
                decoding="async"
                draggable={false}
              />
              <div className="egg-reveal-egg__sparkles" aria-hidden>
                {Array.from({ length: 14 }, (_, i) => (
                  <span key={i} className={`egg-reveal-egg__spark egg-reveal-egg__spark--${i % 7}`} />
                ))}
              </div>
              <div className="egg-reveal-egg__shell egg-reveal-egg__shell--top" />
              <div className="egg-reveal-egg__shell egg-reveal-egg__shell--bottom" />
              {SHARDS.map((s, i) => (
                <span
                  key={i}
                  className="egg-reveal-egg__shard"
                  style={
                    {
                      "--egg-shard-deg": `${s.rot}deg`,
                      "--egg-shard-tx": `${s.tx}px`,
                      "--egg-shard-ty": `${s.ty}px`,
                      animationDelay: `${s.delay}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
