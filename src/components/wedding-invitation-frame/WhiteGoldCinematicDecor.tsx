import type { CSSProperties } from "react";
import { GoldGlitterRain } from "../effects/GoldGlitterRain";
import { MaroonBokehDrift } from "./MaroonBokehDrift";

const SPARK_COUNT = 18;

function sparkStyle(i: number): CSSProperties {
  const left = 8 + ((i * 17.3) % 84);
  const top = 10 + ((i * 23.7) % 72);
  const delay = -((i * 0.73) % 8);
  const duration = 3.6 + (i % 5) * 0.55;
  const size = 3 + (i % 4);
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
}

/** Soft gold atmosphere for white-gold cinematic welcome + sequence. */
export function WhiteGoldCinematicDecor() {
  return (
    <>
      <div className="wif-wg-ambient" aria-hidden>
        <span className="wif-wg-ambient__wash wif-wg-ambient__wash--a" />
        <span className="wif-wg-ambient__wash wif-wg-ambient__wash--b" />
        <span className="wif-wg-ambient__ring wif-wg-ambient__ring--outer" />
        <span className="wif-wg-ambient__ring wif-wg-ambient__ring--inner" />
        <span className="wif-wg-ambient__ray wif-wg-ambient__ray--l" />
        <span className="wif-wg-ambient__ray wif-wg-ambient__ray--r" />
        {Array.from({ length: SPARK_COUNT }, (_, i) => (
          <span key={i} className="wif-wg-ambient__spark" style={sparkStyle(i)} />
        ))}
      </div>
      <MaroonBokehDrift />
      <GoldGlitterRain variant="cinematic" className="wif-wg-glitter" />
    </>
  );
}
