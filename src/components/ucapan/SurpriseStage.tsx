import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUcapanCopy } from "../../context/UcapanCopyContext";
import type { SurprisePhotoConfig } from "./surprisePhotos";

type SurpriseStageProps = {
  photos: SurprisePhotoConfig[];
  exiting: boolean;
  onClose: () => void;
};

type BounceBody = { tx: number; ty: number; vx: number; vy: number };

const RESTITUTION = 0.94;
/** Slightly softer than walls so stacks of circles settle nicely */
const PAIR_RESTITUTION = 0.9;
const BASE_SPEED = 38;
const MAX_DT = 1 / 45;
const PAIR_SOLVER_PASSES = 4;

/** Pointer drag → nearby circles pick up velocity (stir the “bowl”) */
const STIR_GAIN = 1.15;
const STIR_RADIUS_FRAC = 0.32;
const STIR_MIN_RADIUS = 130;
const STIR_MAX_RADIUS = 300;
const STIR_POINTER_CAP = 2000;
const STIR_VEL_SMOOTH = 0.42;

/** Quick tap on a circle opens fullscreen; larger movement = stir only */
const TAP_MAX_MOVE_PX = 14;
const TAP_MAX_MS = 320;

type StirPointerRef = {
  active: boolean;
  lastX: number;
  lastY: number;
  lastT: number;
  vx: number;
  vy: number;
};

function applyStirToBodies(
  stir: StirPointerRef,
  stageRect: DOMRect,
  itemRefs: (HTMLElement | null)[],
  bodies: BounceBody[],
  dt: number,
) {
  if (!stir.active) {
    stir.vx *= 0.82;
    stir.vy *= 0.82;
    return;
  }

  const stirR = Math.min(STIR_MAX_RADIUS, Math.max(STIR_MIN_RADIUS, stageRect.width * STIR_RADIUS_FRAC));
  const px = stir.lastX;
  const py = stir.lastY;
  const gain = STIR_GAIN * dt;

  for (let i = 0; i < bodies.length; i++) {
    const el = itemRefs[i];
    const body = bodies[i];
    if (!el || !body) continue;
    const { cx, cy, r } = circleFromEl(el);
    const dist = Math.hypot(cx - px, cy - py);
    const reach = stirR + r;
    if (dist > reach) continue;
    const w = 1 - dist / reach;
    const falloff = w * w;
    body.vx += stir.vx * gain * falloff;
    body.vy += stir.vy * gain * falloff;
  }
}

function circleFromEl(el: HTMLElement): { cx: number; cy: number; r: number } {
  const box = el.getBoundingClientRect();
  const cx = (box.left + box.right) / 2;
  const cy = (box.top + box.bottom) / 2;
  const r = 0.5 * Math.min(el.offsetWidth, el.offsetHeight);
  return { cx, cy, r };
}

function resolveStageBounds(
  el: HTMLElement,
  body: BounceBody,
  rot: number,
  stageRect: DOMRect,
  applyTransform: (el: HTMLElement, body: BounceBody, rot: number) => void,
) {
  for (let pass = 0; pass < 2; pass++) {
    const r = el.getBoundingClientRect();
    if (r.left < stageRect.left) {
      body.tx += stageRect.left - r.left;
      body.vx = Math.abs(body.vx) * RESTITUTION;
    }
    if (r.right > stageRect.right) {
      body.tx -= r.right - stageRect.right;
      body.vx = -Math.abs(body.vx) * RESTITUTION;
    }
    if (r.top < stageRect.top) {
      body.ty += stageRect.top - r.top;
      body.vy = Math.abs(body.vy) * RESTITUTION;
    }
    if (r.bottom > stageRect.bottom) {
      body.ty -= r.bottom - stageRect.bottom;
      body.vy = -Math.abs(body.vy) * RESTITUTION;
    }
    applyTransform(el, body, rot);
  }
}

function resolvePairCollision(
  a: HTMLElement,
  b: HTMLElement,
  bodyA: BounceBody,
  bodyB: BounceBody,
  rotA: number,
  rotB: number,
  applyTransform: (el: HTMLElement, body: BounceBody, rot: number) => void,
) {
  const ca = circleFromEl(a);
  const cb = circleFromEl(b);
  let dx = cb.cx - ca.cx;
  let dy = cb.cy - ca.cy;
  let dist = Math.hypot(dx, dy);
  const minDist = ca.r + cb.r;

  if (dist >= minDist) return;

  if (dist < 1e-4) {
    dx = 1;
    dy = 0;
    dist = 1;
  } else {
    dx /= dist;
    dy /= dist;
  }

  const rvn = (bodyB.vx - bodyA.vx) * dx + (bodyB.vy - bodyA.vy) * dy;

  const overlap = minDist - dist;
  const half = overlap * 0.5;
  bodyA.tx -= dx * half;
  bodyA.ty -= dy * half;
  bodyB.tx += dx * half;
  bodyB.ty += dy * half;
  applyTransform(a, bodyA, rotA);
  applyTransform(b, bodyB, rotB);

  if (rvn >= 0) return;

  const impulse = (-(1 + PAIR_RESTITUTION) * rvn) / 2;
  bodyA.vx -= impulse * dx;
  bodyA.vy -= impulse * dy;
  bodyB.vx += impulse * dx;
  bodyB.vy += impulse * dy;
}

function hitTestTopPhotoIndex(clientX: number, clientY: number, itemRefs: (HTMLElement | null)[], n: number): number {
  for (let i = n - 1; i >= 0; i--) {
    const el = itemRefs[i];
    if (!el) continue;
    const { cx, cy, r } = circleFromEl(el);
    if (Math.hypot(clientX - cx, clientY - cy) <= r) return i;
  }
  return -1;
}

function initBodies(count: number, configs: SurprisePhotoConfig[]): BounceBody[] {
  return configs.map((p, i) => {
    const angle = (i / Math.max(count, 1)) * Math.PI * 2 + i * 0.73;
    const sp = BASE_SPEED + (i % 5) * 5 + (p.speedPx ?? 0);
    return {
      tx: 0,
      ty: 0,
      vx: Math.cos(angle) * sp,
      vy: Math.sin(angle) * sp,
    };
  });
}

type SurpriseViewerState =
  | null
  | { media: "image"; src: string; alt: string }
  | { media: "video"; src: string };

export function SurpriseStage({ photos, exiting, onClose }: SurpriseStageProps) {
  const { copy } = useUcapanCopy();
  const [entered, setEntered] = useState(false);
  const [stirring, setStirring] = useState(false);
  const [viewer, setViewer] = useState<SurpriseViewerState>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const bodiesRef = useRef<BounceBody[]>([]);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const photosRef = useRef(photos);
  photosRef.current = photos;
  const stirPointerRef = useRef<StirPointerRef>({
    active: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    vx: 0,
    vy: 0,
  });
  const gestureRef = useRef({ startX: 0, startY: 0, startT: 0, cancelledByDrag: false });

  const closeViewer = useCallback(() => setViewer(null), []);

  useEffect(() => {
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, []);

  useLayoutEffect(() => {
    if (!entered || exiting) return;
    const root = stageRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>(".ucapan-surprise__photo");
    itemRefs.current = Array.from(nodes);
  }, [entered, exiting, photos.length]);

  useEffect(() => {
    if (exiting) {
      stirPointerRef.current.active = false;
      stirPointerRef.current.vx = 0;
      stirPointerRef.current.vy = 0;
      setStirring(false);
      setViewer(null);
    }
  }, [exiting]);

  useEffect(() => {
    if (!viewer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer, closeViewer]);

  useEffect(() => {
    const root = stageRef.current;
    if (!root) return undefined;

    const vids = () => Array.from(root.querySelectorAll<HTMLVideoElement>("video"));

    if (exiting || !entered) {
      vids().forEach((v) => {
        v.pause();
        v.currentTime = 0;
      });
    } else {
      vids().forEach((v) => {
        v.muted = true;
        void v.play().catch(() => {
          /* Autoplay blocked — muted loop usually OK after tap to open surprise */
        });
      });
    }

    return () => {
      vids().forEach((v) => v.pause());
    };
  }, [entered, exiting]);

  useEffect(() => {
    if (!entered || exiting) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      bodiesRef.current = [];
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;

    const list = photosRef.current;
    bodiesRef.current = initBodies(list.length, list);
    lastTsRef.current = performance.now();

    const applyTransform = (el: HTMLElement, body: BounceBody, rot: number) => {
      el.style.transform = `translate3d(${body.tx}px, ${body.ty}px, 0) rotate(${rot}deg)`;
    };

    const step = (now: number) => {
      const dt = Math.min(MAX_DT, Math.max(0, (now - lastTsRef.current) / 1000));
      lastTsRef.current = now;
      const s = stage.getBoundingClientRect();
      const cfg = photosRef.current;
      const n = cfg.length;

      applyStirToBodies(stirPointerRef.current, s, itemRefs.current, bodiesRef.current, dt);

      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        const body = bodiesRef.current[i];
        if (!el || !body) continue;
        body.tx += body.vx * dt;
        body.ty += body.vy * dt;
        applyTransform(el, body, cfg[i].rotationDeg ?? 0);
      }

      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        const body = bodiesRef.current[i];
        if (!el || !body) continue;
        resolveStageBounds(el, body, cfg[i].rotationDeg ?? 0, s, applyTransform);
      }

      for (let pass = 0; pass < PAIR_SOLVER_PASSES; pass++) {
        for (let i = 0; i < n; i++) {
          const elA = itemRefs.current[i];
          const bodyA = bodiesRef.current[i];
          if (!elA || !bodyA) continue;
          const rotA = cfg[i].rotationDeg ?? 0;
          for (let j = i + 1; j < n; j++) {
            const elB = itemRefs.current[j];
            const bodyB = bodiesRef.current[j];
            if (!elB || !bodyB) continue;
            resolvePairCollision(elA, elB, bodyA, bodyB, rotA, cfg[j].rotationDeg ?? 0, applyTransform);
          }
        }
      }

      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        const body = bodiesRef.current[i];
        if (!el || !body) continue;
        resolveStageBounds(el, body, cfg[i].rotationDeg ?? 0, s, applyTransform);
      }

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [entered, exiting, photos.length]);

  const endStir = () => {
    const st = stirPointerRef.current;
    st.active = false;
    st.vx = 0;
    st.vy = 0;
    setStirring(false);
  };

  return (
    <div
      className={[
        "ucapan-surprise",
        entered && !exiting ? "ucapan-surprise--in" : "",
        exiting ? "ucapan-surprise--out" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ucapan-surprise-title"
    >
      <div className="ucapan-surprise__wash" aria-hidden />
      <div className="ucapan-surprise__glow ucapan-surprise__glow--a" aria-hidden />
      <div className="ucapan-surprise__glow ucapan-surprise__glow--b" aria-hidden />
      <div className="ucapan-surprise__particles" aria-hidden />

      <header className="ucapan-surprise__header">
        <h1 id="ucapan-surprise-title" className="ucapan-surprise__title">
          {copy.surpriseTitle}
        </h1>
        <button type="button" className="ucapan-surprise__back" onClick={onClose}>
          {copy.surpriseBack}
        </button>
      </header>

      <div
        className={["ucapan-surprise__stage", stirring ? "ucapan-surprise__stage--stirring" : ""].filter(Boolean).join(" ")}
        ref={stageRef}
        role="application"
        aria-label={copy.surpriseStageAriaLabel}
        onPointerDown={(e) => {
          if (!entered || exiting) return;
          if (e.pointerType === "mouse" && e.button !== 0) return;
          gestureRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startT: performance.now(),
            cancelledByDrag: false,
          };
          const st = stirPointerRef.current;
          st.active = true;
          st.lastX = e.clientX;
          st.lastY = e.clientY;
          st.lastT = performance.now();
          st.vx = 0;
          st.vy = 0;
          e.currentTarget.setPointerCapture(e.pointerId);
          setStirring(true);
        }}
        onPointerMove={(e) => {
          const st = stirPointerRef.current;
          if (!st.active) return;
          const g = gestureRef.current;
          if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > TAP_MAX_MOVE_PX) {
            g.cancelledByDrag = true;
          }
          const now = performance.now();
          const dtMs = now - st.lastT;
          if (dtMs < 4) return;
          const instVx = (e.clientX - st.lastX) / (dtMs / 1000);
          const instVy = (e.clientY - st.lastY) / (dtMs / 1000);
          st.lastX = e.clientX;
          st.lastY = e.clientY;
          st.lastT = now;
          const mag = Math.hypot(instVx, instVy);
          const cap = mag > STIR_POINTER_CAP ? STIR_POINTER_CAP / mag : 1;
          const ix = instVx * cap;
          const iy = instVy * cap;
          st.vx = st.vx * STIR_VEL_SMOOTH + ix * (1 - STIR_VEL_SMOOTH);
          st.vy = st.vy * STIR_VEL_SMOOTH + iy * (1 - STIR_VEL_SMOOTH);
        }}
        onPointerUp={(e) => {
          const g = gestureRef.current;
          const elapsed = performance.now() - g.startT;
          if (!g.cancelledByDrag && elapsed < TAP_MAX_MS && elapsed >= 0) {
            const cfg = photosRef.current;
            const n = cfg.length;
            const idx = hitTestTopPhotoIndex(e.clientX, e.clientY, itemRefs.current, n);
            if (idx >= 0) {
              const p = cfg[idx];
              if (p.media === "video") {
                setViewer({ media: "video", src: p.src });
              } else {
                setViewer({ media: "image", src: p.src, alt: p.alt ?? "" });
              }
            }
          }
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
          endStir();
        }}
        onPointerCancel={(e) => {
          gestureRef.current.cancelledByDrag = true;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
          endStir();
        }}
        onLostPointerCapture={() => {
          endStir();
        }}
      >
        {photos.map((p, i) => (
          <figure
            key={`${p.src}-${i}`}
            className="ucapan-surprise__photo ucapan-surprise__photo--bounce"
            style={{
              top: p.top,
              ...(p.left != null ? { left: p.left } : {}),
              ...(p.right != null ? { right: p.right } : {}),
              width: p.width,
            }}
          >
            <span className="ucapan-surprise__photoFrame">
              {p.media === "video" ? (
                <video
                  className="ucapan-surprise__photoImg ucapan-surprise__photoVideo"
                  src={p.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  controls={false}
                  aria-hidden={true}
                />
              ) : (
                <img src={p.src} alt={p.alt ?? ""} className="ucapan-surprise__photoImg" width={400} height={400} decoding="async" />
              )}
            </span>
          </figure>
        ))}
      </div>

      {viewer && (
        <div
          className="ucapan-surprise__viewer"
          role="dialog"
          aria-modal="true"
          aria-label={viewer.media === "image" ? copy.viewerImageAriaLabel : copy.viewerVideoAriaLabel}
        >
          <button
            type="button"
            className="ucapan-surprise__viewerBackdrop"
            aria-label={copy.viewerBackdropAriaLabel}
            onClick={closeViewer}
          />
          <div className="ucapan-surprise__viewerInner">
            <button type="button" className="ucapan-surprise__viewerClose" onClick={closeViewer} autoFocus>
              {copy.viewerCloseButton}
            </button>
            {viewer.media === "image" ? (
              <img src={viewer.src} alt={viewer.alt} className="ucapan-surprise__viewerImg" decoding="async" />
            ) : (
              <video className="ucapan-surprise__viewerVideo" src={viewer.src} controls playsInline loop preload="metadata" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
