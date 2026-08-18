const TONES = {
  gold: { wing: "#e8d5a0", wingDark: "#c4a45d", spot: "#fff6dc", body: "#3d151c" },
  rose: { wing: "#e8b4c4", wingDark: "#b85a6a", spot: "#fde8ee", body: "#4a1820" },
  lilac: { wing: "#c9b8e4", wingDark: "#8b6fb0", spot: "#f3ecfb", body: "#3a2748" },
  cream: { wing: "#f4ead6", wingDark: "#d2b48a", spot: "#fffdf8", body: "#5c3d2e" },
} as const;

type Tone = keyof typeof TONES;
type PathId = 1 | 2 | 3 | 4 | 5 | 6;

type ButterflySpec = {
  id: string;
  tone: Tone;
  path: PathId;
  size: string;
  dur: string;
  /** Negative delay starts them already scattered along the loop */
  delay: string;
};

const TOP: ButterflySpec[] = [
  { id: "t1", tone: "gold", path: 1, size: "0.78rem", dur: "18s", delay: "-2s" },
  { id: "t2", tone: "rose", path: 2, size: "0.62rem", dur: "14s", delay: "-7s" },
  { id: "t3", tone: "lilac", path: 3, size: "0.7rem", dur: "21s", delay: "-11s" },
  { id: "t4", tone: "cream", path: 4, size: "0.56rem", dur: "16s", delay: "-4s" },
  { id: "t5", tone: "gold", path: 5, size: "0.66rem", dur: "19s", delay: "-13s" },
  { id: "t6", tone: "rose", path: 6, size: "0.58rem", dur: "13s", delay: "-1s" },
];

const BOTTOM: ButterflySpec[] = [
  { id: "b1", tone: "lilac", path: 4, size: "0.76rem", dur: "17s", delay: "-5s" },
  { id: "b2", tone: "cream", path: 1, size: "0.6rem", dur: "15s", delay: "-9s" },
  { id: "b3", tone: "gold", path: 6, size: "0.68rem", dur: "20s", delay: "-3s" },
  { id: "b4", tone: "rose", path: 3, size: "0.54rem", dur: "12s", delay: "-8s" },
  { id: "b5", tone: "lilac", path: 2, size: "0.64rem", dur: "18s", delay: "-14s" },
  { id: "b6", tone: "cream", path: 5, size: "0.58rem", dur: "14s", delay: "-6s" },
];

const TOP_SPARSE = TOP.filter((_, i) => i % 3 === 0);
const BOTTOM_SPARSE = BOTTOM.filter((_, i) => i % 3 === 0);

function ButterflySvg({ tone }: { tone: Tone }) {
  const c = TONES[tone];
  return (
    <svg className="laila-bf-svg" viewBox="0 0 80 70" aria-hidden>
      <ellipse className="laila-bf-wing laila-bf-wing--l" cx="22" cy="26" rx="21" ry="17" fill={c.wing} stroke={c.wingDark} strokeWidth="1.2" />
      <ellipse className="laila-bf-wing laila-bf-wing--l" cx="26" cy="46" rx="13" ry="11" fill={c.wingDark} opacity="0.92" />
      <circle cx="16" cy="22" r="4.5" fill={c.spot} opacity="0.55" />
      <ellipse className="laila-bf-wing laila-bf-wing--r" cx="58" cy="26" rx="21" ry="17" fill={c.wing} stroke={c.wingDark} strokeWidth="1.2" />
      <ellipse className="laila-bf-wing laila-bf-wing--r" cx="54" cy="46" rx="13" ry="11" fill={c.wingDark} opacity="0.92" />
      <circle cx="64" cy="22" r="4.5" fill={c.spot} opacity="0.55" />
      <ellipse cx="40" cy="36" rx="3.4" ry="17" fill={c.body} />
      <circle cx="40" cy="16" r="3.6" fill={c.body} />
      <path d="M38 14 Q28 3 22 7" stroke={c.body} strokeWidth="1.15" fill="none" strokeLinecap="round" />
      <path d="M42 14 Q52 3 58 7" stroke={c.body} strokeWidth="1.15" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Butterfly({ spec }: { spec: ButterflySpec }) {
  return (
    <div
      className={`laila-butterfly laila-butterfly--path${spec.path}`}
      style={{
        width: spec.size,
        animationDuration: spec.dur,
        animationDelay: spec.delay,
      }}
    >
      <ButterflySvg tone={spec.tone} />
    </div>
  );
}

export function LailaButterflies({ density = "full" }: { density?: "full" | "sparse" }) {
  const top = density === "sparse" ? TOP_SPARSE : TOP;
  const bottom = density === "sparse" ? BOTTOM_SPARSE : BOTTOM;
  return (
    <>
      <div className="laila-butterflies laila-butterflies--top" aria-hidden>
        {top.map((spec) => (
          <Butterfly key={spec.id} spec={spec} />
        ))}
      </div>
      <div className="laila-butterflies laila-butterflies--bottom" aria-hidden>
        {bottom.map((spec) => (
          <Butterfly key={spec.id} spec={spec} />
        ))}
      </div>
    </>
  );
}
