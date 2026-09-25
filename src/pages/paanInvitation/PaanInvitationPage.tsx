import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import { StudioCredit } from "../../components/studio/StudioCredit";
import { PortfolioBackToCatalog } from "../../components/portfolio/PortfolioBackToCatalog";
import { usePortfolioPreviewMode } from "../../hooks/usePortfolioPreviewMode";
import { submitRsvpToGoogleSheet } from "../../lib/rsvpGoogleSheet";
import {
  IconGoogleMaps,
  IconPhone,
  IconPin,
  IconWaze,
} from "../malayClassicInvitation/ClassicActionIcons";
import { PaanGlitter } from "./PaanGlitter";
import { usePaanMusic } from "./PaanMusicContext";
import {
  PAAN_ATURCARA,
  PAAN_RSVP_THEME,
  PAAN_SALAM_KHAT,
  PAAN_SALAM_LATIN,
  PAAN_TAGLINE_JAWI,
  PAAN_TRADITIONAL_FRAME,
  PAAN_WHATSAPP,
  downloadPaanIcs,
  getPaanGoogleCalendarUrl,
  getPaanRsvpScriptUrl,
  paanCoupleLabel,
  paanHasEventDate,
  paanInviteForPreview,
  paanPageTitle,
} from "./paanInviteData";
import "./paan-invitation.css";

type Phase = "cover" | "details";

/** Chocolate traditional classic — lace frame asset (`paan/traditional.png`). */
export function PaanInvitationPage() {
  const preview = usePortfolioPreviewMode();
  const { playFromStart: playPaanMusic } = usePaanMusic();
  const invite = paanInviteForPreview(preview.isPreview);
  const names = paanCoupleLabel(invite);
  const contacts = preview.isPreview
    ? PAAN_WHATSAPP.map((c) => ({ ...c, displayNumber: "012-000 0000", whatsappUrl: "#" }))
    : PAAN_WHATSAPP;

  const [phase, setPhase] = useState<Phase>("cover");
  const [coverReady, setCoverReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [rsvp, setRsvp] = useState<"idle" | "yes" | "no" | "sending">("idle");
  const [rsvpError, setRsvpError] = useState("");
  const [attendingChoice, setAttendingChoice] = useState<"ya" | "tidak">("ya");
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement | null>(null);

  const isCover = phase === "cover";
  const isDetails = phase === "details";
  const showCountdown = paanHasEventDate(invite);
  const googleCal = getPaanGoogleCalendarUrl(invite);

  useEffect(() => {
    document.title = paanPageTitle(invite);
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
    img.src = PAAN_TRADITIONAL_FRAME;
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
    if (!isLocationMenuOpen && !isCalendarOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const node = event.target;
      if (!(node instanceof Node)) return;
      if (locationMenuRef.current && !locationMenuRef.current.contains(node)) {
        setIsLocationMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocationMenuOpen(false);
        setIsCalendarOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isLocationMenuOpen, isCalendarOpen]);

  const remaining = getRemaining(new Date(invite.weddingDateTime), now);

  const openInvitation = useCallback(() => {
    if (phase !== "cover") return;
    playPaanMusic();
    setPhase("details");
    window.scrollTo(0, 0);
  }, [phase, playPaanMusic]);

  const backToCover = useCallback(() => {
    setPhase("cover");
    setRsvp("idle");
    setRsvpError("");
    setAttendingChoice("ya");
    setIsLocationMenuOpen(false);
    setIsCalendarOpen(false);
  }, []);

  const onRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rsvp === "sending") return;

    const data = new FormData(event.currentTarget);
    const name = String(data.get("nama") || "").trim();
    const attending = data.get("kehadiran") === "tidak" ? "no" : "yes";
    const message = String(data.get("ucapan") || "").trim();
    const guestsRaw = Math.floor(Number(data.get("tetamu")) || 1);
    const guests = attending === "no" ? 1 : Math.max(1, Math.min(10, guestsRaw));

    if (!name) {
      setRsvpError("Sila masukkan nama anda.");
      return;
    }

    if (preview.isPreview) {
      setRsvpError("");
      setRsvp(attending === "no" ? "no" : "yes");
      return;
    }

    const scriptUrl = getPaanRsvpScriptUrl();
    if (!scriptUrl) {
      setRsvpError("RSVP akan diaktifkan apabila Google Sheet klien sedia.");
      return;
    }

    setRsvp("sending");
    setRsvpError("");
    try {
      await submitRsvpToGoogleSheet(
        {
          name,
          attending,
          guests,
          message,
          theme: PAAN_RSVP_THEME,
        },
        scriptUrl,
      );
      setRsvp(attending === "no" ? "no" : "yes");
    } catch {
      setRsvp("idle");
      setRsvpError("Tidak dapat menghantar sekarang. Sila cuba lagi sebentar.");
    }
  };

  return (
    <div className={`paan-page${isDetails ? " paan-page--details" : " paan-page--cover"}`} lang="ms">
      <PortfolioBackToCatalog />

      {isCover ? (
        <header className={`paan-cover${coverReady ? " paan-cover--ready" : ""}`}>
          <div className="paan-cover__frame-wrap" aria-hidden>
            <div className="paan-ornament paan-ornament--tl">
              <img
                src={PAAN_TRADITIONAL_FRAME}
                alt=""
                width={900}
                height={1600}
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="paan-ornament paan-ornament--br">
              <img src={PAAN_TRADITIONAL_FRAME} alt="" width={900} height={1600} decoding="async" />
            </div>
            <div className="paan-cover__glow" />
            <PaanGlitter />
          </div>

          <div className="paan-cover__writing">
            <p className="paan-cover__khat paan-cover__line" lang="ar" dir="rtl">
              {PAAN_TAGLINE_JAWI}
            </p>
            <p className="paan-cover__kicker paan-cover__line">Walimatul Urus</p>
            <div className="paan-cover__rule paan-cover__line" aria-hidden />
            <h1 className="paan-cover__names" aria-label={names}>
              <span className="paan-cover__name paan-cover__line paan-cover__line--script">{invite.groomName}</span>
              <span className="paan-cover__amp paan-cover__line">&amp;</span>
              <span className="paan-cover__name paan-cover__line paan-cover__line--script">{invite.brideName}</span>
            </h1>
            <p className="paan-cover__meta paan-cover__line">
              <span>{invite.dayLabel}</span>
              <span className="paan-cover__dot" aria-hidden>
                ·
              </span>
              <span>{invite.date}</span>
            </p>
            <p className="paan-cover__venue paan-cover__line">{invite.venue}</p>
            <button
              type="button"
              className="paan-cover__open paan-cover__line"
              onClick={openInvitation}
              aria-label="Buka jemputan"
            >
              <svg className="paan-cover__open-icon" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="10.25" fill="none" />
                <path d="M8.2 10.4 12 14.2l3.8-3.8" fill="none" />
              </svg>
              <span className="paan-cover__open-label">Buka</span>
            </button>
          </div>
        </header>
      ) : (
        <main className="paan-main">
          <div className="paan-main__frame" aria-hidden>
            <div className="paan-ornament paan-ornament--tl">
              <img src={PAAN_TRADITIONAL_FRAME} alt="" width={900} height={1600} decoding="async" />
            </div>
            <div className="paan-ornament paan-ornament--br">
              <img src={PAAN_TRADITIONAL_FRAME} alt="" width={900} height={1600} decoding="async" />
            </div>
          </div>

          <button type="button" className="paan-back" onClick={backToCover} aria-label="Kembali ke kad">
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

          <div className="paan-stack">
            <ScrollReveal as="section" variant="up" className="paan-invite">
              <p className="paan-khat" lang="ar" dir="rtl" aria-label={PAAN_SALAM_LATIN}>
                {PAAN_SALAM_KHAT}
              </p>
              <div className="paan-rule" aria-hidden />
              <p className="paan-kicker">Jemputan</p>
              <p className="paan-parents">
                {invite.parentNote ? (
                  <>
                    <span>{invite.motherName}</span>
                    <span className="paan-parents__note">{invite.parentNote}</span>
                  </>
                ) : (
                  <>
                    <span>{invite.fatherName}</span>
                    <span className="paan-parents__amp">&amp;</span>
                    <span>{invite.motherName}</span>
                  </>
                )}
              </p>
              <p className="paan-prose">
                {invite.invitation.split("\n").map((line, i, lines) => (
                  <span key={i}>
                    {line}
                    {i < lines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
              <p className="paan-couple">
                <span className="paan-couple__name">{invite.groomFullName}</span>
                <span className="paan-couple__note">{invite.coupleNote}</span>
                <span className="paan-couple__name">{invite.brideFullName}</span>
              </p>
            </ScrollReveal>

            <ScrollReveal as="section" variant="up" className="paan-details" delayMs={100}>
              <dl className="paan-spec">
                <div className="paan-spec__row">
                  <dt>Tarikh</dt>
                  <dd>
                    {invite.date} ({invite.dayLabel})
                  </dd>
                </div>
                <div className="paan-spec__row">
                  <dt>Masa</dt>
                  <dd>{invite.timeLabel}</dd>
                </div>
                <div className="paan-spec__row">
                  <dt>Tempat</dt>
                  <dd>{invite.venue}</dd>
                </div>
                <div className="paan-spec__row">
                  <dt>Alamat</dt>
                  <dd>{invite.address}</dd>
                </div>
              </dl>

              <div className="paan-actions">
                <div className="paan-location" ref={locationMenuRef}>
                  <button
                    type="button"
                    className="paan-icon-btn"
                    aria-expanded={isLocationMenuOpen}
                    aria-label="Lihat lokasi"
                    title="Lihat lokasi"
                    onClick={() => {
                      setIsCalendarOpen(false);
                      setIsLocationMenuOpen((open) => !open);
                    }}
                  >
                    <IconPin className="paan-icon-btn__glyph" />
                  </button>
                  {isLocationMenuOpen ? (
                    <div className="paan-icon-menu" role="menu" aria-label="Pilih peta">
                      <a
                        className="paan-icon-menu__item"
                        href={invite.wazeUrl}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        aria-label="Buka di Waze"
                        title="Waze"
                        onClick={() => setIsLocationMenuOpen(false)}
                      >
                        <IconWaze className="paan-icon-menu__logo" />
                      </a>
                      <a
                        className="paan-icon-menu__item"
                        href={invite.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        role="menuitem"
                        aria-label="Buka di Google Maps"
                        title="Google Maps"
                        onClick={() => setIsLocationMenuOpen(false)}
                      >
                        <IconGoogleMaps className="paan-icon-menu__logo" />
                      </a>
                    </div>
                  ) : null}
                </div>

                {googleCal ? (
                  <div className="paan-calendar">
                    <button
                      type="button"
                      className="paan-btn paan-btn--soft"
                      aria-expanded={isCalendarOpen}
                      onClick={() => {
                        setIsLocationMenuOpen(false);
                        setIsCalendarOpen((v) => !v);
                      }}
                    >
                      Tambah ke kalendar
                    </button>
                    {isCalendarOpen ? (
                      <div className="paan-calendar__panel" role="group" aria-label="Pilih kalendar">
                        <button
                          type="button"
                          className="paan-btn paan-btn--ghost"
                          onClick={() => {
                            window.open(googleCal, "_blank", "noopener,noreferrer");
                            setIsCalendarOpen(false);
                          }}
                        >
                          Google Calendar
                        </button>
                        <button
                          type="button"
                          className="paan-btn paan-btn--ghost"
                          onClick={() => {
                            downloadPaanIcs(invite);
                            setIsCalendarOpen(false);
                          }}
                        >
                          Apple Calendar
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="paan-contacts">
                <p className="paan-contacts__label">Nombor dihubungi</p>
                <div className="paan-contacts__list">
                  {contacts.map((contact) => (
                    <a
                      key={contact.name}
                      className="paan-contacts__link"
                      href={contact.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WhatsApp ${contact.name}`}
                      title={contact.name}
                    >
                      <span className="paan-icon-btn paan-icon-btn--wa" aria-hidden>
                        <IconPhone className="paan-icon-btn__glyph" />
                      </span>
                      <span className="paan-contacts__name">{contact.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal as="section" variant="up" className="paan-aturcara" delayMs={140}>
              <p className="paan-kicker">Aturcara</p>
              <ol className="paan-aturcara__list">
                {PAAN_ATURCARA.map((item) => (
                  <li key={item.title}>
                    <span className="paan-aturcara__time">{item.time}</span>
                    <span className="paan-aturcara__title">{item.title}</span>
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            {showCountdown && !remaining.done ? (
              <ScrollReveal as="section" variant="up" className="paan-chrono" delayMs={160}>
                <p className="paan-kicker">Menanti</p>
                <h2 className="paan-title">Kira detik bahagia</h2>
                <div className="paan-chrono__grid" role="timer" aria-live="polite">
                  {[
                    { label: "Hari", value: remaining.days, pad: false },
                    { label: "Jam", value: remaining.hours, pad: true },
                    { label: "Minit", value: remaining.minutes, pad: true },
                    { label: "Saat", value: remaining.seconds, pad: true },
                  ].map((u) => (
                    <div key={u.label} className="paan-chrono__cell">
                      <span className="paan-chrono__num">{u.pad ? pad(u.value) : u.value}</span>
                      <span className="paan-chrono__unit">{u.label}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ) : null}

            <ScrollReveal as="section" variant="up" className="paan-rsvp" delayMs={180}>
              <p className="paan-kicker">Kehadiran</p>
              <h2 className="paan-title">Sahkan kehadiran</h2>
              <p className="paan-prose paan-rsvp__lead">
                Sila sahkan kehadiran anda. Tinggalkan juga sedikit doa &amp; ucapan.
              </p>
              {rsvp === "idle" || rsvp === "sending" ? (
                <form className="paan-rsvp__form" onSubmit={(e) => void onRsvp(e)}>
                  <label className="paan-field">
                    <span>Nama</span>
                    <input name="nama" required autoComplete="name" disabled={rsvp === "sending"} />
                  </label>
                  <fieldset className="paan-field paan-field--choice" disabled={rsvp === "sending"}>
                    <legend>Kehadiran</legend>
                    <label>
                      <input
                        type="radio"
                        name="kehadiran"
                        value="ya"
                        checked={attendingChoice === "ya"}
                        onChange={() => setAttendingChoice("ya")}
                      />
                      Hadir
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="kehadiran"
                        value="tidak"
                        checked={attendingChoice === "tidak"}
                        onChange={() => setAttendingChoice("tidak")}
                      />
                      Tidak hadir
                    </label>
                  </fieldset>
                  {attendingChoice === "ya" ? (
                    <label className="paan-field">
                      <span>Bilangan tetamu</span>
                      <select name="tetamu" defaultValue={1} disabled={rsvp === "sending"}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  <label className="paan-field">
                    <span>Ucapan / doa</span>
                    <textarea
                      name="ucapan"
                      rows={3}
                      placeholder="Doa dan ucapan anda…"
                      disabled={rsvp === "sending"}
                    />
                  </label>
                  <button type="submit" className="paan-btn" disabled={rsvp === "sending"}>
                    {rsvp === "sending" ? "Menghantar…" : "Hantar RSVP"}
                  </button>
                  {rsvpError ? <p className="paan-rsvp__note">{rsvpError}</p> : null}
                  {preview.isPreview && !rsvpError ? (
                    <p className="paan-rsvp__note">Demo — jawapan tidak dihantar.</p>
                  ) : null}
                </form>
              ) : (
                <p className="paan-rsvp__thanks">
                  {rsvp === "yes"
                    ? "Terima kasih — kami nantikan kehadiran dan doa anda."
                    : "Terima kasih atas maklum balas dan doa anda."}
                </p>
              )}
            </ScrollReveal>

            <footer className="paan-footer">
              <p className="paan-footer__text">{invite.footer}</p>
              <p className="paan-footer__names">{names}</p>
              <StudioCredit />
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}
