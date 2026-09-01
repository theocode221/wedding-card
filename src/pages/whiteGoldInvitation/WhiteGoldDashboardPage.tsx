import { useCallback, useEffect, useMemo, useState } from "react";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import {
  PORTFOLIO_DEMO_COUPLE_LABEL,
  PORTFOLIO_DEMO_DATE,
  PORTFOLIO_DEMO_TIME_LABEL,
} from "../../data/portfolioDemoNames";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { WHITE_GOLD_DASHBOARD_DEMO_ROWS } from "./whiteGoldDashboardDemoData";
import {
  WHITE_GOLD_COUPLE,
  whiteGoldCoupleLabel,
} from "./whiteGoldInviteData";
import {
  fetchWhiteGoldRsvpRows,
  isAttending,
  type WhiteGoldRsvpRow,
} from "./whiteGoldRsvpApi";
import "./white-gold-dashboard.css";

export function WhiteGoldDashboardPage() {
  const { isPreview } = usePortfolioPreviewMode();
  const names = isPreview ? PORTFOLIO_DEMO_COUPLE_LABEL : whiteGoldCoupleLabel();
  const dateLabel = isPreview ? PORTFOLIO_DEMO_DATE : WHITE_GOLD_COUPLE.dateLabel;
  const timeLabel = isPreview ? PORTFOLIO_DEMO_TIME_LABEL : WHITE_GOLD_COUPLE.timeLabel;

  const [rows, setRows] = useState<WhiteGoldRsvpRow[]>(() =>
    isPreview ? [...WHITE_GOLD_DASHBOARD_DEMO_ROWS] : [],
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    isPreview ? "ready" : "loading",
  );
  const [errorText, setErrorText] = useState("");

  const load = useCallback(async () => {
    if (isPreview) {
      setRows([...WHITE_GOLD_DASHBOARD_DEMO_ROWS]);
      setStatus("ready");
      setErrorText("");
      return;
    }
    setStatus("loading");
    setErrorText("");
    try {
      const next = await fetchWhiteGoldRsvpRows();
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
          <p className="wg-dash__kicker">{isPreview ? "Demo" : "Papan klien"}</p>
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
            {errorText} Deploy semula Apps Script dengan versi baharu (lihat{" "}
            <code>whiteGoldRsvpAppsScript.gs</code>), kemudian muat semula.
          </p>
        ) : null}

        {status === "ready" ? (
          <>
            <section className="wg-dash-stats" aria-label="Ringkasan kehadiran">
              <article className="wg-dash-stat wg-dash-stat--yes">
                <p className="wg-dash-stat__kicker">Hadir</p>
                <p className="wg-dash-stat__num">{attending.length}</p>
                <p className="wg-dash-stat__sub">
                  {guestTotal} tetamu
                  {rows.length > 0 ? ` · ${attendingShare}% jawapan` : ""}
                </p>
              </article>
              <article className="wg-dash-stat wg-dash-stat--no">
                <p className="wg-dash-stat__kicker">Tidak hadir</p>
                <p className="wg-dash-stat__num">{declining.length}</p>
                <p className="wg-dash-stat__sub">
                  {declining.length === 1 ? "1 jawapan" : `${declining.length} jawapan`}
                </p>
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
            {ucapan.length === 0 ? (
              <p className="wg-dash__hint">Belum ada ucapan untuk dieksport.</p>
            ) : (
              <p className="wg-dash__hint">
                {ucapan.length} ucapan. Pilih “Save as PDF” pada tetingkap cetak.
              </p>
            )}

            <section className="wg-dash-list">
              <h2 className="wg-dash-list__title">Hadir</h2>
              {attending.length === 0 ? (
                <p className="wg-dash-list__empty">Tiada lagi.</p>
              ) : (
                <ul className="wg-dash-list__items">
                  {attending.map((row, i) => (
                    <li key={`${row.name}-${row.submittedAt}-${i}`}>
                      <span className="wg-dash-list__name">{row.name}</span>
                      <span className="wg-dash-list__meta">{row.guests} tetamu</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="wg-dash-list">
              <h2 className="wg-dash-list__title">Tidak hadir</h2>
              {declining.length === 0 ? (
                <p className="wg-dash-list__empty">Tiada lagi.</p>
              ) : (
                <ul className="wg-dash-list__items">
                  {declining.map((row, i) => (
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
              {ucapan.length === 0 ? (
                <p className="wg-dash-list__empty">Belum ada ucapan.</p>
              ) : (
                <ul className="wg-dash-ucapan">
                  {ucapan.map((row, i) => (
                    <li key={`${row.name}-ucapan-${i}`}>
                      <p className="wg-dash-ucapan__text">{row.message}</p>
                      <p className="wg-dash-ucapan__from">— {row.name}</p>
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
        {ucapan.map((row, i) => (
          <article key={`print-${row.name}-${i}`} className="wg-ucapan-book__card">
            <p className="wg-ucapan-book__message">{row.message}</p>
            <p className="wg-ucapan-book__sign">— {row.name}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
