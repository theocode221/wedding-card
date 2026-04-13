import { useCallback, useId, useState } from "react";
import { downloadWeddingIcs, getGoogleCalendarUrl } from "../../lib/weddingCalendar";

export function AddToCalendar() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const onToggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const onGoogle = useCallback(() => {
    window.open(getGoogleCalendarUrl(), "_blank", "noopener,noreferrer");
    setOpen(false);
  }, []);

  const onApple = useCallback(() => {
    downloadWeddingIcs();
    setOpen(false);
  }, []);

  return (
    <div className="wif-invitation__calendar">
      <button
        type="button"
        className="wif-invitation__btn wif-invitation__btn--calendar"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="wif-invitation__calendar-label">Tambah ke kalendar</span>
        <span className="wif-invitation__calendar-chevron" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open && (
        <div id={panelId} className="wif-invitation__calendar-panel" role="group" aria-label="Pilih kalendar">
          <button type="button" className="wif-invitation__btn wif-invitation__btn--calendar-opt" onClick={onGoogle}>
            Google Calendar
          </button>
          <button type="button" className="wif-invitation__btn wif-invitation__calendar-opt" onClick={onApple}>
            Apple Calendar
          </button>
        </div>
      )}
      <p className="wif-invitation__calendar-hint">
        Apple: muat turun fail .ics — buka pada iPhone untuk tambah ke Kalendar.
      </p>
    </div>
  );
}
