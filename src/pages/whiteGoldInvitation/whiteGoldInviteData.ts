import { getRsvpGoogleScriptUrl } from "../../lib/rsvpGoogleSheet";

/** Theme value written by RsvpPage for Naim & Nadhirah. */
export const WHITE_GOLD_RSVP_THEME = "whiteGold";

export const WHITE_GOLD_DASHBOARD_PATH = "/naim-nadhirah-nikah/dashboard";

export const WHITE_GOLD_COUPLE = {
  brideName: "Nadhirah",
  groomName: "Naim",
  dateLabel: "27 September 2026",
  timeLabel: "10:00 pagi – 2:00 petang",
} as const;

export function whiteGoldCoupleLabel(
  couple: Pick<typeof WHITE_GOLD_COUPLE, "brideName" | "groomName"> = WHITE_GOLD_COUPLE,
): string {
  return `${couple.groomName} & ${couple.brideName}`;
}

export function getWhiteGoldRsvpScriptUrl(): string {
  const dedicated = import.meta.env.VITE_WHITE_GOLD_RSVP_GOOGLE_SCRIPT_URL;
  if (typeof dedicated === "string" && dedicated.trim()) return dedicated.trim();
  return getRsvpGoogleScriptUrl();
}
