import type { WeddingEventData } from "../../types/event";

const gallery = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "https://images.unsplash.com/photo-1522673606160-de4fd0a292db?w=800&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  "https://images.unsplash.com/photo-1529636799528-21b6d622bb1e?w=800&q=80",
] as const;

/**
 * Self-contained payload for the Royal Maroon invitation only.
 * `theme` satisfies the shared `Event` type but is not read by this layout.
 */
export const ROYAL_MAROON_INVITE: WeddingEventData = {
  brideName: "NADHIRAH",
  groomName: "Nabil",
  theme: "elegant",
  date: "20 Disember 2026",
  venue: "Dewan Seri Cinta",
  address: "Kuala Lumpur, Malaysia",
  weddingDateTime: "2026-12-20T11:00:00",
  dateTimeLabel: "20 Disember 2026 · 11:00 pagi",
  invitation:
    "Dengan penuh kesyukuran, kami menjemput anda hadir ke majlis walimatul urus kami.",
  footer: "Terima kasih atas doa dan kehadiran anda.",
  mapsUrl: "https://maps.google.com",
  whatsappUrl: "https://wa.me/60123456789",
  gallery: [...gallery],
  heroImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85",
  tagline: "Walimatul Urus",
};

export function royalMaroonRsvpWhatsappUrl(event: Pick<WeddingEventData, "groomName" | "brideName" | "whatsappUrl">): string {
  const base = event.whatsappUrl ?? "https://wa.me/";
  const url = new URL(base);
  const text = `Assalamualaikum. Saya ingin memaklumkan kehadiran saya ke majlis Walimatul Urus ${event.groomName} & ${event.brideName}.`;
  url.searchParams.set("text", text);
  return url.toString();
}
