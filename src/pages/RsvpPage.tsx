import { Link } from "react-router-dom";
import { MOCK_WEDDING_EVENT, coupleLabel } from "../data/mockEvent";

/** Placeholder RSVP route — replace with a form or external link later */
export function RsvpPage() {
  const names = coupleLabel(MOCK_WEDDING_EVENT);

  return (
    <div className="rsvp-page">
      <div className="rsvp-page__card">
        <p className="rsvp-page__eyebrow">RSVP</p>
        <h1 className="rsvp-page__title">We’re glad you’re here</h1>
        <p className="rsvp-page__text">
          RSVP details for {names} will appear here — for now, this is a placeholder page so the “Confirm
          Attendance” flow works end-to-end.
        </p>
        <Link to="/" className="rsvp-page__back">
          Back to invitation
        </Link>
      </div>
    </div>
  );
}
