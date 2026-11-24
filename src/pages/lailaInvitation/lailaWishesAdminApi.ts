import { getLailaWishesScriptUrl } from "./lailaInviteData";
import type { LailaWish } from "./lailaWishesDemoData";

export type LailaWishAdminRow = LailaWish & {
  active?: boolean;
  sort?: number;
};

type PostResult = { ok?: boolean; error?: string; id?: string; imageUrl?: string };

function jsonpGet<T>(params: Record<string, string>): Promise<T> {
  const base = getLailaWishesScriptUrl();
  if (!base) return Promise.reject(new Error("Wishlist script URL missing."));
  const query = new URLSearchParams(params);
  return new Promise((resolve, reject) => {
    const callback = `lailaWishAdm_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Request timed out."));
    }, 22000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete (window as unknown as Record<string, unknown>)[callback];
      script.remove();
    }

    (window as unknown as Record<string, unknown>)[callback] = (payload: { ok?: boolean; error?: string; wishes?: LailaWishAdminRow[] }) => {
      cleanup();
      if (!payload || payload.ok === false) {
        reject(new Error(payload?.error || "Request failed."));
        return;
      }
      resolve(payload as T);
    };

    const script = document.createElement("script");
    script.src = `${base}?${query.toString()}&callback=${encodeURIComponent(callback)}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error("Could not reach the wishlist service."));
    };
    document.body.appendChild(script);
  });
}

export function fetchLailaWishesAdmin(): Promise<LailaWishAdminRow[]> {
  return jsonpGet<{ wishes: LailaWishAdminRow[] }>({ action: "wishlistAdmin" }).then((p) =>
    Array.isArray(p.wishes) ? p.wishes : [],
  );
}

async function postWishScript(body: Record<string, unknown>): Promise<PostResult> {
  const url = getLailaWishesScriptUrl();
  if (!url) throw new Error("Wishlist script URL missing.");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  try {
    return JSON.parse(text) as PostResult;
  } catch {
    if (response.ok) return { ok: true };
    throw new Error("Save failed. Redeploy Apps Script and try again.");
  }
}

export type WishUpsertPayload = {
  id?: string;
  title: string;
  description?: string;
  category: string;
  priceHint?: string;
  link?: string;
  imageUrl?: string;
  qty: number;
  imageBase64?: string;
  imageMime?: string;
  imageName?: string;
};

export async function upsertLailaWish(payload: WishUpsertPayload): Promise<PostResult> {
  return postWishScript({
    action: "wishUpsert",
    wish: {
      id: payload.id,
      title: payload.title,
      description: payload.description ?? "",
      category: payload.category,
      priceHint: payload.priceHint ?? "",
      link: payload.link ?? "",
      imageUrl: payload.imageUrl ?? "",
      qty: payload.qty,
    },
    imageBase64: payload.imageBase64,
    imageMime: payload.imageMime,
    imageName: payload.imageName,
  });
}

export async function setLailaWishActive(id: string, active: boolean): Promise<PostResult> {
  return postWishScript({ action: "wishSetActive", id, active });
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function readImageFileAsBase64(file: File): Promise<{ base64: string; mime: string; name: string }> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be under 4 MB.");
  }
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return { base64: btoa(binary), mime: file.type || "image/jpeg", name: file.name || "wish-photo.jpg" };
}