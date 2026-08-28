import { useCallback, useId, useState } from "react";
import {
  PORTFOLIO_DEMO_ADDRESS,
  PORTFOLIO_DEMO_COUPLE_DISPLAY,
  PORTFOLIO_DEMO_VENUE,
} from "../../data/portfolioDemoNames";
import {
  downloadWeddingIcs,
  getGoogleCalendarUrl,
} from "../../lib/weddingCalendar";
import { AppleBrandIcon, GoogleBrandIcon } from "./CalendarBrandIcons";

type AddToCalendarProps = {
  demoMode?: boolean;
};

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function getDemoGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Walimatul Urus — ${PORTFOLIO_DEMO_COUPLE_DISPLAY}`,
    dates: "20270101T030000Z/20270101T080000Z",
    details: "Demo jemputan — data contoh sahaja.",
    location: `${PORTFOLIO_DEMO_VENUE}, ${PORTFOLIO_DEMO_ADDRESS}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadDemoIcs(): void {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Card//Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:wedding-demo-portfolio@wedding-card",
    "DTSTAMP:20270101T000000Z",
    "DTSTART:20270101T030000Z",
    "DTEND:20270101T080000Z",
    `SUMMARY:${escapeIcsText(`Walimatul Urus — ${PORTFOLIO_DEMO_COUPLE_DISPLAY}`)}`,
    `DESCRIPTION:${escapeIcsText("Demo jemputan — data contoh sahaja.")}`,
    `LOCATION:${escapeIcsText(`${PORTFOLIO_DEMO_VENUE}, ${PORTFOLIO_DEMO_ADDRESS}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jemputan-demo.ics";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AddToCalendar({ demoMode = false }: AddToCalendarProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const onToggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const onGoogle = useCallback(() => {
    window.open(demoMode ? getDemoGoogleCalendarUrl() : getGoogleCalendarUrl(), "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [demoMode]);

  const onApple = useCallback(() => {
    if (demoMode) downloadDemoIcs();
    else downloadWeddingIcs();
    setOpen(false);
  }, [demoMode]);

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
          <button
            type="button"
            className="wif-invitation__btn wif-invitation__btn--calendar-opt"
            onClick={onGoogle}
            aria-label="Google Calendar"
          >
            <GoogleBrandIcon className="wif-invitation__calendar-brand" />
            <span className="wif-invitation__calendar-opt-label">Calendar</span>
          </button>
          <button
            type="button"
            className="wif-invitation__btn wif-invitation__btn--calendar-opt wif-invitation__btn--calendar-opt-apple"
            onClick={onApple}
            aria-label="Apple Calendar"
          >
            <AppleBrandIcon className="wif-invitation__calendar-brand" />
            <span className="wif-invitation__calendar-opt-label">Calendar</span>
          </button>
        </div>
      )}
    </div>
  );
}
