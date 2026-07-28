import { useLayoutEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { MOCK_WEDDING_EVENT, coupleLabel } from "../data/mockEvent";
import {
  invitationSatellitePageModifier,
  resolveInvitationReturnPath,
  resolveInvitationSatelliteSkin,
  type InvitationSatelliteSkin,
} from "../lib/invitationFlow";
import { submitRsvpToGoogleSheet } from "../lib/rsvpGoogleSheet";

type Attending = "yes" | "no" | "maybe";
type SubmitStatus = "idle" | "sending" | "success" | "error";

function themeLabel(skin: InvitationSatelliteSkin): string {
  if (skin === "maroon") return "maroon";
  if (skin === "whiteGold") return "whiteGold";
  return "default";
}

export function RsvpPage() {
  const names = coupleLabel(MOCK_WEDDING_EVENT);
  const location = useLocation();
  const invitationReturnPath = useMemo(() => resolveInvitationReturnPath(location.state), [location.state]);
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
        <div className="rsvp-page__card rsvp-page__card--thanks" role="status">
          <p className="rsvp-page__success-title">Terima kasih!</p>
          <p className="rsvp-page__success-text">
            RSVP anda telah dihantar. Kami tidak sabar menanti hari bahagia ini bersama anda.
          </p>
          <Link
            to={invitationReturnPath}
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
      <div className="rsvp-page__card">
        <p className="rsvp-page__eyebrow">RSVP</p>
        <h1 className="rsvp-page__title">Sahkan kehadiran anda</h1>
        <p className="rsvp-page__text">
          Maklumkan kehadiran anda untuk majlis {names}. Jawapan anda akan direkodkan terus.
        </p>

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
                  ["maybe", "Belum pasti"],
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
              <input
                className="rsvp-page__input rsvp-page__input--narrow"
                type="number"
                name="guests"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value) || 1)}
              />
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
