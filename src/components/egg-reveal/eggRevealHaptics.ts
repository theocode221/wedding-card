/** Safe no-op when Vibration API is missing (desktop, iOS Safari, etc.). */
function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  navigator.vibrate(pattern);
}

/** Each tap on the egg crack sequence. */
export function eggCrackHapticTap(which: 1 | 2 | 3) {
  if (which === 1) vibrate(14);
  else if (which === 2) vibrate([12, 38, 14]);
  else vibrate([18, 45, 20, 55, 28]);
}

/** When the reveal panel first appears (post-burst). */
export function revealCelebrationHaptic() {
  vibrate([22, 55, 24, 50, 26, 65, 32]);
}

/** Double-tap “cheer” on the cartoon GIF. */
export function revealCheerHaptic() {
  vibrate([10, 35, 12, 40, 14]);
}

/** Primary / ghost buttons on the reveal panel. */
export function revealUiTapHaptic() {
  vibrate(12);
}

/** Caught a good falling item in Catch the Love. */
export function gameCatchGoodHaptic() {
  vibrate(12);
}

/** Tapped a bomb in Catch the Love. */
export function gameBombHaptic() {
  vibrate([28, 50, 35, 65, 40]);
}
