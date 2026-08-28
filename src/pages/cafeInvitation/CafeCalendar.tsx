import { useCallback, useId, useState } from "react";
import {
  AppleBrandIcon,
  GoogleBrandIcon,
} from "../../components/wedding-invitation-frame/CalendarBrandIcons";
import {
  cafeHasEventDate,
  downloadCafeIcs,
  getCafeGoogleCalendarUrl,
  type CafeInvite,
} from "./cafeInviteData";

type CafeCalendarProps = {
  invite: CafeInvite;
};

export function CafeCalendar({ invite }: CafeCalendarProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ready = cafeHasEventDate(invite);
  const googleUrl = getCafeGoogleCalendarUrl(invite);

  const onGoogle = useCallback(() => {
    if (!googleUrl) return;
    window.open(googleUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [googleUrl]);

  const onApple = useCallback(() => {
    downloadCafeIcs(invite);
    setOpen(false);
  }, [invite]);

  if (!ready) return null;

  return (
    <div className="cafe-calendar">
      <button
        type="button"
        className="cafe-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        tambah ke kalendar {open ? "~" : "→"}
      </button>
      {open ? (
        <div id={panelId} className="cafe-calendar__panel" role="group" aria-label="Pilih kalendar">
          <button type="button" className="cafe-calendar__opt" onClick={onGoogle} aria-label="Google Calendar">
            <GoogleBrandIcon className="cafe-calendar__brand" />
            <span>Google</span>
          </button>
          <button type="button" className="cafe-calendar__opt" onClick={onApple} aria-label="Apple Calendar">
            <AppleBrandIcon className="cafe-calendar__brand" />
            <span>Apple</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
