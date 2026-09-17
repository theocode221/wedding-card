import { PORTFOLIO_DEMO_CINEMATIC_COPY } from "./portfolioDemoNames";

/** Cinematic hero copy — Rumi (Latin) only. */

/** [tagline, names (`\n` rows), body, reference/date line] */
export type CinematicCopyTuple = readonly [string, string, string, string];

/**
 * Safe default — used whenever copy is omitted (portfolio demos, loading).
 * Never put a real client couple here.
 */
export const CINEMATIC_COPY: CinematicCopyTuple = PORTFOLIO_DEMO_CINEMATIC_COPY;

/** Live White & Gold / framed invitation — Naim & Nadhirah only. */
export const NAIM_NADHIRAH_CINEMATIC_COPY: CinematicCopyTuple = [
  "Satukan Cinta",
  "Naim\n&\nNadhirah",
  "“dan Kami ciptakan kamu berpasang-pasangan”",
  "An Naba' (78:8)",
];

/** Malay Classic (frame) demo couple — Imran & Aisyah. */
export const MALAY_CLASSIC_CINEMATIC_COPY: CinematicCopyTuple = [
  "Walimatul Urus",
  "Imran\n&\nAisyah",
  "Dengan penuh rasa syukur ke hadrat Allah S.W.T",
  "14 Mac 2027",
];
