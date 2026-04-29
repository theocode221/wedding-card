import type { FallingItem, FallingItemType } from "./catchTheLoveTypes";

const SPAWN_X_MIN = 10;
const SPAWN_X_MAX = 90;

export const CATCH_LOVE_DURATION_SEC = 15;

export function pointsForType(type: FallingItemType): number {
  switch (type) {
    case "heart":
      return 1;
    case "star":
      return 2;
    case "ring":
      return 3;
    case "bomb":
      return -2;
    default:
      return 0;
  }
}

export function rollItemType(): FallingItemType {
  const r = Math.random();
  if (r < 0.36) return "heart";
  if (r < 0.58) return "star";
  if (r < 0.8) return "ring";
  return "bomb";
}

export function nextSpawnDelayMs(): number {
  return 500 + Math.random() * 400;
}

export function fallDurationMs(): number {
  return 2200 + Math.random() * 2400;
}

export function createFallingItem(): FallingItem {
  const type = rollItemType();
  const x = SPAWN_X_MIN + Math.random() * (SPAWN_X_MAX - SPAWN_X_MIN);
  const speed = fallDurationMs();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    x,
    speed,
    points: pointsForType(type),
  };
}

const BURST = ["WOW!", "LOVE!", "POW!", "ZAP!", "SWAK!"] as const;

export function pickCatchLabel(points: number, _type: FallingItemType): string {
  if (points < 0) return "BOOM!";
  if (Math.random() < 0.38) return BURST[Math.floor(Math.random() * BURST.length)];
  return `+${points}`;
}

export function getCatchTheLoveResultTitle(score: number): string {
  const s = Math.max(0, Math.round(score));
  if (s <= 5) return "Cinta Baru Nak Panas";
  if (s <= 12) return "Power Cinta Meningkat!";
  return "Hero Cinta Legendary!";
}
