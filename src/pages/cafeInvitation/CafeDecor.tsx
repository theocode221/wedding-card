import type { CSSProperties } from "react";

type CafeDecorProps = {
  dense?: boolean;
  steamBurst?: boolean;
};

type ScatterKind = "cup" | "bean" | "spoon" | "croissant" | "leaf" | "saucer";

type ScatterItem = {
  kind: ScatterKind;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  rotate: number;
  anim: "float" | "drift" | "pulse" | "bob";
  delay: number;
};

const COVER_SCATTER: ScatterItem[] = [
  { kind: "cup", top: "12%", left: "4%", size: "2.4rem", rotate: -8, anim: "float", delay: 0.2 },
  { kind: "bean", top: "28%", right: "5%", size: "1.2rem", rotate: 18, anim: "pulse", delay: 0.5 },
  { kind: "spoon", bottom: "18%", left: "6%", size: "2rem", rotate: -28, anim: "drift", delay: 0.7 },
  { kind: "croissant", bottom: "12%", right: "6%", size: "2.1rem", rotate: 12, anim: "bob", delay: 0.35 },
  { kind: "leaf", top: "48%", left: "3%", size: "1.35rem", rotate: -14, anim: "float", delay: 1 },
  { kind: "bean", bottom: "32%", right: "8%", size: "1rem", rotate: -22, anim: "pulse", delay: 0.9 },
  { kind: "saucer", top: "18%", right: "10%", size: "1.6rem", rotate: 6, anim: "drift", delay: 1.2 },
  { kind: "leaf", bottom: "8%", left: "22%", size: "1.2rem", rotate: 20, anim: "bob", delay: 0.55 },
];

const DETAILS_SCATTER: ScatterItem[] = [
  { kind: "bean", top: "8%", left: "6%", size: "1rem", rotate: 14, anim: "pulse", delay: 0.2 },
  { kind: "leaf", top: "22%", right: "4%", size: "1.15rem", rotate: -10, anim: "float", delay: 0.5 },
  { kind: "spoon", bottom: "18%", right: "5%", size: "1.5rem", rotate: 24, anim: "drift", delay: 0.7 },
  { kind: "croissant", bottom: "8%", left: "5%", size: "1.55rem", rotate: -8, anim: "bob", delay: 0.4 },
  { kind: "cup", top: "48%", left: "3%", size: "1.5rem", rotate: 6, anim: "float", delay: 0.95 },
];

function CupIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        d="M14 18h18v12c0 4.4-3.6 8-8 8h-2c-4.4 0-8-3.6-8-8V18Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M32 22h4a4 4 0 0 1 0 8h-4" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 40h22" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M20 8c0 3 2 4 2 7M26 7c0 3.5 2 4.5 2 8"
        opacity="0.7"
      />
    </svg>
  );
}

function BeanIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <ellipse cx="24" cy="24" rx="11" ry="16" fill="none" stroke="currentColor" strokeWidth="2.2" transform="rotate(-28 24 24)" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M18 16c4 6 4 12 0 18" />
    </svg>
  );
}

function SpoonIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <ellipse cx="16" cy="14" rx="7" ry="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M20 20 36 38" />
    </svg>
  );
}

function CroissantIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 30c2-10 10-16 18-18 2 6 4 12 2 20-8 2-16 2-20-2Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M16 28c4-2 8-6 10-12M20 32c5-1 9-4 12-9" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24 40C14 32 10 22 14 12c10 2 18 8 22 18-8 4-16 6-12 10Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M18 18c4 6 6 12 6 20" />
    </svg>
  );
}

function SaucerIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <ellipse cx="24" cy="28" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 28c2-4 8-6 12-6s10 2 12 6" />
    </svg>
  );
}

function iconFor(kind: ScatterKind) {
  switch (kind) {
    case "cup":
      return <CupIcon />;
    case "bean":
      return <BeanIcon />;
    case "spoon":
      return <SpoonIcon />;
    case "croissant":
      return <CroissantIcon />;
    case "leaf":
      return <LeafIcon />;
    case "saucer":
      return <SaucerIcon />;
  }
}

function Scatter({ item }: { item: ScatterItem }) {
  const style = {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: item.size,
    height: item.size,
    "--cafe-delay": `${item.delay}s`,
  } as CSSProperties;

  return (
    <div
      className={`cafe-scatter cafe-scatter--${item.kind} cafe-scatter--${item.anim}`}
      style={style}
      aria-hidden
    >
      <span className="cafe-scatter__inner" style={{ transform: `rotate(${item.rotate}deg)` }}>
        {iconFor(item.kind)}
      </span>
    </div>
  );
}

function SteamField({ burst }: { burst?: boolean }) {
  return (
    <div className={`cafe-steam${burst ? " cafe-steam--burst" : ""}`} aria-hidden>
      <span className="cafe-steam__wisp cafe-steam__wisp--a" />
      <span className="cafe-steam__wisp cafe-steam__wisp--b" />
      <span className="cafe-steam__wisp cafe-steam__wisp--c" />
    </div>
  );
}

export function CafeDecor({ dense = false, steamBurst = false }: CafeDecorProps) {
  const items = dense ? DETAILS_SCATTER : COVER_SCATTER;
  return (
    <div className={`cafe-scatter-field${dense ? " cafe-scatter-field--dense" : ""}`} aria-hidden>
      {!dense ? <SteamField burst={steamBurst} /> : null}
      {items.map((item, i) => (
        <Scatter key={`${item.kind}-${i}`} item={item} />
      ))}
    </div>
  );
}
