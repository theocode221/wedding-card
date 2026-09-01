import { useState } from "react";
import {
  IconAppleCalendar,
  IconCalendar,
  IconGoogleCalendar,
} from "./ClassicActionIcons";
import {
  downloadClassicIcs,
  getClassicGoogleCalendarUrl,
  type ClassicInvite,
} from "./classicInviteData";

export function ClassicCalendar({ invite }: { invite: ClassicInvite }) {
  const [open, setOpen] = useState(false);
  const googleUrl = getClassicGoogleCalendarUrl(invite);

  return (
    <div className={`classic-cal${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="classic-icon-btn"
        aria-expanded={open}
        aria-label="Tambah ke kalendar"
        title="Tambah ke kalendar"
        onClick={() => setOpen((v) => !v)}
      >
        <IconCalendar className="classic-icon-btn__glyph" />
      </button>
      {open ? (
        <div className="classic-icon-menu" role="menu" aria-label="Pilih kalendar">
          {googleUrl ? (
            <a
              className="classic-icon-menu__item"
              href={googleUrl}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              aria-label="Google Calendar"
              title="Google"
            >
              <IconGoogleCalendar className="classic-icon-menu__logo" />
            </a>
          ) : null}
          <button
            type="button"
            className="classic-icon-menu__item"
            role="menuitem"
            aria-label="Apple Calendar"
            title="Apple"
            onClick={() => downloadClassicIcs(invite)}
          >
            <IconAppleCalendar className="classic-icon-menu__logo" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
