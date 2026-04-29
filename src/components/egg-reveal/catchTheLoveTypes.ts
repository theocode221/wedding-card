export type FallingItemType = "heart" | "ring" | "star" | "bomb";

export type FallingItem = {
  id: string;
  type: FallingItemType;
  /** Horizontal centre, percent 0–100 within play field */
  x: number;
  /** Fall duration in milliseconds (drives CSS animation). */
  speed: number;
  points: number;
};

export type CatchFloatingEffect = {
  id: string;
  leftPct: number;
  topPct: number;
  label: string;
  tone: "good" | "bad";
};
