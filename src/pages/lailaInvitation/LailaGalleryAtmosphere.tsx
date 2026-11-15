import type { CSSProperties } from "react";

const PETAL_TONES = ["#7a1f30", "#a8475a", "#c98a96", "#5c101c", "#e3c1c6"] as const;

type Petal = {
  left: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  spin: number;
  tone: string;
  opacity: number;
};

type Mote = {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
};

/** Deterministic pseudo-random so layout is stable between renders. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const PETALS: Petal[] = (() => {
  const rand = seeded(17);
  return Array.from({ length: 22 }, (_, i) => ({
    left: Math.round(rand() * 100),
    size: 0.5 + rand() * 0.55,
    dur: 13 + rand() * 11,
    delay: -rand() * 24,
    drift: (rand() - 0.5) * 18,
    spin: 280 + rand() * 420,
    tone: PETAL_TONES[i % PETAL_TONES.length],
    opacity: 0.55 + rand() * 0.35,
  }));
})();

const MOTES: Mote[] = (() => {
  const rand = seeded(53);
  return Array.from({ length: 26 }, () => ({
    left: Math.round(rand() * 100),
    top: Math.round(rand() * 100),
    size: 1.5 + rand() * 2.5,
    dur: 9 + rand() * 10,
    delay: -rand() * 19,
  }));
})();

export function LailaGalleryAtmosphere() {
  return (
    <>
      <div className="laila-gallery-atmos laila-gallery-atmos--back" aria-hidden>
        <div className="laila-gallery-atmos__glow" />
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="laila-gallery-mote"
            style={
              {
                left: `${m.left}%`,
                top: `${m.top}%`,
                width: `${m.size}px`,
                height: `${m.size}px`,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="laila-gallery-atmos laila-gallery-atmos--front" aria-hidden>
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="laila-gallery-petal"
            style={
              {
                left: `${p.left}%`,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                "--petal-drift": `${p.drift}vw`,
              } as CSSProperties
            }
          >
            <span
              className="laila-gallery-petal__leaf"
              style={
                {
                  width: `${p.size}rem`,
                  height: `${p.size * 1.25}rem`,
                  background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.35), transparent 55%), ${p.tone}`,
                  opacity: p.opacity,
                  animationDuration: `${(p.dur / 3.2).toFixed(2)}s`,
                  "--petal-spin": `${p.spin}deg`,
                } as CSSProperties
              }
            />
          </span>
        ))}
        <div className="laila-gallery-atmos__vignette" />
      </div>
    </>
  );
}
