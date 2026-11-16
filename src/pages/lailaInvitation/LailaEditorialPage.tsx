import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import {
  downloadLailaIcs,
  getLailaGoogleCalendarUrl,
  LAILA_DETAILS_HASH,
  LAILA_EDITORIAL_SIDE,
  LAILA_GALLERY_PATH,
  LAILA_PATH,
  LAILA_RSVP_PATH,
  withLailaMainSearch,
  LAILA_SALAM_LATIN,
  lailaCoupleLabel,
  lailaHasEventDate,
  lailaInviteForPreview,
  lailaPageTitleForInvite,
  lailaWhatsappForPreview,
} from "./lailaInviteData";
import { LailaAturcara } from "./LailaAturcara";
import { LailaButterflies } from "./LailaButterflies";
import { AppleBrandIcon, GoogleBrandIcon } from "../../components/wedding-invitation-frame/CalendarBrandIcons";
import { LailaSalamKhat, LailaSectionFlourish } from "./LailaPageDecor";
import { LailaUcapanWall } from "./LailaUcapanWall";
import { LailaPetalRain } from "./LailaGalleryAtmosphere";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { useLailaMusic } from "./LailaMusicContext";
import "./laila-invitation.css";
import "./laila-editorial.css";

type CountdownUnit = {
  label: string;
  value: number;
  padValue: boolean;
};

type QuickSheet = "none" | "contact" | "location" | "calendar";

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
 * Laila main card (/laila): grey editorial, `11.png` florals, serif cover.
 */
export function LailaEditorialPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPreview } = usePortfolioPreviewMode();
  const { playFromStart: playLailaMusic } = useLailaMusic();
  const isOpen = location.hash.replace(/^#/, "") === LAILA_DETAILS_HASH;
  const invite = lailaInviteForPreview(isPreview);
  const whatsappContacts = lailaWhatsappForPreview(isPreview);
  const names = lailaCoupleLabel(invite);
  const kadSearch = withLailaMainSearch(location.search);
  const galleryTo = withPortfolioSearch(LAILA_GALLERY_PATH, kadSearch);
  const rsvpTo = withPortfolioSearch(LAILA_RSVP_PATH, kadSearch);
  const coverTo = withPortfolioSearch(LAILA_PATH, kadSearch);
  const showCountdown = lailaHasEventDate(invite);
  const countdownTarget = useMemo(
    () => (showCountdown ? new Date(invite.weddingDateTime) : null),
    [invite.weddingDateTime, showCountdown],
  );
  const googleCalUrl = useMemo(() => getLailaGoogleCalendarUrl(invite), [invite]);
  const [activeSheet, setActiveSheet] = useState<QuickSheet>("none");
  const [coverReady, setCoverReady] = useState(false);

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

  /** Wait for cover art + fonts before starting motion — avoids first-open hitch on slow networks. */
  useEffect(() => {
    if (isOpen) return;

    let cancelled = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCoverReady(true);
      return;
    }

    setCoverReady(false);

    const coverAssets = [LAILA_EDITORIAL_SIDE];
    const preloads = coverAssets.map((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    const loadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const done = () => resolve();
        img.onload = () => {
          if (typeof img.decode === "function") {
            void img.decode().then(done).catch(done);
          } else {
            done();
          }
        };
        img.onerror = done;
        img.src = src;
      });

    const assetsReady = Promise.all(coverAssets.map(loadImage));
    const fontsReady =
      "fonts" in document ? document.fonts.ready.then(() => undefined).catch(() => undefined) : Promise.resolve();
    const timeout = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 2200);
    });

    void Promise.race([Promise.all([assetsReady, fontsReady]), timeout]).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (!cancelled) setCoverReady(true);
      });
    });

    return () => {
      cancelled = true;
      preloads.forEach((link) => link.remove());
    };
  }, [isOpen]);

  useEffect(() => {
    if (!countdownTarget) return;
    const id = window.setInterval(() => {
      setTick(getRemaining(countdownTarget, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [countdownTarget]);

  useEffect(() => {
    if (activeSheet === "none") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSheet("none");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const toggleSheet = useCallback((sheet: Exclude<QuickSheet, "none">) => {
    setActiveSheet((prev) => (prev === sheet ? "none" : sheet));
  }, []);

  return (
    <div
      className={`laila-page laila-editorial-page${isOpen ? " laila-page--details" : " laila-page--cover"}`}
      lang="ms"
    >
      <PortfolioBackToCatalog />
      {!isOpen ? (
      <header className={`le-cover${coverReady ? " le-cover--ready" : ""}`}>
        <img
          className="le-cover__floral"
          src={LAILA_EDITORIAL_SIDE}
          alt=""
          decoding="async"
          fetchPriority="high"
          draggable={false}
        />
        <div className="le-cover__writing">
          <p className="le-cover__kicker">{invite.tagline}</p>
          <div className="le-cover__rule" aria-hidden />
          <h1 className="le-cover__names" aria-label={names}>
            <span className="le-cover__name">{invite.brideName}</span>
            <span className="le-cover__amp">&amp;</span>
            <span className="le-cover__name">{invite.groomName}</span>
          </h1>
          <p className="le-cover__date">
            <span className="le-cover__day">{invite.dayLabel}</span>
            <span className="le-cover__when">{invite.date}</span>
          </p>
          <button type="button" className="le-cover__open" onClick={openInvitation} aria-label="Buka jemputan">
            <svg className="le-cover__open-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10.25" fill="none" />
              <path d="M8.2 10.4 12 14.2l3.8-3.8" fill="none" />
            </svg>
          </button>
        </div>
      </header>
      ) : (
      <>
      <main className="laila-main le-main">
        <div className="le-main__floral-bg" aria-hidden>
          <img
            className="le-main__floral"
            src={LAILA_EDITORIAL_SIDE}
            alt=""
            decoding="async"
            draggable={false}
          />
        </div>
        <LailaButterflies density="sparse" accent="maroon" />
        <LailaPetalRain className="le-main__petals" />
        <div className="le-main__content">
        <div className="le-main__panel">
        <div className="laila-stack">
          <section id="laila-jemputan">
            <ScrollReveal as="div" variant="from-top" className="laila-invite">
              <LailaSalamKhat />
              <p className="laila-salam-latin">{LAILA_SALAM_LATIN}</p>
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
                <LailaCountdownGrid units={countdownUnits} />
              )}
            </ScrollReveal>
          ) : null}

          <ScrollReveal as="footer" variant="from-top" className="laila-footer">
            <p className="laila-footer__text">{invite.footer}</p>
            <p className="laila-footer__names">{names}</p>
          </ScrollReveal>

          <ScrollReveal as="div" variant="from-top">
            <LailaUcapanWall />
            <StudioCredit className="laila-footer__studio" />
          </ScrollReveal>
        </div>
        </div>
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

      {/* Sticky Bottom Navigation Panel inspired by jemputan.me */}
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
