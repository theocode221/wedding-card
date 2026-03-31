export type ThemeId = "traditional" | "floral" | "elegant";

/** Core event fields (API / CMS shape) */
export type Event = {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  address: string;
  gallery: string[];
  theme: ThemeId;
};

/** Full wedding payload used by invitation templates */
export type WeddingEventData = Event & {
  weddingDateTime: string;
  invitation: string;
  heroImage: string;
  footer: string;
  mapsUrl: string;
  dateTimeLabel: string;
  /** Optional hero subtitle (e.g. formal Malay invitation line) */
  tagline?: string;
};

export type TemplateProps = {
  event: WeddingEventData;
  onRsvp: () => void;
};
