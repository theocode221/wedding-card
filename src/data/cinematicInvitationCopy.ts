/** Cinematic hero typography — two orthographies (guest preference). */

export type CinematicScript = "jawi" | "rumi";

export const CINEMATIC_SCRIPT_STORAGE_KEY = "wedding:cinematic-script";

/** [tagline, names (\\n rows), body, date] — tagline is small; names are the hero. */
export const COPY_JAWI = [
  "رايکن چينتا",
  "نابيل\n  &\n انيس",
  "ديجومڤوت هادير کي مجليس وليمة تل عروس",
  "٢٠ ديسمبر ٢٠٢٦",
] as const;

/** Rumi — names string: `\\n` splits rows (same as Jawi hero block). */
export const COPY_RUMI = [
  "  Raikan Cinta",
  "\n\nNaim\n  &\n Nadhirah",
  "“dan Kami ciptakan kamu berpasang-pasangan”",
  "An Naba' (78:8)",
] as const;

export type CinematicCopy = readonly [string, string, string, string];

export function getCopyForScript(script: CinematicScript): CinematicCopy {
  return script === "jawi" ? COPY_JAWI : COPY_RUMI;
}

/** `?tulisan=jawi` | `?tulisan=rumi` (optional). */
export function readScriptFromSearch(search: string): CinematicScript | null {
  try {
    const q = new URLSearchParams(search).get("tulisan")?.toLowerCase();
    if (q === "jawi" || q === "rumi") return q;
  } catch {
    /* ignore */
  }
  return null;
}

export function readStoredScript(): CinematicScript | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CINEMATIC_SCRIPT_STORAGE_KEY);
    if (v === "jawi" || v === "rumi") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function persistScript(script: CinematicScript): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CINEMATIC_SCRIPT_STORAGE_KEY, script);
  } catch {
    /* ignore */
  }
}

export function resolveInitialScript(search: string): CinematicScript {
  return readScriptFromSearch(search) ?? readStoredScript() ?? "jawi";
}
