import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  INVITATION_PATH_MALAY_CLASSIC,
  skinFromInvitationPath,
  type InvitationFlowState,
} from "../../lib/invitationFlow";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { WhatsAppContactLink } from "../shared/WhatsAppContactLink";
import { getRemaining, pad } from "../shared/countdownUtils";
import { AppleBrandIcon, GoogleBrandIcon } from "./CalendarBrandIcons";
import {
  CLASSIC_ATURCARA,
  CLASSIC_SALAM_KHAT,
  CLASSIC_SALAM_LATIN,
  CLASSIC_TAGLINE_JAWI,
  CLASSIC_WHATSAPP,
  classicCoupleLabel,
  classicInviteForPreview,
  downloadClassicIcs,
  getClassicGoogleCalendarUrl,
} from "../../pages/malayClassicInvitation/classicInviteData";
import type { WhatsAppContact } from "../../data/contact";

export type MalayClassicFrameInvitationContentProps = {
  onReplay: () => void;
  demoMode?: boolean;
};

export function MalayClassicFrameInvitationContent({
  onReplay,
  demoMode = false,
}: MalayClassicFrameInvitationContentProps) {
  const location = useLocation();
  const invite = useMemo(() => classicInviteForPreview(demoMode), [demoMode]);
  const names = classicCoupleLabel(invite);
  const countdownIso = invite.weddingDateTime;
  const target = useMemo(() => new Date(countdownIso), [countdownIso]);

  const satelliteState = useMemo<InvitationFlowState>(
    () => ({
      invitationReturnPath: INVITATION_PATH_MALAY_CLASSIC,
      invitationSkin: skinFromInvitationPath(INVITATION_PATH_MALAY_CLASSIC),
    }),
    [],
  );
  const rsvpTo = withPortfolioSearch("/rsvp", location.search);

  const waContacts = useMemo<readonly WhatsAppContact[]>(
    () =>
      CLASSIC_WHATSAPP.map((c) => ({
        name: c.name,
        displayNumber: c.displayNumber,
        url: c.whatsappUrl,
      })),
    [],
  );

  const [tick, setTick] = useState(() => getRemaining(target, new Date()));
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement | null>(null);
  const calendarId = useId();

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(getRemaining(target, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  useEffect(() => {
    if (!isLocationMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const node = event.target;
      if (!(node instanceof Node)) return;
      if (!locationMenuRef.current?.contains(node)) setIsLocationMenuOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLocationMenuOpen(false);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isLocationMenuOpen]);

  const googleCal = getClassicGoogleCalendarUrl(invite);

  return (
    <div className="wif-invitation wif-invitation--malay-classic">
      <header className="wif-invitation__hero">
        <p className="wif-invitation__khat" lang="ar" dir="rtl">
          {CLASSIC_TAGLINE_JAWI}
        </p>
        <p className="wif-invitation__hero-eyebrow">Walimatul Urus</p>
        <h1 className="wif-invitation__names wif-invitation__names--script">{names}</h1>
        <p className="wif-invitation__hero-date">
          {invite.dayLabel}, {invite.date}
        </p>
        <p className="wif-invitation__hero-line">{invite.venue}</p>
      </header>

      <section className="wif-invitation__salam" aria-label="Salam">
        <p className="wif-invitation__khat wif-invitation__khat--salam" lang="ar" dir="rtl">
          {CLASSIC_SALAM_KHAT}
        </p>
        <p className="wif-invitation__salam-latin">{CLASSIC_SALAM_LATIN}</p>
      </section>

      <section className="wif-invitation__jemputan" aria-labelledby="wif-mc-jemputan">
        <h2 id="wif-mc-jemputan" className="wif-invitation__section-title wif-invitation__section-title--subtle">
          Jemputan
        </h2>
        <p className="wif-invitation__parents">
          {invite.fatherName}
          <br />
          &amp;
          <br />
          {invite.motherName}
        </p>
        <p className="wif-invitation__invite-copy">
          {invite.invitation.split("\n").map((line, i, lines) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
        <p className="wif-invitation__couple-note">{invite.coupleNote}</p>
        <p className="wif-invitation__couple-full">
          <span>{invite.brideFullName}</span>
          <span className="wif-invitation__couple-amp">&amp;</span>
          <span>{invite.groomFullName}</span>
        </p>
      </section>

      <section
        id="wif-invitation-details"
        className="wif-invitation__details"
        aria-labelledby="wif-details-heading"
      >
        <h2 id="wif-details-heading" className="wif-invitation__section-title">
          Butiran majlis
        </h2>
        <ul className="wif-invitation__detail-list">
          <li>
            <span className="wif-invitation__detail-label">Tarikh</span>
            <span className="wif-invitation__detail-value">
              {invite.dayLabel}, {invite.date}
            </span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Masa</span>
            <span className="wif-invitation__detail-value">{invite.timeLabel}</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Tempat</span>
            <span className="wif-invitation__detail-value">{invite.venue}</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Alamat</span>
            <span className="wif-invitation__detail-value">{invite.address}</span>
          </li>
        </ul>

        <div className="wif-invitation__location" ref={locationMenuRef}>
          <button
            type="button"
            className="wif-invitation__btn wif-invitation__btn--primary wif-invitation__btn--location"
            aria-expanded={isLocationMenuOpen}
            aria-controls="wif-mc-location-panel"
            onClick={() => setIsLocationMenuOpen((open) => !open)}
          >
            <span>Lihat lokasi</span>
            <span className="wif-invitation__location-chevron" aria-hidden>
              {isLocationMenuOpen ? "▲" : "▼"}
            </span>
          </button>
          {isLocationMenuOpen ? (
            <div id="wif-mc-location-panel" className="wif-invitation__location-panel">
              <a
                className="wif-invitation__btn wif-invitation__btn--location-opt"
                href={invite.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLocationMenuOpen(false)}
              >
                Waze
              </a>
              <a
                className="wif-invitation__btn wif-invitation__btn--location-opt"
                href={invite.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLocationMenuOpen(false)}
              >
                Google Maps
              </a>
            </div>
          ) : null}
        </div>

        {googleCal ? (
          <div className="wif-invitation__calendar">
            <button
              type="button"
              className="wif-invitation__btn wif-invitation__btn--calendar"
              aria-expanded={isCalendarOpen}
              aria-controls={calendarId}
              onClick={() => setIsCalendarOpen((v) => !v)}
            >
              <span>Tambah ke kalendar</span>
              <span className="wif-invitation__calendar-chevron" aria-hidden>
                {isCalendarOpen ? "▲" : "▼"}
              </span>
            </button>
            {isCalendarOpen ? (
              <div id={calendarId} className="wif-invitation__calendar-panel">
                <button
                  type="button"
                  className="wif-invitation__btn wif-invitation__btn--calendar-opt"
                  onClick={() => {
                    window.open(googleCal, "_blank", "noopener,noreferrer");
                    setIsCalendarOpen(false);
                  }}
                >
                  <GoogleBrandIcon />
                  Google Calendar
                </button>
                <button
                  type="button"
                  className="wif-invitation__btn wif-invitation__btn--calendar-opt wif-invitation__btn--calendar-opt-apple"
                  onClick={() => {
                    downloadClassicIcs(invite);
                    setIsCalendarOpen(false);
                  }}
                >
                  <AppleBrandIcon />
                  Apple Calendar
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="wif-invitation__aturcara" aria-labelledby="wif-mc-aturcara">
        <h2 id="wif-mc-aturcara" className="wif-invitation__section-title">
          Aturcara
        </h2>
        <ol className="wif-invitation__aturcara-list">
          {CLASSIC_ATURCARA.map((item) => (
            <li key={item.title}>
              <span className="wif-invitation__aturcara-time">{item.time}</span>
              <span className="wif-invitation__aturcara-title">{item.title}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wif-invitation__note" aria-labelledby="wif-note-heading">
        <h2 id="wif-note-heading" className="wif-invitation__section-title wif-invitation__section-title--subtle">
          Doa restu
        </h2>
        <p className="wif-invitation__note-text">{invite.footer}</p>
      </section>

      <section className="wif-invitation__countdown" aria-labelledby="wif-count-heading">
        <h2 id="wif-count-heading" className="wif-invitation__section-title">
          Menuju detik bahagia
        </h2>
        {tick.done ? (
          <p className="wif-invitation__countdown-done">Hari ini — jumpa di majlis.</p>
        ) : (
          <div className="wif-invitation__countdown-grid" role="timer" aria-live="polite">
            <div className="wif-invitation__countdown-unit">
              <span className="wif-invitation__countdown-value">{tick.days}</span>
              <span className="wif-invitation__countdown-label">Hari</span>
            </div>
            <div className="wif-invitation__countdown-unit">
              <span className="wif-invitation__countdown-value">{pad(tick.hours)}</span>
              <span className="wif-invitation__countdown-label">Jam</span>
            </div>
            <div className="wif-invitation__countdown-unit">
              <span className="wif-invitation__countdown-value">{pad(tick.minutes)}</span>
              <span className="wif-invitation__countdown-label">Minit</span>
            </div>
            <div className="wif-invitation__countdown-unit">
              <span className="wif-invitation__countdown-value">{pad(tick.seconds)}</span>
              <span className="wif-invitation__countdown-label">Saat</span>
            </div>
          </div>
        )}
      </section>

      <section className="wif-invitation__rsvp-cta" aria-labelledby="wif-rsvp-cta-heading">
        <h2 id="wif-rsvp-cta-heading" className="wif-invitation__section-title">
          Kehadiran anda bermakna
        </h2>
        <p className="wif-invitation__rsvp-cta-text">
          Sila sahkan kehadiran anda. Jawapan anda membantu kami merancang majlis dengan lebih baik.
        </p>
        <Link
          to={rsvpTo}
          state={satelliteState}
          className="wif-invitation__btn wif-invitation__btn--gold wif-invitation__btn--rsvp"
        >
          Sahkan kehadiran (RSVP)
        </Link>
        <p className="wif-invitation__rsvp-cta-note">Terima kasih. Maklum balas anda sangat bermakna.</p>
      </section>

      <div className="wif-invitation__actions">
        <div className="wif-invitation__actions-row wif-invitation__actions-row--replay">
          <button type="button" className="wif-invitation__btn wif-invitation__btn--ghost" onClick={onReplay}>
            Main semula
          </button>
        </div>
        <div className="wif-invitation__contact">
          <WhatsAppContactLink demo={demoMode} contacts={waContacts} />
        </div>
      </div>

      <footer className="wif-invitation__footer">
        <p>Dengan penuh kasih sayang, kami yang menantikan hari bahagia.</p>
        <p className="wif-invitation__footer-sign">{names}</p>
      </footer>
    </div>
  );
}
