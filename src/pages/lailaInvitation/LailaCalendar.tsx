import { useCallback, useId, useState } from "react";
import { AppleBrandIcon, GoogleBrandIcon } from "../../components/wedding-invitation-frame/CalendarBrandIcons";
import {
  downloadLailaIcs,
  getLailaGoogleCalendarUrl,
  lailaHasEventDate,
} from "./lailaInviteData";

export function LailaCalendar() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ready = lailaHasEventDate();
  const googleUrl = getLailaGoogleCalendarUrl();

  const onGoogle = useCallback(() => {
    if (!googleUrl) return;
    window.open(googleUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [googleUrl]);

  const onApple = useCallback(() => {
    downloadLailaIcs();
    setOpen(false);
  }, []);

  if (!ready) return null;

  return (
    <div className="laila-calendar">
      <button
        type="button"
        className="laila-btn laila-btn--pill"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        Tambah ke kalendar {open ? "▴" : "▾"}
      </button>
      {open ? (
        <div id={panelId} className="laila-calendar__panel" role="group" aria-label="Pilih kalendar">
          <button type="button" className="laila-calendar__opt" onClick={onGoogle} aria-label="Google Calendar">
            <GoogleBrandIcon className="laila-calendar__brand" />
            <span>Google</span>
          </button>
          <button type="button" className="laila-calendar__opt" onClick={onApple} aria-label="Apple Calendar">
            <AppleBrandIcon className="laila-calendar__brand" />
            <span>Apple</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
