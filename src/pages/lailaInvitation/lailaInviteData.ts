import { publicUrl } from "../../lib/publicAsset";
import {
  PORTFOLIO_DEMO_BRIDE,
  PORTFOLIO_DEMO_GROOM,
} from "../../data/portfolioDemoNames";

/**
 * Laila / Lela KB — maroon Malay traditional invitation.
 * Couple names, majlis details, gallery Drive IDs, and RSVP sheet URL live here.
 */
export const LAILA_COVER_BG = encodeURI(publicUrl("lela kb/marron bg laila.png"));
export const LAILA_BUNGA_TOP = encodeURI(publicUrl("lela kb/bunga-2.png"));
export const LAILA_BUNGA_BOTTOM = encodeURI(publicUrl("lela kb/bunga-1.png"));

export const LAILA_PATH = "/laila";
export const LAILA_RSVP_PATH = "/laila/rsvp";
export const LAILA_GALLERY_PATH = "/laila/galeri";
/** Client-only dashboard — not linked from the public invitation. */
export const LAILA_DASHBOARD_PATH = "/laila/papan";
/** Details screen after “Buka Jemputan” — treated as a separate page, not a scroll. */
export const LAILA_DETAILS_HASH = "jemputan";
export const LAILA_DETAILS_TO = { pathname: LAILA_PATH, hash: LAILA_DETAILS_HASH } as const;

export const LAILA_INVITE = {
  brideName: "Laila",
  groomName: "Hazziq",
  tagline: "Walimatul Urus",
  invitation:
    "Dengan penuh kesyukuran ke hadrat Ilahi, kami menjemput Dato’ / Datin / Tuan / Puan / Encik / Cik meriahkan majlis walimatul urus kami.",
  date: "Sabtu, 22 November 2026",
  timeLabel: "11:00 pagi - 3:00 petang",
  venue: "Akan dimaklumkan",
  address: "Kota Bharu, Kelantan",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kota+Bharu+Kelantan",
  wazeUrl: "https://www.waze.com/ul?q=Kota%20Bharu%20Kelantan&navigate=yes",
  /** ISO local (Asia/Kuala_Lumpur). Update when the client confirms the tarikh. */
  weddingDateTime: "2026-11-22T11:00:00",
  /** Hours the majlis runs — used for calendar end time once a date is set. */
  durationHours: 4,
  footer: "Kehadiran dan doa restu anda amat dialu-alukan.",
} as const;

export type LailaInvite = {
  brideName: string;
  groomName: string;
  tagline: string;
  invitation: string;
  date: string;
  timeLabel: string;
  venue: string;
  address: string;
  mapsUrl: string;
  wazeUrl: string;
  weddingDateTime: string;
  durationHours: number;
  footer: string;
};

export function lailaCoupleLabel(invite: Pick<LailaInvite, "groomName" | "brideName"> = LAILA_INVITE): string {
  return `${invite.groomName} & ${invite.brideName}`;
}

export function lailaInviteForPreview(isPreview: boolean): LailaInvite {
  if (!isPreview) return LAILA_INVITE;
  return {
    ...LAILA_INVITE,
    groomName: PORTFOLIO_DEMO_GROOM,
    brideName: PORTFOLIO_DEMO_BRIDE,
  };
}

export function lailaPageTitleForInvite(invite: Pick<LailaInvite, "groomName" | "brideName">): string {
  return `Walimatul Urus — ${lailaCoupleLabel(invite)}`;
}

/** Google Apps Script web app for this client’s sheet. Env overrides the default. */
const DEFAULT_LAILA_RSVP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw00qJF6UFtPI1c6smJ9bBtBSIa1rby5yUgXVI3Siin94yyg1-nUODPre_utl3fW5uikw/exec";

export function getLailaRsvpScriptUrl(): string {
  const fromEnv = import.meta.env.VITE_LAILA_RSVP_GOOGLE_SCRIPT_URL;
  return typeof fromEnv === "string" && fromEnv.trim() ? fromEnv.trim() : DEFAULT_LAILA_RSVP_SCRIPT_URL;
}

/**
 * Google Drive file IDs for the gallery.
 * Paste IDs from share links (`.../file/d/FILE_ID/view`) when the client sends photos.
 */
export const LAILA_GALLERY_DRIVE_IDS: readonly string[] = [];

export function driveFileViewUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`;
}

export const LAILA_GALLERY_IMAGE_URLS: readonly string[] =
  LAILA_GALLERY_DRIVE_IDS.map(driveFileViewUrl);

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function toUtcStamp(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${h}${min}${s}Z`;
}

export function lailaHasEventDate(invite: Pick<LailaInvite, "weddingDateTime"> = LAILA_INVITE): boolean {
  return Boolean(invite.weddingDateTime.trim());
}

export function getLailaGoogleCalendarUrl(invite = LAILA_INVITE): string | null {
  if (!lailaHasEventDate(invite)) return null;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${lailaCoupleLabel(invite)}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: invite.invitation,
    location: `${invite.venue}, ${invite.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadLailaIcs(invite = LAILA_INVITE): void {
  if (!lailaHasEventDate(invite)) return;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const title = `Walimatul Urus — ${lailaCoupleLabel(invite)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//Laila//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-laila-${toUtcStamp(start)}@wedding-card`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(invite.invitation)}`,
    `LOCATION:${escapeIcsText(`${invite.venue}, ${invite.address}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jemputan-laila.ics";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
