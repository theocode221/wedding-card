import { useCallback, useEffect, useMemo, useState } from "react";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import {
  PORTFOLIO_DEMO_COUPLE_LABEL,
  PORTFOLIO_DEMO_DATE,
  PORTFOLIO_DEMO_TIME_LABEL,
} from "../../data/portfolioDemoNames";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { PAAN_DASHBOARD_DEMO_ROWS } from "./paanDashboardDemoData";
import { PAAN_INVITE, paanCoupleLabel } from "./paanInviteData";
import { fetchPaanRsvpRows, isAttending, type PaanRsvpRow } from "./paanRsvpApi";
import "../whiteGoldInvitation/white-gold-dashboard.css";

export function PaanDashboardPage() {
  const { isPreview } = usePortfolioPreviewMode();
  const names = isPreview ? PORTFOLIO_DEMO_COUPLE_LABEL : paanCoupleLabel();
  const dateLabel = isPreview ? PORTFOLIO_DEMO_DATE : PAAN_INVITE.date;
  const timeLabel = isPreview ? PORTFOLIO_DEMO_TIME_LABEL : PAAN_INVITE.timeLabel;

  const [rows, setRows] = useState<PaanRsvpRow[]>(() =>
    isPreview ? [...PAAN_DASHBOARD_DEMO_ROWS] : [],
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    isPreview ? "ready" : "loading",
  );
  const [errorText, setErrorText] = useState("");

  const load = useCallback(async () => {
    if (isPreview) {
      setRows([...PAAN_DASHBOARD_DEMO_ROWS]);
      setStatus("ready");
      setErrorText("");
      return;
    }
    setStatus("loading");
    setErrorText("");
    try {
      const next = await fetchPaanRsvpRows();
      setRows(next);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Gagal memuat data.");
    }
  }, [isPreview]);

  useEffect(() => {
    const prev = document.title;
    document.title = isPreview ? `RSVP Dashboard demo — ${names}` : `Papan RSVP — ${names}`;
    return () => {
      document.title = prev;
    };
  }, [isPreview, names]);

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
  /** Newest sheet rows first (sheet appends at the bottom). */
  const attendingNewest = useMemo(() => [...attending].reverse(), [attending]);
  const decliningNewest = useMemo(() => [...declining].reverse(), [declining]);
  const ucapanNewest = useMemo(() => [...ucapan].reverse(), [ucapan]);
  const attendingShare = rows.length === 0 ? 0 : Math.round((attending.length / rows.length) * 100);

  const exportUcapanPdf = useCallback(() => {
    document.body.classList.add("wg-print-ucapan");
    const restore = () => {
      document.body.classList.remove("wg-print-ucapan");
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.setTimeout(() => window.print(), 50);
  }, []);

  return (
    <div className={`wg-dash${isPreview ? " wg-dash--demo" : ""}`} lang="ms">
      <PortfolioBackToCatalog />
      <div className="wg-dash__frame" aria-hidden />
      <div className="wg-dash__inner">
        <header className="wg-dash__head">
          <h1 className="wg-dash__title">RSVP &amp; ucapan</h1>
          <p className="wg-dash__lead">Walimatul Urus {names}</p>
          <p className="wg-dash__meta">
            {dateLabel} · {timeLabel}
          </p>
          {isPreview ? (
            <p className="wg-dash__demo-banner">Sample data only — not a real client dashboard.</p>
          ) : null}
        </header>

        {status === "loading" ? <p className="wg-dash__status">Memuat data RSVP…</p> : null}

        {status === "error" ? (
          <p className="wg-dash__error" role="alert">
            {errorText}
          </p>
        ) : null}

        {status === "ready" ? (
          <>
            <section className="wg-dash-stats" aria-label="Ringkasan kehadiran">
              <article className="wg-dash-stat wg-dash-stat--yes">
                <p className="wg-dash-stat__kicker">Hadir</p>
                <p className="wg-dash-stat__num">{attending.length}</p>
                <p className="wg-dash-stat__sub">{guestTotal} tetamu</p>
              </article>
              <article className="wg-dash-stat wg-dash-stat--no">
                <p className="wg-dash-stat__kicker">Tidak hadir</p>
                <p className="wg-dash-stat__num">{declining.length}</p>
              </article>
            </section>

            <div className="wg-dash-bar" aria-hidden={rows.length === 0}>
              <span className="wg-dash-bar__yes" style={{ width: `${attendingShare}%` }} />
            </div>
            <p className="wg-dash__total">{rows.length} RSVP diterima</p>

            <div className="wg-dash__toolbar">
              {isPreview ? null : (
                <button type="button" className="wg-dash-btn" onClick={() => void load()}>
                  Muat semula
                </button>
              )}
              <button
                type="button"
                className="wg-dash-btn wg-dash-btn--solid"
                onClick={exportUcapanPdf}
                disabled={ucapan.length === 0}
              >
                Eksport ucapan (PDF)
              </button>
            </div>

            <section className="wg-dash-list">
              <h2 className="wg-dash-list__title">Hadir</h2>
              {attendingNewest.length === 0 ? (
                <p className="wg-dash-list__empty">Tiada lagi.</p>
              ) : (
                <ul className="wg-dash-list__items">
                  {attendingNewest.map((row, i) => (
                    <li key={`${row.name}-${row.submittedAt}-${i}`}>
                      <span className="wg-dash-list__name">{row.name}</span>
                      <span className="wg-dash-list__meta">
                        {Math.max(1, row.guests || 1)} tetamu
                        {row.submittedAt ? ` · ${row.submittedAt}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="wg-dash-list">
              <h2 className="wg-dash-list__title">Tidak hadir</h2>
              {decliningNewest.length === 0 ? (
                <p className="wg-dash-list__empty">Tiada lagi.</p>
              ) : (
                <ul className="wg-dash-list__items">
                  {decliningNewest.map((row, i) => (
                    <li key={`${row.name}-${row.submittedAt}-${i}`}>
                      <span className="wg-dash-list__name">{row.name}</span>
                      <span className="wg-dash-list__meta">{row.submittedAt || "—"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="wg-dash-list">
              <h2 className="wg-dash-list__title">Ucapan</h2>
              {ucapanNewest.length === 0 ? (
                <p className="wg-dash-list__empty">Belum ada ucapan.</p>
              ) : (
                <ul className="wg-dash-ucapan">
                  {ucapanNewest.map((row, i) => (
                    <li key={`${row.name}-ucapan-${i}`}>
                      <p className="wg-dash-ucapan__text">{row.message}</p>
                      <p className="wg-dash-ucapan__from">
                        — {row.name}
                        {row.submittedAt ? ` · ${row.submittedAt}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>

      <div className="wg-ucapan-book" aria-hidden>
        <header className="wg-ucapan-book__cover">
          <p className="wg-ucapan-book__kicker">Kompilasi ucapan</p>
          <h2 className="wg-ucapan-book__names">{names}</h2>
          <p className="wg-ucapan-book__date">{dateLabel}</p>
          <p className="wg-ucapan-book__count">{ucapan.length} ucapan daripada tetamu</p>
        </header>
        {ucapanNewest.map((row, i) => (
          <article key={`print-${row.name}-${i}`} className="wg-ucapan-book__card">
            <p className="wg-ucapan-book__message">{row.message}</p>
            <p className="wg-ucapan-book__sign">— {row.name}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
