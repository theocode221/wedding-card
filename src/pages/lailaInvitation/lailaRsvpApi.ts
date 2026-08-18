import { getLailaRsvpScriptUrl } from "./lailaInviteData";

export type LailaRsvpRow = {
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
  rows?: LailaRsvpRow[];
};

export function isAttending(row: Pick<LailaRsvpRow, "attending">): boolean {
  const value = row.attending.trim().toLowerCase();
  return value === "hadir" || value === "yes" || value === "ya";
}

export type LailaUcapanSnippet = {
  name: string;
  message: string;
};

/** Latest ucapan with text, capped for the invitation spotlight. */
export function pickUcapanSpotlight(rows: LailaRsvpRow[], limit = 4): LailaUcapanSnippet[] {
  return rows
    .filter((row) => row.message.trim().length > 0)
    .slice(-limit)
    .reverse()
    .map((row) => ({
      name: row.name.trim(),
      message: row.message.trim(),
    }));
}

export function fetchLailaRsvpRows(): Promise<LailaRsvpRow[]> {
  const base = getLailaRsvpScriptUrl();
  if (!base) return Promise.reject(new Error("RSVP script URL missing."));

  return new Promise((resolve, reject) => {
    const callback = `lailaRsvp_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
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
      resolve(Array.isArray(payload.rows) ? payload.rows : []);
    };

    const script = document.createElement("script");
    script.src = `${base}?action=list&callback=${encodeURIComponent(callback)}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error("Tidak dapat memuat data. Pastikan Apps Script sudah di-deploy semula."));
    };
    document.body.appendChild(script);
  });
}
