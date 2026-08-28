import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PORTFOLIO_DEMO_ADDRESS,
  PORTFOLIO_DEMO_COUPLE_DISPLAY,
  PORTFOLIO_DEMO_DATE_LONG,
  PORTFOLIO_DEMO_MAPS_URL,
  PORTFOLIO_DEMO_VENUE,
  PORTFOLIO_DEMO_WAZE_URL,
  PORTFOLIO_DEMO_WEDDING_ISO,
} from "../../data/portfolioDemoNames";
import {
  INVITATION_PATH_DEFAULT,
  skinFromInvitationPath,
  type InvitationFlowState,
  type InvitationFramePath,
} from "../../lib/invitationFlow";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { WEDDING_EVENT_START_ISO } from "../../lib/weddingCalendar";
import { WhatsAppContactLink } from "../shared/WhatsAppContactLink";
import { getRemaining, pad } from "../shared/countdownUtils";
import { AddToCalendar } from "./AddToCalendar";
import { NnMonogramLogo } from "../branding/NnMonogramLogo";

export type InvitationContentProps = {
  onReplay: () => void;
  /** Which framed invitation this card belongs to — drives Galeri / RSVP theme + back target */
  invitationFlowBase?: InvitationFramePath;
  /** Override couple names in hero + footer (e.g. demo). */
  coupleDisplayName?: string;
  /** Strip real client venue, address, contacts, calendar location. */
  demoMode?: boolean;
};

const LIVE_VENUE = "Hotel Pintar Parit Raja";
const LIVE_ADDRESS = "Parit Raja, 86400, Johor, Malaysia";
const LIVE_DATE = "27 September 2026";
const LIVE_DATE_DETAIL = "Ahad, 27 September 2026";
const LIVE_LOCATION_QUERY = encodeURIComponent("Hotel Pintar Parit Raja");
const LIVE_GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${LIVE_LOCATION_QUERY}`;
const LIVE_WAZE_URL = `https://www.waze.com/ul?q=${LIVE_LOCATION_QUERY}&navigate=yes`;

export function InvitationContent({
  onReplay,
  invitationFlowBase = INVITATION_PATH_DEFAULT,
  coupleDisplayName,
  demoMode = false,
}: InvitationContentProps) {
  const location = useLocation();
  const names = coupleDisplayName ?? (demoMode ? PORTFOLIO_DEMO_COUPLE_DISPLAY : "NAIM & NADHIRAH");
  const venue = demoMode ? PORTFOLIO_DEMO_VENUE : LIVE_VENUE;
  const address = demoMode ? PORTFOLIO_DEMO_ADDRESS : LIVE_ADDRESS;
  const heroDate = demoMode ? PORTFOLIO_DEMO_DATE_LONG.replace(/^[^,]+,\s*/, "") : LIVE_DATE;
  const detailDate = demoMode ? PORTFOLIO_DEMO_DATE_LONG : LIVE_DATE_DETAIL;
  const mapsUrl = demoMode ? PORTFOLIO_DEMO_MAPS_URL : LIVE_GOOGLE_MAPS_URL;
  const wazeUrl = demoMode ? PORTFOLIO_DEMO_WAZE_URL : LIVE_WAZE_URL;
  const countdownIso = demoMode ? PORTFOLIO_DEMO_WEDDING_ISO : WEDDING_EVENT_START_ISO;

  const target = useMemo(() => new Date(countdownIso), [countdownIso]);
  const satelliteState = useMemo<InvitationFlowState>(
    () => ({
      invitationReturnPath: invitationFlowBase,
      invitationSkin: skinFromInvitationPath(invitationFlowBase),
    }),
    [invitationFlowBase],
  );
  const rsvpTo = withPortfolioSearch("/rsvp", location.search);
  const [tick, setTick] = useState(() => getRemaining(target, new Date()));
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(getRemaining(target, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  useEffect(() => {
    if (!isLocationMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target;
      if (!(targetNode instanceof Node)) return;
      if (!locationMenuRef.current?.contains(targetNode)) {
        setIsLocationMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocationMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isLocationMenuOpen]);

  return (
    <div className="wif-invitation">
      <header className="wif-invitation__hero">
        {demoMode ? null : <NnMonogramLogo className="wif-invitation__monogram" />}
        <p className="wif-invitation__hero-eyebrow">Jemputan Majlis Akad Nikah</p>
        <h1 className="wif-invitation__names">{names}</h1>
        <p className="wif-invitation__hero-date">{heroDate}</p>
        <p className="wif-invitation__hero-line">
          Dengan penuh kesyukuran, kami menjemput anda ke majlis kami
        </p>
      </header>

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
            <span className="wif-invitation__detail-value">{detailDate}</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Masa</span>
            <span className="wif-invitation__detail-value">10:00 pagi – 2:00 petang</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Tempat</span>
            <span className="wif-invitation__detail-value">{venue}</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Alamat</span>
            <span className="wif-invitation__detail-value">{address}</span>
          </li>
        </ul>
        <div className="wif-invitation__location" ref={locationMenuRef}>
          <button
            type="button"
            className="wif-invitation__btn wif-invitation__btn--primary wif-invitation__btn--location"
            aria-expanded={isLocationMenuOpen}
            aria-controls="wif-location-panel"
            onClick={() => setIsLocationMenuOpen((open) => !open)}
          >
            <span>Lihat lokasi</span>
            <span className="wif-invitation__location-chevron" aria-hidden="true">
              {isLocationMenuOpen ? "▲" : "▼"}
            </span>
          </button>
          {isLocationMenuOpen ? (
            <div id="wif-location-panel" className="wif-invitation__location-panel">
              <a
                className="wif-invitation__btn wif-invitation__btn--location-opt"
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLocationMenuOpen(false)}
              >
                Waze
              </a>
              <a
                className="wif-invitation__btn wif-invitation__btn--location-opt"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLocationMenuOpen(false)}
              >
                Google Maps
              </a>
            </div>
          ) : null}
        </div>
        <AddToCalendar demoMode={demoMode} />
      </section>

      <section className="wif-invitation__note" aria-labelledby="wif-note-heading">
        <h2 id="wif-note-heading" className="wif-invitation__section-title wif-invitation__section-title--subtle">
          Suatu pesanan
        </h2>
        <p className="wif-invitation__note-text">
          Kehadiran dan doa anda amat dialu-alukan. Kami tidak sabar untuk berkongsi hari bahagia ini
          bersama keluarga dan rakan tersayang.
        </p>
      </section>

      <section className="wif-invitation__countdown" aria-labelledby="wif-count-heading">
        <h2 id="wif-count-heading" className="wif-invitation__section-title">
          Menuju detik bahagia:
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
          Sila sahkan kehadiran anda. Jawapan anda membantu kami merancang majlis dengan lebih baik
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
          <WhatsAppContactLink demo={demoMode} />
        </div>
      </div>

      <footer className="wif-invitation__footer">
        <p>Dengan penuh kasih sayang, kami yang menantikan hari bahagia.</p>
        <p className="wif-invitation__footer-sign">{names}</p>
      </footer>
    </div>
  );
}
