/** Web Share API with clipboard fallback (same spirit as CongratulationCardPage). */
export async function shareEggRevealHappiness(): Promise<{ ok: boolean; message: string }> {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = "Tahniah Haziq & Laila 💕";
  const text = "Main Catch the Love di kad digital ini!";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return { ok: true, message: "Dikongsi!" };
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return { ok: false, message: "" };
      }
    }
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return { ok: true, message: "Link disalin!" };
    }
  } catch {
    /* fall through */
  }

  return { ok: false, message: url ? `Salin manual: ${url.slice(0, 56)}…` : "Tidak dapat menyalin pautan." };
}
