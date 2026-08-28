import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { CafeCalendar } from "./CafeCalendar";
import { CafeDecor } from "./CafeDecor";
import { cafeCoupleLabel, cafeInviteForPreview, cafePageTitle } from "./cafeInviteData";
import "./cafe-invitation.css";

/** Match CSS menu-open duration (+ small buffer). */
const OPEN_MS = 3000;

type Phase = "cover" | "opening" | "details";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Cafe wedding demo — menu cover lifts through steam into details. */
export function CafeInvitationPage() {
  const preview = usePortfolioPreviewMode();
  const invite = cafeInviteForPreview(preview.isPreview);
  const names = cafeCoupleLabel(invite);
  const [phase, setPhase] = useState<Phase>("cover");
  const [now, setNow] = useState(() => new Date());
  const [rsvp, setRsvp] = useState<"idle" | "yes" | "no">("idle");
  const [coverReady, setCoverReady] = useState(!preview.isEmbed);

  const isCover = phase === "cover" || phase === "opening";
  const isOpening = phase === "opening";
  const isDetails = phase === "details";

  useEffect(() => {
    document.title = cafePageTitle(invite);
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
    if (!isDetails) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [isDetails]);

  useEffect(() => {
    if (phase !== "opening") return;
    const id = window.setTimeout(() => setPhase("details"), OPEN_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const remaining = getRemaining(new Date(invite.weddingDateTime), now);

  const openInvitation = useCallback(() => {
    if (phase !== "cover") return;
    if (prefersReducedMotion()) {
      setPhase("details");
      return;
    }
    setPhase("opening");
  }, [phase]);

  const backToCover = useCallback(() => {
    setPhase("cover");
    setRsvp("idle");
  }, []);

  const onRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setRsvp(data.get("kehadiran") === "tidak" ? "no" : "yes");
  };

  return (
    <div
      className={[
        "cafe-page",
        isDetails ? "cafe-page--details" : "cafe-page--cover",
        isOpening ? "cafe-page--opening" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      lang="ms"
    >
      <PortfolioBackToCatalog />
      {isCover ? (
        <header className="cafe-cover" key={coverReady ? "cover-ready" : "cover-wait"}>
          {coverReady ? (
            <>
              <CafeDecor steamBurst={isOpening} />
              <div
                className={["cafe-menu", isOpening ? "cafe-menu--open" : ""].filter(Boolean).join(" ")}
              >
                <div className="cafe-cover__card">
                  <p className="cafe-cover__brand">{invite.cafeName}</p>
                  <p className="cafe-cover__kicker">{invite.kicker}</p>
                  <h1 className="cafe-cover__names" aria-label={names}>
                    <span className="cafe-cover__name">{invite.groomName}</span>
                    <span className="cafe-cover__amp">&amp;</span>
                    <span className="cafe-cover__name">{invite.brideName}</span>
                  </h1>
                  <p className="cafe-cover__desc">Satu meja. Dua hati. Seumur hidup.</p>
                  <div className="cafe-cover__row" aria-hidden>
                    <span>{invite.dayLabel}</span>
                    <span className="cafe-cover__dots" />
                    <span>{invite.date}</span>
                  </div>
                  <div className="cafe-cover__row cafe-cover__row--price" aria-hidden>
                    <span>RSVP</span>
                    <span className="cafe-cover__dots" />
                    <span>on the house</span>
                  </div>
                  {!isOpening ? (
                    <button type="button" className="cafe-cover__open" onClick={openInvitation}>
                      Buka menu
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </header>
      ) : (
        <main className="cafe-main">
          <CafeDecor dense />
          <div className="cafe-stack">
            <ScrollReveal as="section" variant="from-top" className="cafe-block">
              <p className="cafe-kicker">chef&apos;s note</p>
              <p className="cafe-title">{names}</p>
              <p className="cafe-prose">{invite.invitation}</p>
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="cafe-block" delayMs={160}>
              <p className="cafe-kicker">reservation</p>
              <dl className="cafe-spec">
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
                  <dt>Venue</dt>
                  <dd>
                    {invite.venue}
                    <span>{invite.address}</span>
                  </dd>
                </div>
              </dl>
              <div className="cafe-actions">
                <CafeCalendar invite={invite} />
                <a
                  className="cafe-btn cafe-btn--link"
                  href={invite.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  buka maps →
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="cafe-block" delayMs={280}>
              <p className="cafe-kicker">brew timer</p>
              {remaining.done ? (
                <p className="cafe-prose">Freshly served — jumpa di majlis!</p>
              ) : (
                <div className="cafe-chrono" role="timer" aria-live="polite" aria-atomic="true">
                  {[
                    { label: "Hari", value: pad(remaining.days) },
                    { label: "Jam", value: pad(remaining.hours) },
                    { label: "Minit", value: pad(remaining.minutes) },
                    { label: "Saat", value: pad(remaining.seconds) },
                  ].map((unit) => (
                    <div key={unit.label} className="cafe-chrono__cell">
                      <span className="cafe-chrono__num">{unit.value}</span>
                      <span className="cafe-chrono__unit">{unit.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="cafe-block" delayMs={380}>
              <p className="cafe-kicker">guest list</p>
              <p className="cafe-title cafe-title--small">Datang?</p>
              {rsvp === "idle" ? (
                <form className="cafe-rsvp" onSubmit={onRsvp}>
                  <label>
                    Nama
                    <input name="nama" type="text" autoComplete="name" required />
                  </label>
                  <fieldset>
                    <legend>Kehadiran</legend>
                    <label className="cafe-rsvp__choice">
                      <input type="radio" name="kehadiran" value="hadir" defaultChecked />
                      Hadir
                    </label>
                    <label className="cafe-rsvp__choice">
                      <input type="radio" name="kehadiran" value="tidak" />
                      Tidak hadir
                    </label>
                  </fieldset>
                  <button type="submit">Hantar</button>
                </form>
              ) : (
                <p className="cafe-prose">
                  {rsvp === "yes"
                    ? "Meja reserved — jumpa di majlis! (demo)"
                    : "Doa restu diterima. Terima kasih! (demo)"}
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal as="footer" variant="from-top" className="cafe-footer">
              <p>{invite.footer}</p>
              <p className="cafe-footer__names">{names}</p>
              <StudioCredit className="cafe-footer__studio" />
            </ScrollReveal>
          </div>

          {!preview.isEmbed ? (
            <button
              type="button"
              className="cafe-back-cover"
              onClick={backToCover}
              aria-label="Kembali ke kad"
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M10.8 5.2 4 12l6.8 6.8 1.4-1.4L7.8 13H20v-2H7.8l4.4-4.4-1.4-1.4z"
                />
              </svg>
            </button>
          ) : null}
        </main>
      )}
    </div>
  );
}
