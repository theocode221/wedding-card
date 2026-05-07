import { useLayoutEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { MOCK_WEDDING_EVENT, coupleLabel } from "../data/mockEvent";
import { resolveInvitationReturnPath, resolveInvitationSatelliteSkin } from "../lib/invitationFlow";

/** Placeholder RSVP route — replace with a form or external link later */
export function RsvpPage() {
  const names = coupleLabel(MOCK_WEDDING_EVENT);
  const location = useLocation();
  const invitationReturnPath = useMemo(() => resolveInvitationReturnPath(location.state), [location.state]);
  const maroonSatellite = useMemo(
    () => resolveInvitationSatelliteSkin(location.state) === "maroon",
    [location.state],
  );

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={["rsvp-page", maroonSatellite ? "rsvp-page--maroon" : ""].filter(Boolean).join(" ")}>
      <div className="rsvp-page__card">
        <p className="rsvp-page__eyebrow">RSVP</p>
        <h1 className="rsvp-page__title">Kami berbesar hati menantikan kedatangan anda</h1>
        <p className="rsvp-page__text">
          RSVP details for {names} will appear here — for now, this is a placeholder page so the “Confirm
          Attendance” flow works end-to-end.
        </p>
        <Link
          to={invitationReturnPath}
          state={{ skipCinematic: true, scrollTo: "details" as const }}
          className="rsvp-page__back"
        >
          Kembali ke jemputan
        </Link>
      </div>
    </div>
  );
}
