import { getLailaWishesScriptUrl } from "./lailaInviteData";
import type { LailaWish } from "./lailaWishesDemoData";

export type LailaLinkPreview = {
  title: string;
  description: string;
  imageUrl: string;
  priceHint: string;
};

type JsonpPayload<T> = {
  ok?: boolean;
  error?: string;
} & T;

function jsonpGet<T>(baseUrl: string, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams(params);
  return new Promise((resolve, reject) => {
    const callback = `lailaWish_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Request timed out."));
    }, 22000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete (window as unknown as Record<string, unknown>)[callback];
      script.remove();
    }

    (window as unknown as Record<string, unknown>)[callback] = (payload: JsonpPayload<T>) => {
      cleanup();
      if (!payload || payload.ok === false) {
        reject(new Error(payload?.error || "Request failed."));
        return;
      }
      resolve(payload as T);
    };

    const script = document.createElement("script");
    script.src = `${baseUrl}?${query.toString()}&callback=${encodeURIComponent(callback)}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error("Could not reach the wishlist service."));
    };
    document.body.appendChild(script);
  });
}

export function fetchLailaWishes(): Promise<LailaWish[]> {
  const base = getLailaWishesScriptUrl();
  if (!base) return Promise.reject(new Error("Wishlist script URL missing."));
  return jsonpGet<{ wishes: LailaWish[] }>(base, { action: "wishlist" }).then((p) =>
    Array.isArray(p.wishes) ? p.wishes : [],
  );
}

export async function grantLailaWish(payload: { wishId: string; name: string; note?: string }): Promise<void> {
  const url = getLailaWishesScriptUrl();
  if (!url) throw new Error("Wishlist script URL missing.");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "grant",
      wishId: payload.wishId,
      name: payload.name.trim(),
      note: payload.note?.trim() ?? "",
    }),
  });

  const text = await response.text();
  let result: { ok?: boolean; error?: string };
  try {
    result = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    if (!response.ok) throw new Error("Could not record your grant. Please try again.");
    return;
  }
  if (!result.ok) throw new Error(result.error || "Could not record your grant.");
}

export function unfurlLailaProductLink(url: string): Promise<LailaLinkPreview> {
  const base = getLailaWishesScriptUrl();
  if (!base) return Promise.reject(new Error("Wishlist script URL missing."));
  return jsonpGet<{ preview: LailaLinkPreview }>(base, { action: "unfurl", url: url.trim() }).then(
    (p) =>
      p.preview ?? {
        title: "",
        description: "",
        imageUrl: "",
        priceHint: "",
      },
  );
}

/** Fill image / title / price from shop links via Apps Script (cannot run in the browser). */
export async function enrichLailaWishesWithPreviews(wishes: LailaWish[]): Promise<LailaWish[]> {
  const scriptUrl = getLailaWishesScriptUrl();
  if (!scriptUrl) return wishes;

  const next = wishes.map((w) => ({ ...w }));
  await Promise.all(
    next.map(async (wish, index) => {
      if (!wish.link?.trim()) return;
      const needsImage = !wish.imageUrl?.trim();
      const needsTitle = !wish.title?.trim();
      const needsPrice = !wish.priceHint?.trim();
      if (!needsImage && !needsTitle && !needsPrice) return;

      try {
        const preview = await unfurlLailaProductLink(wish.link);
        next[index] = {
          ...wish,
          imageUrl: needsImage ? preview.imageUrl || wish.imageUrl : wish.imageUrl,
          title: needsTitle ? preview.title || wish.title : wish.title,
          description: wish.description || preview.description,
          priceHint: needsPrice ? preview.priceHint || wish.priceHint : wish.priceHint,
        };
      } catch {
        /* keep manual fields */
      }
    }),
  );
  return next;
}