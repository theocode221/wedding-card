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

/** Cover-only Jawi for “Walimatul Urus”. Other pages keep the Rumi tagline. */
export const LAILA_TAGLINE_JAWI = "وليمة العرس";

/** Full salam in Arabic calligraphy on the details page. */
export const LAILA_SALAM_KHAT = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ";
export const LAILA_SALAM_LATIN = "Assalamualaikum Warahmatullahi Wabarakatuh";

export const LAILA_INVITE = {
  brideName: "Suhailah",
  groomName: "Hazziq",
  tagline: "Walimatul Urus",
  fatherName: "Mohd Junid bin Masiran",
  motherName: "Salina binti Shahar",
  invitation:
    "Dengan penuh rasa syukur ke hadrat Allah S.W.T,\nkami dengan segala hormatnya menjemput\nDato’ / Datin / Tuan / Puan / Encik / Cik\nke majlis perkahwinan puteri kami",
  coupleNote: "dengan pilihan hatinya",
  groomFullName: "Muhammad Hazziq",
  brideFullName: "Nur Lailatul Suhailah",
  dayLabel: "Sabtu",
  date: "12.12.2026",
  timeLabel: "11:00 A.M. – 4:00 P.M.",
  venue: "Rinching Terrace Wedding & Event",
  address: "Kampung Rinching Hilir, Kajang",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rinching+Terrace+Wedding+%26+Event+Kampung+Rinching+Hilir+Kajang",
  wazeUrl:
    "https://www.waze.com/ul?q=Rinching%20Terrace%20Wedding%20%26%20Event%20Kampung%20Rinching%20Hilir%20Kajang&navigate=yes",
  /** ISO local (Asia/Kuala_Lumpur). */
  weddingDateTime: "2026-12-12T11:00:00",
  /** Hours the majlis runs — used for calendar end time once a date is set. */
  durationHours: 5,
  footer: "Kehadiran dan doa restu anda amat dialu-alukan.",
} as const;

export type LailaAturcaraIcon = "rings" | "lantern" | "couple" | "moon";

export type LailaAturcaraItem = {
  time: string;
  title: string;
  icon: LailaAturcaraIcon;
};

export const LAILA_ATURCARA: readonly LailaAturcaraItem[] = [
  { time: "8:00 AM", title: "Akad Nikah", icon: "rings" },
  { time: "11:00 AM", title: "Majlis Bermula", icon: "lantern" },
  { time: "12:00 PM", title: "Ketibaan Pengantin", icon: "couple" },
  { time: "4:00 PM", title: "Majlis Berakhir", icon: "moon" },
] as const;

export type LailaWhatsappContact = {
  name: string;
  displayNumber: string;
  whatsappUrl: string;
};

function lailaWaMeUrl(localMalaysiaMobile: string): string {
  const digits = localMalaysiaMobile.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `60${digits.slice(1)}` : digits;
  return `https://wa.me/${international}`;
}

export const LAILA_WHATSAPP_CONTACTS: readonly LailaWhatsappContact[] = [
  {
    name: "Shuhada",
    displayNumber: "013-778 8695",
    whatsappUrl: lailaWaMeUrl("0137788695"),
  },
  {
    name: "Sahira",
    displayNumber: "018-281 4341",
    whatsappUrl: lailaWaMeUrl("0182814341"),
  },
] as const;

export type LailaInvite = {
  brideName: string;
  groomName: string;
  tagline: string;
  fatherName: string;
  motherName: string;
  invitation: string;
  coupleNote: string;
  groomFullName: string;
  brideFullName: string;
  dayLabel: string;
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
  return `${invite.brideName} & ${invite.groomName}`;
}

export function lailaInvitationDetails(
  invite: Pick<LailaInvite, "invitation" | "brideFullName" | "coupleNote" | "groomFullName"> = LAILA_INVITE,
): string {
  return `${invite.invitation}\n${invite.brideFullName}\n${invite.coupleNote}\n${invite.groomFullName}`;
}

export function lailaInviteForPreview(isPreview: boolean): LailaInvite {
  if (!isPreview) return LAILA_INVITE;
  return {
    ...LAILA_INVITE,
    groomName: PORTFOLIO_DEMO_GROOM,
    brideName: PORTFOLIO_DEMO_BRIDE,
    groomFullName: PORTFOLIO_DEMO_GROOM,
    brideFullName: PORTFOLIO_DEMO_BRIDE,
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
 * Photos in `public/lela kb/gallery/` (png, jpg, webp, gif).
 * Drop files in that folder — they are picked up automatically, sorted by filename.
 */
const LAILA_GALLERY_MODULES = import.meta.glob(
  "../../../public/lela kb/gallery/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

export const LAILA_GALLERY_IMAGE_URLS: readonly string[] = Object.entries(LAILA_GALLERY_MODULES)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  .map(([, url]) => url);

function lailaEventLocation(invite: Pick<LailaInvite, "venue" | "address">): string {
  return invite.address ? `${invite.venue}, ${invite.address}` : invite.venue;
}

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

export function getLailaGoogleCalendarUrl(invite: LailaInvite = LAILA_INVITE): string | null {
  if (!lailaHasEventDate(invite)) return null;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${lailaCoupleLabel(invite)}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: lailaInvitationDetails(invite),
    location: lailaEventLocation(invite),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadLailaIcs(invite: LailaInvite = LAILA_INVITE): void {
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
    `DESCRIPTION:${escapeIcsText(lailaInvitationDetails(invite))}`,
    `LOCATION:${escapeIcsText(lailaEventLocation(invite))}`,
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
