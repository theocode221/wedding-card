/** WhatsApp contacts for “Hubungi Kami”. Malaysian numbers → international wa.me. */

export type WhatsAppContact = {
  name: string;
  /** Display number as provided by the couple */
  displayNumber: string;
  /** Full wa.me URL */
  url: string;
};

function toWaMeUrl(localMalaysiaMobile: string): string {
  const digits = localMalaysiaMobile.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `60${digits.slice(1)}` : digits;
  return `https://wa.me/${international}`;
}

export const WHATSAPP_CONTACTS: readonly WhatsAppContact[] = [
  {
    name: "Naim",
    displayNumber: "011-2674 5787",
    url: toWaMeUrl("01126745787"),
  },
  {
    name: "Nadhirah",
    displayNumber: "011-5745 1981",
    url: toWaMeUrl("01157451981"),
  },
] as const;

/** @deprecated Prefer WHATSAPP_CONTACTS — kept for older single-link usages */
export const WHATSAPP_CONTACT_URL = WHATSAPP_CONTACTS[0].url;
