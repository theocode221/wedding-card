import {
  PORTFOLIO_DEMO_ADDRESS,
  PORTFOLIO_DEMO_BRIDE,
  PORTFOLIO_DEMO_GROOM,
  PORTFOLIO_DEMO_MAPS_URL,
  PORTFOLIO_DEMO_VENUE,
} from "../../data/portfolioDemoNames";
import { publicUrl } from "../../lib/publicAsset";

export const PAAN_PATH = "/paan";

/** Lace frame asset — copper on black (`public/paan/traditional.png`). */
export const PAAN_TRADITIONAL_FRAME = publicUrl("paan/traditional.png");

export const PAAN_TAGLINE_JAWI = "وليمة العرس";
export const PAAN_SALAM_KHAT = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ";
export const PAAN_SALAM_LATIN = "Assalamualaikum Warahmatullahi Wabarakatuh";

export const PAAN_INVITE = {
  brideName: "Atheela",
  groomName: "Farhan",
  fatherName: "nama ayah",
  motherName: "nama mak",
  invitation:
    "Dengan penuh rasa syukur ke hadrat Allah S.W.T,\nkami dengan segala hormatnya menjemput\nDato’ / Datin / Tuan / Puan / Encik / Cik\nke majlis perkahwinan puteri kami",
  coupleNote: "dengan pilihan hatinya",
  brideFullName: "NURIN ATHEELA BINTI HAIRUDIN",
  groomFullName: "MOHAMAD FARHAN HAIKAL BIN FARID",
  dayLabel: "Jumaat",
  date: "26.12.2025",
  timeLabel: "11:00 pagi – 4:00 petang",
  venue: "Masjid Kampung Parit Terus",
  address: "Benut, Pontian",
  weddingDateTime: "2025-12-26T11:00:00",
  durationHours: 5,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Masjid+Kampung+Parit+Terus+Benut+Pontian",
  wazeUrl:
    "https://www.waze.com/ul?q=Masjid%20Kampung%20Parit%20Terus%20Benut%20Pontian&navigate=yes",
  footer: "Kehadiran dan doa restu anda amat dialu-alukan.",
} as const;

export type PaanAturcaraItem = {
  time: string;
  title: string;
};

export const PAAN_ATURCARA: readonly PaanAturcaraItem[] = [
  { time: "8:00 AM", title: "Akad Nikah" },
  { time: "11:00 AM", title: "Majlis Bermula" },
  { time: "12:00 PM", title: "Ketibaan Pengantin" },
  { time: "4:00 PM", title: "Majlis Berakhir" },
] as const;

export type PaanWhatsappContact = {
  name: string;
  displayNumber: string;
  whatsappUrl: string;
};

export const PAAN_WHATSAPP: readonly PaanWhatsappContact[] = [
  {
    name: "Ibu",
    displayNumber: "012-000 0000",
    whatsappUrl: "https://wa.me/60120000000",
  },
  {
    name: "Ayah",
    displayNumber: "013-000 0000",
    whatsappUrl: "https://wa.me/60130000000",
  },
] as const;

export type PaanInvite = {
  brideName: string;
  groomName: string;
  fatherName: string;
  motherName: string;
  invitation: string;
  coupleNote: string;
  brideFullName: string;
  groomFullName: string;
  dayLabel: string;
  date: string;
  timeLabel: string;
  venue: string;
  address: string;
  weddingDateTime: string;
  durationHours: number;
  mapsUrl: string;
  wazeUrl: string;
  footer: string;
};

export function paanCoupleLabel(
  invite: Pick<PaanInvite, "brideName" | "groomName"> = PAAN_INVITE,
): string {
  return `${invite.groomName} & ${invite.brideName}`;
}

export function paanInviteForPreview(isPreview: boolean): PaanInvite {
  if (!isPreview) return { ...PAAN_INVITE };
  return {
    ...PAAN_INVITE,
    brideName: PORTFOLIO_DEMO_BRIDE,
    groomName: PORTFOLIO_DEMO_GROOM,
    brideFullName: PORTFOLIO_DEMO_BRIDE,
    groomFullName: PORTFOLIO_DEMO_GROOM,
    fatherName: "Ayah Pengantin",
    motherName: "Ibu Pengantin",
    venue: PORTFOLIO_DEMO_VENUE,
    address: PORTFOLIO_DEMO_ADDRESS,
    mapsUrl: PORTFOLIO_DEMO_MAPS_URL,
  };
}

export function paanPageTitle(invite: Pick<PaanInvite, "brideName" | "groomName">): string {
  return `Walimatul Urus — ${paanCoupleLabel(invite)}`;
}

export function paanHasEventDate(invite: Pick<PaanInvite, "weddingDateTime"> = PAAN_INVITE): boolean {
  return Boolean(invite.weddingDateTime.trim());
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

export function getPaanGoogleCalendarUrl(invite: PaanInvite = PAAN_INVITE): string | null {
  if (!paanHasEventDate(invite)) return null;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${paanCoupleLabel(invite)}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: invite.invitation,
    location: `${invite.venue}, ${invite.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadPaanIcs(invite: PaanInvite = PAAN_INVITE): void {
  if (!paanHasEventDate(invite)) return;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const title = `Walimatul Urus — ${paanCoupleLabel(invite)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//Paan Traditional//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:paan-traditional-${start.getTime()}@theocodewedding`,
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
  a.download = "walimatul-urus-paan.ics";
  a.click();
  URL.revokeObjectURL(url);
}
