import { useCallback, useId, useState } from "react";
import { AppleBrandIcon, GoogleBrandIcon } from "../../components/wedding-invitation-frame/CalendarBrandIcons";
import {
  doodleHasEventDate,
  downloadDoodleIcs,
  getDoodleGoogleCalendarUrl,
  type DoodleInvite,
} from "./doodleInviteData";

type DoodleCalendarProps = {
  invite: DoodleInvite;
};

export function DoodleCalendar({ invite }: DoodleCalendarProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ready = doodleHasEventDate(invite);
  const googleUrl = getDoodleGoogleCalendarUrl(invite);

  const onGoogle = useCallback(() => {
    if (!googleUrl) return;
    window.open(googleUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [googleUrl]);

  const onApple = useCallback(() => {
    downloadDoodleIcs(invite);
    setOpen(false);
  }, [invite]);

  if (!ready) return null;

  return (
    <div className="doodle-calendar">
      <button
        type="button"
        className="doodle-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        tambah ke kalendar {open ? "~" : "→"}
      </button>
      {open ? (
        <div id={panelId} className="doodle-calendar__panel" role="group" aria-label="Pilih kalendar">
          <button type="button" className="doodle-calendar__opt" onClick={onGoogle} aria-label="Google Calendar">
            <GoogleBrandIcon className="doodle-calendar__brand" />
            <span>Google</span>
          </button>
          <button type="button" className="doodle-calendar__opt" onClick={onApple} aria-label="Apple Calendar">
            <AppleBrandIcon className="doodle-calendar__brand" />
            <span>Apple</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
