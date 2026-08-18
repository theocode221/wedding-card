import { useCallback, useEffect, useMemo, useState } from "react";
import { LailaPageDecor } from "./LailaPageDecor";
import { fetchLailaRsvpRows, isAttending, type LailaRsvpRow } from "./lailaRsvpApi";
import { LAILA_INVITE, lailaCoupleLabel } from "./lailaInviteData";
import "./laila-invitation.css";

const PAGE_TITLE = `Papan RSVP — ${lailaCoupleLabel()}`;

export function LailaDashboardPage() {
  const names = lailaCoupleLabel();
  const [rows, setRows] = useState<LailaRsvpRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorText, setErrorText] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorText("");
    try {
      const next = await fetchLailaRsvpRows();
      setRows(next);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Gagal memuat data.");
    }
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const attending = useMemo(() => rows.filter(isAttending), [rows]);
  const declining = useMemo(() => rows.filter((row) => !isAttending(row)), [rows]);
  const guestTotal = useMemo(
    () => attending.reduce((sum, row) => sum + Math.max(1, row.guests || 1), 0),
    [attending],
  );
  const ucapan = useMemo(
    () => rows.filter((row) => row.message.trim().length > 0),
    [rows],
  );
  const attendingShare = rows.length === 0 ? 0 : Math.round((attending.length / rows.length) * 100);

  const exportUcapanPdf = useCallback(() => {
    document.body.classList.add("laila-print-ucapan");
    const restore = () => {
      document.body.classList.remove("laila-print-ucapan");
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.setTimeout(() => window.print(), 50);
  }, []);

  return (
    <div className="laila-page laila-dashboard" lang="ms">
      <LailaPageDecor />
      <div className="laila-dashboard__inner">
        <header className="laila-dashboard__head">
          <p className="laila-kicker">Papan klien</p>
          <h1 className="laila-title">RSVP &amp; ucapan</h1>
          <p className="laila-dashboard__lead">Walimatul Urus {names}</p>
          <p className="laila-dashboard__meta">
            {LAILA_INVITE.date} · {LAILA_INVITE.timeLabel}
          </p>
        </header>

        {status === "loading" ? (
          <p className="laila-dashboard__status">Memuat data RSVP…</p>
        ) : null}

        {status === "error" ? (
          <p className="laila-dashboard__error" role="alert">
            {errorText} Deploy semula Apps Script dengan versi baharu, kemudian muat semula.
          </p>
        ) : null}

        {status === "ready" ? (
          <>
            <section className="laila-dash-stats" aria-label="Ringkasan kehadiran">
              <article className="laila-dash-stat laila-dash-stat--yes">
                <p className="laila-dash-stat__kicker">Hadir</p>
                <p className="laila-dash-stat__num">{attending.length}</p>
                <p className="laila-dash-stat__sub">
                  {guestTotal} tetamu
                  {rows.length > 0 ? ` · ${attendingShare}% jawapan` : ""}
                </p>
              </article>
              <article className="laila-dash-stat laila-dash-stat--no">
                <p className="laila-dash-stat__kicker">Tidak hadir</p>
                <p className="laila-dash-stat__num">{declining.length}</p>
                <p className="laila-dash-stat__sub">
                  {declining.length === 1 ? "1 jawapan" : `${declining.length} jawapan`}
                </p>
              </article>
            </section>

            <div className="laila-dash-bar" aria-hidden={rows.length === 0}>
              <span className="laila-dash-bar__yes" style={{ width: `${attendingShare}%` }} />
            </div>
            <p className="laila-dashboard__total">{rows.length} RSVP diterima</p>

            <div className="laila-dashboard__toolbar">
              <button type="button" className="laila-btn laila-btn--pill" onClick={() => void load()}>
                Muat semula
              </button>
              <button
                type="button"
                className="laila-btn laila-btn--maroon laila-btn--pill"
                onClick={exportUcapanPdf}
                disabled={ucapan.length === 0}
              >
                Eksport ucapan (PDF)
              </button>
            </div>
            {ucapan.length === 0 ? (
              <p className="laila-dashboard__hint">Belum ada ucapan untuk dieksport.</p>
            ) : (
              <p className="laila-dashboard__hint">
                {ucapan.length} ucapan. Pilih “Save as PDF” pada tetingkap cetak.
              </p>
            )}

            <section className="laila-dash-list">
              <h2 className="laila-dash-list__title">Hadir</h2>
              {attending.length === 0 ? (
                <p className="laila-dash-list__empty">Tiada lagi.</p>
              ) : (
                <ul className="laila-dash-list__items">
                  {attending.map((row, i) => (
                    <li key={`${row.name}-${row.submittedAt}-${i}`}>
                      <span className="laila-dash-list__name">{row.name}</span>
                      <span className="laila-dash-list__meta">{row.guests} tetamu</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="laila-dash-list">
              <h2 className="laila-dash-list__title">Tidak hadir</h2>
              {declining.length === 0 ? (
                <p className="laila-dash-list__empty">Tiada lagi.</p>
              ) : (
                <ul className="laila-dash-list__items">
                  {declining.map((row, i) => (
                    <li key={`${row.name}-${row.submittedAt}-${i}`}>
                      <span className="laila-dash-list__name">{row.name}</span>
                      <span className="laila-dash-list__meta">{row.submittedAt || "—"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="laila-dash-list">
              <h2 className="laila-dash-list__title">Ucapan</h2>
              {ucapan.length === 0 ? (
                <p className="laila-dash-list__empty">Belum ada ucapan.</p>
              ) : (
                <ul className="laila-dash-ucapan">
                  {ucapan.map((row, i) => (
                    <li key={`${row.name}-ucapan-${i}`}>
                      <p className="laila-dash-ucapan__text">{row.message}</p>
                      <p className="laila-dash-ucapan__from">— {row.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>

      <div className="laila-ucapan-book" aria-hidden>
        <header className="laila-ucapan-book__cover">
          <p className="laila-khat laila-ucapan-book__khat" lang="ar" dir="rtl">
            السَّلَامُ عَلَيْكُمْ
          </p>
          <p className="laila-kicker">Kompilasi ucapan</p>
          <h2 className="laila-ucapan-book__names">{names}</h2>
          <p className="laila-ucapan-book__date">{LAILA_INVITE.date}</p>
          <p className="laila-ucapan-book__count">
            {ucapan.length} ucapan daripada tetamu
          </p>
        </header>
        {ucapan.map((row, i) => (
          <article key={`print-${row.name}-${i}`} className="laila-ucapan-book__card">
            <p className="laila-ucapan-book__message">{row.message}</p>
            <p className="laila-ucapan-book__sign">— {row.name}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
