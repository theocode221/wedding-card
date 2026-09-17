import type { CSSProperties } from "react";

/** Sparse gold glitter — keep airy, not crowded. */
const RAIN = [
  { id: "g1", left: "8%", size: "0.16rem", delay: "0s", dur: "8.2s", drift: "10px" },
  { id: "g2", left: "22%", size: "0.11rem", delay: "1.8s", dur: "9.4s", drift: "-8px" },
  { id: "g3", left: "36%", size: "0.18rem", delay: "0.6s", dur: "7.6s", drift: "14px" },
  { id: "g4", left: "48%", size: "0.12rem", delay: "3.2s", dur: "8.8s", drift: "-6px" },
  { id: "g5", left: "58%", size: "0.15rem", delay: "1.1s", dur: "9s", drift: "9px" },
  { id: "g6", left: "70%", size: "0.1rem", delay: "2.4s", dur: "7.9s", drift: "-12px" },
  { id: "g7", left: "82%", size: "0.17rem", delay: "0.3s", dur: "8.5s", drift: "7px" },
  { id: "g8", left: "92%", size: "0.12rem", delay: "4s", dur: "9.6s", drift: "-5px" },
  { id: "g9", left: "14%", size: "0.09rem", delay: "5.2s", dur: "10s", drift: "6px" },
  { id: "g10", left: "64%", size: "0.13rem", delay: "3.8s", dur: "8.1s", drift: "-9px" },
] as const;

/** Soft falling gold glitter for the Paan cover. */
export function PaanGlitter() {
  return (
    <div className="paan-glitter" aria-hidden>
      {RAIN.map((g) => (
        <span
          key={g.id}
          className="paan-glitter__dot"
          style={
            {
              left: g.left,
              width: g.size,
              height: g.size,
              animationDelay: g.delay,
              animationDuration: g.dur,
              "--drift": g.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
