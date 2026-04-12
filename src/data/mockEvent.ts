import type { ThemeId, WeddingEventData } from "../types/event";

const gallery = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "https://images.unsplash.com/photo-1522673606160-de4fd0a292db?w=800&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  "https://images.unsplash.com/photo-1529636799528-21b6d622bb1e?w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
] as const;

const base: Omit<WeddingEventData, "theme"> = {
  brideName: "ANIS",
  groomName: "NABIL",
  date: "Saturday, 20 December 2026",
  venue: "The Garden Pavilion",
  address: "Jalan Damai 12, 50480 Kuala Lumpur, Malaysia",
  gallery: [...gallery],
  weddingDateTime: "2026-12-20T15:00:00",
  invitation:
    "Together with their families, we invite you to celebrate our wedding and share in our joy as we begin this new chapter together.",
  heroImage: "https://images.unsplash.com/photo-1522673606160-de4fd0a292db?w=1920&q=85",
  footer: "We look forward to celebrating with you",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Garden+Pavilion+Kuala+Lumpur",
  dateTimeLabel: "Saturday, 20 December 2026 · 3:00 PM",
};

/** Default mock — change `theme` to preview a different template, or use the dev toggle */
export const MOCK_WEDDING_EVENT: WeddingEventData = {
  ...base,
  theme: "floral",
};

export function weddingEventWithTheme(theme: ThemeId): WeddingEventData {
  return { ...MOCK_WEDDING_EVENT, theme };
}

export function coupleLabel(event: Pick<WeddingEventData, "groomName" | "brideName">): string {
  return `${event.groomName} & ${event.brideName}`;
}

/**
 * Example payload tuned for the Traditional Malay template (batik / forest palette).
 * Use with `theme: "traditional"` or `weddingEventWithTheme("traditional")`.
 */
export const MOCK_TRADITIONAL_WEDDING_EVENT: WeddingEventData = {
  ...base,
  theme: "traditional",
  tagline: "Dengan penuh hormat, kami berbesar hati menjemput ke majlis perkahwinan kami.",
  heroImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85",
  invitation:
    "Together with our families, we joyfully invite you to witness and celebrate our marriage. Your presence would honour us greatly as we begin this blessed journey together.",
};
