import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortfolioLivePreview } from "../../components/portfolio/PortfolioLivePreview";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_ITEMS,
  type PortfolioCategory,
} from "../../data/portfolioCatalog";
import { STUDIO_HANDLE, STUDIO_NAME, STUDIO_PACKAGES_COMING_SOON, STUDIO_TAGLINE } from "../../data/studioBrand";
import { useHiddenPortfolioIds } from "../../hooks/useHiddenPortfolioIds";
import { usePortfolioDescriptions } from "../../hooks/usePortfolioDescriptions";
import { resolvedPortfolioDescription } from "../../lib/portfolioDescriptions";
import { buildPortfolioDemoPath, buildPortfolioEmbedPath } from "../../lib/portfolioPreview";
import "../../styles/portfolio.css";

const PAGE_TITLE = `${STUDIO_NAME} — Portfolio`;

export function PortfolioPage() {
  const hiddenIds = useHiddenPortfolioIds();
  const descriptions = usePortfolioDescriptions();
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "all">("all");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = prev;
    };
  }, []);

  const filtered = useMemo(() => {
    const visible = PORTFOLIO_ITEMS.filter((item) => !hiddenIds.includes(item.id));
    if (activeCategory === "all") return visible;
    return visible.filter((item) => item.category === activeCategory);
  }, [activeCategory, hiddenIds]);

  return (
    <main className="portfolio-page" lang="ms">
      <div className="portfolio-page__decor" aria-hidden>
        <span className="portfolio-page__corner portfolio-page__corner--tl" />
        <span className="portfolio-page__corner portfolio-page__corner--tr" />
        <span className="portfolio-page__corner portfolio-page__corner--bl" />
        <span className="portfolio-page__corner portfolio-page__corner--br" />
      </div>

      <div className="portfolio-page__inner">
        <header className="portfolio-hero">
          <p className="portfolio-hero__eyebrow">@{STUDIO_HANDLE}</p>
          <h1 className="portfolio-hero__title">{STUDIO_NAME}</h1>
          <p className="portfolio-hero__lead">{STUDIO_TAGLINE}</p>
          <p className="portfolio-hero__note">
            Hover atau ketik play untuk animasi · Nama demo: Nama &amp; Nama
          </p>
        </header>

        <nav className="portfolio-filters" aria-label="Tapis reka bentuk">
          <button
            type="button"
            className={activeCategory === "all" ? "is-active" : undefined}
            onClick={() => setActiveCategory("all")}
          >
            Semua
          </button>
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={activeCategory === cat.id ? "is-active" : undefined}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <ul className="portfolio-grid">
          {filtered.map((item) => {
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
                        Main pratonton
                      </button>
                    ) : null}
                  </div>
                  <div className="portfolio-card__body">
                    <h2 className="portfolio-card__title">{item.title}</h2>
                    <p className="portfolio-card__desc">
                      {resolvedPortfolioDescription(item.id, item.description, descriptions)}
                    </p>
                    {item.tags?.length ? (
                      <ul className="portfolio-card__tags">
                        {item.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    ) : null}
                    <span className="portfolio-card__cta">Buka demo →</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <section className="portfolio-packages" aria-labelledby="portfolio-packages-title">
          <p className="portfolio-packages__kicker">Pakej</p>
          <h2 id="portfolio-packages-title" className="portfolio-packages__title">
            Harga &amp; pakej
          </h2>
          {STUDIO_PACKAGES_COMING_SOON ? (
            <p className="portfolio-packages__soon">
              Senarai pakej dan harga akan ditambah tidak lama lagi. Hubungi{" "}
              <span className="portfolio-packages__handle">@{STUDIO_HANDLE}</span> untuk sebut
              harga.
            </p>
          ) : null}
        </section>

        <footer className="portfolio-footer">
          <Link to="/" className="portfolio-footer__back">
            ← Kembali
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
