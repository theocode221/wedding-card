import { BLESSING_SEGMENTS, DEG_PER_SEGMENT, WHEEL_OFFSET_DEG } from "../../data/blessings";

const CX = 0;
const CY = 0;
const R_OUT = 100;
const R_IN = 22;

function polar(r: number, angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function sectorPath(startDeg: number, endDeg: number): string {
  const p0 = polar(R_IN, startDeg);
  const p1 = polar(R_OUT, startDeg);
  const p2 = polar(R_OUT, endDeg);
  const p3 = polar(R_IN, endDeg);
  const large = 0;
  return [
    `M ${p0.x} ${p0.y}`,
    `L ${p1.x} ${p1.y}`,
    `A ${R_OUT} ${R_OUT} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${R_IN} ${R_IN} 0 ${large} 0 ${p0.x} ${p0.y}`,
    "Z",
  ].join(" ");
}

export type BlessingWheelProps = {
  rotation: number;
  isSpinning: boolean;
  selectedIndex: number | null;
  pickedIndices: readonly number[];
  showIdleShimmer: boolean;
  pointerBounce: boolean;
  onSpinTransitionEnd: () => void;
};

export function BlessingWheel({
  rotation,
  isSpinning,
  selectedIndex,
  pickedIndices,
  showIdleShimmer,
  pointerBounce,
  onSpinTransitionEnd,
}: BlessingWheelProps) {
  const totalRotate = rotation + WHEEL_OFFSET_DEG;

  return (
    <div className="blessing-wheel">
      <div
        className={["blessing-wheel__pointer", pointerBounce ? "blessing-wheel__pointer--bounce" : ""].filter(Boolean).join(" ")}
        aria-hidden
      />

      <div
        className={["blessing-wheel__stage", showIdleShimmer && !isSpinning ? "blessing-wheel__stage--shimmer" : ""].filter(Boolean).join(" ")}
      >
        <div
          className="blessing-wheel__spin"
          style={{
            transform: `translate3d(0, 0, 0) rotate(${totalRotate}deg)`,
            transition: isSpinning ? "transform 4.2s cubic-bezier(0.12, 0.72, 0.12, 1)" : "none",
          }}
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.propertyName !== "transform") return;
            onSpinTransitionEnd();
          }}
        >
          <svg className="blessing-wheel__svg" viewBox="-108 -108 216 216" aria-hidden>
            <defs>
              {BLESSING_SEGMENTS.map((s) => (
                <linearGradient key={s.id} id={`bw-grad-${s.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={s.fillMid} />
                  <stop offset="55%" stopColor={s.fill} />
                  <stop offset="100%" stopColor={s.fill} stopOpacity={0.92} />
                </linearGradient>
              ))}
              <filter id="bw-inner-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="bw-hub-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#faf6f0" />
                <stop offset="100%" stopColor="#e8dcc8" />
              </linearGradient>
            </defs>

            <circle cx={CX} cy={CY} r={R_OUT + 4} className="blessing-wheel__rim" />

            {BLESSING_SEGMENTS.map((s, i) => {
              const start = i * DEG_PER_SEGMENT;
              const end = (i + 1) * DEG_PER_SEGMENT;
              const mid = start + DEG_PER_SEGMENT / 2;
              const labelPos = polar(68, mid);
              return (
                <g key={s.id}>
                  <path
                    d={sectorPath(start, end)}
                    fill={`url(#bw-grad-${s.id})`}
                    className={[
                      "blessing-wheel__sector",
                      selectedIndex === i ? "blessing-wheel__sector--selected" : "",
                      pickedIndices.includes(i) && selectedIndex !== i ? "blessing-wheel__sector--picked" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    className="blessing-wheel__label"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${mid - 90}, ${labelPos.x}, ${labelPos.y})`}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}

            <circle cx={CX} cy={CY} r={R_IN + 5} className="blessing-wheel__hub-ring" filter="url(#bw-inner-glow)" />
            <circle cx={CX} cy={CY} r={R_IN} className="blessing-wheel__hub" fill="url(#bw-hub-grad)" />
            <circle cx={CX} cy={CY} r={R_IN - 5} className="blessing-wheel__hub-inner" />
          </svg>
        </div>
      </div>
    </div>
  );
}
