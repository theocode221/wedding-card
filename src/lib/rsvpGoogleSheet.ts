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

export function getRsvpGoogleScriptUrl(): string {
  const fromEnv = import.meta.env.VITE_RSVP_GOOGLE_SCRIPT_URL;
  return typeof fromEnv === "string" && fromEnv.trim() ? fromEnv.trim() : DEFAULT_RSVP_SCRIPT_URL;
}

/**
 * Posts RSVP JSON to Google Apps Script.
 * Uses `text/plain` + `no-cors` so browsers can reach the script without a CORS preflight
 * (Apps Script web apps often redirect in a way that blocks normal CORS responses).
 * Success is optimistic: if the request leaves the browser without a network error, treat as sent.
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

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
  });
}
