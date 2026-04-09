export type BlessingSegment = {
  id: string;
  label: string;
  fill: string;
  fillMid: string;
  message: string;
};

/** Four segments; wheel offset centres segment 0 under the top pointer. */
export const BLESSING_SEGMENTS: readonly BlessingSegment[] = [
  {
    id: "anep",
    label: "ANEP",
    fill: "#e8d4c8",
    fillMid: "#f2e4dc",
    message:
      "Selamat Pengantin Baru\nsemoga sentiasa dilimpahkan rezeki dan dikurniakan\nzuriat yang soleh dan solehah serta comel (nak 10 orang nuk)",
  },
  {
    id: "din",
    label: "DIN",
    fill: "#dcc8c4",
    fillMid: "#ead8d4",
    message:
      "Selamat Pengantin Baru Nuk\nsemoga bahagia selalu dan jadi lelaki \nyang bertanggungjawab, jaga isteri baik baik. muahhh",
  },
  {
    id: "hafizi",
    label: "HAFIZI",
    fill: "#c8d4cc",
    fillMid: "#dce8e0",
    message:
      "Semoga berkekalan hingga syurga, semoga menjadi ketua keluarga yang bertanggungjawab dan sentiasa mementingkan keluarga dalam apa jua hal,\nsemoga perkahwinan dirahmati dan diberkati Allah. lots lurve from pg",
  },
  {
    id: "nabil",
    label: "NABIL",
    fill: "#d8cfa8",
    fillMid: "#e8e4d0",
    message:
      "Selamat Pengantin Baru both of u,\nmay your marriage long last until jannah\ndan kasih yang tidak berbelah bahagi. menyala tunukku!",
  },
] as const;

export const SEGMENT_COUNT = BLESSING_SEGMENTS.length;
export const DEG_PER_SEGMENT = 360 / SEGMENT_COUNT;

/** Aligns segment centres with the top pointer (half-slice offset). */
export const WHEEL_OFFSET_DEG = -DEG_PER_SEGMENT / 2;

/**
 * Segment index under the fixed top pointer. Disk uses rotate(rotationDeg + WHEEL_OFFSET_DEG).
 */
export function segmentIndexAtPointer(rotationDeg: number, n: number = SEGMENT_COUNT): number {
  const half = DEG_PER_SEGMENT / 2;
  const α = ((half - rotationDeg) % 360 + 360) % 360;
  return Math.min(n - 1, Math.floor(α / DEG_PER_SEGMENT));
}

/** `rotationDeg % 360` after spin that centres segment `targetIndex` under the pointer. */
export function rotationModForSegment(targetIndex: number): number {
  return (360 - targetIndex * DEG_PER_SEGMENT) % 360;
}

export function computeNextRotation(currentRotation: number, targetIndex: number): number {
  const currentNorm = ((currentRotation % 360) + 360) % 360;
  const desiredMod = rotationModForSegment(targetIndex);
  let deltaMod = (desiredMod - currentNorm + 360) % 360;
  if (deltaMod < Math.min(48, DEG_PER_SEGMENT * 0.4)) deltaMod += 360;
  const fullSpins = 5 + Math.floor(Math.random() * 3);
  return currentRotation + fullSpins * 360 + deltaMod;
}

/** Indices not yet picked this round (0 .. SEGMENT_COUNT-1). */
export function availableSegmentIndices(picked: readonly number[]): number[] {
  const all = BLESSING_SEGMENTS.map((_, i) => i);
  return all.filter((i) => !picked.includes(i));
}
