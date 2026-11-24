import { getLailaWishesScriptUrl } from "./lailaInviteData";

/** Google Drive file id for an uploaded wish photo (sheet may store drive:, lh3, uc?, etc.). */
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

export function lh3WishImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w1200`;
}

export function driveThumbnailWishImageUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1200`;
}

/** Apps Script proxy — use as fallback after redeploying lailaWishesOnlyAppsScript.gs */
export function wishImageProxyUrl(fileId: string): string {
  const base = getLailaWishesScriptUrl();
  if (!base || !fileId) return "";
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}action=wishImage&id=${encodeURIComponent(fileId)}`;
}

/** Primary display URL (works without redeploying Apps Script). */
export function normalizeWishImageUrl(url: string | undefined): string {
  const id = extractWishImageDriveId(url ?? "");
  return id ? lh3WishImageUrl(id) : "";
}

/** Ordered fallbacks for &lt;img onError&gt; (GitHub Pages / mobile). */
export function wishImageFallbackUrls(url: string | undefined): string[] {
  const id = extractWishImageDriveId(url ?? "");
  if (!id) return [];
  const proxy = wishImageProxyUrl(id);
  return proxy
    ? [lh3WishImageUrl(id), driveThumbnailWishImageUrl(id), proxy]
    : [lh3WishImageUrl(id), driveThumbnailWishImageUrl(id)];
}

export function mapWishImageField<T extends { imageUrl?: string }>(wish: T): T {
  const id = extractWishImageDriveId(wish.imageUrl ?? "");
  const imageUrl = id ? lh3WishImageUrl(id) : undefined;
  return imageUrl ? { ...wish, imageUrl } : { ...wish, imageUrl: undefined };
}