import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { ClassicAturcara } from "./ClassicAturcara";
import { ClassicCalendar } from "./ClassicCalendar";
import { IconGoogleMaps, IconPhone, IconPin, IconWaze } from "./ClassicActionIcons";
import { ClassicGlitter } from "./ClassicGlitter";
import { ClassicWishSpotlight } from "./ClassicWishSpotlight";
import {
  CLASSIC_COVER_PHOTO,
  CLASSIC_SALAM_KHAT,
  CLASSIC_SALAM_LATIN,
  CLASSIC_TAGLINE_JAWI,
  CLASSIC_WHATSAPP,
  classicCoupleLabel,
  classicHasEventDate,
  classicInviteForPreview,
  classicPageTitle,
} from "./classicInviteData";
import "./classic-invitation.css";

type Phase = "cover" | "details";

/** Malay classic — full-bleed photo cover, gold accents, soft floral sprays. */
export function MalayClassicInvitationPage() {
  const preview = usePortfolioPreviewMode();
  const invite = classicInviteForPreview(preview.isPreview);
  const names = classicCoupleLabel(invite);
  const contacts = preview.isPreview
    ? CLASSIC_WHATSAPP.map((c) => ({ ...c, displayNumber: "012-000 0000", whatsappUrl: "#" }))
    : CLASSIC_WHATSAPP;
  const [phase, setPhase] = useState<Phase>("cover");
  const [coverReady, setCoverReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [rsvp, setRsvp] = useState<"idle" | "yes" | "no">("idle");
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement | null>(null);

  const isCover = phase === "cover";
  const isDetails = phase === "details";
  const showCountdown = classicHasEventDate(invite);

  useEffect(() => {
    document.title = classicPageTitle(invite);
  }, [invite]);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCoverReady(true);
      return;
    }

    setCoverReady(false);
    const img = new Image();
    const mark = () => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (!cancelled) setCoverReady(true);
      });
    };
    img.onload = () => {
      if (typeof img.decode === "function") {
        void img.decode().then(mark).catch(mark);
      } else {
        mark();
      }
    };
    img.onerror = mark;
    img.src = CLASSIC_COVER_PHOTO;
    const timeout = window.setTimeout(mark, 2400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!isDetails || !showCountdown) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [isDetails, showCountdown]);

  useEffect(() => {
    document.body.style.overflow = isCover ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCover]);

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

  const remaining = getRemaining(new Date(invite.weddingDateTime), now);

  const openInvitation = useCallback(() => {
    if (phase !== "cover") return;
    setPhase("details");
    window.scrollTo(0, 0);
  }, [phase]);

  const backToCover = useCallback(() => {
    setPhase("cover");
    setRsvp("idle");
    setIsLocationMenuOpen(false);
  }, []);

  const onRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (preview.isPreview) {
      setRsvp("yes");
      return;
    }
    const data = new FormData(event.currentTarget);
    setRsvp(data.get("kehadiran") === "tidak" ? "no" : "yes");
  };

  return (
    <div
      className={`classic-page${isDetails ? " classic-page--details" : " classic-page--cover"}`}
      lang="ms"
    >
      <PortfolioBackToCatalog />

      {isCover ? (
        <header className={`classic-cover${coverReady ? " classic-cover--ready" : ""}`}>
          <div className="classic-cover__photo-wrap" aria-hidden>
            <img
              className="classic-cover__photo"
              src={CLASSIC_COVER_PHOTO}
              alt=""
              width={1600}
              height={2400}
              decoding="async"
              fetchPriority="high"
            />
            <div className="classic-cover__veil" />
          </div>

          <ClassicGlitter />

          <div className="classic-cover__writing">
            <p className="classic-cover__kicker" lang="ar" dir="rtl">
              {CLASSIC_TAGLINE_JAWI}
            </p>
            <p className="classic-cover__kicker-lat">Walimatul Urus</p>
            <div className="classic-cover__rule" aria-hidden />
            <h1 className="classic-cover__names" aria-label={names}>
              <span className="classic-cover__name">{invite.brideName}</span>
              <span className="classic-cover__amp">&amp;</span>
              <span className="classic-cover__name">{invite.groomName}</span>
            </h1>
            <p className="classic-cover__meta">
              <span className="classic-cover__day">{invite.dayLabel}</span>
              <span className="classic-cover__when">{invite.date}</span>
            </p>
            <p className="classic-cover__venue">{invite.venue}</p>
            <button
              type="button"
              className="classic-cover__open"
              onClick={openInvitation}
              aria-label="Buka jemputan"
            >
              <svg className="classic-cover__open-icon" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="10.25" fill="none" />
                <path d="M8.2 10.4 12 14.2l3.8-3.8" fill="none" />
              </svg>
            </button>
          </div>
        </header>
      ) : (
        <main className="classic-main">
          <div className="classic-frame" aria-hidden>
            <span className="classic-frame__line classic-frame__line--outer" />
            <span className="classic-frame__line classic-frame__line--inner" />
            <span className="classic-frame__corner classic-frame__corner--tl" />
            <span className="classic-frame__corner classic-frame__corner--tr" />
            <span className="classic-frame__corner classic-frame__corner--bl" />
            <span className="classic-frame__corner classic-frame__corner--br" />
          </div>
          <ClassicGlitter />

          <button type="button" className="classic-back-cover" onClick={backToCover} aria-label="Kembali ke kad">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M15.5 5.5 9 12l6.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="classic-stack">
            <ScrollReveal as="section" variant="up" className="classic-invite">
              <p className="classic-khat" lang="ar" dir="rtl" aria-label={CLASSIC_SALAM_LATIN}>
                {CLASSIC_SALAM_KHAT}
              </p>
              <div className="classic-invite__rule" aria-hidden />
              <p className="classic-kicker">Jemputan</p>
              <p className="classic-parents">
                <span>{invite.fatherName}</span>
                <span className="classic-parents__amp">&amp;</span>
                <span>{invite.motherName}</span>
              </p>
              <p className="classic-prose">{invite.invitation}</p>
              <p className="classic-puteri">
                <span className="classic-puteri__name">{invite.brideFullName}</span>
                <span className="classic-puteri__note">{invite.coupleNote}</span>
                <span className="classic-puteri__name">{invite.groomFullName}</span>
              </p>
            </ScrollReveal>

            <ScrollReveal as="section" variant="up" className="classic-details" delayMs={120}>
              <dl className="classic-spec">
                <div className="classic-spec__row">
                  <dt>Tarikh</dt>
                  <dd>
                    {invite.date} ({invite.dayLabel})
                  </dd>
                </div>
                <div className="classic-spec__row">
                  <dt>Masa</dt>
                  <dd>{invite.timeLabel}</dd>
                </div>
                <div className="classic-spec__row">
                  <dt>Tempat</dt>
                  <dd>{invite.venue}</dd>
                </div>
                <div className="classic-spec__row">
                  <dt>Alamat</dt>
                  <dd>{invite.address}</dd>
                </div>
              </dl>
              <div className="classic-actions">
                <div className="classic-location" ref={locationMenuRef}>
                  <button
                    type="button"
                    className="classic-icon-btn"
                    aria-expanded={isLocationMenuOpen}
                    aria-label="Lihat lokasi"
                    title="Lihat lokasi"
                    onClick={() => setIsLocationMenuOpen((open) => !open)}
                  >
                    <IconPin className="classic-icon-btn__glyph" />
                  </button>
                  {isLocationMenuOpen ? (
                    <div className="classic-icon-menu" role="menu" aria-label="Pilih peta">
                      <a
                        className="classic-icon-menu__item"
                        href={invite.wazeUrl}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        aria-label="Buka di Waze"
                        title="Waze"
                        onClick={() => setIsLocationMenuOpen(false)}
                      >
                        <IconWaze className="classic-icon-menu__logo" />
                      </a>
                      <a
                        className="classic-icon-menu__item"
                        href={invite.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        aria-label="Buka di Google Maps"
                        title="Google Maps"
                        onClick={() => setIsLocationMenuOpen(false)}
                      >
                        <IconGoogleMaps className="classic-icon-menu__logo" />
                      </a>
                    </div>
                  ) : null}
                </div>
                <ClassicCalendar invite={invite} />
              </div>

              <div className="classic-contacts">
                <p className="classic-contacts__label">Nombor dihubungi</p>
                <div className="classic-contacts__list">
                  {contacts.map((contact) => (
                    <a
                      key={contact.name}
                      className="classic-contacts__link"
                      href={contact.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WhatsApp ${contact.name}`}
                      title={contact.name}
                    >
                      <span className="classic-icon-btn classic-icon-btn--wa" aria-hidden>
                        <IconPhone className="classic-icon-btn__glyph" />
                      </span>
                      <span className="classic-contacts__name">{contact.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ClassicAturcara />

            {showCountdown && !remaining.done ? (
              <ScrollReveal as="section" variant="up" className="classic-chrono" delayMs={180}>
                <p className="classic-kicker">Menanti</p>
                <h2 className="classic-title">Kira detik bahagia</h2>
                <div className="classic-chrono__grid" role="timer" aria-live="polite">
                  {[
                    { label: "Hari", value: remaining.days, pad: false },
                    { label: "Jam", value: remaining.hours, pad: true },
                    { label: "Minit", value: remaining.minutes, pad: true },
                    { label: "Saat", value: remaining.seconds, pad: true },
                  ].map((u) => (
                    <div key={u.label} className="classic-chrono__cell">
                      <span className="classic-chrono__num">{u.pad ? pad(u.value) : u.value}</span>
                      <span className="classic-chrono__unit">{u.label}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ) : null}

            <ScrollReveal as="section" variant="up" className="classic-rsvp" delayMs={200}>
              <p className="classic-kicker">Kehadiran</p>
              <h2 className="classic-title">Sahkan kehadiran</h2>
              <p className="classic-prose classic-rsvp__lead">
                Sila sahkan kehadiran anda. Tinggalkan juga sedikit doa &amp; ucapan.
              </p>
              {rsvp === "idle" ? (
                <form className="classic-rsvp__form" onSubmit={onRsvp}>
                  <label className="classic-field">
                    <span>Nama</span>
                    <input name="nama" required autoComplete="name" />
                  </label>
                  <fieldset className="classic-field classic-field--choice">
                    <legend>Kehadiran</legend>
                    <label>
                      <input type="radio" name="kehadiran" value="ya" defaultChecked />
                      Hadir
                    </label>
                    <label>
                      <input type="radio" name="kehadiran" value="tidak" />
                      Tidak hadir
                    </label>
                  </fieldset>
                  <label className="classic-field">
                    <span>Ucapan / doa</span>
                    <textarea name="ucapan" rows={3} placeholder="Doa dan ucapan anda…" />
                  </label>
                  <button type="submit" className="classic-btn">
                    Hantar RSVP
                  </button>
                  {preview.isPreview ? (
                    <p className="classic-rsvp__note">Demo — jawapan tidak dihantar.</p>
                  ) : null}
                </form>
              ) : (
                <p className="classic-rsvp__thanks">
                  {rsvp === "yes"
                    ? "Terima kasih — kami nantikan kehadiran dan doa anda."
                    : "Terima kasih atas maklum balas dan doa anda."}
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal as="div" variant="up" delayMs={220}>
              <ClassicWishSpotlight />
            </ScrollReveal>

            <footer className="classic-footer">
              <p className="classic-footer__text">{invite.footer}</p>
              <p className="classic-footer__names">{names}</p>
              <StudioCredit />
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}
