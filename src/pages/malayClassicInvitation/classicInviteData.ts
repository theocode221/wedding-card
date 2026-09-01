import {
  PORTFOLIO_DEMO_ADDRESS,
  PORTFOLIO_DEMO_BRIDE,
  PORTFOLIO_DEMO_GROOM,
  PORTFOLIO_DEMO_MAPS_URL,
  PORTFOLIO_DEMO_VENUE,
} from "../../data/portfolioDemoNames";

export const CLASSIC_PATH = "/malay-classic";

/**
 * Cover photo — soft traditional garden feel (placeholder until client supplies theirs).
 * Soft florals are drawn in ClassicDecor (SVG), not the Laila watercolor set.
 */
export const CLASSIC_COVER_PHOTO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85";

export const CLASSIC_TAGLINE_JAWI = "وليمة العرس";
export const CLASSIC_SALAM_KHAT = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ";
export const CLASSIC_SALAM_LATIN = "Assalamualaikum Warahmatullahi Wabarakatuh";

export const CLASSIC_INVITE = {
  brideName: "Aisyah",
  groomName: "Imran",
  fatherName: "Ahmad bin Hassan",
  motherName: "Siti Aminah binti Ismail",
  invitation:
    "Dengan penuh rasa syukur ke hadrat Allah S.W.T,\nkami dengan segala hormatnya menjemput\nDato’ / Datin / Tuan / Puan / Encik / Cik\nke majlis perkahwinan puteri kami",
  coupleNote: "dengan pilihan hatinya",
  brideFullName: "Nur Aisyah",
  groomFullName: "Muhammad Imran",
  dayLabel: "Sabtu",
  date: "14.03.2027",
  timeLabel: "11:00 pagi – 4:00 petang",
  venue: "Dewan Seri Melati",
  address: "Shah Alam, Selangor",
  weddingDateTime: "2027-03-14T11:00:00",
  durationHours: 5,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Dewan+Seri+Melati+Shah+Alam",
  wazeUrl:
    "https://www.waze.com/ul?q=Dewan%20Seri%20Melati%20Shah%20Alam&navigate=yes",
  footer: "Kehadiran dan doa restu anda amat dialu-alukan.",
} as const;

export type ClassicAturcaraIcon = "rings" | "lantern" | "couple" | "moon";

export type ClassicAturcaraItem = {
  time: string;
  title: string;
  icon: ClassicAturcaraIcon;
};

export const CLASSIC_ATURCARA: readonly ClassicAturcaraItem[] = [
  { time: "8:00 AM", title: "Akad Nikah", icon: "rings" },
  { time: "11:00 AM", title: "Majlis Bermula", icon: "lantern" },
  { time: "12:00 PM", title: "Ketibaan Pengantin", icon: "couple" },
  { time: "4:00 PM", title: "Majlis Berakhir", icon: "moon" },
] as const;

export type ClassicWish = {
  name: string;
  message: string;
};

/** Demo wishes for the spotlight — replace with live RSVP ucapan later. */
export const CLASSIC_DEMO_WISHES: readonly ClassicWish[] = [
  {
    name: "Farah & Family",
    message: "Semoga berbahagia hingga ke Jannah. Doa kami sentiasa menyertai kalian.",
  },
  {
    name: "Hakim",
    message: "Tahniah buat pengantin baru. Semoga rumah tangga dilimpahi keberkatan.",
  },
  {
    name: "Aina",
    message: "Selamat pengantin baru. Semoga menjadi pasangan yang dikasihi Ilahi.",
  },
  {
    name: "Rizal & Amira",
    message: "Alhamdulillah. Doa restu kami buat Imran & Aisyah — bahagia dunia akhirat.",
  },
] as const;

export type ClassicWhatsappContact = {
  name: string;
  displayNumber: string;
  whatsappUrl: string;
};

export const CLASSIC_WHATSAPP: readonly ClassicWhatsappContact[] = [
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

export type ClassicInvite = {
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

export function classicCoupleLabel(
  invite: Pick<ClassicInvite, "brideName" | "groomName"> = CLASSIC_INVITE,
): string {
  return `${invite.brideName} & ${invite.groomName}`;
}

export function classicInviteForPreview(isPreview: boolean): ClassicInvite {
  if (!isPreview) return { ...CLASSIC_INVITE };
  return {
    ...CLASSIC_INVITE,
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

export function classicPageTitle(
  invite: Pick<ClassicInvite, "brideName" | "groomName">,
): string {
  return `Walimatul Urus — ${classicCoupleLabel(invite)}`;
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

export function classicHasEventDate(
  invite: Pick<ClassicInvite, "weddingDateTime"> = CLASSIC_INVITE,
): boolean {
  return Boolean(invite.weddingDateTime.trim());
}

export function getClassicGoogleCalendarUrl(invite: ClassicInvite = CLASSIC_INVITE): string | null {
  if (!classicHasEventDate(invite)) return null;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${classicCoupleLabel(invite)}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: invite.invitation,
    location: `${invite.venue}, ${invite.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadClassicIcs(invite: ClassicInvite = CLASSIC_INVITE): void {
  if (!classicHasEventDate(invite)) return;
  const start = new Date(invite.weddingDateTime);
  const end = new Date(start.getTime() + invite.durationHours * 60 * 60 * 1000);
  const title = `Walimatul Urus — ${classicCoupleLabel(invite)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//Malay Classic//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:malay-classic-${start.getTime()}@theocodewedding`,
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
  a.download = "walimatul-urus.ics";
  a.click();
  URL.revokeObjectURL(url);
}
