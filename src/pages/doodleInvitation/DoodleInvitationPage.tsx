import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { DoodleCalendar } from "./DoodleCalendar";
import { DoodleDecor, DoodleFrame, DoodlePen } from "./DoodleDecor";
import {
  doodleCoupleLabel,
  doodleInviteForPreview,
  doodlePageTitle,
} from "./doodleInviteData";
import "./doodle-invitation.css";

const LETTER_STAGGER_S = 0.07;

function HandwrittenLine({
  text,
  className,
  delayStart = 0,
}: {
  text: string;
  className?: string;
  delayStart?: number;
}) {
  const chars = Array.from(text);
  const writeS = Math.max(chars.length * LETTER_STAGGER_S, 0.35);

  return (
    <span className={["doodle-write-line", className].filter(Boolean).join(" ")} aria-hidden>
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="doodle-hand-char"
          style={{ animationDelay: `${delayStart + i * LETTER_STAGGER_S}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
      <DoodlePen durationS={writeS} delayS={delayStart} />
    </span>
  );
}

type DoodleInvitationPageProps = {
  variant?: "ink" | "pastel";
};

export function DoodleInvitationPage({ variant = "ink" }: DoodleInvitationPageProps) {
  const preview = usePortfolioPreviewMode();
  const invite = doodleInviteForPreview(preview.isPreview);
  const names = doodleCoupleLabel(invite);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [rsvp, setRsvp] = useState<"idle" | "yes" | "no">("idle");
  /** Delay cover mount in embed so hover iframe is visible before drawing/name animations start. */
  const [coverReady, setCoverReady] = useState(!preview.isEmbed);

  useEffect(() => {
    document.title = doodlePageTitle(invite);
  }, [invite]);

  useEffect(() => {
    if (!preview.isEmbed) {
      setCoverReady(true);
      return;
    }
    setCoverReady(false);
    const id = window.setTimeout(() => setCoverReady(true), 120);
    return () => window.clearTimeout(id);
  }, [preview.isEmbed]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [open]);

  const remaining = getRemaining(new Date(invite.weddingDateTime), now);
  const openInvitation = useCallback(() => setOpen(true), []);

  const groomStart = 0.55;
  const ampDelay = groomStart + invite.groomName.length * LETTER_STAGGER_S + 0.08;
  const brideStart = ampDelay + 0.16;
  const dateDelay = brideStart + invite.brideName.length * LETTER_STAGGER_S + 0.14;
  const buttonDelay = dateDelay + 0.22;

  const onRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setRsvp(data.get("kehadiran") === "tidak" ? "no" : "yes");
  };

  return (
    <div
      className={[
        "doodle-page",
        `doodle-page--${variant}`,
        open ? "doodle-page--details" : "doodle-page--cover",
      ].join(" ")}
      lang="ms"
    >
      {!open ? (
        <header className="doodle-cover" key={coverReady ? "cover-ready" : "cover-wait"}>
          {coverReady ? (
            <>
              <DoodleDecor />
              <div className="doodle-cover__card">
                <DoodleFrame />
                <p className="doodle-cover__kicker">{invite.kicker}</p>
                <h1 className="doodle-cover__names" aria-label={names}>
                  <HandwrittenLine text={invite.groomName} className="doodle-cover__name" delayStart={groomStart} />
                  <span className="doodle-cover__amp" style={{ animationDelay: `${ampDelay}s` }}>
                    &amp;
                  </span>
                  <HandwrittenLine
                    text={invite.brideName}
                    className="doodle-cover__name"
                    delayStart={brideStart}
                  />
                </h1>
                <p className="doodle-cover__date" style={{ animationDelay: `${dateDelay}s` }}>
                  <span>{invite.dayLabel}</span>
                  <span>{invite.date}</span>
                </p>
                <button
                  type="button"
                  className="doodle-cover__open"
                  style={{ animationDelay: `${buttonDelay}s` }}
                  onClick={openInvitation}
                >
                  Buka jemputan
                </button>
              </div>
            </>
          ) : null}
        </header>
      ) : (
        <main className="doodle-main">
          <DoodleDecor dense />
          <div className="doodle-stack">
            <ScrollReveal as="section" variant="from-top" className="doodle-block">
              <p className="doodle-kicker">majlis apa ni?</p>
              <p className="doodle-title">{names}</p>
              <p className="doodle-prose">{invite.invitation}</p>
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="doodle-block" delayMs={180}>
              <p className="doodle-kicker">bila &amp; kat mana?</p>
              <dl className="doodle-spec">
                <div>
                  <dt>Tarikh</dt>
                  <dd>
                    {invite.dayLabel}, {invite.date}
                  </dd>
                </div>
                <div>
                  <dt>Masa</dt>
                  <dd>{invite.timeLabel}</dd>
                </div>
                <div>
                  <dt>Tempat</dt>
                  <dd>
                    {invite.venue}
                    <span>{invite.address}</span>
                  </dd>
                </div>
              </dl>
              <div className="doodle-actions">
                <DoodleCalendar invite={invite} />
                <a
                  className="doodle-btn doodle-btn--link"
                  href={invite.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  buka maps →
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="doodle-block" delayMs={320}>
              <p className="doodle-kicker">lagi berapa hari ye?</p>
              {remaining.done ? (
                <p className="doodle-prose">Jumpa di majlis!</p>
              ) : (
                <div className="doodle-chrono" role="timer" aria-live="polite" aria-atomic="true">
                  {[
                    { label: "Hari", value: pad(remaining.days) },
                    { label: "Jam", value: pad(remaining.hours) },
                    { label: "Minit", value: pad(remaining.minutes) },
                    { label: "Saat", value: pad(remaining.seconds) },
                  ].map((unit) => (
                    <div key={unit.label} className="doodle-chrono__cell">
                      <span className="doodle-chrono__num">{unit.value}</span>
                      <span className="doodle-chrono__unit">{unit.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="doodle-block" delayMs={420}>
              <p className="doodle-kicker">check kedatangan..</p>
              <p className="doodle-title doodle-title--small">Datang?</p>
              {rsvp === "idle" ? (
                <form className="doodle-rsvp" onSubmit={onRsvp}>
                  <label>
                    Nama
                    <input name="nama" type="text" autoComplete="name" required />
                  </label>
                  <fieldset>
                    <legend>Kehadiran</legend>
                    <label className="doodle-rsvp__choice">
                      <input type="radio" name="kehadiran" value="hadir" defaultChecked />
                      Hadir
                    </label>
                    <label className="doodle-rsvp__choice">
                      <input type="radio" name="kehadiran" value="tidak" />
                      Tidak hadir
                    </label>
                  </fieldset>
                  <button type="submit">Hantar</button>
                </form>
              ) : (
                <p className="doodle-prose">
                  {rsvp === "yes"
                    ? "Yay — jumpa kat majlis! (demo)"
                    : "Doa restu diterima. Terima kasih! (demo)"}
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal as="footer" variant="from-top" className="doodle-footer">
              <p>{invite.footer}</p>
              <p className="doodle-footer__names">{names}</p>
              <StudioCredit className="doodle-footer__studio" />
            </ScrollReveal>
          </div>

          {!preview.isEmbed ? (
            <button type="button" className="doodle-back-cover" onClick={() => setOpen(false)}>
              Cover
            </button>
          ) : null}
        </main>
      )}
    </div>
  );
}
