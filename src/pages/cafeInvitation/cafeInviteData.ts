import {
  PORTFOLIO_DEMO_BRIDE,
  PORTFOLIO_DEMO_GROOM,
} from "../../data/portfolioDemoNames";

export const CAFE_PATH = "/cafe";

export const CAFE_INVITE = {
  brideName: "Hana",
  groomName: "Danial",
  cafeName: "THEOCODE CAFÉ",
  kicker: "Today's special",
  invitation:
    "Dengan penuh kesyukuran, kami menjemput anda duduk sekejap bersama kami — kopi panas, doa yang lembut, dan majlis yang penuh rasa.",
  dayLabel: "Ahad",
  date: "09.05.2027",
  timeLabel: "11:30 pagi – 4:00 petang",
  venue: "Garden Terrace Café",
  address: "Petaling Jaya",
  weddingDateTime: "2027-05-09T11:30:00",
  durationHours: 4.5,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Petaling+Jaya",
  footer: "Meja anda sudah diketepikan. Jumpa di majlis.",
} as const;

export type CafeInvite = {
  brideName: string;
  groomName: string;
  cafeName: string;
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

export function cafeCoupleLabel(invite: Pick<CafeInvite, "groomName" | "brideName"> = CAFE_INVITE): string {
  return `${invite.groomName} & ${invite.brideName}`;
}

export function cafeInviteForPreview(isPreview: boolean): CafeInvite {
  if (!isPreview) return CAFE_INVITE;
  return {
    ...CAFE_INVITE,
    groomName: PORTFOLIO_DEMO_GROOM,
    brideName: PORTFOLIO_DEMO_BRIDE,
  };
}

export function cafePageTitle(invite: Pick<CafeInvite, "groomName" | "brideName">): string {
  return `Jemputan — ${cafeCoupleLabel(invite)}`;
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

export function cafeHasEventDate(invite: Pick<CafeInvite, "weddingDateTime"> = CAFE_INVITE): boolean {
  return Boolean(invite.weddingDateTime.trim());
}

export function getCafeGoogleCalendarUrl(invite: CafeInvite = CAFE_INVITE): string | null {
  if (!cafeHasEventDate(invite)) return null;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${cafeCoupleLabel(invite)}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: invite.invitation,
    location: `${invite.venue}, ${invite.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadCafeIcs(invite: CafeInvite = CAFE_INVITE): void {
  if (!cafeHasEventDate(invite)) return;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const title = `Walimatul Urus — ${cafeCoupleLabel(invite)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//Cafe//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-cafe-${toUtcStamp(start)}@wedding-card`,
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
  a.download = "jemputan-cafe.ics";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
