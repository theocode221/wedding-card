import { useCallback, useId, useState } from "react";
import {
  AppleBrandIcon,
  GoogleBrandIcon,
} from "../../components/wedding-invitation-frame/CalendarBrandIcons";
import {
  downloadTravellersIcs,
  getTravellersGoogleCalendarUrl,
  travellersHasEventDate,
  type TravellersInvite,
} from "./travellersInviteData";

type TravellersCalendarProps = {
  invite: TravellersInvite;
};

export function TravellersCalendar({ invite }: TravellersCalendarProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ready = travellersHasEventDate(invite);
  const googleUrl = getTravellersGoogleCalendarUrl(invite);

  const onGoogle = useCallback(() => {
    if (!googleUrl) return;
    window.open(googleUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [googleUrl]);

  const onApple = useCallback(() => {
    downloadTravellersIcs(invite);
    setOpen(false);
  }, [invite]);

  if (!ready) return null;

  return (
    <div className="travellers-calendar">
      <button
        type="button"
        className="travellers-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        tambah ke kalendar {open ? "~" : "→"}
      </button>
      {open ? (
        <div id={panelId} className="travellers-calendar__panel" role="group" aria-label="Pilih kalendar">
          <button
            type="button"
            className="travellers-calendar__opt"
            onClick={onGoogle}
            aria-label="Google Calendar"
          >
            <GoogleBrandIcon className="travellers-calendar__brand" />
            <span>Google</span>
          </button>
          <button
            type="button"
            className="travellers-calendar__opt"
            onClick={onApple}
            aria-label="Apple Calendar"
          >
            <AppleBrandIcon className="travellers-calendar__brand" />
            <span>Apple</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
