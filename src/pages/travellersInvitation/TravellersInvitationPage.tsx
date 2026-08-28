import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { TravellersCalendar } from "./TravellersCalendar";
import { TravellersDecor, TravellersTearEdge, TravellersTicketFrame } from "./TravellersDecor";
import {
  travellersCoupleLabel,
  travellersInviteForPreview,
  travellersPageTitle,
} from "./travellersInviteData";
import "./travellers-invitation.css";

/** Match CSS tear duration — buffer after the cinematic motion ends. */
const TEAR_MS = 3600;

type Phase = "cover" | "tearing" | "details";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function PassHeader({ kicker }: { kicker: string }) {
  return (
    <div className="travellers-pass__header">
      <p className="travellers-cover__airline">THEOCODE AIRWAYS</p>
      <p className="travellers-cover__kicker">{kicker}</p>
      <p className="travellers-cover__boarding">BOARDING PASS</p>
    </div>
  );
}

function PassBody({
  names,
  groomName,
  brideName,
  dayLabel,
  date,
  footer,
}: {
  names: string;
  groomName: string;
  brideName: string;
  dayLabel: string;
  date: string;
  footer?: ReactNode;
}) {
  return (
    <div className="travellers-pass__body">
      <h1 className="travellers-cover__names" aria-label={names}>
        <span className="travellers-cover__name">{groomName}</span>
        <span className="travellers-cover__amp">&amp;</span>
        <span className="travellers-cover__name">{brideName}</span>
      </h1>
      <div className="travellers-cover__route" aria-hidden>
        <span>KUL</span>
        <span className="travellers-cover__route-line" />
        <span>♥</span>
      </div>
      <p className="travellers-cover__date">
        <span>{dayLabel}</span>
        <span>{date}</span>
      </p>
      {footer}
    </div>
  );
}

/** Travellers wedding demo — boarding-pass cover tears open along the perforation. */
export function TravellersInvitationPage() {
  const preview = usePortfolioPreviewMode();
  const invite = travellersInviteForPreview(preview.isPreview);
  const names = travellersCoupleLabel(invite);
  const [phase, setPhase] = useState<Phase>("cover");
  const [now, setNow] = useState(() => new Date());
  const [rsvp, setRsvp] = useState<"idle" | "yes" | "no">("idle");
  const [coverReady, setCoverReady] = useState(!preview.isEmbed);

  const isCover = phase === "cover" || phase === "tearing";
  const isTearing = phase === "tearing";
  const isDetails = phase === "details";

  useEffect(() => {
    document.title = travellersPageTitle(invite);
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
    if (phase !== "tearing") return;
    const id = window.setTimeout(() => setPhase("details"), TEAR_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const remaining = getRemaining(new Date(invite.weddingDateTime), now);

  const openInvitation = useCallback(() => {
    if (phase !== "cover") return;
    if (prefersReducedMotion()) {
      setPhase("details");
      return;
    }
    setPhase("tearing");
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
        "travellers-page",
        isDetails ? "travellers-page--details" : "travellers-page--cover",
        isTearing ? "travellers-page--tearing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      lang="ms"
    >
      <PortfolioBackToCatalog />
      {isCover ? (
        <header className="travellers-cover" key={coverReady ? "cover-ready" : "cover-wait"}>
          {coverReady ? (
            <>
              <TravellersDecor planeExit={isTearing} />
              <div
                className={["travellers-pass", isTearing ? "travellers-pass--tearing" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {!isTearing ? (
                  <div className="travellers-cover__card travellers-pass__intact">
                    <TravellersTicketFrame />
                    <PassHeader kicker={invite.kicker} />
                    <div className="travellers-pass__perforation" aria-hidden />
                    <PassBody
                      names={names}
                      groomName={invite.groomName}
                      brideName={invite.brideName}
                      dayLabel={invite.dayLabel}
                      date={invite.date}
                      footer={
                        <button type="button" className="travellers-cover__open" onClick={openInvitation}>
                          Buka jemputan
                        </button>
                      }
                    />
                  </div>
                ) : (
                  <div className="travellers-pass__torn" aria-hidden>
                    <div className="travellers-pass__half travellers-pass__half--stub">
                      <div className="travellers-cover__card travellers-pass__piece travellers-pass__piece--stub">
                        <PassHeader kicker={invite.kicker} />
                        <TravellersTearEdge side="top" />
                      </div>
                    </div>
                    <div className="travellers-pass__half travellers-pass__half--main">
                      <div className="travellers-cover__card travellers-pass__piece travellers-pass__piece--main">
                        <TravellersTearEdge side="bottom" />
                        <PassBody
                          names={names}
                          groomName={invite.groomName}
                          brideName={invite.brideName}
                          dayLabel={invite.dayLabel}
                          date={invite.date}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </header>
      ) : (
        <main className="travellers-main">
          <TravellersDecor dense />
          <div className="travellers-stack">
            <ScrollReveal as="section" variant="from-top" className="travellers-block">
              <p className="travellers-kicker">destination</p>
              <p className="travellers-title">{names}</p>
              <p className="travellers-prose">{invite.invitation}</p>
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="travellers-block" delayMs={160}>
              <p className="travellers-kicker">itinerary</p>
              <dl className="travellers-spec">
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
              <div className="travellers-actions">
                <TravellersCalendar invite={invite} />
                <a
                  className="travellers-btn travellers-btn--link"
                  href={invite.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  buka maps →
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="travellers-block" delayMs={280}>
              <p className="travellers-kicker">countdown to departure</p>
              {remaining.done ? (
                <p className="travellers-prose">Welcome aboard — jumpa di majlis!</p>
              ) : (
                <div className="travellers-chrono" role="timer" aria-live="polite" aria-atomic="true">
                  {[
                    { label: "Hari", value: pad(remaining.days) },
                    { label: "Jam", value: pad(remaining.hours) },
                    { label: "Minit", value: pad(remaining.minutes) },
                    { label: "Saat", value: pad(remaining.seconds) },
                  ].map((unit) => (
                    <div key={unit.label} className="travellers-chrono__cell">
                      <span className="travellers-chrono__num">{unit.value}</span>
                      <span className="travellers-chrono__unit">{unit.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal as="section" variant="from-top" className="travellers-block" delayMs={380}>
              <p className="travellers-kicker">passenger check-in</p>
              <p className="travellers-title travellers-title--small">Datang?</p>
              {rsvp === "idle" ? (
                <form className="travellers-rsvp" onSubmit={onRsvp}>
                  <label>
                    Nama
                    <input name="nama" type="text" autoComplete="name" required />
                  </label>
                  <fieldset>
                    <legend>Kehadiran</legend>
                    <label className="travellers-rsvp__choice">
                      <input type="radio" name="kehadiran" value="hadir" defaultChecked />
                      Hadir
                    </label>
                    <label className="travellers-rsvp__choice">
                      <input type="radio" name="kehadiran" value="tidak" />
                      Tidak hadir
                    </label>
                  </fieldset>
                  <button type="submit">Hantar</button>
                </form>
              ) : (
                <p className="travellers-prose">
                  {rsvp === "yes"
                    ? "Seat secured — jumpa di majlis! (demo)"
                    : "Doa restu diterima. Terima kasih! (demo)"}
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal as="footer" variant="from-top" className="travellers-footer">
              <p>{invite.footer}</p>
              <p className="travellers-footer__names">{names}</p>
              <StudioCredit className="travellers-footer__studio" />
            </ScrollReveal>
          </div>

          {!preview.isEmbed ? (
            <button
              type="button"
              className="travellers-back-cover"
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
