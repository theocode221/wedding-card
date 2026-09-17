import type { CSSProperties } from "react";

const RAIN = [
  { id: "r1", left: "6%", size: "0.18rem", delay: "0s", dur: "7.2s", drift: "10px" },
  { id: "r2", left: "14%", size: "0.12rem", delay: "1.1s", dur: "8s", drift: "-8px" },
  { id: "r3", left: "22%", size: "0.2rem", delay: "0.5s", dur: "6.6s", drift: "14px" },
  { id: "r4", left: "31%", size: "0.14rem", delay: "2s", dur: "8.8s", drift: "-12px" },
  { id: "r5", left: "40%", size: "0.16rem", delay: "0.9s", dur: "7s", drift: "6px" },
  { id: "r6", left: "48%", size: "0.11rem", delay: "2.8s", dur: "8.4s", drift: "-9px" },
  { id: "r7", left: "57%", size: "0.22rem", delay: "1.4s", dur: "6.4s", drift: "12px" },
  { id: "r8", left: "66%", size: "0.13rem", delay: "0.3s", dur: "7.6s", drift: "-5px" },
  { id: "r9", left: "74%", size: "0.17rem", delay: "2.4s", dur: "8.2s", drift: "9px" },
  { id: "r10", left: "83%", size: "0.12rem", delay: "1.7s", dur: "6.9s", drift: "-14px" },
  { id: "r11", left: "91%", size: "0.19rem", delay: "0.7s", dur: "9s", drift: "7px" },
  { id: "r12", left: "18%", size: "0.1rem", delay: "3.2s", dur: "7.8s", drift: "-6px" },
  { id: "r13", left: "52%", size: "0.15rem", delay: "3.8s", dur: "8.6s", drift: "11px" },
  { id: "r14", left: "78%", size: "0.11rem", delay: "4.2s", dur: "7.3s", drift: "-8px" },
] as const;

/** Soft gold glitter for Malay Classic cinematic cover. */
export function MalayClassicCinematicDecor() {
  return (
    <div className="wif-mc-glitter" aria-hidden>
      {RAIN.map((g) => (
        <span
          key={g.id}
          className="wif-mc-glitter__dot"
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
