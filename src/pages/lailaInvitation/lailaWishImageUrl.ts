/** Make wish images display on GitHub Pages (Drive / bad redirect links). */
export function normalizeWishImageUrl(url: string | undefined): string {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return "";

  const idFromQuery = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];
  const idFromFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  const idFromLh = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  const driveId = idFromQuery || idFromFile || idFromLh;
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}=w1200`;
  }

  if (/^https?:\/\/sl\.bing\.net\//i.test(trimmed)) return "";
  if (/bing\.com\/images\/search/i.test(trimmed)) return "";

  return trimmed;
}

export function mapWishImageField<T extends { imageUrl?: string }>(wish: T): T {
  const imageUrl = normalizeWishImageUrl(wish.imageUrl);
  return imageUrl ? { ...wish, imageUrl } : { ...wish, imageUrl: undefined };
}