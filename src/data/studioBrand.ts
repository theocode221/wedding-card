/** Studio branding — update here for footer links and the portfolio page. */
export const STUDIO_HANDLE = "theocodewedding";
export const STUDIO_NAME = "Theocode Wedding";
export const STUDIO_PORTFOLIO_PATH = "/theocodewedding";

/** Studio WhatsApp (Malaysia local → wa.me international). */
export const STUDIO_WHATSAPP_DISPLAY = "011-3347 0207";
export const STUDIO_WHATSAPP_URL = "https://wa.me/601133470207";

export type StudioLocale = "en" | "ms";

export type StudioLocalizedText = {
  en: string;
  ms: string;
};

export type StudioPackage = {
  id: string;
  priceLabel: string;
  name: StudioLocalizedText;
  blurb: StudioLocalizedText;
  features: readonly StudioLocalizedText[];
};

export const STUDIO_UI = {
  pricingTitle: { en: "Pricing", ms: "Harga" },
  playPreview: { en: "Play preview", ms: "Main pratonton" },
  openDemo: { en: "Open demo →", ms: "Buka demo →" },
  bookAsk: { en: "Book / enquire:", ms: "Tempah / tanya:" },
  back: { en: "← Back", ms: "← Kembali" },
  langEn: { en: "EN", ms: "EN" },
  langMs: { en: "BM", ms: "BM" },
  moreDesigns: {
    en: "More designs will be added… stay tuned.",
    ms: "Lebih banyak reka bentuk akan ditambah… nantikan.",
  },
  dashboardTitle: { en: "RSVP Dashboard demo", ms: "Demo Dashboard RSVP" },
  dashboardBlurb: {
    en: "See attendance stats, guest wishes, and PDF export — sample data only.",
    ms: "Lihat statistik kehadiran, ucapan tetamu, dan eksport PDF — data contoh sahaja.",
  },
  dashboardCta: { en: "Open dashboard demo →", ms: "Buka demo dashboard →" },
} as const;

export const STUDIO_PACKAGES: readonly StudioPackage[] = [
  {
    id: "asas",
    priceLabel: "RM30",
    name: { en: "Basic", ms: "Asas" },
    blurb: {
      en: "Digital invitation, ready to share.",
      ms: "Kad jemputan digital, siap dikongsi.",
    },
    features: [
      { en: "Opening animation", ms: "Animasi pembuka" },
      { en: "Google Maps location", ms: "Lokasi Google Maps" },
      { en: "Add to calendar (Apple / Google)", ms: "Tambah ke kalendar (Apple / Google)" },
      { en: "RSVP (Google Form)", ms: "RSVP (Google Form)" },
      { en: "WhatsApp to couple", ms: "WhatsApp pengantin" },
      { en: "Gallery page", ms: "Halaman galeri" },
      {
        en: "Theme pick / custom design (add-on may apply)",
        ms: "Pilih tema / custom design (mungkin ada caj tambahan)",
      },
    ],
  },
  {
    id: "lengkap",
    priceLabel: "RM45",
    name: { en: "Complete", ms: "Lengkap" },
    blurb: {
      en: "Everything in Basic, plus RSVP tools & wishes.",
      ms: "Semua dalam Asas, plus RSVP & ucapan.",
    },
    features: [
      { en: "Everything in Basic", ms: "Semua dalam pakej Asas" },
      { en: "RSVP dashboard", ms: "Dashboard RSVP" },
      {
        en: "Guest wishes, saved as PDF",
        ms: "Ucapan tetamu, simpan dalam PDF",
      },
    ],
  },
] as const;

export function studioText(copy: StudioLocalizedText, locale: StudioLocale): string {
  return copy[locale];
}
