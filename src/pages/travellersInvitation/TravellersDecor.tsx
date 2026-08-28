import type { CSSProperties } from "react";

type TravellersDecorProps = {
  dense?: boolean;
};

type ScatterKind = "plane" | "backpack" | "passport" | "stamp" | "pin" | "cloud" | "suitcase" | "compass";

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
  { kind: "passport", top: "14%", left: "3%", size: "2.15rem", rotate: -12, anim: "float", delay: 0.45 },
  { kind: "backpack", bottom: "14%", left: "4%", size: "2.35rem", rotate: 8, anim: "bob", delay: 0.8 },
  { kind: "stamp", top: "38%", right: "3%", size: "1.75rem", rotate: 14, anim: "pulse", delay: 0.3 },
  { kind: "pin", bottom: "20%", right: "7%", size: "1.3rem", rotate: -6, anim: "pulse", delay: 1 },
  { kind: "stamp", bottom: "7%", left: "24%", size: "1.4rem", rotate: -18, anim: "float", delay: 0.65 },
  { kind: "cloud", top: "6%", left: "18%", size: "2.8rem", rotate: 0, anim: "drift", delay: 0.1 },
  { kind: "cloud", top: "22%", right: "12%", size: "2.2rem", rotate: 0, anim: "drift", delay: 1.4 },
  { kind: "suitcase", bottom: "28%", left: "8%", size: "1.7rem", rotate: -8, anim: "float", delay: 1.1 },
  { kind: "compass", top: "52%", left: "5%", size: "1.55rem", rotate: 12, anim: "pulse", delay: 0.9 },
  { kind: "cloud", bottom: "12%", right: "18%", size: "2.4rem", rotate: 0, anim: "drift", delay: 0.55 },
];

const DETAILS_SCATTER: ScatterItem[] = [
  { kind: "cloud", top: "4%", left: "8%", size: "2rem", rotate: 0, anim: "drift", delay: 0.2 },
  { kind: "passport", top: "24%", left: "2%", size: "1.45rem", rotate: -8, anim: "float", delay: 0.5 },
  { kind: "backpack", bottom: "16%", right: "3%", size: "1.55rem", rotate: 10, anim: "bob", delay: 0.75 },
  { kind: "stamp", bottom: "6%", left: "5%", size: "1.15rem", rotate: 16, anim: "pulse", delay: 0.35 },
  { kind: "pin", top: "56%", right: "5%", size: "1.05rem", rotate: -4, anim: "pulse", delay: 0.95 },
  { kind: "compass", top: "40%", left: "4%", size: "1.25rem", rotate: 8, anim: "float", delay: 1.15 },
  { kind: "suitcase", bottom: "32%", right: "6%", size: "1.35rem", rotate: -10, anim: "float", delay: 0.6 },
];

const FLIGHT_PATH =
  "M-40 520 C60 440, 40 340, 120 280 S240 180, 300 110 S380 40, 420 -20";

function PlaneIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path
        fill="currentColor"
        d="M44.2 22.4 30.6 17.8 18.4 6.4c-.6-.6-1.6-.4-1.9.4L14.2 14 6.8 16.4c-1 .3-1.4 1.5-.8 2.3l4.6 5.4-4.6 5.4c-.6.8-.2 2 .8 2.3L14.2 34l2.3 7.2c.3.8 1.3 1 1.9.4l12.2-11.4 13.6-4.6c1.2-.4 1.2-2.2 0-2.6Z"
      />
    </svg>
  );
}

function BackpackIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 18V14a8 8 0 0 1 16 0v4"
      />
      <rect x="12" y="18" width="24" height="24" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M18 28h12M20 34h8" />
    </svg>
  );
}

function PassportIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <rect x="10" y="6" width="28" height="36" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="24" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M16 32h16M18 37h12" />
    </svg>
  );
}

function StampIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="24" cy="24" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        fill="currentColor"
        d="M24 16.5c2.4 0 4.4 1.8 4.4 4.2 0 3.4-4.4 7.3-4.4 7.3s-4.4-3.9-4.4-7.3c0-2.4 2-4.2 4.4-4.2Z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path
        fill="currentColor"
        d="M24 6c-7.2 0-13 5.6-13 12.6C11 28.4 24 42 24 42s13-13.6 13-23.4C37 11.6 31.2 6 24 6Zm0 17.2a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6Z"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 64 40" aria-hidden>
      <path
        fill="currentColor"
        d="M50 28H16c-5.5 0-10-3.8-10-8.5S10.5 11 16 11c.8-4.8 5-8.5 10.2-8.5 3.8 0 7.1 1.9 9 4.8C37.2 5.2 40 4 43 4c6.1 0 11 4.5 11 10 0 .5 0 1-.1 1.5 3.5.9 6.1 3.8 6.1 7.3 0 4.1-3.6 7.2-9.9 7.2Z"
        opacity="0.55"
      />
    </svg>
  );
}

function SuitcaseIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M18 14V10h12v4" />
      <rect x="8" y="14" width="32" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path fill="none" stroke="currentColor" strokeWidth="2" d="M24 14v26M8 24h32" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
      <path fill="currentColor" d="M24 12l3.2 9.4L24 24l-3.2-2.6L24 12Zm0 24-3.2-9.4L24 24l3.2 2.6L24 36Z" />
    </svg>
  );
}

function ScatterIcon({ kind }: { kind: ScatterKind }) {
  switch (kind) {
    case "plane":
      return <PlaneIcon />;
    case "backpack":
      return <BackpackIcon />;
    case "passport":
      return <PassportIcon />;
    case "stamp":
      return <StampIcon />;
    case "pin":
      return <PinIcon />;
    case "cloud":
      return <CloudIcon />;
    case "suitcase":
      return <SuitcaseIcon />;
    case "compass":
      return <CompassIcon />;
  }
}

function ScatterMark({ item }: { item: ScatterItem }) {
  const style: CSSProperties = {
    top: item.top,
    bottom: item.bottom,
    left: item.left,
    right: item.right,
    width: item.size,
    height: item.size,
    animationDelay: `${item.delay}s`,
  };

  return (
    <span
      className={`travellers-scatter travellers-scatter--${item.kind} travellers-scatter--${item.anim}`}
      style={style}
    >
      <span className="travellers-scatter__inner" style={{ transform: `rotate(${item.rotate}deg)` }}>
        <ScatterIcon kind={item.kind} />
      </span>
    </span>
  );
}

/** Plane that loops along the dashed flight path (CSS offset-path — smoother than SMIL). */
function FlyingPlane({ exit = false }: { exit?: boolean }) {
  return (
    <div className={`travellers-flyer${exit ? " travellers-flyer--exit" : ""}`} aria-hidden>
      <span className="travellers-flyer__plane">
        <PlaneIcon />
      </span>
    </div>
  );
}

export function TravellersDecor({
  dense = false,
  planeExit = false,
}: TravellersDecorProps & { planeExit?: boolean }) {
  const items = dense ? DETAILS_SCATTER : COVER_SCATTER;
  return (
    <div className={`travellers-scatter-field${dense ? " travellers-scatter-field--dense" : ""}`} aria-hidden>
      {!dense ? (
        <>
          <svg className="travellers-flight-path" viewBox="0 0 380 560" preserveAspectRatio="none">
            <path
              className="travellers-flight-path__dash"
              d={FLIGHT_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />
          </svg>
          <FlyingPlane exit={planeExit} />
        </>
      ) : (
        <div className="travellers-flyer travellers-flyer--mini" aria-hidden>
          <span className="travellers-flyer__mini-plane">
            <PlaneIcon />
          </span>
        </div>
      )}
      {items.map((item, i) => (
        <ScatterMark key={`${item.kind}-${i}`} item={item} />
      ))}
    </div>
  );
}

export function TravellersTicketFrame() {
  return (
    <svg className="travellers-ticket-frame" viewBox="0 0 300 420" preserveAspectRatio="none" aria-hidden>
      <rect
        x="8"
        y="8"
        width="284"
        height="404"
        rx="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="5 6"
      />
      <path
        className="travellers-ticket-frame__perforation"
        d="M8 118 H292"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      <circle cx="8" cy="118" r="10" fill="var(--travellers-sky, #d9e8f2)" />
      <circle cx="292" cy="118" r="10" fill="var(--travellers-sky, #d9e8f2)" />
    </svg>
  );
}

/**
 * Jagged edge along the boarding-pass perforation (horizontal tear).
 * `top` = jagged edge on the bottom of the stub; `bottom` = jagged edge on the top of the main piece.
 */
export function TravellersTearEdge({ side }: { side: "top" | "bottom" }) {
  return (
    <svg
      className={`travellers-tear-edge travellers-tear-edge--${side}`}
      viewBox="0 0 300 20"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 10 L12 2 L28 16 L46 3 L64 17 L82 4 L100 15 L118 2 L136 16 L154 5 L172 17 L190 3 L208 14 L226 2 L244 16 L262 4 L280 15 L300 8 L300 20 L0 20 Z"
      />
    </svg>
  );
}
