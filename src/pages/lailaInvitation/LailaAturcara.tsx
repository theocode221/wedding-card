import { useEffect, useId, useRef, useState } from "react";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import {
  LAILA_ATURCARA,
  type LailaAturcaraIcon,
  type LailaAturcaraItem,
} from "./lailaInviteData";

function AturcaraIcon({ icon }: { icon: LailaAturcaraIcon }) {
  switch (icon) {
    case "rings":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <circle cx="15.5" cy="21" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="24.5" cy="21" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M15.5 12.2 17.2 9.4h-3.4Z" fill="currentColor" />
          <path d="M24.5 12.2 26.2 9.4h-3.4Z" fill="currentColor" />
        </svg>
      );
    case "lantern":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <path
            d="M20 7v3.2M14.5 12.5h11M15.2 12.5c0 4.2-1.8 8.2-1.8 12.4 0 2.4 3 4.1 6.6 4.1s6.6-1.7 6.6-4.1c0-4.2-1.8-8.2-1.8-12.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M16.8 18.2h6.4M16.2 23.2h7.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="20" cy="33.2" r="1.4" fill="currentColor" />
        </svg>
      );
    case "couple":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <circle cx="14.5" cy="13.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M8.2 28.8c.4-5.2 2.8-8.2 6.3-8.2s5.9 3 6.3 8.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="25.5" cy="13.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M19.2 28.8c.4-5.2 2.8-8.2 6.3-8.2s5.9 3 6.3 8.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M18.4 20.2c1.1-1.5 3.1-1.5 4.2 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 40 40" aria-hidden>
          <path
            d="M24.8 9.2a11.4 11.4 0 1 0 6 17.8 9.6 9.6 0 1 1-6-17.8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="27.5" cy="14.2" r="1.1" fill="currentColor" />
          <circle cx="30.2" cy="18.5" r="0.8" fill="currentColor" />
        </svg>
      );
  }
}

function GuideButterfly() {
  return (
    <svg className="laila-aturcara__bf-svg" viewBox="0 0 80 70" aria-hidden>
      <ellipse className="laila-aturcara__bf-wing laila-aturcara__bf-wing--l" cx="22" cy="26" rx="21" ry="17" />
      <ellipse className="laila-aturcara__bf-wing laila-aturcara__bf-wing--l" cx="26" cy="46" rx="13" ry="11" opacity="0.9" />
      <circle cx="16" cy="22" r="4.5" fill="#fff6dc" opacity="0.55" />
      <ellipse className="laila-aturcara__bf-wing laila-aturcara__bf-wing--r" cx="58" cy="26" rx="21" ry="17" />
      <ellipse className="laila-aturcara__bf-wing laila-aturcara__bf-wing--r" cx="54" cy="46" rx="13" ry="11" opacity="0.9" />
      <circle cx="64" cy="22" r="4.5" fill="#fff6dc" opacity="0.55" />
      <ellipse cx="40" cy="36" rx="3.4" ry="17" fill="#3d151c" />
      <circle cx="40" cy="16" r="3.6" fill="#3d151c" />
      <path d="M38 14 Q28 3 22 7" stroke="#3d151c" strokeWidth="1.15" fill="none" strokeLinecap="round" />
      <path d="M42 14 Q52 3 58 7" stroke="#3d151c" strokeWidth="1.15" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Curved flight on the right — not a straight vertical drop. */
function flightOffsetX(progress: number) {
  return (
    Math.sin(progress * Math.PI * 2.15) * 14 +
    Math.sin(progress * Math.PI * 4.6 + 0.7) * 7 +
    Math.cos(progress * Math.PI * 1.35) * 4
  );
}

function flightAngle(progress: number, velocityY: number) {
  const curve = Math.cos(progress * Math.PI * 2.15) * 26 + Math.cos(progress * Math.PI * 4.6 + 0.7) * 12;
  return clamp(curve + velocityY * 0.35, -38, 38);
}

type TrailPoint = { x: number; y: number };

export function LailaAturcara() {
  const items = LAILA_ATURCARA;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const butterflyRef = useRef<HTMLDivElement | null>(null);
  const trailSvgRef = useRef<SVGSVGElement | null>(null);
  const trailPathRef = useRef<SVGPathElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);
  const smoothRef = useRef({ x: 0, y: 0, progress: 0, angle: 0, ready: false });
  const listId = useId();

  const [activeIndex, setActiveIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      if (fillRef.current) fillRef.current.style.height = "100%";
      if (butterflyRef.current) butterflyRef.current.classList.remove("is-visible");
      if (trailPathRef.current) trailPathRef.current.setAttribute("d", "");
      smoothRef.current.ready = false;
      return;
    }

    let raf = 0;
    let running = true;
    let prevY = 0;

    const drawTrail = (
      progress: number,
      xAt: (p: number) => number,
      y0: number,
      y1: number,
      width: number,
      height: number,
    ) => {
      const svg = trailSvgRef.current;
      const path = trailPathRef.current;
      if (!svg || !path) return;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      if (progress < 0.02) {
        path.setAttribute("d", "");
        return;
      }

      const steps = Math.max(2, Math.round(progress * 36));
      const pts: TrailPoint[] = [];
      for (let i = 0; i <= steps; i += 1) {
        const p = (i / steps) * progress;
        pts.push({
          x: xAt(p),
          y: lerp(y0, y1, p),
        });
      }

      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length - 1; i += 1) {
        const curr = pts[i];
        const next = pts[i + 1];
        d += ` Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)} ${((curr.x + next.x) / 2).toFixed(1)} ${((curr.y + next.y) / 2).toFixed(1)}`;
      }
      const end = pts[pts.length - 1];
      d += ` L ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
      path.setAttribute("d", d);
    };

    const tick = () => {
      if (!running) return;
      const stage = stageRef.current;
      if (!stage) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const nodes = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
      if (!nodes.length) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const stageBox = stage.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const focusY = vh * 0.42;
      const rightBase = stageBox.width - 16;
      const flightX = (progress: number) =>
        clamp(rightBase + flightOffsetX(progress), stageBox.width - 48, stageBox.width - 6);

      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      const centers: number[] = [];

      nodes.forEach((node, i) => {
        const box = node.getBoundingClientRect();
        const cy = box.top + box.height / 2;
        centers.push(cy);
        const dist = Math.abs(cy - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      const first = centers[0];
      const last = centers[centers.length - 1];
      const span = Math.max(1, last - first);
      const targetProgress = clamp((focusY - first) / span, 0, 1);
      const y0 = clamp(first - stageBox.top, 18, stageBox.height - 18);
      const y1 = clamp(last - stageBox.top, 18, stageBox.height - 18);
      const targetY = lerp(y0, y1, targetProgress);
      const targetX = flightX(targetProgress);
      const visible = stageBox.bottom > 60 && stageBox.top < vh - 30;

      const smooth = smoothRef.current;
      if (!smooth.ready) {
        smooth.x = targetX;
        smooth.y = targetY;
        smooth.progress = targetProgress;
        smooth.angle = flightAngle(targetProgress, 0);
        smooth.ready = true;
        prevY = targetY;
      } else {
        const ease = 0.16;
        smooth.x = lerp(smooth.x, targetX, ease);
        smooth.y = lerp(smooth.y, targetY, ease);
        smooth.progress = lerp(smooth.progress, targetProgress, ease);
        const velocityY = smooth.y - prevY;
        prevY = smooth.y;
        smooth.angle = lerp(smooth.angle, flightAngle(smooth.progress, velocityY * 14), 0.2);
      }

      if (fillRef.current) fillRef.current.style.height = `${smooth.progress * 100}%`;

      const bf = butterflyRef.current;
      if (bf) {
        bf.classList.toggle("is-visible", visible);
        bf.style.transform = `translate3d(${smooth.x}px, ${smooth.y}px, 0) translate(-50%, -50%) rotate(${smooth.angle}deg)`;
      }

      if (visible) {
        drawTrail(smooth.progress, (p) => flightX(p), y0, y1, stageBox.width, stageBox.height);
      } else if (trailPathRef.current && stageBox.bottom < 0) {
        trailPathRef.current.setAttribute("d", "");
      }

      if (best !== activeRef.current) {
        activeRef.current = best;
        setActiveIndex(best);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, items.length]);

  const highlight = focusedIndex ?? activeIndex;

  return (
    <ScrollReveal as="section" variant="from-top" className="laila-aturcara" rootMargin="0px 0px -12% 0px">
      <div className="laila-aturcara__inner">
        <p className="laila-kicker">Hari bahagia</p>
        <h2 className="laila-title" id={listId}>
          Aturcara Majlis
        </h2>
        <p className="laila-prose laila-aturcara__lead">
          Ikuti perjalanan hari — skrol perlahan, rama-rama akan menunjuk jalan.
        </p>

        <div className="laila-aturcara__stage" ref={stageRef}>
          <div className="laila-aturcara__rail" aria-hidden>
            <div className="laila-aturcara__rail-fill" ref={fillRef} />
          </div>

          {!reduceMotion ? (
            <>
              <svg className="laila-aturcara__trail-svg" ref={trailSvgRef} aria-hidden>
                <path
                  ref={trailPathRef}
                  className="laila-aturcara__trail-path"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="laila-aturcara__bf" ref={butterflyRef} aria-hidden>
                <GuideButterfly />
              </div>
            </>
          ) : null}

          <ol className="laila-aturcara__list" aria-labelledby={listId}>
            {items.map((item, index) => (
              <li key={`${item.time}-${item.title}`} className="laila-aturcara__item-wrap">
                <AturcaraStep
                  item={item}
                  active={highlight === index}
                  passed={index <= highlight}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onSelect={() => setFocusedIndex((cur) => (cur === index ? null : index))}
                  buttonRef={(node) => {
                    itemRefs.current[index] = node;
                  }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ScrollReveal>
  );
}

function AturcaraStep({
  item,
  active,
  passed,
  onFocus,
  onBlur,
  onSelect,
  buttonRef,
}: {
  item: LailaAturcaraItem;
  active: boolean;
  passed: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      type="button"
      ref={buttonRef}
      className={`laila-aturcara__step${active ? " is-active" : ""}${passed ? " is-passed" : ""}`}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onSelect}
      aria-current={active ? "step" : undefined}
    >
      <span className="laila-aturcara__node" aria-hidden>
        <span className="laila-aturcara__icon">
          <AturcaraIcon icon={item.icon} />
        </span>
      </span>
      <span className="laila-aturcara__copy">
        <span className="laila-aturcara__time">{item.time}</span>
        <span className="laila-aturcara__label">{item.title}</span>
      </span>
    </button>
  );
}
