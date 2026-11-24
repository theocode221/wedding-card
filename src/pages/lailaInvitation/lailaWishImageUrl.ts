import { getLailaWishesScriptUrl } from "./lailaInviteData";

/** Google Drive file id for an uploaded wish photo (sheet may store lh3, uc?, or proxy URLs). */
export function extractWishImageDriveId(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^drive:/i.test(trimmed)) return trimmed.replace(/^drive:/i, "");

  const wishImage = trimmed.match(/[?&]action=wishImage&id=([a-zA-Z0-9_-]+)/i)?.[1];
  if (wishImage) return wishImage;

  const fromQuery = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/)?.[1];
  if (fromQuery && /drive\.google/i.test(trimmed)) return fromQuery;

  const fromFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  if (fromFile) return fromFile;

  const fromLh = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  if (fromLh) return fromLh;

  return "";
}

/** Served by Apps Script doGet ?action=wishImage — reliable on GitHub Pages and mobile. */
export function wishImageProxyUrl(fileId: string): string {
  const base = getLailaWishesScriptUrl();
  if (!base || !fileId) return "";
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}action=wishImage&id=${encodeURIComponent(fileId)}`;
}

export function normalizeWishImageUrl(url: string | undefined): string {
  const id = extractWishImageDriveId(url ?? "");
  return id ? wishImageProxyUrl(id) : "";
}

export function mapWishImageField<T extends { imageUrl?: string }>(wish: T): T {
  const imageUrl = normalizeWishImageUrl(wish.imageUrl);
  return imageUrl ? { ...wish, imageUrl } : { ...wish, imageUrl: undefined };
}