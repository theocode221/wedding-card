import { useLayoutEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  invitationSatellitePageModifier,
  resolveInvitationReturnPath,
  resolveInvitationSatelliteSkin,
  type InvitationSatelliteSkin,
} from "../lib/invitationFlow";
import { submitRsvpToGoogleSheet } from "../lib/rsvpGoogleSheet";
import { PortfolioBackToCatalog } from "../components/portfolio/PortfolioBackToCatalog";
import { usePortfolioPreviewMode } from "../hooks/usePortfolioPreviewMode";
import { withPortfolioSearch } from "../lib/portfolioPreview";

type Attending = "yes" | "no";
type SubmitStatus = "idle" | "sending" | "success" | "error";

function themeLabel(skin: InvitationSatelliteSkin): string {
  if (skin === "maroon") return "maroon";
  if (skin === "whiteGold") return "whiteGold";
  if (skin === "malayClassic") return "malayClassic";
  return "default";
}

export function RsvpPage() {
  const location = useLocation();
  const { isPreview } = usePortfolioPreviewMode();
  const invitationReturnPath = useMemo(() => resolveInvitationReturnPath(location.state), [location.state]);
  const returnTo = withPortfolioSearch(invitationReturnPath, location.search);
  const satelliteSkin = useMemo(
    () => resolveInvitationSatelliteSkin(location.state),
    [location.state],
  );
  const satelliteClass = invitationSatellitePageModifier(satelliteSkin, "rsvp-page");

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending>("yes");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorText, setErrorText] = useState("");

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const trimmed = name.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorText("Sila masukkan nama anda.");
      return;
    }

    // Bot trap — real users leave this empty
    if (honeypot.trim()) {
      setStatus("success");
      return;
    }

    if (isPreview) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    setErrorText("");

    try {
      await submitRsvpToGoogleSheet({
        name: trimmed,
        attending,
        guests: attending === "no" ? 1 : guests,
        message,
        theme: themeLabel(satelliteSkin),
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorText("Tidak dapat menghantar sekarang. Sila cuba lagi sebentar.");
    }
  };

  if (status === "success") {
    return (
      <div className={["rsvp-page", "rsvp-page--done", satelliteClass].filter(Boolean).join(" ")}>
        <PortfolioBackToCatalog />
        <div className="rsvp-page__card rsvp-page__card--thanks" role="status">
          <p className="rsvp-page__success-title">Terima kasih!</p>
          <p className="rsvp-page__success-text">
            RSVP anda telah dihantar. Kami tidak sabar menanti hari bahagia ini bersama anda.
          </p>
          <Link
            to={returnTo}
            state={{ skipCinematic: true, scrollTo: "details" as const }}
            className="rsvp-page__back rsvp-page__back--thanks"
          >
            Kembali ke kad
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={["rsvp-page", satelliteClass].filter(Boolean).join(" ")}>
      <PortfolioBackToCatalog />
      <div className="rsvp-page__card">
        <p className="rsvp-page__eyebrow">RSVP</p>
        <h1 className="rsvp-page__title">Sahkan kehadiran anda</h1>

        <form className="rsvp-page__form" onSubmit={onSubmit} noValidate>
          <label className="rsvp-page__field">
            <span className="rsvp-page__label">Nama</span>
            <input
              className="rsvp-page__input"
              type="text"
              name="name"
              autoComplete="name"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama penuh anda"
            />
          </label>

          <fieldset className="rsvp-page__fieldset">
            <legend className="rsvp-page__label">Kehadiran</legend>
            <div className="rsvp-page__choices" role="radiogroup" aria-label="Kehadiran">
              {(
                [
                  ["yes", "Hadir"],
                  ["no", "Tidak hadir"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="rsvp-page__choice">
                  <input
                    type="radio"
                    name="attending"
                    value={value}
                    checked={attending === value}
                    onChange={() => setAttending(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {attending !== "no" ? (
            <label className="rsvp-page__field">
              <span className="rsvp-page__label">Bilangan tetamu</span>
              <select
                className="rsvp-page__input rsvp-page__input--narrow rsvp-page__select"
                name="guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value) || 1)}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="rsvp-page__field">
            <span className="rsvp-page__label">Ucapan (pilihan)</span>
            <textarea
              className="rsvp-page__textarea"
              name="message"
              rows={3}
              maxLength={400}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Doa atau ucapan ringkas…"
            />
          </label>

          <label className="rsvp-page__hp" aria-hidden="true">
            <span>Website</span>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>

          {status === "error" && errorText ? (
            <p className="rsvp-page__error" role="alert">
              {errorText}
            </p>
          ) : null}

          <button type="submit" className="rsvp-page__submit" disabled={status === "sending"}>
            {status === "sending" ? "Menghantar…" : "Hantar RSVP"}
          </button>
        </form>

        <Link
          to={returnTo}
          state={{ skipCinematic: true, scrollTo: "details" as const }}
          className="rsvp-page__back"
        >
          Kembali ke jemputan
        </Link>
      </div>
    </div>
  );
}
