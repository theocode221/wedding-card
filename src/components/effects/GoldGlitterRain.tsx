import { type CSSProperties } from "react";
import "../../styles/gold-glitter.css";

type GoldGlitterRainProps = {
  /** "global" = fixed overlay on all pages (App). "cinematic" deprecated — use global from App. */
  variant?: "home" | "cinematic" | "global";
  className?: string;
};

const FLAKE_COUNT = 120;

const FLAKES = Array.from({ length: FLAKE_COUNT }, (_, i) => {
  const left = ((i * 67) % 99) + 0.5 + (i % 6) * 0.06;
  const delay = ((i * 0.11) % 9) * 1;
  const dur = 3.8 + (i % 10) * 0.46;
  const drift = (i % 21) - 10;
  const size = 2 + (i % 5);
  const fine = i % 2 === 0;
  const spark = i % 3 === 0;
  return { id: i, left, delay, dur, drift, size, fine, spark };
});

export function GoldGlitterRain({ variant = "home", className = "" }: GoldGlitterRainProps) {
  return (
    <div
      className={[
        "gold-glitter",
        variant === "cinematic" ? "gold-glitter--cinematic" : "",
        variant === "global" ? "gold-glitter--global" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      {FLAKES.map((f) => {
        const w = f.fine ? Math.max(1, f.size - 1) : f.size;
        return (
          <span
            key={f.id}
            className={[
              "gold-glitter__flake",
              f.fine ? "gold-glitter__flake--fine" : "",
              f.spark ? "gold-glitter__flake--spark" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={
              {
                left: `${f.left}%`,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.dur}s`,
                "--gg-drift": `${f.drift}px`,
                width: `${w}px`,
                height: `${w}px`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
