import type { CSSProperties } from "react";

const ORB_COUNT = 24;

function slotStyle(i: number): CSSProperties {
  const left = (i * 29.3 + (i % 7) * 5.2) % 100;
  const topStart = 96 + (i % 6) * 2.5;
  return {
    left: `${left}%`,
    top: `${topStart}%`,
  };
}

function orbStyle(i: number): CSSProperties {
  const size = 40 + (i % 9) * 20;
  const blur = 10 + (i % 7) * 3;
  const delay = -((i * 2.53) % 62);
  const duration = 52 + (i % 11) * 3.4;
  const tx = `${((i % 15) - 7) * 10}px`;
  const ty = `${((i % 11) - 5) * 6}px`;
  const op1 = 0.08 + (i % 5) * 0.028;
  const op2 = 0.18 + (i % 6) * 0.038;
  const s1 = 0.9 + (i % 4) * 0.05;
  const s2 = 1.06 + (i % 5) * 0.05;
  return {
    width: `${size}px`,
    height: `${size}px`,
    marginLeft: `-${size / 2}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    filter: `blur(${blur}px)`,
    ["--wif-mg-bokeh-tx" as string]: tx,
    ["--wif-mg-bokeh-ty" as string]: ty,
    ["--wif-mg-bokeh-s1" as string]: String(s1),
    ["--wif-mg-bokeh-s2" as string]: String(s2),
    ["--wif-mg-bokeh-op1" as string]: String(op1),
    ["--wif-mg-bokeh-op2" as string]: String(op2),
  };
}

/** Soft gold bokeh drifting upward — cinematic mid-layer (pointer-events none). */
export function MaroonBokehDrift() {
  return (
    <div className="wif-mg-bokeh" aria-hidden>
      {Array.from({ length: ORB_COUNT }, (_, i) => (
        <div key={i} className="wif-mg-bokeh__slot" style={slotStyle(i)}>
          <span className="wif-mg-bokeh__orb" style={orbStyle(i)} />
        </div>
      ))}
    </div>
  );
}
