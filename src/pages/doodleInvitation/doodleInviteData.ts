import {
  PORTFOLIO_DEMO_BRIDE,
  PORTFOLIO_DEMO_GROOM,
} from "../../data/portfolioDemoNames";

export const DOODLE_PATH = "/doodle";
export const DOODLE_PASTEL_PATH = "/doodle-pastel";

export const DOODLE_INVITE = {
  brideName: "Lina",
  groomName: "Adam",
  kicker: "We're getting married",
  invitation:
    "Dengan penuh kesyukuran, kami menjemput anda meriahkan majlis walimatul urus kami — datang dengan senyuman, doa, dan baju keselesaan.",
  dayLabel: "Sabtu",
  date: "12.12.2026",
  timeLabel: "11:00 pagi – 4:00 petang",
  venue: "Garden Hall",
  address: "Kuala Lumpur",
  weddingDateTime: "2026-12-12T11:00:00",
  durationHours: 5,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Garden+Hall+Kuala+Lumpur",
  footer: "Kehadiran dan doa restu anda amat dialu-alukan.",
} as const;

export type DoodleInvite = {
  brideName: string;
  groomName: string;
  kicker: string;
  invitation: string;
  dayLabel: string;
  date: string;
  timeLabel: string;
  venue: string;
  address: string;
  weddingDateTime: string;
  durationHours: number;
  mapsUrl: string;
  footer: string;
};

export function doodleCoupleLabel(invite: Pick<DoodleInvite, "groomName" | "brideName"> = DOODLE_INVITE): string {
  return `${invite.groomName} & ${invite.brideName}`;
}

export function doodleInviteForPreview(isPreview: boolean): DoodleInvite {
  if (!isPreview) return DOODLE_INVITE;
  return {
    ...DOODLE_INVITE,
    groomName: PORTFOLIO_DEMO_GROOM,
    brideName: PORTFOLIO_DEMO_BRIDE,
  };
}

export function doodlePageTitle(invite: Pick<DoodleInvite, "groomName" | "brideName">): string {
  return `Jemputan — ${doodleCoupleLabel(invite)}`;
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

export function doodleHasEventDate(invite: Pick<DoodleInvite, "weddingDateTime"> = DOODLE_INVITE): boolean {
  return Boolean(invite.weddingDateTime.trim());
}

export function getDoodleGoogleCalendarUrl(invite: DoodleInvite = DOODLE_INVITE): string | null {
  if (!doodleHasEventDate(invite)) return null;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${doodleCoupleLabel(invite)}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: invite.invitation,
    location: `${invite.venue}, ${invite.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadDoodleIcs(invite: DoodleInvite = DOODLE_INVITE): void {
  if (!doodleHasEventDate(invite)) return;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const title = `Walimatul Urus — ${doodleCoupleLabel(invite)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//Doodle//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-doodle-${toUtcStamp(start)}@wedding-card`,
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
  a.download = "jemputan-doodle.ics";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
