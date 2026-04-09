import { useCallback, useEffect, useRef, useState } from "react";

const REVEAL_THRESHOLD = 0.52;
const BRUSH_RADIUS_CSS = 26;
const SAMPLE_INTERVAL_MS = 100;

function countTransparentRatio(imageData: ImageData): number {
  const d = imageData.data;
  const n = d.length / 4;
  let transparent = 0;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] < 40) transparent += 1;
  }
  return transparent / n;
}

export type UseScratchCardOptions = {
  onReveal: () => void;
  onProgress?: (ratio: number) => void;
  resetSignal: number;
};

export function useScratchCard({ onReveal, onProgress, resetSignal }: UseScratchCardOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const drawingRef = useRef(false);
  const revealedRef = useRef(false);
  const lastSampleRef = useRef(0);
  const dprRef = useRef(1);
  const progressRef = useRef(0);

  const drawCoating = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    dprRef.current = dpr;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w < 2 || h < 2) return;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#ebe3d9");
    g.addColorStop(0.35, "#dccfbf");
    g.addColorStop(0.65, "#d4c4b4");
    g.addColorStop(1, "#c8b5a2");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 24; i += 1) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.stroke();
    }

    revealedRef.current = false;
    setProgress(0);
    progressRef.current = 0;
    onProgress?.(0);
  }, [onProgress]);

  const sampleProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const { width, height } = canvas;
    if (width < 2 || height < 2) return;

    let ratio: number;
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      ratio = countTransparentRatio(imageData);
    } catch {
      return;
    }

    setProgress(ratio);
    progressRef.current = ratio;
    onProgress?.(ratio);

    if (ratio >= REVEAL_THRESHOLD && !revealedRef.current) {
      revealedRef.current = true;
      onReveal();
    }
  }, [onReveal, onProgress]);

  const scratchAt = useCallback(
    (cssX: number, cssY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || revealedRef.current) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.save();
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cssX, cssY, BRUSH_RADIUS_CSS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const now = performance.now();
      if (now - lastSampleRef.current >= SAMPLE_INTERVAL_MS) {
        lastSampleRef.current = now;
        sampleProgress();
      }
    },
    [sampleProgress],
  );

  const endStroke = useCallback(() => {
    sampleProgress();
  }, [sampleProgress]);

  useEffect(() => {
    drawCoating();
  }, [drawCoating, resetSignal]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      if (revealedRef.current) return;
      if (progressRef.current > 0.02) return;
      drawCoating();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [drawCoating, resetSignal]);

  return {
    canvasRef,
    wrapRef,
    progress,
    drawingRef,
    scratchAt,
    endStroke,
    drawCoating,
  };
}
