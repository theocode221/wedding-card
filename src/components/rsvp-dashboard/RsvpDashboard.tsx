import { useCallback, useEffect, useMemo, useState } from "react";
import { STUDIO_NAME } from "../../data/studioBrand";
import "./rsvp-dashboard.css";

/** One RSVP submission as stored in a client's Google Sheet. */
export type RsvpDashboardRow = {
  submittedAt: string;
  name: string;
  attending: string;
  guests: number;
  message: string;
};

export type RsvpDashboardEvent = {
  /** e.g. "Walimatul Urus" */
  title: string;
  /** e.g. "Suhailah & Hazziq" */
  couple: string;
  date: string;
  time?: string;
  venue?: string;
};

type Props = {
  event: RsvpDashboardEvent;
  /** Fetch live rows. Ignored when `demoRows` is given. */
  loadRows: () => Promise<readonly RsvpDashboardRow[]>;
  /** Portfolio preview: show these sample rows instead of live data. */
  demoRows?: readonly RsvpDashboardRow[];
  /** Used for the CSV filename, e.g. "suhailah-hazziq". */
  fileSlug: string;
};

type Filter = "all" | "attending" | "declined";
type Status = "loading" | "ready" | "error";

export function isRsvpAttending(row: Pick<RsvpDashboardRow, "attending">): boolean {
  const value = row.attending.trim().toLowerCase();
  return value === "hadir" || value === "yes" || value === "ya" || value === "attending";
}

function guestCount(row: RsvpDashboardRow): number {
  return Math.max(1, Number(row.guests) || 1);
}

function parseSubmitted(value: string): Date | null {
  if (!value) return null;
  const dmy = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (dmy) {
    const [, day, month, year, hour = "0", minute = "0", second = "0"] = dmy;
    return new Date(+year, +month - 1, +day, +hour, +minute, +second);
  }
  const d = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
}

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatSubmitted(value: string): string {
  const d = parseSubmitted(value);
  return d ? DATE_FMT.format(d) : value || "—";
}

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows: readonly RsvpDashboardRow[], fileSlug: string) {
  const header = ["Name", "Status", "Guests", "Wish", "Submitted"];
  const lines = rows.map((row) =>
    [
      row.name,
      isRsvpAttending(row) ? "Attending" : "Not attending",
      isRsvpAttending(row) ? guestCount(row) : 0,
      row.message.trim(),
      row.submittedAt,
    ]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob([`\uFEFF${[header.join(","), ...lines].join("\n")}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rsvp-${fileSlug}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function RsvpDashboard({ event, loadRows, demoRows, fileSlug }: Props) {
  const isDemo = Boolean(demoRows);
  const [rows, setRows] = useState<readonly RsvpDashboardRow[]>(() => demoRows ?? []);
  const [status, setStatus] = useState<Status>(isDemo ? "ready" : "loading");
  const [errorText, setErrorText] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(isDemo ? new Date() : null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    if (demoRows) {
      setRows(demoRows);
      setStatus("ready");
      setUpdatedAt(new Date());
      return;
    }
    setStatus((s) => (s === "ready" ? s : "loading"));
    setErrorText("");
    try {
      const next = await loadRows();
      setRows(next);
      setStatus("ready");
      setUpdatedAt(new Date());
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Unable to load RSVP data.");
    }
  }, [demoRows, loadRows]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const prev = document.title;
    document.title = `RSVP Dashboard — ${event.couple}`;
    return () => {
      document.title = prev;
    };
  }, [event.couple]);

  const sorted = useMemo(
    () =>
      [...rows].sort(
        (a, b) =>
          (parseSubmitted(b.submittedAt)?.getTime() ?? 0) - (parseSubmitted(a.submittedAt)?.getTime() ?? 0),
      ),
    [rows],
  );
  const attending = useMemo(() => sorted.filter(isRsvpAttending), [sorted]);
  const declined = useMemo(() => sorted.filter((row) => !isRsvpAttending(row)), [sorted]);
  const guestTotal = useMemo(() => attending.reduce((sum, row) => sum + guestCount(row), 0), [attending]);
  const wishes = useMemo(() => sorted.filter((row) => row.message.trim().length > 0), [sorted]);
  const attendingShare = sorted.length === 0 ? 0 : Math.round((attending.length / sorted.length) * 100);

  const visible = useMemo(() => {
    const base = filter === "attending" ? attending : filter === "declined" ? declined : sorted;
    const q = query.trim().toLowerCase();
    return q ? base.filter((row) => row.name.toLowerCase().includes(q)) : base;
  }, [attending, declined, filter, query, sorted]);

  const printWishes = useCallback(() => {
    document.body.classList.add("rsvp-dash-printing");
    const restore = () => {
      document.body.classList.remove("rsvp-dash-printing");
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.setTimeout(() => window.print(), 50);
  }, []);

  const eventMeta = [event.date, event.time, event.venue].filter(Boolean).join("  ·  ");

  return (
    <div className="rsvp-dash" lang="en">
      <div className="rsvp-dash__screen">
        <header className="rsvp-dash__bar">
          <p className="rsvp-dash__brand">RSVP Dashboard</p>
          <div className="rsvp-dash__actions">
            {isDemo ? null : (
              <button type="button" className="rsvp-dash__btn" onClick={() => void load()}>
                Refresh
              </button>
            )}
            <button
              type="button"
              className="rsvp-dash__btn"
              onClick={() => downloadCsv(sorted, fileSlug)}
              disabled={sorted.length === 0}
            >
              Download CSV
            </button>
            <button
              type="button"
              className="rsvp-dash__btn rsvp-dash__btn--primary"
              onClick={printWishes}
              disabled={wishes.length === 0}
            >
              Export wishes (PDF)
            </button>
          </div>
        </header>

        <section className="rsvp-dash__hero">
          <p className="rsvp-dash__eyebrow">{event.title}</p>
          <h1 className="rsvp-dash__couple">{event.couple}</h1>
          {eventMeta ? <p className="rsvp-dash__meta">{eventMeta}</p> : null}
          {isDemo ? <p className="rsvp-dash__demo">Sample data — not a real client dashboard.</p> : null}
        </section>

        {status === "loading" ? <p className="rsvp-dash__state">Loading responses…</p> : null}

        {status === "error" ? (
          <div className="rsvp-dash__state rsvp-dash__state--error" role="alert">
            <p>{errorText}</p>
            <button type="button" className="rsvp-dash__btn" onClick={() => void load()}>
              Try again
            </button>
          </div>
        ) : null}

        {status === "ready" ? (
          <>
            <section className="rsvp-dash__stats" aria-label="Summary">
              <article className="rsvp-dash__stat">
                <p className="rsvp-dash__stat-label">Responses</p>
                <p className="rsvp-dash__stat-value">{sorted.length}</p>
                <p className="rsvp-dash__stat-note">RSVPs received</p>
              </article>
              <article className="rsvp-dash__stat rsvp-dash__stat--accent">
                <p className="rsvp-dash__stat-label">Total guests</p>
                <p className="rsvp-dash__stat-value">{guestTotal}</p>
                <p className="rsvp-dash__stat-note">Expected to attend</p>
              </article>
              <article className="rsvp-dash__stat">
                <p className="rsvp-dash__stat-label">Attending</p>
                <p className="rsvp-dash__stat-value">{attending.length}</p>
                <p className="rsvp-dash__stat-note">{attendingShare}% of responses</p>
              </article>
              <article className="rsvp-dash__stat">
                <p className="rsvp-dash__stat-label">Not attending</p>
                <p className="rsvp-dash__stat-value">{declined.length}</p>
                <p className="rsvp-dash__stat-note">{sorted.length ? 100 - attendingShare : 0}% of responses</p>
              </article>
            </section>

            <div className="rsvp-dash__ratio" aria-hidden>
              <span style={{ width: `${attendingShare}%` }} />
            </div>

            <section className="rsvp-dash__panel" aria-labelledby="rsvp-dash-guests">
              <div className="rsvp-dash__panel-head">
                <h2 id="rsvp-dash-guests" className="rsvp-dash__panel-title">
                  Guest list
                </h2>
                <div className="rsvp-dash__controls">
                  <div className="rsvp-dash__tabs" role="tablist" aria-label="Filter guests">
                    {(
                      [
                        ["all", `All (${sorted.length})`],
                        ["attending", `Attending (${attending.length})`],
                        ["declined", `Not attending (${declined.length})`],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={filter === value}
                        className={`rsvp-dash__tab${filter === value ? " is-active" : ""}`}
                        onClick={() => setFilter(value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="search"
                    className="rsvp-dash__search"
                    placeholder="Search name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search guest name"
                  />
                </div>
              </div>

              {visible.length === 0 ? (
                <p className="rsvp-dash__empty">
                  {sorted.length === 0 ? "No responses yet." : "No guests match this view."}
                </p>
              ) : (
                <table className="rsvp-dash__table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="is-num">
                        Guests
                      </th>
                      <th scope="col">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row, i) => {
                      const yes = isRsvpAttending(row);
                      return (
                        <tr key={`${row.name}-${row.submittedAt}-${i}`}>
                          <td className="rsvp-dash__name">{row.name}</td>
                          <td>
                            <span className={`rsvp-dash__pill${yes ? " is-yes" : " is-no"}`}>
                              {yes ? "Attending" : "Not attending"}
                            </span>
                          </td>
                          <td className="is-num" data-label="Guests">
                            {yes ? guestCount(row) : "—"}
                          </td>
                          <td className="rsvp-dash__muted" data-label="Submitted">
                            {formatSubmitted(row.submittedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>

            <section className="rsvp-dash__panel" aria-labelledby="rsvp-dash-wishes">
              <div className="rsvp-dash__panel-head">
                <h2 id="rsvp-dash-wishes" className="rsvp-dash__panel-title">
                  Wishes
                </h2>
                <p className="rsvp-dash__panel-note">{wishes.length} received</p>
              </div>
              {wishes.length === 0 ? (
                <p className="rsvp-dash__empty">No wishes yet.</p>
              ) : (
                <ul className="rsvp-dash__wishes">
                  {wishes.map((row, i) => (
                    <li key={`${row.name}-wish-${i}`} className="rsvp-dash__wish">
                      <p className="rsvp-dash__wish-text">{row.message.trim()}</p>
                      <p className="rsvp-dash__wish-from">
                        {row.name}
                        <span>{formatSubmitted(row.submittedAt)}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}

        <footer className="rsvp-dash__foot">
          {updatedAt ? <span>Last updated {DATE_FMT.format(updatedAt)}</span> : <span />}
          <span>{STUDIO_NAME}</span>
        </footer>
      </div>

      <div className="rsvp-dash__book" aria-hidden>
        <header className="rsvp-dash__book-cover">
          <p className="rsvp-dash__eyebrow">A collection of wishes</p>
          <h2 className="rsvp-dash__book-couple">{event.couple}</h2>
          <p className="rsvp-dash__book-meta">
            {event.title} · {event.date}
          </p>
          <p className="rsvp-dash__book-count">{wishes.length} wishes from your guests</p>
        </header>
        {wishes.map((row, i) => (
          <article key={`print-${row.name}-${i}`} className="rsvp-dash__book-card">
            <p className="rsvp-dash__book-message">{row.message.trim()}</p>
            <p className="rsvp-dash__book-sign">{row.name}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
