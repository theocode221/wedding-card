import { useEffect, useLayoutEffect, useMemo, useState, type FormEvent } from "react";
import { fetchLailaWishes, grantLailaWish } from "./lailaWishesApi";
import { Link, useLocation } from "react-router-dom";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { LailaButterflies } from "./LailaButterflies";
import { LailaPetalRain } from "./LailaGalleryAtmosphere";
import { LailaSectionFlourish } from "./LailaPageDecor";
import {
  LAILA_HASHTAG,
  getLailaWishesScriptUrl,
  lailaCoupleLabel,
  lailaDetailsDestination,
  lailaInviteForPreview,
} from "./lailaInviteData";
import { LAILA_WISHES_DEMO, type LailaWish } from "./lailaWishesDemoData";
import "./laila-invitation.css";

function isFulfilled(wish: LailaWish): boolean {
  return wish.grantedCount >= wish.qty;
}

function grantedLabel(wish: LailaWish): string {
  if (wish.qty <= 1) return isFulfilled(wish) ? "Granted" : "Open";
  return `${wish.grantedCount} of ${wish.qty} granted`;
}

type WishCardProps = {
  wish: LailaWish;
  onGrant: (id: string) => void;
  subdued?: boolean;
  previewLoading?: boolean;
};

function WishCard({ wish, onGrant, subdued, previewLoading }: WishCardProps) {
  const fulfilled = isFulfilled(wish);
  const displayTitle = wish.title?.trim() || (previewLoading ? "Loading preview…" : "Wish");
  return (
    <article className={`laila-wishes__card${subdued ? " laila-wishes__card--granted" : ""}`}>
      <header className="laila-wishes__card-head">
        <h3 className="laila-wishes__card-title">{displayTitle}</h3>
        {subdued ? <span className="laila-wishes__ribbon">Granted</span> : null}
      </header>
      {previewLoading && wish.link && !wish.imageUrl ? (
        <div className="laila-wishes__thumb laila-wishes__thumb--skeleton" aria-hidden />
      ) : null}
      {wish.imageUrl ? (
        <a
          className="laila-wishes__thumb"
          href={wish.link || wish.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={wish.link ? 0 : -1}
          aria-hidden={wish.link ? undefined : true}
        >
          <img
            src={wish.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </a>
      ) : null}
      <div className="laila-wishes__card-body">
        {wish.description ? <p className="laila-wishes__desc">{wish.description}</p> : null}
        <div className="laila-wishes__meta">
          {wish.priceHint ? <span className="laila-wishes__price">{wish.priceHint}</span> : null}
          <span className={`laila-wishes__status${fulfilled ? " is-granted" : " is-open"}`}>{grantedLabel(wish)}</span>
        </div>
        {wish.link ? (
          <a className="laila-wishes__link" href={wish.link} target="_blank" rel="noopener noreferrer">
            View reference
          </a>
        ) : null}
      </div>
      {!subdued && !fulfilled ? (
        <button type="button" className="laila-btn laila-btn--maroon laila-btn--pill laila-wishes__grant-btn" onClick={() => onGrant(wish.id)}>
          Grant this wish
        </button>
      ) : null}
    </article>
  );
}

export function LailaWishesPage() {
  const location = useLocation();
  const { isPreview } = usePortfolioPreviewMode();
  const invite = lailaInviteForPreview(isPreview);
  const names = lailaCoupleLabel(invite);
  const detailsTo = withPortfolioSearch(lailaDetailsDestination(location.search), location.search);

  const [wishes, setWishes] = useState<LailaWish[]>(() =>
    isPreview ? LAILA_WISHES_DEMO.map((w) => ({ ...w })) : [],
  );
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(() =>
    isPreview ? "ready" : "loading",
  );
  const [loadError, setLoadError] = useState("");
  const [previewingIds] = useState<ReadonlySet<string>>(() => new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [grantName, setGrantName] = useState("");
  const [grantNote, setGrantNote] = useState("");
  const [grantStep, setGrantStep] = useState<"form" | "thanks">("form");
  const [grantSubmitting, setGrantSubmitting] = useState(false);
  const [grantError, setGrantError] = useState("");

  const activeWish = useMemo(() => wishes.find((w) => w.id === activeId) ?? null, [activeId, wishes]);

  const { openWishes, grantedWishes, categories } = useMemo(() => {
    const open: LailaWish[] = [];
    const granted: LailaWish[] = [];
    for (const w of wishes) {
      if (isFulfilled(w)) granted.push(w);
      else open.push(w);
    }
    const cats = [...new Set(open.map((w) => w.category))];
    return { openWishes: open, grantedWishes: granted, categories: cats };
  }, [wishes]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isPreview) return;

    let cancelled = false;
    const scriptUrl = getLailaWishesScriptUrl();

    async function load() {
      if (!scriptUrl) {
        setLoadState("error");
        setLoadError("Wish list is not connected yet.");
        setWishes([]);
        return;
      }

      setLoadState("loading");
      setLoadError("");
      try {
        const fromSheet = await fetchLailaWishes();
        if (cancelled) return;
        setWishes(fromSheet);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        setWishes([]);
        setLoadState("error");
        setLoadError(err instanceof Error ? err.message : "Could not load the wish list.");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isPreview]);

  useLayoutEffect(() => {
    const prev = document.title;
    document.title = `Grant a wish — ${names}`;
    return () => {
      document.title = prev;
    };
  }, [names]);

  const closeGrant = () => {
    setActiveId(null);
    setGrantName("");
    setGrantNote("");
    setGrantStep("form");
  };

  const openGrant = (id: string) => {
    setActiveId(id);
    setGrantStep("form");
    setGrantName("");
    setGrantNote("");
  };

  const onGrantSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = grantName.trim();
    if (!trimmed || !activeId || grantSubmitting) return;

    if (isPreview) {
      setWishes((prev) =>
        prev.map((w) => (w.id === activeId && !isFulfilled(w) ? { ...w, grantedCount: w.grantedCount + 1 } : w)),
      );
      setGrantStep("thanks");
      return;
    }

    setGrantSubmitting(true);
    setGrantError("");
    void (async () => {
      try {
        await grantLailaWish({ wishId: activeId, name: trimmed, note: grantNote });
        setWishes((prev) =>
          prev.map((w) => (w.id === activeId && !isFulfilled(w) ? { ...w, grantedCount: w.grantedCount + 1 } : w)),
        );
        setGrantStep("thanks");
      } catch (err) {
        setGrantError(err instanceof Error ? err.message : "Could not save your grant.");
      } finally {
        setGrantSubmitting(false);
      }
    })();
  };

  const wishesByCategory = (cat: string) => openWishes.filter((w) => w.category === cat);

  return (
    <div className="laila-page laila-satellite laila-wishes-page" lang="en">
      <PortfolioBackToCatalog />
      <div className="laila-wishes-page__decor" aria-hidden>
        <LailaButterflies density="sparse" accent="maroon" />
        <LailaPetalRain className="laila-wishes-page__petals" />
      </div>

      <div className="laila-satellite__inner laila-wishes-page__inner">
        <Link to={detailsTo} className="laila-satellite__back laila-satellite__back--top">
          ← Back to invitation
        </Link>

        <header className="laila-wishes__hero">
          <p className="laila-kicker">Granted</p>
          <h1 className="laila-wishes__title">Grant a wish</h1>
          <p className="laila-wishes__couple">Walimatul Urus · {names}</p>
          <p className="laila-wishes__lead">
            These are gentle ideas for our new home — not obligations. When you grant a wish, you are letting us know
            you intend to give it, so we do not receive the same gift twice. You do not pay through this page. Your
            presence and prayers mean the most to us.
          </p>
          <p className="laila-wishes__ui-note">Wish list is managed by the couple via their private admin link.</p>
        </header>

        <LailaSectionFlourish className="laila-wishes__flourish" />

        {loadState === "loading" ? <p className="laila-wishes__empty">Loading wish list…</p> : null}
        {loadState === "error" ? (
          <p className="laila-wishes__empty" role="alert">
            {loadError || "Could not load the wish list."}
          </p>
        ) : null}

        {loadState === "ready" && openWishes.length === 0 && grantedWishes.length === 0 ? (
          <p className="laila-wishes__empty">No wishes have been published yet. Please check back soon.</p>
        ) : null}

        {loadState === "ready" && openWishes.length === 0 && grantedWishes.length > 0 ? (
          <p className="laila-wishes__empty">Every wish on this list has been granted. Thank you for your kindness.</p>
        ) : null}

        {loadState === "ready" && openWishes.length > 0 ? (
          <div className="laila-wishes__sections">
            {categories.map((cat) => (
              <section key={cat} className="laila-wishes__section" aria-labelledby={`laila-wish-cat-${cat}`}>
                <h2 id={`laila-wish-cat-${cat}`} className="laila-wishes__section-title">
                  {cat}
                </h2>
                <ul className="laila-wishes__list">
                  {wishesByCategory(cat).map((wish) => (
                    <li key={wish.id}>
                      <WishCard wish={wish} onGrant={openGrant} previewLoading={previewingIds.has(wish.id)} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}

        {loadState === "ready" && grantedWishes.length > 0 ? (
          <section className="laila-wishes__section laila-wishes__section--granted" aria-labelledby="laila-wishes-granted">
            <h2 id="laila-wishes-granted" className="laila-wishes__section-title">
              Already granted
            </h2>
            <p className="laila-wishes__section-note">Thank you to everyone who has granted a wish — details stay private here.</p>
            <ul className="laila-wishes__list laila-wishes__list--granted">
              {grantedWishes.map((wish) => (
                <li key={wish.id}>
                  <WishCard wish={wish} onGrant={openGrant} subdued previewLoading={previewingIds.has(wish.id)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <footer className="laila-wishes__foot">
          <p className="laila-wishes__foot-text">
            Prefer only to attend? That is more than enough. We are grateful you are part of our day.
          </p>
          <p className="laila-wishes__hashtag">{isPreview ? names : LAILA_HASHTAG}</p>
          <p className="laila-wishes__event">Saturday · {invite.date}</p>
        </footer>
      </div>

      {activeWish ? (
        <div className="laila-wishes-grant" role="presentation" onClick={closeGrant}>
          <div
            className="laila-wishes-grant__panel"
            role="dialog"
            aria-labelledby="laila-grant-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {grantStep === "thanks" ? (
              <div className="laila-wishes-grant__thanks">
                <p className="laila-kicker">Thank you</p>
                <h2 id="laila-grant-title" className="laila-wishes-grant__title">
                  Wish granted
                </h2>
                <p className="laila-wishes__lead">
                  We have noted your promise for <strong>{activeWish.title}</strong>. See you at the majlis — and thank
                  you from the heart.
                </p>
                <button type="button" className="laila-btn laila-btn--maroon laila-btn--pill" onClick={closeGrant}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="laila-kicker">Grant</p>
                <h2 id="laila-grant-title" className="laila-wishes-grant__title">
                  {activeWish.title}
                </h2>
                <form className="laila-form laila-wishes-grant__form" onSubmit={onGrantSubmit} noValidate>
                  <label className="laila-form__field">
                    <span className="laila-form__label">Your name</span>
                    <input
                      className="laila-form__input"
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={80}
                      value={grantName}
                      onChange={(e) => setGrantName(e.target.value)}
                      placeholder="Full name"
                    />
                  </label>
                  <label className="laila-form__field">
                    <span className="laila-form__label">Note (optional)</span>
                    <textarea
                      className="laila-form__textarea"
                      name="note"
                      rows={2}
                      maxLength={200}
                      value={grantNote}
                      onChange={(e) => setGrantNote(e.target.value)}
                      placeholder="e.g. I will bring this on the wedding day"
                    />
                  </label>
                  {grantError ? (
                    <p className="laila-form__error" role="alert">
                      {grantError}
                    </p>
                  ) : null}
                  <div className="laila-wishes-grant__actions">
                    <button type="button" className="laila-btn laila-btn--pill laila-wishes-grant__cancel" onClick={closeGrant}>
                      Cancel
                    </button>
                    <button type="submit" className="laila-btn laila-btn--maroon laila-btn--pill" disabled={grantSubmitting}>
                      {grantSubmitting ? "Saving…" : "Confirm grant"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}