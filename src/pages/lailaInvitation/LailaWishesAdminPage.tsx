import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { withPortfolioSearch } from "../../lib/portfolioPreview";
import { LailaButterflies } from "./LailaButterflies";
import { LailaPetalRain } from "./LailaGalleryAtmosphere";
import { LailaSectionFlourish } from "./LailaPageDecor";
import {
  LAILA_WISHES_PATH,
  lailaCoupleLabel,
  lailaDetailsDestination,
  lailaInviteForPreview,
} from "./lailaInviteData";
import {
  fetchLailaWishesAdmin,
  readImageFileAsBase64,
  setLailaWishActive,
  upsertLailaWish,
  type LailaWishAdminRow,
} from "./lailaWishesAdminApi";
import { normalizeWishImageUrl } from "./lailaWishImageUrl";
import "./laila-invitation.css";

const CATEGORIES = ["Home", "Kitchen", "Living", "Bedroom", "Flexible", "General"];

const emptyForm = {
  title: "",
  description: "",
  category: "Kitchen",
  priceHint: "",
  link: "",
  imageUrl: "",
  qty: 1,
};

export function LailaWishesAdminPage() {
  const location = useLocation();
  const names = lailaCoupleLabel(lailaInviteForPreview(false));
  const publicWishesTo = withPortfolioSearch(LAILA_WISHES_PATH, location.search);
  const detailsTo = withPortfolioSearch(lailaDetailsDestination(location.search), location.search);

  const [rows, setRows] = useState<LailaWishAdminRow[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const load = useCallback(async () => {
    setLoadState("loading");
    setLoadError("");
    try {
      const next = await fetchLailaWishesAdmin();
      setRows(next);
      setLoadState("ready");
    } catch (err) {
      setLoadState("error");
      setLoadError(err instanceof Error ? err.message : "Could not load wishes.");
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = `Wishlist admin — ${names}`;
    return () => {
      document.title = prev;
    };
  }, [names]);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setImageFile(null);
    setSaveState("idle");
    setSaveError("");
  };

  const startEdit = (row: LailaWishAdminRow) => {
    setEditId(row.id);
    setForm({
      title: row.title,
      description: row.description ?? "",
      category: row.category || "General",
      priceHint: row.priceHint ?? "",
      link: row.link ?? "",
      imageUrl: row.imageUrl ?? "",
      qty: row.qty,
    });
    setImageFile(null);
    setSaveState("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setSaveState("error");
      setSaveError("Title is required.");
      return;
    }
    if (!imageFile && !editId) {
      setSaveState("error");
      setSaveError("Upload a product photo.");
      return;
    }
    if (!imageFile && editId && !form.imageUrl.trim()) {
      setSaveState("error");
      setSaveError("Upload a photo for this wish.");
      return;
    }

    setSaveState("saving");
    setSaveError("");

    try {
      let imageBase64: string | undefined;
      let imageMime: string | undefined;
      let imageName: string | undefined;
      if (imageFile) {
        const encoded = await readImageFileAsBase64(imageFile);
        imageBase64 = encoded.base64;
        imageMime = encoded.mime;
        imageName = encoded.name;
      }

      const result = await upsertLailaWish({
        id: editId ?? undefined,
        title,
        description: form.description.trim(),
        category: form.category,
        priceHint: form.priceHint.trim(),
        link: form.link.trim(),
        imageUrl: imageFile ? "" : form.imageUrl.trim(),
        qty: form.qty,
        imageBase64,
        imageMime,
        imageName,
      });

      if (result.ok === false) throw new Error(result.error || "Save failed.");

      setSaveState("ok");
      resetForm();
      await load();
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Could not save.");
    }
  };

  const onHide = async (id: string) => {
    if (!window.confirm("Hide this wish from the public list?")) return;
    try {
      await setLailaWishActive(id, false);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Could not update.");
    }
  };

  const onRestore = async (id: string) => {
    try {
      await setLailaWishActive(id, true);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Could not update.");
    }
  };

  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return normalizeWishImageUrl(form.imageUrl);
  }, [imageFile, form.imageUrl]);

  useEffect(() => {
    if (!imageFile || !previewSrc.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(previewSrc);
  }, [imageFile, previewSrc]);

  return (
    <div className="laila-page laila-satellite laila-wishes-page laila-wishes-admin-page" lang="en">
      <div className="laila-wishes-page__decor" aria-hidden>
        <LailaButterflies density="sparse" accent="maroon" />
        <LailaPetalRain className="laila-wishes-page__petals" />
      </div>

      <div className="laila-satellite__inner laila-wishes-page__inner laila-wishes-admin-page__inner">
        <Link to={detailsTo} className="laila-satellite__back laila-satellite__back--top">
          ← Back to invitation
        </Link>

        <header className="laila-wishes__hero laila-wishes-admin__head">
          <p className="laila-kicker">Private</p>
          <h1 className="laila-wishes__title">Wishlist admin</h1>
          <p className="laila-wishes__couple">{names}</p>
          <p className="laila-wishes__lead laila-wishes-admin__lead">
            Add gifts for guests to grant. Upload one product photo per wish — guests will see it on the public wish
            page.
          </p>
          <div className="laila-wishes-admin__toolbar">
            <Link to={publicWishesTo} className="laila-wishes-admin__pill">
              View public page
            </Link>
            <button type="button" className="laila-wishes-admin__pill laila-wishes-admin__pill--ghost" onClick={() => void load()}>
              Refresh list
            </button>
          </div>
        </header>

        <LailaSectionFlourish className="laila-wishes__flourish laila-wishes-admin__flourish" />

        <form className="laila-wishes-admin__form laila-form" onSubmit={(e) => void onSubmit(e)} noValidate>
          <h2 className="laila-wishes-admin__form-title">{editId ? "Edit wish" : "Add wish"}</h2>

          <label className="laila-form__field">
            <span className="laila-form__label">Title</span>
            <input
              className="laila-form__input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              maxLength={120}
              placeholder="e.g. IKEA glass food container"
            />
          </label>

          <div className="laila-wishes-admin__form-row laila-wishes-admin__form-row--split">
            <label className="laila-form__field">
              <span className="laila-form__label">Category</span>
              <select
                className="laila-form__input"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="laila-form__field">
              <span className="laila-form__label">Quantity</span>
              <input
                className="laila-form__input laila-form__input--narrow laila-wishes-admin__qty"
                type="number"
                min={1}
                max={20}
                value={form.qty}
                onChange={(e) => setForm((f) => ({ ...f, qty: Math.max(1, Number(e.target.value) || 1) }))}
              />
            </label>
          </div>

          <div className="laila-wishes-admin__form-row laila-wishes-admin__form-row--split">
            <label className="laila-form__field">
              <span className="laila-form__label">Price hint (optional)</span>
              <input
                className="laila-form__input"
                value={form.priceHint}
                onChange={(e) => setForm((f) => ({ ...f, priceHint: e.target.value }))}
                placeholder="RM 69"
              />
            </label>

            <label className="laila-form__field">
              <span className="laila-form__label">Shop link (optional)</span>
              <input
                className="laila-form__input"
                type="url"
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                placeholder="https://…"
              />
            </label>
          </div>

          <label className="laila-form__field">
            <span className="laila-form__label">Note for guests (optional)</span>
            <textarea
              className="laila-form__textarea"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Colour preference, size, etc."
            />
          </label>

          <fieldset className="laila-wishes-admin__photo-block">
            <legend className="laila-form__label">Product photo (required)</legend>
            <p className="laila-wishes-admin__photo-hint">Take or choose a photo from your gallery. JPG, PNG, or WebP, under 4&nbsp;MB.</p>
            <label className="laila-form__field">
              <input
                className="laila-form__input laila-wishes-admin__file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                capture="environment"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {previewSrc ? (
              <div className="laila-wishes-admin__preview">
                <img src={previewSrc} alt="" referrerPolicy="no-referrer" />
              </div>
            ) : null}
            {editId && form.imageUrl && !imageFile ? (
              <p className="laila-wishes-admin__photo-hint">Current photo is kept until you upload a new one.</p>
            ) : null}
          </fieldset>

          {saveState === "error" && saveError ? (
            <p className="laila-form__error" role="alert">
              {saveError}
            </p>
          ) : null}
          {saveState === "ok" ? (
            <p className="laila-wishes-admin__ok" role="status">
              Saved to Google Sheet.
            </p>
          ) : null}

          <div className="laila-wishes-admin__form-actions">
            {editId ? (
              <button type="button" className="laila-btn laila-btn--pill laila-wishes-admin__cancel" onClick={resetForm}>
                Cancel edit
              </button>
            ) : null}
            <button type="submit" className="laila-btn laila-btn--maroon laila-btn--pill laila-wishes-admin__submit" disabled={saveState === "saving"}>
              {saveState === "saving" ? "Saving…" : editId ? "Update wish" : "Add wish"}
            </button>
          </div>
        </form>

        <section className="laila-wishes-admin__list" aria-labelledby="laila-admin-list">
          <h2 id="laila-admin-list" className="laila-wishes__section-title laila-wishes-admin__list-title">
            Your wishes
          </h2>

          {loadState === "loading" ? <p className="laila-wishes__empty">Loading…</p> : null}
          {loadState === "error" ? (
            <p className="laila-form__error" role="alert">
              {loadError}
            </p>
          ) : null}

          {loadState === "ready" && rows.length === 0 ? (
            <p className="laila-wishes__empty">No wishes yet. Add one above.</p>
          ) : null}

          {loadState === "ready" && rows.length > 0 ? (
            <ul className="laila-wishes-admin__items">
              {rows.map((row) => (
                <li key={row.id} className={`laila-wishes-admin__item${row.active === false ? " is-hidden" : ""}`}>
                  {row.imageUrl ? (
                    <img
                      className="laila-wishes-admin__thumb"
                      src={row.imageUrl}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="laila-wishes-admin__thumb laila-wishes-admin__thumb--empty">No image</div>
                  )}
                  <div className="laila-wishes-admin__item-body">
                    <div className="laila-wishes-admin__item-head">
                      <p className="laila-wishes-admin__item-title">{row.title}</p>
                      {row.active === false ? <span className="laila-wishes-admin__badge">Hidden</span> : null}
                    </div>
                    <p className="laila-wishes-admin__item-meta">
                      <span>{row.category}</span>
                      {row.priceHint ? <span>{row.priceHint}</span> : null}
                      <span>{row.grantedCount > 0 ? `${row.grantedCount}/${row.qty} granted` : `Qty ${row.qty}`}</span>
                    </p>
                    <div className="laila-wishes-admin__item-actions">
                      <button type="button" className="laila-wishes-admin__text-btn" onClick={() => startEdit(row)}>
                        Edit
                      </button>
                      {row.active === false ? (
                        <button type="button" className="laila-wishes-admin__text-btn" onClick={() => void onRestore(row.id)}>
                          Show again
                        </button>
                      ) : (
                        <button type="button" className="laila-wishes-admin__text-btn" onClick={() => void onHide(row.id)}>
                          Hide
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <footer className="laila-wishes-admin__foot">
          <p>
            If upload fails: Apps Script → run <strong>authorizeWishlistDrive_</strong> → Allow → Deploy new version.
          </p>
        </footer>
      </div>
    </div>
  );
}