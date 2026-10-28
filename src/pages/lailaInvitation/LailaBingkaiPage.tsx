import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { AppleBrandIcon, GoogleBrandIcon } from "../../components/wedding-invitation-frame/CalendarBrandIcons";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { LailaAturcara } from "./LailaAturcara";
import { LailaButterflies } from "./LailaButterflies";
import { LailaPageDecor, LailaSalamKhat, LailaSectionFlourish } from "./LailaPageDecor";
import { LailaUcapanSpotlight } from "./LailaUcapanSpotlight";
import { useLailaMusic } from "./LailaMusicContext";
import {
  downloadLailaIcs,
  getLailaGoogleCalendarUrl,
  LAILA_BINGKAI_PATH,
  LAILA_BUNGA_SIDE,
  LAILA_DETAILS_HASH,
  LAILA_GALLERY_PATH,
  LAILA_RSVP_PATH,
  LAILA_SALAM_LATIN,
  lailaCoupleLabel,
  lailaHasEventDate,
  lailaInviteForPreview,
  lailaPageTitleForInvite,
  lailaWhatsappForPreview,
  withLailaKadSearch,
} from "./lailaInviteData";
import "./laila-invitation.css";
import "./laila-bingkai.css";

function BingkaiSideFlowers({ variant }: { variant: "cover" | "details" }) {
  return (
    <div className={`lb-side-flowers lb-side-flowers--${variant}`} aria-hidden="true">
      <div className="lb-side-flower lb-side-flower--left">
        <img className="lb-side-flower__img" src={LAILA_BUNGA_SIDE} alt="" decoding="async" />
      </div>
      <div className="lb-side-flower lb-side-flower--right">
        <img
          className="lb-side-flower__img lb-side-flower__img--right"
          src={LAILA_BUNGA_SIDE}
          alt=""
          decoding="async"
        />
      </div>
    </div>
  );
}

type ActiveSheet = "none" | "contact" | "location" | "calendar";

/**
 * Alternative Laila & Hazziq card design (/laila/bingkai) answering the client's Page 3 sketch:
 * - Same Royal Maroon, Champagne-Gold Songket & Ivory/Gold theme as /laila
 * - Left & right vertical floral frames instead of top & bottom bouquets
 * - Clean, well-aligned typography with generous side clearance so every word is easy to read
 */
export function LailaBingkaiPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPreview } = usePortfolioPreviewMode();
  const { playFromStart: playLailaMusic } = useLailaMusic();
  const isOpen = location.hash.replace(/^#/, "") === LAILA_DETAILS_HASH;
  const invite = lailaInviteForPreview(isPreview);
  const whatsappContacts = lailaWhatsappForPreview(isPreview);
  const names = lailaCoupleLabel(invite);
  const kadSearch = withLailaKadSearch(location.search, "bingkai");
  const galleryTo = withPortfolioSearch(LAILA_GALLERY_PATH, kadSearch);
  const rsvpTo = withPortfolioSearch(LAILA_RSVP_PATH, kadSearch);
  const coverTo = withPortfolioSearch(LAILA_BINGKAI_PATH, kadSearch);
  const showCountdown = lailaHasEventDate(invite);
  const googleCalUrl = useMemo(() => getLailaGoogleCalendarUrl(invite), [invite]);
  const countdownTarget = useMemo(
    () => (showCountdown ? new Date(invite.weddingDateTime) : null),
    [invite.weddingDateTime, showCountdown],
  );
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>("none");
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
    if (activeSheet === "none") return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveSheet("none");
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeSheet]);

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
    navigate({
      pathname: location.pathname,
      search: kadSearch,
      hash: LAILA_DETAILS_HASH,
    });
  }, [kadSearch, location.pathname, navigate, playLailaMusic]);

  const backToCover = useCallback(() => {
    setActiveSheet("none");
    navigate(coverTo);
  }, [coverTo, navigate]);

  const toggleSheet = useCallback((sheet: Exclude<ActiveSheet, "none">) => {
    setActiveSheet((prev) => (prev === sheet ? "none" : sheet));
  }, []);

  const initials = `${invite.brideName.charAt(0).toUpperCase()} | ${invite.groomName.charAt(0).toUpperCase()}`;

  return (
    <div className={`laila-page lb-page${isOpen ? " laila-page--details" : " laila-page--cover"}`} lang="ms">
      <PortfolioBackToCatalog />

      {!isOpen ? (
        <header className="laila-cover lb-cover">
          <LailaButterflies />

          <div className="lb-cover__stage">
            <BingkaiSideFlowers variant="cover" />

            <div className="lb-cover__plaque">
              <div className="lb-monogram" aria-hidden="true">
                <span>{initials}</span>
              </div>

              <p className="lb-kicker">{invite.tagline}</p>
              <div className="lb-rule" aria-hidden="true" />

              <h1 className="lb-names" aria-label={names}>
                <span className="lb-name">{invite.brideName}</span>
                <span className="lb-amp">&amp;</span>
                <span className="lb-name">{invite.groomName}</span>
              </h1>

              <div className="lb-date-block">
                <span className="lb-date-day">{invite.dayLabel}</span>
                <span className="lb-date-num">{invite.date}</span>
              </div>

              <button
                type="button"
                className="lb-open-btn"
                onClick={openInvitation}
                aria-label="Buka jemputan"
              >
                <span className="lb-open-btn__label">Buka Jemputan</span>
                <svg className="lb-open-btn__icon" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M5.5 7.8 10 12.3l4.5-4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
      ) : (
        <>
          <main className="laila-main lb-main">
            <LailaPageDecor />
            <BingkaiSideFlowers variant="details" />

            <div className="laila-stack lb-stack">
              <section id="laila-jemputan">
                <ScrollReveal as="div" variant="from-top" className="laila-invite">
                  <LailaSalamKhat />
                  <p className="laila-salam-latin">{LAILA_SALAM_LATIN}</p>
                  <div className="laila-invite__rule" aria-hidden="true" />
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
                  <LailaSectionFlourish />
                </ScrollReveal>
              </section>

              <ScrollReveal as="section" variant="from-top" className="laila-details" delayMs={180}>
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
                <LailaSectionFlourish />
              </ScrollReveal>

              <LailaAturcara />

              {countdownTarget ? (
                <ScrollReveal as="section" variant="from-top" className="laila-chrono" delayMs={180}>
                  <LailaSectionFlourish className="laila-section-flourish laila-section-flourish--top" />
                  <h2 className="laila-title">Kira detik bahagia</h2>
                  {tick?.done ? (
                    <p className="laila-chrono__done">Alhamdulillah — jumpa di majlis.</p>
                  ) : (
                    <div className="laila-chrono__grid" role="timer" aria-live="polite" aria-atomic="true">
                      {countdownUnits.map((unit) => (
                        <div key={unit.label} className="laila-chrono__cell">
                          <span className="laila-chrono__num">
                            {unit.padValue ? pad(unit.value) : unit.value}
                          </span>
                          <span className="laila-chrono__unit">{unit.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollReveal>
              ) : null}

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
            <svg className="laila-back-cover__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10.8 5.2 4 12l6.8 6.8 1.4-1.4L7.8 13H20v-2H7.8l4.4-4.4-1.4-1.4z"
              />
            </svg>
          </button>

          {/* Quick-action pop-up sheet above bottom dock */}
          {activeSheet !== "none" ? (
            <div className="laila-sheet-backdrop" onClick={() => setActiveSheet("none")}>
              <div
                className="laila-sheet"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="laila-sheet__head">
                  <p className="laila-sheet__title">
                    {activeSheet === "contact"
                      ? "Hubungi Wakil Keluarga"
                      : activeSheet === "location"
                        ? "Pilih Aplikasi Navigasi"
                        : "Simpan ke Kalendar"}
                  </p>
                  <button
                    type="button"
                    className="laila-sheet__close"
                    onClick={() => setActiveSheet("none")}
                    aria-label="Tutup"
                  >
                    ✕
                  </button>
                </div>

                {activeSheet === "contact" ? (
                  <div className="laila-sheet__list">
                    {whatsappContacts.map((c) => (
                      <a
                        key={c.name}
                        className="laila-sheet__link"
                        href={c.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{c.name}</span>
                        <span className="laila-sheet__muted">WhatsApp {c.displayNumber}</span>
                      </a>
                    ))}
                  </div>
                ) : null}

                {activeSheet === "location" ? (
                  <div className="laila-sheet__list">
                    <a
                      className="laila-sheet__link"
                      href={invite.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setActiveSheet("none")}
                    >
                      <span>Google Maps</span>
                      <span className="laila-sheet__muted">{invite.venue}</span>
                    </a>
                    <a
                      className="laila-sheet__link"
                      href={invite.wazeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setActiveSheet("none")}
                    >
                      <span>Waze</span>
                      <span className="laila-sheet__muted">{invite.venue}</span>
                    </a>
                  </div>
                ) : null}

                {activeSheet === "calendar" ? (
                  <div className="laila-sheet__list">
                    {googleCalUrl ? (
                      <a
                        className="laila-sheet__link"
                        href={googleCalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setActiveSheet("none")}
                      >
                        <span className="laila-sheet__brand">
                          <GoogleBrandIcon className="laila-sheet__brand-icon" />
                          Google Calendar
                        </span>
                        <span className="laila-sheet__muted">Buka pautan</span>
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className="laila-sheet__link"
                      onClick={() => {
                        downloadLailaIcs();
                        setActiveSheet("none");
                      }}
                    >
                      <span className="laila-sheet__brand">
                        <AppleBrandIcon className="laila-sheet__brand-icon" />
                        Apple / Outlook (.ics)
                      </span>
                      <span className="laila-sheet__muted">Muat turun</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Sticky Bottom Navigation Dock (Royal Maroon & Gold, matching /laila) */}
          <nav className="laila-dock" aria-label="Tindakan pantas jemputan">
            <button
              type="button"
              className={`laila-dock__btn${activeSheet === "contact" ? " is-active" : ""}`}
              onClick={() => toggleSheet("contact")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.56 3.6.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.56 3.6a1 1 0 0 1-.25 1L6.6 10.8Z"
                />
              </svg>
              <span>Hubungi</span>
            </button>

            <button
              type="button"
              className={`laila-dock__btn${activeSheet === "location" ? " is-active" : ""}`}
              onClick={() => toggleSheet("location")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 1 1 18.5 10c0 5.2-6.5 11-6.5 11Z"
                />
                <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>Lokasi</span>
            </button>

            <button
              type="button"
              className={`laila-dock__btn${activeSheet === "calendar" ? " is-active" : ""}`}
              onClick={() => toggleSheet("calendar")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3.5"
                  y="5"
                  width="17"
                  height="15.5"
                  rx="2.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8 3.5v3M16 3.5v3M3.5 9.5h17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span>Kalendar</span>
            </button>

            <Link to={galleryTo} className="laila-dock__btn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3.5"
                  y="4.5"
                  width="17"
                  height="15"
                  rx="2.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="9" cy="9.5" r="1.5" fill="currentColor" />
                <path
                  d="m5.5 17 4.5-4.2 3.2 3 2.8-2.6 2.5 3.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Galeri</span>
            </Link>

            <Link to={rsvpTo} className="laila-dock__btn laila-dock__btn--primary">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.8 6.8h16.4a1.3 1.3 0 0 1 1.3 1.3v8.8a1.3 1.3 0 0 1-1.3 1.3H3.8a1.3 1.3 0 0 1-1.3-1.3V8.1a1.3 1.3 0 0 1 1.3-1.3Z"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m3.5 7.5 8.5 5.8 8.5-5.8"
                />
              </svg>
              <span>RSVP</span>
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
