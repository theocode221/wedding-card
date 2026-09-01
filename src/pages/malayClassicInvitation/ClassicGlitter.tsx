import type { CSSProperties } from "react";

const RAIN = [
  { id: "r1", left: "4%", size: "0.2rem", delay: "0s", dur: "7.5s", drift: "12px" },
  { id: "r2", left: "11%", size: "0.14rem", delay: "1.2s", dur: "8.2s", drift: "-8px" },
  { id: "r3", left: "18%", size: "0.22rem", delay: "0.4s", dur: "6.8s", drift: "18px" },
  { id: "r4", left: "26%", size: "0.16rem", delay: "2.1s", dur: "9s", drift: "-14px" },
  { id: "r5", left: "33%", size: "0.18rem", delay: "0.8s", dur: "7.2s", drift: "6px" },
  { id: "r6", left: "41%", size: "0.12rem", delay: "3s", dur: "8.6s", drift: "-10px" },
  { id: "r7", left: "48%", size: "0.24rem", delay: "1.5s", dur: "6.5s", drift: "15px" },
  { id: "r8", left: "55%", size: "0.15rem", delay: "0.2s", dur: "7.8s", drift: "-6px" },
  { id: "r9", left: "62%", size: "0.19rem", delay: "2.6s", dur: "8.4s", drift: "10px" },
  { id: "r10", left: "69%", size: "0.13rem", delay: "1.8s", dur: "7s", drift: "-16px" },
  { id: "r11", left: "76%", size: "0.21rem", delay: "0.6s", dur: "9.2s", drift: "8px" },
  { id: "r12", left: "83%", size: "0.17rem", delay: "3.4s", dur: "6.9s", drift: "-12px" },
  { id: "r13", left: "90%", size: "0.14rem", delay: "1s", dur: "8s", drift: "14px" },
  { id: "r14", left: "96%", size: "0.2rem", delay: "2.3s", dur: "7.4s", drift: "-5px" },
  { id: "r15", left: "8%", size: "0.11rem", delay: "4.1s", dur: "8.8s", drift: "9px" },
  { id: "r16", left: "22%", size: "0.16rem", delay: "3.7s", dur: "7.6s", drift: "-11px" },
  { id: "r17", left: "37%", size: "0.13rem", delay: "4.5s", dur: "9.5s", drift: "7px" },
  { id: "r18", left: "58%", size: "0.18rem", delay: "5s", dur: "6.6s", drift: "-9px" },
  { id: "r19", left: "72%", size: "0.12rem", delay: "4.8s", dur: "8.1s", drift: "11px" },
  { id: "r20", left: "87%", size: "0.15rem", delay: "5.4s", dur: "7.3s", drift: "-7px" },
  { id: "r21", left: "15%", size: "0.1rem", delay: "2.8s", dur: "10s", drift: "5px" },
  { id: "r22", left: "44%", size: "0.17rem", delay: "3.2s", dur: "8.9s", drift: "-13px" },
  { id: "r23", left: "66%", size: "0.14rem", delay: "1.4s", dur: "7.7s", drift: "16px" },
  { id: "r24", left: "79%", size: "0.11rem", delay: "0.9s", dur: "9.1s", drift: "-4px" },
] as const;

/** Falling gold glitter rain — cover & details. */
export function ClassicGlitter() {
  return (
    <div className="classic-glitter" aria-hidden>
      {RAIN.map((g) => (
        <span
          key={g.id}
          className="classic-glitter__dot"
          style={
            {
              left: g.left,
              width: g.size,
              height: g.size,
              animationDelay: g.delay,
              animationDuration: g.dur,
              "--classic-glitter-drift": g.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
