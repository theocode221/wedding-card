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
  LAILA_SALAM_KHAT,
  LAILA_SALAM_LATIN,
  LAILA_TAGLINE_JAWI,
  LAILA_WHATSAPP_CONTACTS,
  lailaCoupleLabel,
  lailaHasEventDate,
  lailaInviteForPreview,
  lailaPageTitleForInvite,
} from "./lailaInviteData";
import { LailaAturcara } from "./LailaAturcara";
import { LailaButterflies } from "./LailaButterflies";
import { LailaCalendar } from "./LailaCalendar";
import { LailaPageDecor } from "./LailaPageDecor";
import { LailaUcapanSpotlight } from "./LailaUcapanSpotlight";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { useLailaMusic } from "./LailaMusicContext";
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
  const { playFromStart: playLailaMusic } = useLailaMusic();
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
    playLailaMusic();
    navigate({ pathname: location.pathname, hash: LAILA_DETAILS_HASH });
  }, [location.pathname, navigate, playLailaMusic]);

  const backToCover = useCallback(() => {
    navigate(LAILA_PATH);
  }, [navigate]);

  const brideWriteStart = 1.15;
  const ampDelay = brideWriteStart + invite.brideName.length * LETTER_STAGGER_S + 0.08;
  const groomWriteStart = ampDelay + 0.18;
  const dateDelay = groomWriteStart + invite.groomName.length * LETTER_STAGGER_S + 0.16;
  const venueDelay = dateDelay + 0.18;
  const buttonDelay = venueDelay + 0.22;

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
            <p className="laila-cover__kicker" lang="ar" dir="rtl">
              {LAILA_TAGLINE_JAWI}
            </p>
            <div className="laila-cover__rule" aria-hidden />
            <h1 className="laila-cover__names" aria-label={names}>
              <HandwrittenLine
                text={invite.brideName}
                className="laila-cover__name laila-cover__name--bride"
                delayStart={brideWriteStart}
              />
              <span className="laila-cover__amp" style={{ animationDelay: `${ampDelay}s` }}>
                &amp;
              </span>
              <HandwrittenLine
                text={invite.groomName}
                className="laila-cover__name"
                delayStart={groomWriteStart}
              />
            </h1>
            <p className="laila-cover__date" style={{ animationDelay: `${dateDelay}s` }}>
              <span className="laila-cover__day">{invite.dayLabel}</span>
              <span className="laila-cover__when">{invite.date}</span>
            </p>
            <p className="laila-cover__venue" style={{ animationDelay: `${venueDelay}s` }}>
              {invite.venue}, Kajang
            </p>
            <button
              type="button"
              className="laila-cover__open"
              style={{ animationDelay: `${buttonDelay}s` }}
              onClick={openInvitation}
              aria-label="Buka jemputan"
            >
              <svg className="laila-cover__open-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10.25" fill="none" />
                <path d="M8.2 10.4 12 14.2l3.8-3.8" fill="none" />
              </svg>
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
            <ScrollReveal as="div" variant="from-top" className="laila-invite">
              <p className="laila-khat laila-khat--salam" lang="ar" dir="rtl" aria-label={LAILA_SALAM_LATIN}>
                {LAILA_SALAM_KHAT}
              </p>
              <div className="laila-invite__rule" aria-hidden />
              <p className="laila-kicker">Jemputan</p>
              <p
                className="laila-parents"
                aria-label={`${invite.fatherName} & ${invite.motherName}`}
              >
                <span className="laila-parents__name">{invite.fatherName}</span>
                <span className="laila-parents__amp">&amp;</span>
                <span className="laila-parents__name">{invite.motherName}</span>
              </p>
              <p className="laila-prose laila-prose--invite">{invite.invitation}</p>
              <p
                className="laila-puteri"
                aria-label={`${invite.brideFullName}, ${invite.coupleNote}, ${invite.groomFullName}`}
              >
                <span className="laila-puteri__name">{invite.brideFullName}</span>
                <span className="laila-puteri__note">{invite.coupleNote}</span>
                <span className="laila-puteri__name">{invite.groomFullName}</span>
              </p>
            </ScrollReveal>
          </section>

          <ScrollReveal as="section" variant="from-top" className="laila-details" delayMs={1900}>
            <dl className="laila-spec">
              <div className="laila-spec__row">
                <dt className="laila-spec__k">Tarikh</dt>
                <dd className="laila-spec__v">
                  {invite.date} ({invite.dayLabel})
                </dd>
              </div>
              <div className="laila-spec__row">
                <dt className="laila-spec__k">Masa</dt>
                <dd className="laila-spec__v">{invite.timeLabel}</dd>
              </div>
              <div className="laila-spec__row">
                <dt className="laila-spec__k">Tempat</dt>
                <dd className="laila-spec__v">{invite.venue}</dd>
              </div>
              {invite.address ? (
                <div className="laila-spec__row">
                  <dt className="laila-spec__k">Alamat</dt>
                  <dd className="laila-spec__v">{invite.address}</dd>
                </div>
              ) : null}
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

            <div className="laila-contacts">
              <p className="laila-contacts__label">Nombor dihubungi</p>
              <div className="laila-contacts__list">
                {LAILA_WHATSAPP_CONTACTS.map((contact) => (
                  <a
                    key={contact.name}
                    className="laila-btn laila-btn--pill laila-btn--whatsapp"
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${contact.name} ${contact.displayNumber}`}
                  >
                    <svg className="laila-contacts__icon" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                      />
                    </svg>
                    <span className="laila-contacts__text">
                      <span className="laila-contacts__name">{contact.name}</span>
                      <span className="laila-contacts__number">{contact.displayNumber}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <LailaAturcara />

          {countdownTarget ? (
            <ScrollReveal as="section" variant="from-top" className="laila-chrono" delayMs={2400}>
              <p className="laila-kicker">Menanti</p>
              <h2 className="laila-title">Kira detik bahagia</h2>
              {tick?.done ? (
                <p className="laila-chrono__done">Alhamdulillah — jumpa di majlis.</p>
              ) : (
                <LailaCountdownGrid units={countdownUnits} />
              )}
            </ScrollReveal>
          ) : null}

          <ScrollReveal as="section" variant="from-top" className="laila-cta" rootMargin="0px 0px -18% 0px">
            <p className="laila-kicker">Kenangan</p>
            <h2 className="laila-title">Galeri</h2>
            <p className="laila-prose">Detik indah yang dirakam untuk dikenang bersama.</p>
            <Link to={LAILA_GALLERY_PATH} className="laila-btn laila-btn--pill">
              Buka galeri
            </Link>
          </ScrollReveal>

          <ScrollReveal as="section" variant="from-top" className="laila-cta" rootMargin="0px 0px -18% 0px">
            <p className="laila-kicker">Kehadiran</p>
            <h2 className="laila-title">Sahkan kehadiran</h2>
            <p className="laila-prose">
              Sila sahkan kehadiran anda. Jawapan anda membantu kami merancang majlis dengan lebih baik.
            </p>
            <Link to={LAILA_RSVP_PATH} className="laila-btn laila-btn--maroon laila-btn--pill">
              Sahkan kehadiran (RSVP)
            </Link>
          </ScrollReveal>

          <ScrollReveal as="div" variant="from-top">
            <LailaUcapanSpotlight />
          </ScrollReveal>

          <ScrollReveal as="footer" variant="from-top" className="laila-footer">
            <p className="laila-footer__text">{invite.footer}</p>
            <p className="laila-footer__names">{names}</p>
            <StudioCredit className="laila-footer__studio" />
          </ScrollReveal>
        </div>
      </main>
      <button
        type="button"
        className="laila-back-cover"
        onClick={backToCover}
        aria-label="Kembali ke kad"
      >
        <svg className="laila-back-cover__icon" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M10.8 5.2 4 12l6.8 6.8 1.4-1.4L7.8 13H20v-2H7.8l4.4-4.4-1.4-1.4z"
          />
        </svg>
      </button>
      </>
      )}
    </div>
  );
}
