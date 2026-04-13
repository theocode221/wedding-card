/** Single source for calendar export — matches invitation copy (Malaysia time). */

/** ISO local — for countdown (same day as Butiran majlis). */
export const WEDDING_EVENT_START_ISO = "2026-12-20T11:00:00";

export const WEDDING_EVENT_TITLE = "Walimatul Urus — Nabil & Anis";

export const WEDDING_EVENT_DESCRIPTION =
  "Jemputan perkahwinan Nabil & Anis. Kehadiran dan doa anda amat dialu-alukan.";

export const WEDDING_EVENT_LOCATION =
  "Dewan Perdana Felda, Jalan Perdana, 50480 Kuala Lumpur, Malaysia";

/** 20 Dec 2026, 11:00–16:00 Malaysia (UTC+8) → Zulu for Google / ICS */
const START_UTC = "20261220T030000Z";
const END_UTC = "20261220T080000Z";

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function getGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: WEDDING_EVENT_TITLE,
    dates: `${START_UTC}/${END_UTC}`,
    details: WEDDING_EVENT_DESCRIPTION,
    location: WEDDING_EVENT_LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildWeddingIcs(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-nabil-anis-20261220@wedding-card`,
    `DTSTAMP:${formatIcsUtcStamp(new Date())}`,
    `DTSTART:${START_UTC}`,
    `DTEND:${END_UTC}`,
    `SUMMARY:${escapeIcsText(WEDDING_EVENT_TITLE)}`,
    `DESCRIPTION:${escapeIcsText(WEDDING_EVENT_DESCRIPTION)}`,
    `LOCATION:${escapeIcsText(WEDDING_EVENT_LOCATION)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function formatIcsUtcStamp(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${h}${min}${s}Z`;
}

export function downloadWeddingIcs(): void {
  const body = buildWeddingIcs();
  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jemputan-nabil-anis.ics";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
