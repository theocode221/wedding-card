import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WEDDING_EVENT_START_ISO } from "../../lib/weddingCalendar";
import { WhatsAppContactLink } from "../shared/WhatsAppContactLink";
import { getRemaining, pad } from "../shared/countdownUtils";
import { AddToCalendar } from "./AddToCalendar";

export type InvitationContentProps = {
  onReplay: () => void;
};

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Dewan+Perdana+Felda+Kuala+Lumpur";

export function InvitationContent({ onReplay }: InvitationContentProps) {
  const target = useMemo(() => new Date(WEDDING_EVENT_START_ISO), []);
  const [tick, setTick] = useState(() => getRemaining(target, new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(getRemaining(target, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <div className="wif-invitation">
      <header className="wif-invitation__hero">
        <p className="wif-invitation__hero-eyebrow">Jemputan perkahwinan</p>
        <h1 className="wif-invitation__names">NABIL &amp; ANIS</h1>
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
            <span className="wif-invitation__detail-value">Dewan Perdana Felda</span>
          </li>
          <li>
            <span className="wif-invitation__detail-label">Alamat</span>
            <span className="wif-invitation__detail-value">
              Jalan Perdana, 50480 Kuala Lumpur, Malaysia
            </span>
          </li>
        </ul>
        <a
          className="wif-invitation__btn wif-invitation__btn--primary"
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Lihat lokasi
        </a>
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
          <Link to="/rsvp" className="wif-invitation__btn wif-invitation__btn--gold">
            RSVP
          </Link>
          <Link to="/galeri" className="wif-invitation__btn wif-invitation__btn--gold">
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
        <p className="wif-invitation__footer-sign">NABIL &amp; ANIS</p>
      </footer>
    </div>
  );
}
