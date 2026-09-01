import {
  getWhiteGoldRsvpScriptUrl,
  WHITE_GOLD_RSVP_THEME,
} from "./whiteGoldInviteData";

export type WhiteGoldRsvpRow = {
  submittedAt: string;
  name: string;
  attending: string;
  guests: number;
  message: string;
  theme: string;
};

type ListPayload = {
  ok?: boolean;
  error?: string;
  rows?: WhiteGoldRsvpRow[];
};

export function isAttending(row: Pick<WhiteGoldRsvpRow, "attending">): boolean {
  const value = row.attending.trim().toLowerCase();
  return value === "hadir" || value === "yes" || value === "ya";
}

/**
 * Loads RSVP rows from the shared (or dedicated) Apps Script via JSONP.
 * Requests `theme=whiteGold` so mixed sheets can filter server-side;
 * also filters client-side as a safety net.
 */
export function fetchWhiteGoldRsvpRows(): Promise<WhiteGoldRsvpRow[]> {
  const base = getWhiteGoldRsvpScriptUrl();
  if (!base) return Promise.reject(new Error("RSVP script URL missing."));

  return new Promise((resolve, reject) => {
    const callback = `wgRsvp_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Tidak dapat memuat data. Sila cuba lagi."));
    }, 18000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete (window as unknown as Record<string, unknown>)[callback];
      script.remove();
    }

    (window as unknown as Record<string, unknown>)[callback] = (payload: ListPayload) => {
      cleanup();
      if (!payload || payload.ok === false) {
        reject(new Error(payload?.error || "Gagal memuat RSVP."));
        return;
      }
      const rows = Array.isArray(payload.rows) ? payload.rows : [];
      const filtered = rows.filter((row) => {
        const theme = (row.theme || "").trim().toLowerCase();
        // Keep whiteGold rows; also keep blank theme rows from older submits.
        return !theme || theme === WHITE_GOLD_RSVP_THEME.toLowerCase();
      });
      resolve(filtered);
    };

    const script = document.createElement("script");
    const params = new URLSearchParams({
      action: "list",
      theme: WHITE_GOLD_RSVP_THEME,
      callback,
    });
    script.src = `${base}?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(
        new Error(
          "Tidak dapat memuat data. Pastikan Apps Script sudah di-deploy semula dengan fungsi list.",
        ),
      );
    };
    document.body.appendChild(script);
  });
}
