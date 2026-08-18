import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import {
  LAILA_BUNGA_BOTTOM,
  LAILA_BUNGA_TOP,
  LAILA_COVER_BG,
  LAILA_DETAILS_HASH,
  LAILA_GALLERY_PATH,
  LAILA_PATH,
  LAILA_RSVP_PATH,
  lailaCoupleLabel,
  lailaHasEventDate,
  lailaInviteForPreview,
  lailaPageTitleForInvite,
} from "./lailaInviteData";
import { LailaButterflies } from "./LailaButterflies";
import { LailaCalendar } from "./LailaCalendar";
import { LailaPageDecor } from "./LailaPageDecor";
import { LailaUcapanSpotlight } from "./LailaUcapanSpotlight";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import "./laila-invitation.css";

const LETTER_STAGGER_S = 0.08;

function HandwrittenLine({
  text,
  className,
  delayStart = 0,
}: {
  text: string;
  className?: string;
  delayStart?: number;
}) {
  return (
    <span className={className} aria-hidden>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="laila-hand-char"
          style={{ animationDelay: `${delayStart + i * LETTER_STAGGER_S}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

type CountdownUnit = {
  label: string;
  value: number;
  padValue: boolean;
};

function LailaCountdownGrid({
  units,
  gridClassName = "laila-chrono__grid",
  cellClassName = "laila-chrono__cell",
  style,
}: {
  units: readonly CountdownUnit[];
  gridClassName?: string;
  cellClassName?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={gridClassName}
      style={style}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {units.map((unit) => (
        <div key={unit.label} className={cellClassName}>
          <span className="laila-chrono__num">
            {unit.padValue ? pad(unit.value) : unit.value}
          </span>
          <span className="laila-chrono__unit">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Standalone maroon Malay invitation for Laila / Lela KB.
 * Cover = oval artwork + names; details = cream paper, maroon type, flowers & butterflies.
 */
export function LailaInvitationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPreview } = usePortfolioPreviewMode();
  const isOpen = location.hash.replace(/^#/, "") === LAILA_DETAILS_HASH;
  const invite = lailaInviteForPreview(isPreview);
  const names = lailaCoupleLabel(invite);
  const showCountdown = lailaHasEventDate(invite);
  const countdownTarget = useMemo(
    () => (showCountdown ? new Date(invite.weddingDateTime) : null),
    [invite.weddingDateTime, showCountdown],
  );
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement | null>(null);

  const [tick, setTick] = useState(() =>
    countdownTarget ? getRemaining(countdownTarget, new Date()) : null,
  );

  useEffect(() => {
    const prev = document.title;
    document.title = lailaPageTitleForInvite(invite);
    return () => {
      document.title = prev;
    };
  }, [invite]);

  useEffect(() => {
    if (!countdownTarget) return;
    const id = window.setInterval(() => {
      setTick(getRemaining(countdownTarget, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [countdownTarget]);

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

  const countdownUnits = useMemo(() => {
    if (!tick || tick.done) return [];
    return [
      { label: "Hari", value: tick.days, padValue: false },
      { label: "Jam", value: tick.hours, padValue: true },
      { label: "Minit", value: tick.minutes, padValue: true },
      { label: "Saat", value: tick.seconds, padValue: true },
    ] as const;
  }, [tick]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openInvitation = useCallback(() => {
    navigate({ pathname: location.pathname, hash: LAILA_DETAILS_HASH });
  }, [location.pathname, navigate]);

  const backToCover = useCallback(() => {
    navigate(LAILA_PATH);
  }, [navigate]);

  const groomWriteStart = 1.15;
  const ampDelay = groomWriteStart + invite.groomName.length * LETTER_STAGGER_S + 0.08;
  const brideWriteStart = ampDelay + 0.18;
  const chronoDelay = brideWriteStart + invite.brideName.length * LETTER_STAGGER_S + 0.16;
  const showCoverCountdown = Boolean(countdownTarget && tick && !tick.done && countdownUnits.length);
  const buttonDelay = chronoDelay + (showCoverCountdown ? 0.32 : 0.12);

  return (
    <div className={`laila-page${isOpen ? " laila-page--details" : " laila-page--cover"}`} lang="ms">
      {!isOpen ? (
      <header className="laila-cover">
        <div className="laila-cover__garlands" aria-hidden>
          <img
            className="laila-garland laila-garland--top"
            src={LAILA_BUNGA_TOP}
            alt=""
            width={1080}
            height={1920}
            decoding="async"
          />
          <img
            className="laila-garland laila-garland--bottom"
            src={LAILA_BUNGA_BOTTOM}
            alt=""
            width={1080}
            height={1920}
            decoding="async"
          />
        </div>

        <LailaButterflies />

        <div className="laila-cover__frame">
          <img
            className="laila-cover__bg"
            src={LAILA_COVER_BG}
            alt=""
            width={1080}
            height={1920}
            decoding="async"
          />

          <div className="laila-cover__writing">
            <p className="laila-cover__kicker">{invite.tagline}</p>
            <div className="laila-cover__rule" aria-hidden />
            <h1 className="laila-cover__names" aria-label={names}>
              <HandwrittenLine
                text={invite.groomName}
                className="laila-cover__name"
                delayStart={groomWriteStart}
              />
              <span className="laila-cover__amp" style={{ animationDelay: `${ampDelay}s` }}>
                &amp;
              </span>
              <HandwrittenLine
                text={invite.brideName}
                className="laila-cover__name laila-cover__name--bride"
                delayStart={brideWriteStart}
              />
            </h1>
            {showCoverCountdown ? (
              <LailaCountdownGrid
                units={countdownUnits}
                gridClassName="laila-cover__chrono"
                cellClassName="laila-cover__chrono-cell"
                style={{ animationDelay: `${chronoDelay}s` }}
              />
            ) : null}
            <button
              type="button"
              className="laila-cover__open"
              style={{ animationDelay: `${buttonDelay}s` }}
              onClick={openInvitation}
            >
              Buka Jemputan
            </button>
          </div>
        </div>
      </header>
      ) : (
      <>
      <main className="laila-main">
        <LailaPageDecor />
        <div className="laila-stack">
          <section id="laila-jemputan">
            <ScrollReveal as="div" variant="up" className="laila-invite">
              <p className="laila-khat" lang="ar" dir="rtl">
                السَّلَامُ عَلَيْكُمْ
              </p>
              <div className="laila-invite__rule" aria-hidden />
              <p className="laila-kicker">Jemputan</p>
              <h2 className="laila-title">Meraih restu dan kehadiran</h2>
              <p className="laila-prose">{invite.invitation}</p>
            </ScrollReveal>
          </section>

          <ScrollReveal as="section" variant="up" className="laila-details">
            <p className="laila-kicker">Majlis</p>
            <h2 className="laila-title">Maklumat walimatul urus</h2>
            <dl className="laila-spec">
              <div className="laila-spec__row">
                <dt className="laila-spec__k">Tarikh</dt>
                <dd className="laila-spec__v">{invite.date}</dd>
              </div>
              <div className="laila-spec__row">
                <dt className="laila-spec__k">Masa</dt>
                <dd className="laila-spec__v">{invite.timeLabel}</dd>
              </div>
              <div className="laila-spec__row">
                <dt className="laila-spec__k">Tempat</dt>
                <dd className="laila-spec__v">{invite.venue}</dd>
              </div>
              <div className="laila-spec__row">
                <dt className="laila-spec__k">Alamat</dt>
                <dd className="laila-spec__v">{invite.address}</dd>
              </div>
            </dl>

            <div className="laila-actions">
              <div className="laila-location" ref={locationMenuRef}>
                <button
                  type="button"
                  className="laila-btn laila-btn--pill"
                  aria-expanded={isLocationMenuOpen}
                  aria-controls="laila-location-panel"
                  onClick={() => setIsLocationMenuOpen((open) => !open)}
                >
                  Lihat lokasi {isLocationMenuOpen ? "▴" : "▾"}
                </button>
                {isLocationMenuOpen ? (
                  <div id="laila-location-panel" className="laila-location__panel">
                    <a
                      className="laila-btn laila-btn--pill"
                      href={invite.wazeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsLocationMenuOpen(false)}
                    >
                      Waze
                    </a>
                    <a
                      className="laila-btn laila-btn--pill"
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
              <LailaCalendar />
            </div>
          </ScrollReveal>

          {countdownTarget ? (
            <ScrollReveal as="section" variant="from-zoom" className="laila-chrono">
              <p className="laila-kicker">Menanti</p>
              <h2 className="laila-title">Kira detik bahagia</h2>
              {tick?.done ? (
                <p className="laila-chrono__done">Alhamdulillah — jumpa di majlis.</p>
              ) : (
                <LailaCountdownGrid units={countdownUnits} />
              )}
            </ScrollReveal>
          ) : null}

          <ScrollReveal as="section" variant="up" className="laila-cta">
            <p className="laila-kicker">Kenangan</p>
            <h2 className="laila-title">Galeri</h2>
            <p className="laila-prose">Detik indah yang dirakam untuk dikenang bersama.</p>
            <Link to={LAILA_GALLERY_PATH} className="laila-btn laila-btn--pill">
              Buka galeri
            </Link>
          </ScrollReveal>

          <ScrollReveal as="section" variant="up" className="laila-cta">
            <p className="laila-kicker">Kehadiran</p>
            <h2 className="laila-title">Sahkan kehadiran</h2>
            <p className="laila-prose">
              Sila sahkan kehadiran anda. Jawapan anda membantu kami merancang majlis dengan lebih baik.
            </p>
            <Link to={LAILA_RSVP_PATH} className="laila-btn laila-btn--maroon laila-btn--pill">
              Sahkan kehadiran (RSVP)
            </Link>
          </ScrollReveal>

          <ScrollReveal as="div" variant="up">
            <LailaUcapanSpotlight />
          </ScrollReveal>

          <ScrollReveal as="footer" variant="up" className="laila-footer">
            <p className="laila-footer__text">{invite.footer}</p>
            <p className="laila-footer__names">{names}</p>
            <StudioCredit className="laila-footer__studio" />
          </ScrollReveal>
        </div>
      </main>
      <button type="button" className="laila-back-cover" onClick={backToCover}>
        ← Kembali ke kad
      </button>
      </>
      )}
    </div>
  );
}
