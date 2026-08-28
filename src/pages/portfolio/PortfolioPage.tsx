import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortfolioLivePreview } from "../../components/portfolio/PortfolioLivePreview";
import { PORTFOLIO_ITEMS } from "../../data/portfolioCatalog";
import {
  STUDIO_HANDLE,
  STUDIO_NAME,
  STUDIO_PACKAGES,
  STUDIO_UI,
  STUDIO_WHATSAPP_DISPLAY,
  STUDIO_WHATSAPP_URL,
  studioText,
  type StudioLocale,
} from "../../data/studioBrand";
import { useHiddenPortfolioIds } from "../../hooks/useHiddenPortfolioIds";
import { buildPortfolioDemoPath, buildPortfolioEmbedPath } from "../../lib/portfolioPreview";
import { LAILA_DASHBOARD_PATH } from "../lailaInvitation/lailaInviteData";
import "../../styles/portfolio.css";

const PAGE_TITLE = `${STUDIO_NAME} — Portfolio`;

export function PortfolioPage() {
  const hiddenIds = useHiddenPortfolioIds();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [locale, setLocale] = useState<StudioLocale>("en");

  useEffect(() => {
    const prev = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = prev;
    };
  }, []);

  const items = useMemo(
    () => PORTFOLIO_ITEMS.filter((item) => !hiddenIds.includes(item.id)),
    [hiddenIds],
  );

  return (
    <main className="portfolio-page" lang={locale === "ms" ? "ms" : "en"}>
      <div className="portfolio-page__decor" aria-hidden>
        <span className="portfolio-page__corner portfolio-page__corner--tl" />
        <span className="portfolio-page__corner portfolio-page__corner--tr" />
        <span className="portfolio-page__corner portfolio-page__corner--bl" />
        <span className="portfolio-page__corner portfolio-page__corner--br" />
      </div>

      <div className="portfolio-page__inner">
        <header className="portfolio-hero">
          <div className="portfolio-hero__top">
            <p className="portfolio-hero__eyebrow">@{STUDIO_HANDLE}</p>
            <div className="portfolio-lang" role="group" aria-label="Language">
              <button
                type="button"
                className={locale === "en" ? "is-active" : undefined}
                onClick={() => setLocale("en")}
              >
                {STUDIO_UI.langEn.en}
              </button>
              <button
                type="button"
                className={locale === "ms" ? "is-active" : undefined}
                onClick={() => setLocale("ms")}
              >
                {STUDIO_UI.langMs.ms}
              </button>
            </div>
          </div>
          <h1 className="portfolio-hero__title">{STUDIO_NAME}</h1>
        </header>

        <ul className="portfolio-grid">
          {items.map((item) => {
            const playing = playingId === item.id;
            return (
              <li
                key={item.id}
                onMouseEnter={() => setPlayingId(item.id)}
                onMouseLeave={() => setPlayingId((id) => (id === item.id ? null : id))}
              >
                <Link to={buildPortfolioDemoPath(item.path)} className="portfolio-card">
                  <div className="portfolio-card__preview">
                    <PortfolioLivePreview
                      item={item}
                      src={buildPortfolioEmbedPath(item.path)}
                      playing={playing}
                    />
                    {!playing ? (
                      <button
                        type="button"
                        className="portfolio-card__play"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setPlayingId(item.id);
                        }}
                      >
                        {studioText(STUDIO_UI.playPreview, locale)}
                      </button>
                    ) : null}
                  </div>
                  <div className="portfolio-card__body">
                    <h2 className="portfolio-card__title">{item.title}</h2>
                    <span className="portfolio-card__cta">{studioText(STUDIO_UI.openDemo, locale)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="portfolio-more-note">{studioText(STUDIO_UI.moreDesigns, locale)}</p>

        <section className="portfolio-dashboard-demo" aria-labelledby="portfolio-dashboard-title">
          <h2 id="portfolio-dashboard-title" className="portfolio-dashboard-demo__title">
            {studioText(STUDIO_UI.dashboardTitle, locale)}
          </h2>
          <p className="portfolio-dashboard-demo__blurb">
            {studioText(STUDIO_UI.dashboardBlurb, locale)}
          </p>
          <Link
            to={buildPortfolioDemoPath(LAILA_DASHBOARD_PATH)}
            className="portfolio-dashboard-demo__cta"
          >
            {studioText(STUDIO_UI.dashboardCta, locale)}
          </Link>
        </section>

        <section className="portfolio-packages" aria-labelledby="portfolio-packages-title">
          <h2 id="portfolio-packages-title" className="portfolio-packages__title">
            {studioText(STUDIO_UI.pricingTitle, locale)}
          </h2>
          <ul className="portfolio-packages__list">
            {STUDIO_PACKAGES.map((pack) => (
              <li key={pack.id} className="portfolio-packages__card">
                <div className="portfolio-packages__card-top">
                  <p className="portfolio-packages__name">{studioText(pack.name, locale)}</p>
                  <p className="portfolio-packages__price">{pack.priceLabel}</p>
                </div>
                <p className="portfolio-packages__blurb">{studioText(pack.blurb, locale)}</p>
                <ul className="portfolio-packages__features">
                  {pack.features.map((feature) => (
                    <li key={feature.en}>{studioText(feature, locale)}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="portfolio-packages__contact">
            {studioText(STUDIO_UI.bookAsk, locale)}{" "}
            <a
              className="portfolio-packages__whatsapp"
              href={STUDIO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {STUDIO_WHATSAPP_DISPLAY}
            </a>
          </p>
        </section>

        <footer className="portfolio-footer">
          <Link to="/" className="portfolio-footer__back">
            {studioText(STUDIO_UI.back, locale)}
          </Link>
          <p className="portfolio-footer__credit">—{STUDIO_HANDLE}</p>
          <Link to="/theocodewedding/admin" className="portfolio-footer__admin">
            Admin
          </Link>
        </footer>
      </div>
    </main>
  );
}
