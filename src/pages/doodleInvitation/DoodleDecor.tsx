import type { CSSProperties, ReactNode } from "react";
import { publicUrl } from "../../lib/publicAsset";

const BRIDE_SRC = publicUrl("doodle/bride-trim.png");
const GROOM_SRC = publicUrl("doodle/groom-trim.png");
const RING_SRC = publicUrl("doodle/ring-trim.png");
const CAKE_SRC = publicUrl("doodle/cake-trim.png");
const GOWN_SRC = publicUrl("doodle/gown-trim.png");
const PORTRAIT_SRC = publicUrl("doodle/potrait-trim.png");

type DoodleDecorProps = {
  /** More doodles on details page */
  dense?: boolean;
};

const FRAME_PATH =
  "M18 28c8-10 28-14 52-12 70 4 120-8 212 8 8 2 14 12 12 28-6 88-4 180 6 292 2 18-8 32-26 36-80 14-140 6-220-2-16-2-28-16-26-34 6-92 4-188-10-280-2-12 4-24 16-36z";

function stroke(extra?: Record<string, string | number>) {
  return {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...extra,
  };
}

type DoodleKind = "heart" | "star" | "ring" | "flower" | "spark" | "butterfly";

const DOODLE_SVGS: Record<DoodleKind, ReactNode> = {
  heart: (
    <path
      d="M12 20C5 14 2 10 2 6c0-3 2-5 5-5 2 0 4 1 5 3 1-2 3-3 5-3 3 0 5 2 5 5 0 4-3 8-10 14z"
      {...stroke()}
    />
  ),
  star: <path d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.8L12 16l-5.6 3.6 2.1-6.8L3 8.8h6.8z" {...stroke()} />,
  ring: (
    <>
      <circle cx="9" cy="12" r="6.5" {...stroke()} />
      <circle cx="15" cy="12" r="6.5" {...stroke()} />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2" {...stroke({ strokeWidth: 1.6 })} />
      <circle cx="12" cy="6" r="3" {...stroke({ strokeWidth: 1.6 })} />
      <circle cx="12" cy="18" r="3" {...stroke({ strokeWidth: 1.6 })} />
      <circle cx="6" cy="12" r="3" {...stroke({ strokeWidth: 1.6 })} />
      <circle cx="18" cy="12" r="3" {...stroke({ strokeWidth: 1.6 })} />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v18M3 12h18" {...stroke({ strokeWidth: 1.6 })} />
      <path d="M6 6l12 12M18 6L6 18" {...stroke({ strokeWidth: 1.3 })} />
    </>
  ),
  butterfly: (
    <>
      <path d="M12 6v12" {...stroke({ strokeWidth: 1.5 })} />
      <path d="M12 7 C9 4 5 4 5 8 C5 10.5 8.5 11.5 12 9.5" {...stroke({ strokeWidth: 1.4 })} />
      <path d="M12 7 C15 4 19 4 19 8 C19 10.5 15.5 11.5 12 9.5" {...stroke({ strokeWidth: 1.4 })} />
      <path d="M12 10 C9 12 5.5 14 5 17 C4.5 19 8 18.5 12 16" {...stroke({ strokeWidth: 1.4 })} />
      <path d="M12 10 C15 12 18.5 14 19 17 C19.5 19 16 18.5 12 16" {...stroke({ strokeWidth: 1.4 })} />
      <path d="M10.5 6.5c0 .8.7 1.4 1.5 1.4" {...stroke({ strokeWidth: 1.2 })} />
    </>
  ),
};

type ScatterItem = {
  kind: DoodleKind;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  rotate: number;
  color: "accent" | "sage" | "mustard" | "ink";
  anim: "float" | "wiggle" | "pulse" | "fly";
  delay: number;
  flyY?: string;
};

const COVER_SCATTER: ScatterItem[] = [
  { kind: "heart", top: "2%", left: "4%", size: "1.35rem", rotate: -12, color: "accent", anim: "pulse", delay: 0 },
  { kind: "star", top: "6%", right: "5%", size: "0.85rem", rotate: 18, color: "mustard", anim: "wiggle", delay: 0.45 },
  { kind: "spark", top: "14%", left: "22%", size: "0.75rem", rotate: 8, color: "mustard", anim: "pulse", delay: 0.25 },
  { kind: "flower", top: "52%", left: "4%", size: "1.2rem", rotate: -14, color: "sage", anim: "wiggle", delay: 1.1 },
  { kind: "heart", top: "44%", right: "5%", size: "0.9rem", rotate: 10, color: "accent", anim: "float", delay: 0.65 },
  { kind: "star", bottom: "18%", left: "6%", size: "1.05rem", rotate: -8, color: "mustard", anim: "wiggle", delay: 1.3 },
  { kind: "spark", bottom: "14%", right: "18%", size: "0.8rem", rotate: 14, color: "sage", anim: "pulse", delay: 0.5 },
  { kind: "flower", bottom: "4%", left: "18%", size: "1.15rem", rotate: 6, color: "accent", anim: "float", delay: 0.9 },
];

type AssetScatterItem = {
  src: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  rotate: number;
  anim: "float" | "wiggle" | "pulse";
  delay: number;
  centerX?: boolean;
};

const COVER_ASSETS: AssetScatterItem[] = [
  { src: PORTRAIT_SRC, top: "1%", size: "clamp(5.8rem, 26vw, 8.4rem)", rotate: -3, anim: "float", delay: 0.1, centerX: true },
  { src: GOWN_SRC, bottom: "0.5%", size: "clamp(6.8rem, 30vw, 9.6rem)", rotate: 4, anim: "float", delay: 0.35, centerX: true },
  { src: CAKE_SRC, top: "16%", left: "0%", size: "clamp(5rem, 22vw, 7rem)", rotate: -8, anim: "wiggle", delay: 0.55 },
  { src: GROOM_SRC, bottom: "22%", left: "1%", size: "clamp(4rem, 18vw, 5.6rem)", rotate: -6, anim: "float", delay: 0.2 },
  { src: BRIDE_SRC, top: "32%", right: "0%", size: "clamp(3.2rem, 14vw, 4.8rem)", rotate: 10, anim: "float", delay: 0.5 },
  { src: RING_SRC, top: "10%", right: "14%", size: "clamp(2.2rem, 10vw, 3rem)", rotate: 14, anim: "pulse", delay: 0.75 },
  { src: RING_SRC, bottom: "26%", right: "1%", size: "clamp(1.55rem, 7vw, 2.2rem)", rotate: -18, anim: "wiggle", delay: 1.05 },
  { src: CAKE_SRC, bottom: "8%", right: "16%", size: "clamp(2.4rem, 11vw, 3.4rem)", rotate: 7, anim: "pulse", delay: 0.85 },
];

const DETAILS_SCATTER: ScatterItem[] = [
  { kind: "heart", top: "6%", left: "4%", size: "0.8rem", rotate: -10, color: "accent", anim: "pulse", delay: 0.2 },
  { kind: "star", top: "10%", right: "5%", size: "0.75rem", rotate: 14, color: "mustard", anim: "wiggle", delay: 0.5 },
  { kind: "spark", top: "72%", left: "3%", size: "0.7rem", rotate: 6, color: "sage", anim: "pulse", delay: 0.8 },
  { kind: "flower", bottom: "8%", right: "4%", size: "0.85rem", rotate: -12, color: "accent", anim: "float", delay: 1 },
  { kind: "heart", bottom: "18%", left: "5%", size: "0.75rem", rotate: 8, color: "mustard", anim: "wiggle", delay: 0.35 },
  { kind: "butterfly", top: "18%", left: "0", size: "1rem", rotate: 0, color: "sage", anim: "fly", delay: 0, flyY: "18%" },
  { kind: "butterfly", top: "52%", left: "0", size: "0.8rem", rotate: 0, color: "accent", anim: "fly", delay: 7, flyY: "52%" },
];

function DoodleIcon({ kind }: { kind: DoodleKind }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      {DOODLE_SVGS[kind]}
    </svg>
  );
}

function ScatterAsset({ item }: { item: AssetScatterItem }) {
  const style: CSSProperties = {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: item.size,
    animationDelay: `${item.delay}s`,
  };

  return (
    <span
      className={[
        "doodle-scatter",
        "doodle-scatter--asset",
        `doodle-scatter--${item.anim}`,
        item.centerX ? "doodle-scatter--mid" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="doodle-scatter__inner" style={{ transform: `rotate(${item.rotate}deg)` }}>
        <img src={item.src} alt="" draggable={false} />
      </span>
    </span>
  );
}

function ScatterDoodle({ item }: { item: ScatterItem }) {
  const style: CSSProperties = {
    top: item.anim === "fly" ? item.flyY ?? item.top : item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: item.size,
    height: item.size,
    animationDelay: `${item.delay}s`,
  };

  return (
    <span
      className={[
        "doodle-scatter",
        `doodle-scatter--${item.color}`,
        `doodle-scatter--${item.anim}`,
        item.kind === "butterfly" ? "doodle-scatter--butterfly" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="doodle-scatter__inner" style={{ transform: `rotate(${item.rotate}deg)` }}>
        <DoodleIcon kind={item.kind} />
      </span>
    </span>
  );
}

export function DoodleDecor({ dense = false }: DoodleDecorProps) {
  const doodles = dense ? DETAILS_SCATTER : COVER_SCATTER;
  const assets = dense ? [] : COVER_ASSETS;

  return (
    <div className={`doodle-scatter-field${dense ? " doodle-scatter-field--dense" : ""}`} aria-hidden>
      {assets.map((item, i) => (
        <ScatterAsset key={`asset-${i}`} item={item} />
      ))}
      {doodles.map((item, i) => (
        <ScatterDoodle key={`${item.kind}-${i}`} item={item} />
      ))}
    </div>
  );
}

export function DoodleFrame() {
  return (
    <svg className="doodle-frame" viewBox="0 0 300 420" preserveAspectRatio="none" aria-hidden>
      <path className="doodle-frame__stroke" d={FRAME_PATH} {...stroke({ strokeWidth: 2.2, pathLength: 1 })} />
    </svg>
  );
}

export function DoodlePen({ durationS, delayS }: { durationS: number; delayS: number }) {
  return (
    <svg
      className="doodle-pen"
      viewBox="-6 -10 12 22"
      aria-hidden
      style={{ animationDuration: `${durationS}s`, animationDelay: `${delayS}s` }}
    >
      <path d="M0 0 l3.2 8.6 L0 7.2 -3.2 8.6 Z" fill="currentColor" />
      <path d="M0 0 v-7.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-1.6 -6.2 h3.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
