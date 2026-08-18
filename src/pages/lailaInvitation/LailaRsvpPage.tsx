import { useLayoutEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { submitRsvpToGoogleSheet } from "../../lib/rsvpGoogleSheet";
import { LailaPageDecor } from "./LailaPageDecor";
import {
  getLailaRsvpScriptUrl,
  LAILA_DETAILS_TO,
  lailaCoupleLabel,
} from "./lailaInviteData";
import "./laila-invitation.css";

type Attending = "yes" | "no";
type SubmitStatus = "idle" | "sending" | "success" | "error";

export function LailaRsvpPage() {
  const scriptUrl = getLailaRsvpScriptUrl();
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

    if (honeypot.trim()) {
      setStatus("success");
      return;
    }

    if (!scriptUrl) {
      setStatus("error");
      setErrorText("RSVP akan diaktifkan apabila Google Sheet klien sedia.");
      return;
    }

    setStatus("sending");
    setErrorText("");

    try {
      await submitRsvpToGoogleSheet(
        {
          name: trimmed,
          attending,
          guests: attending === "no" ? 1 : guests,
          message,
          theme: "laila",
        },
        scriptUrl,
      );
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorText("Tidak dapat menghantar sekarang. Sila cuba lagi sebentar.");
    }
  };

  return (
    <div className="laila-page laila-satellite" lang="ms">
      <LailaPageDecor />
      <div className="laila-satellite__card">
        {status === "success" ? (
          <div role="status">
            <p className="laila-kicker">RSVP</p>
            <h1 className="laila-title">Terima kasih</h1>
            <p className="laila-prose">
              RSVP anda telah dihantar. Kami tidak sabar menanti hari bahagia ini bersama anda.
            </p>
            <Link to={LAILA_DETAILS_TO} className="laila-btn laila-btn--pill">
              Kembali ke kad
            </Link>
          </div>
        ) : (
          <>
            <p className="laila-kicker">RSVP</p>
            <h1 className="laila-title">Sahkan kehadiran anda</h1>
            <p className="laila-satellite__lead">Walimatul Urus {lailaCoupleLabel()}</p>

            <form className="laila-form" onSubmit={onSubmit} noValidate>
              <label className="laila-form__field">
                <span className="laila-form__label">Nama</span>
                <input
                  className="laila-form__input"
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

              <fieldset className="laila-form__field">
                <legend className="laila-form__label">Kehadiran</legend>
                <div className="laila-form__choices">
                  {(
                    [
                      ["yes", "Hadir"],
                      ["no", "Tidak hadir"],
                    ] as const
                  ).map(([value, label]) => (
                    <label key={value} className="laila-form__choice">
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
                <label className="laila-form__field">
                  <span className="laila-form__label">Bilangan tetamu</span>
                  <select
                    className="laila-form__input laila-form__input--narrow"
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

              <label className="laila-form__field">
                <span className="laila-form__label">Ucapan (pilihan)</span>
                <textarea
                  className="laila-form__textarea"
                  name="message"
                  rows={3}
                  maxLength={400}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Doa atau ucapan ringkas…"
                />
              </label>

              <label className="laila-form__hp" aria-hidden="true">
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
                <p className="laila-form__error" role="alert">
                  {errorText}
                </p>
              ) : null}

              <button
                type="submit"
                className="laila-btn laila-btn--maroon laila-btn--pill laila-form__submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Menghantar…" : "Hantar RSVP"}
              </button>
            </form>

            <Link to={LAILA_DETAILS_TO} className="laila-satellite__back">
              Kembali ke jemputan
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
