import { useEffect, useState } from "react";
import { fetchLailaRsvpRows, pickAllUcapan, type LailaUcapanSnippet } from "./lailaRsvpApi";

type WallState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: LailaUcapanSnippet[] };

export function LailaUcapanWall() {
  const [state, setState] = useState<WallState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchLailaRsvpRows()
      .then((rows) => {
        if (!cancelled) setState({ status: "ready", items: pickAllUcapan(rows) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = state.status === "ready" ? state.items : [];

  return (
    <section className="laila-ucapan-wall" aria-label="Semua ucapan tetamu">
      <p className="laila-ucapan-wall__kicker">Ucapan &amp; doa tetamu</p>

      {state.status === "loading" ? (
        <p className="laila-ucapan-wall__note">Memuatkan ucapan…</p>
      ) : state.status === "error" ? (
        <p className="laila-ucapan-wall__note">Ucapan tidak dapat dimuatkan buat masa ini.</p>
      ) : items.length === 0 ? (
        <p className="laila-ucapan-wall__note">Jadilah yang pertama menghantar ucapan.</p>
      ) : (
        <div className="laila-ucapan-wall__scroll" tabIndex={0}>
          <ul className="laila-ucapan-wall__list">
            {items.map((item, i) => (
              <li key={`${item.name}-${i}`} className="laila-ucapan-wall__item">
                <p className="laila-ucapan-wall__text">{item.message}</p>
                <p className="laila-ucapan-wall__from">{item.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
