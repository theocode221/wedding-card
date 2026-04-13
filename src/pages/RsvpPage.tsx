import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { MOCK_WEDDING_EVENT, coupleLabel } from "../data/mockEvent";

/** Placeholder RSVP route — replace with a form or external link later */
export function RsvpPage() {
  const names = coupleLabel(MOCK_WEDDING_EVENT);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="rsvp-page">
      <div className="rsvp-page__card">
        <p className="rsvp-page__eyebrow">RSVP</p>
        <h1 className="rsvp-page__title">Kami berbesar hati menantikan kedatangan anda</h1>
        <p className="rsvp-page__text">
          RSVP details for {names} will appear here — for now, this is a placeholder page so the “Confirm
          Attendance” flow works end-to-end.
        </p>
        <Link
          to="/jemputan-frame"
          state={{ skipCinematic: true, scrollTo: "details" as const }}
          className="rsvp-page__back"
        >
          Kembali ke jemputan
        </Link>
      </div>
    </div>
  );
}
