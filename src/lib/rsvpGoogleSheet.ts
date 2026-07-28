/** Payload written as a row in the RSVP Google Sheet via Apps Script. */
export type RsvpSheetPayload = {
  name: string;
  attending: "yes" | "no" | "maybe";
  guests: number;
  message: string;
  theme: string;
};

const DEFAULT_RSVP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz8MmtjgPjGLoQkYVFHOFa3KhS8fTO96O3LJkyuyBoEuAtkl-EvQcdUoLc7Pn-pIXln/exec";

/** Cap how long the UI waits — Apps Script cold starts can take many seconds. */
const UI_WAIT_MS = 400;

export function getRsvpGoogleScriptUrl(): string {
  const fromEnv = import.meta.env.VITE_RSVP_GOOGLE_SCRIPT_URL;
  return typeof fromEnv === "string" && fromEnv.trim() ? fromEnv.trim() : DEFAULT_RSVP_SCRIPT_URL;
}

/**
 * Posts RSVP JSON to Google Apps Script.
 * Uses `text/plain` + `no-cors` so browsers can reach the script without a CORS preflight.
 *
 * The UI does not wait for the full Apps Script round-trip (often slow / cold-start).
 * We dispatch the request and resolve after a short cap so guests don't feel stuck;
 * the browser continues the POST in the background (`keepalive`).
 */
export async function submitRsvpToGoogleSheet(payload: RsvpSheetPayload): Promise<void> {
  const url = getRsvpGoogleScriptUrl();
  const body = JSON.stringify({
    name: payload.name.trim(),
    attending: payload.attending,
    guests: Math.max(1, Math.min(20, Math.floor(payload.guests) || 1)),
    message: payload.message.trim(),
    theme: payload.theme,
  });

  const request = fetch(url, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
  });

  const outcome = await Promise.race([
    request.then(() => "done" as const),
    new Promise<"timeout">((resolve) => {
      window.setTimeout(() => resolve("timeout"), UI_WAIT_MS);
    }),
  ]);

  if (outcome === "timeout") {
    // Keep the request alive in the background; ignore late network errors for UX.
    void request.catch(() => undefined);
  }
}
