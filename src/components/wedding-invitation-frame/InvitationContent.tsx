import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  INVITATION_PATH_DEFAULT,
  INVITATION_PATH_MAROON,
  type InvitationFlowState,
} from "../../lib/invitationFlow";
import { WEDDING_EVENT_START_ISO } from "../../lib/weddingCalendar";
import { WhatsAppContactLink } from "../shared/WhatsAppContactLink";
import { getRemaining, pad } from "../shared/countdownUtils";
import { AddToCalendar } from "./AddToCalendar";
import { NnMonogramLogo } from "../branding/NnMonogramLogo";

export type InvitationContentProps = {
  onReplay: () => void;
  /** Which framed invitation this card belongs to — drives Galeri / RSVP theme + back target */
  invitationFlowBase?: typeof INVITATION_PATH_DEFAULT | typeof INVITATION_PATH_MAROON;
};

const LOCATION_QUERY = encodeURIComponent("Hotel Pintar Parit Raja");
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${LOCATION_QUERY}`;
const WAZE_URL = `https://www.waze.com/ul?q=${LOCATION_QUERY}&navigate=yes`;

export function InvitationContent({
  onReplay,
  invitationFlowBase = INVITATION_PATH_DEFAULT,
}: InvitationContentProps) {
  const target = useMemo(() => new Date(WEDDING_EVENT_START_ISO), []);
  const satelliteState = useMemo<InvitationFlowState>(
    () => ({
      invitationReturnPath: invitationFlowBase,
      invitationSkin: invitationFlowBase === INVITATION_PATH_MAROON ? "maroon" : "default",
    }),
    [invitationFlowBase],
  );
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
        <NnMonogramLogo className="wif-invitation__monogram" />
        <p className="wif-invitation__hero-eyebrow">Jemputan Majlis Akad Nikah</p>
        <h1 className="wif-invitation__names"> NAIM &amp; NADHIRAH</h1>
        <p className="wif-invitation__hero-date">20 Disember 2026</p>
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
            <span className="wif-invitation__detail-value">Jumaat, 20 Disember 2026</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Masa</span>
            <span className="wif-invitation__detail-value">11:00 pagi – 4:00 petang</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Tempat</span>
            <span className="wif-invitation__detail-value">Hotel Pintar Parit Raja</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Alamat</span>
            <span className="wif-invitation__detail-value">
              JParit, 50480 Kuala Lumpur, Malaysia
            </span>
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
                href={WAZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLocationMenuOpen(false)}
              >
                Waze
              </a>
              <a
                className="wif-invitation__btn wif-invitation__btn--location-opt"
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLocationMenuOpen(false)}
              >
                Google Maps
              </a>
            </div>
          ) : null}
        </div>
        <AddToCalendar />
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
          Kira detik
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

      <div className="wif-invitation__actions">
        <div className="wif-invitation__actions-row wif-invitation__actions-row--primary">
          <Link to="/rsvp" state={satelliteState} className="wif-invitation__btn wif-invitation__btn--gold">
            RSVP
          </Link>
          <Link to="/galeri" state={satelliteState} className="wif-invitation__btn wif-invitation__btn--gold">
            Galeri
          </Link>
        </div>
        <div className="wif-invitation__actions-row wif-invitation__actions-row--replay">
          <button type="button" className="wif-invitation__btn wif-invitation__btn--ghost" onClick={onReplay}>
            Main semula
          </button>
        </div>
        <div className="wif-invitation__contact">
          <WhatsAppContactLink />
        </div>
      </div>

      <footer className="wif-invitation__footer">
        <p>Dengan penuh kasih sayang, kami yang menantikan hari bahagia.</p>
        <p className="wif-invitation__footer-sign"> NAIM &amp; NADHIRAH</p>
      </footer>
    </div>
  );
}
