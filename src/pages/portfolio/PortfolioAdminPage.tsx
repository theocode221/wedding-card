import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_ITEMS,
  type PortfolioItem,
} from "../../data/portfolioCatalog";
import { STUDIO_HANDLE, STUDIO_NAME, STUDIO_PORTFOLIO_PATH } from "../../data/studioBrand";
import { useHiddenPortfolioIds } from "../../hooks/useHiddenPortfolioIds";
import { usePortfolioDescriptions } from "../../hooks/usePortfolioDescriptions";
import {
  resetPortfolioDescription,
  resolvedPortfolioDescription,
  writePortfolioDescription,
} from "../../lib/portfolioDescriptions";
import {
  hidePortfolioItem,
  isPortfolioAdminUnlocked,
  lockPortfolioAdmin,
  showPortfolioItem,
  unlockPortfolioAdmin,
} from "../../lib/portfolioVisibility";
import "../../styles/portfolio.css";

const PAGE_TITLE = `${STUDIO_NAME} — Admin portfolio`;

function AdminItemRow({
  item,
  isHidden,
  savedDescription,
}: {
  item: PortfolioItem;
  isHidden: boolean;
  savedDescription: string;
}) {
  const [draft, setDraft] = useState(savedDescription);
  const category = PORTFOLIO_CATEGORIES.find((cat) => cat.id === item.category)?.label;
  const dirty = draft.trim() !== savedDescription.trim();
  const isCustom = savedDescription.trim() !== item.description;

  useEffect(() => {
    setDraft(savedDescription);
  }, [savedDescription]);

  const save = () => {
    writePortfolioDescription(item.id, draft);
  };

  return (
    <li className={isHidden ? "is-hidden" : undefined}>
      <div className="portfolio-admin__copy">
        <p className="portfolio-admin__cat">{category}</p>
        <h2>{item.title}</h2>
        <label className="portfolio-admin__desc-label" htmlFor={`desc-${item.id}`}>
          Perihalan kad
        </label>
        <textarea
          id={`desc-${item.id}`}
          className="portfolio-admin__desc"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => {
            if (dirty) save();
          }}
        />
      </div>
      <div className="portfolio-admin__actions">
        <button type="button" onClick={save} disabled={!dirty}>
          Simpan
        </button>
        {isCustom ? (
          <button
            type="button"
            className="portfolio-admin__lock"
            onClick={() => resetPortfolioDescription(item.id)}
          >
            Asal
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => (isHidden ? showPortfolioItem(item.id) : hidePortfolioItem(item.id))}
        >
          {isHidden ? "Tunjuk semula" : "Sembunyi"}
        </button>
      </div>
    </li>
  );
}

export function PortfolioAdminPage() {
  const hiddenIds = useHiddenPortfolioIds();
  const descriptions = usePortfolioDescriptions();
  const hidden = new Set(hiddenIds);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setUnlocked(isPortfolioAdminUnlocked());
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = prev;
    };
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (unlockPortfolioAdmin(password)) {
      setUnlocked(true);
      setError(false);
      setPassword("");
      return;
    }
    setError(true);
  };

  if (!unlocked) {
    return (
      <main className="portfolio-page portfolio-admin" lang="ms">
        <div className="portfolio-page__inner">
          <header className="portfolio-hero">
            <p className="portfolio-hero__eyebrow">@{STUDIO_HANDLE}</p>
            <h1 className="portfolio-hero__title">Admin</h1>
            <p className="portfolio-hero__lead">Masuk untuk pilih kad yang dipaparkan di demo.</p>
          </header>
          <form className="portfolio-admin__gate" onSubmit={onSubmit}>
            <label htmlFor="portfolio-admin-password">Kata laluan</label>
            <input
              id="portfolio-admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(false);
              }}
            />
            {error ? <p className="portfolio-admin__error">Kata laluan tidak betul.</p> : null}
            <button type="submit">Masuk</button>
          </form>
          <footer className="portfolio-footer">
            <Link to={STUDIO_PORTFOLIO_PATH} className="portfolio-footer__back">
              ← Kembali ke demo
            </Link>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="portfolio-page portfolio-admin" lang="ms">
      <div className="portfolio-page__inner">
        <header className="portfolio-hero">
          <p className="portfolio-hero__eyebrow">@{STUDIO_HANDLE}</p>
          <h1 className="portfolio-hero__title">Admin portfolio</h1>
          <p className="portfolio-hero__lead">
            Sunting perihalan kad, atau tunjuk/sembunyi kad pada halaman demo. Kad lain ada dalam senarai ini jika mahu dipaparkan.
          </p>
        </header>

        <ul className="portfolio-admin__list">
          {PORTFOLIO_ITEMS.map((item) => (
            <AdminItemRow
              key={item.id}
              item={item}
              isHidden={hidden.has(item.id)}
              savedDescription={resolvedPortfolioDescription(item.id, item.description, descriptions)}
            />
          ))}
        </ul>

        <footer className="portfolio-footer">
          <Link to={STUDIO_PORTFOLIO_PATH} className="portfolio-footer__back">
            Lihat halaman demo →
          </Link>
          <button
            type="button"
            className="portfolio-admin__lock"
            onClick={() => {
              lockPortfolioAdmin();
              setUnlocked(false);
            }}
          >
            Log keluar
          </button>
        </footer>
      </div>
    </main>
  );
}
