import {
  PORTFOLIO_DEMO_BRIDE,
  PORTFOLIO_DEMO_GROOM,
} from "../../data/portfolioDemoNames";

export const TRAVELLERS_PATH = "/travellers";

export const TRAVELLERS_INVITE = {
  brideName: "Farah",
  groomName: "Aiman",
  kicker: "Our next adventure",
  invitation:
    "Dengan penuh kesyukuran, kami menjemput anda menjadi saksi perjalanan baru kami — packing senyuman, doa, dan baju keselesaan.",
  dayLabel: "Sabtu",
  date: "14.03.2027",
  timeLabel: "11:00 pagi – 4:00 petang",
  venue: "Sky Pavilion",
  address: "Kuala Lumpur",
  weddingDateTime: "2027-03-14T11:00:00",
  durationHours: 5,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sky+Pavilion+Kuala+Lumpur",
  footer: "Boarding pass kehadiran anda amat dialu-alukan.",
} as const;

export type TravellersInvite = {
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

export function travellersCoupleLabel(
  invite: Pick<TravellersInvite, "groomName" | "brideName"> = TRAVELLERS_INVITE,
): string {
  return `${invite.groomName} & ${invite.brideName}`;
}

export function travellersInviteForPreview(isPreview: boolean): TravellersInvite {
  if (!isPreview) return TRAVELLERS_INVITE;
  return {
    ...TRAVELLERS_INVITE,
    groomName: PORTFOLIO_DEMO_GROOM,
    brideName: PORTFOLIO_DEMO_BRIDE,
  };
}

export function travellersPageTitle(
  invite: Pick<TravellersInvite, "groomName" | "brideName">,
): string {
  return `Jemputan — ${travellersCoupleLabel(invite)}`;
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

export function travellersHasEventDate(
  invite: Pick<TravellersInvite, "weddingDateTime"> = TRAVELLERS_INVITE,
): boolean {
  return Boolean(invite.weddingDateTime.trim());
}

export function getTravellersGoogleCalendarUrl(
  invite: TravellersInvite = TRAVELLERS_INVITE,
): string | null {
  if (!travellersHasEventDate(invite)) return null;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${travellersCoupleLabel(invite)}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: invite.invitation,
    location: `${invite.venue}, ${invite.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadTravellersIcs(invite: TravellersInvite = TRAVELLERS_INVITE): void {
  if (!travellersHasEventDate(invite)) return;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const title = `Walimatul Urus — ${travellersCoupleLabel(invite)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//Travellers//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-travellers-${toUtcStamp(start)}@wedding-card`,
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
  a.download = "jemputan-travellers.ics";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
