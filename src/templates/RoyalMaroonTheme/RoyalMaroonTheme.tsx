import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import type { TemplateProps } from "../../types/event";
import { coupleLabel } from "../../data/mockEvent";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import { scrollRevealClass, type ScrollRevealVariant } from "../../components/shared/ScrollReveal";
import { getRemaining, pad } from "../../components/shared/countdownUtils";
import { NnMonogramLogo } from "../../components/branding/NnMonogramLogo";
import "./royal-maroon.css";

function formatTimeMalay(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ms-MY", {
      timeZone: "Asia/Kuala_Lumpur",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  as?: "section" | "div";
  id?: string;
  "aria-labelledby"?: string;
};

function RevealSection({
  children,
  className = "",
  variant = "up",
  as: Tag = "section",
  id,
  "aria-labelledby": ariaLabelledBy,
}: RevealSectionProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`${scrollRevealClass(visible, variant)} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export function RoyalMaroonTheme({ event, onRsvp }: TemplateProps) {
  const names = coupleLabel(event);
  const subtitle = event.tagline ?? "Walimatul Urus";
  const masaDisplay = formatTimeMalay(event.weddingDateTime) || event.dateTimeLabel;
  const galleryImages = useMemo(() => event.gallery.slice(0, 4), [event.gallery]);
  const whatsappHref = event.whatsappUrl ?? "https://wa.me/";

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const countdownTitleId = useId();
  const target = useMemo(() => new Date(event.weddingDateTime), [event.weddingDateTime]);
  const { ref: countdownRef, visible: countdownVisible } = useRevealOnScroll<HTMLElement>();
  const [tick, setTick] = useState(() => getRemaining(target, new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(getRemaining(target, new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const countdownUnits = [
    { label: "Hari", value: tick.days, padValue: false },
    { label: "Jam", value: tick.hours, padValue: true },
    { label: "Minit", value: tick.minutes, padValue: true },
    { label: "Saat", value: tick.seconds, padValue: true },
  ] as const;

  return (
    <div className="theme-royal-maroon" lang="ms">
      <header className="rm-hero">
        <div className="rm-hero__wash" aria-hidden />
        <div className="rm-hero__batik" aria-hidden />
        <div className="rm-hero__beam" aria-hidden />
        <div className="rm-hero__inner">
          <div className="rm-hero__plate">
            <div className="rm-hero__plate-shine" aria-hidden />
            <div className="rm-hero__seal" aria-hidden>
              <NnMonogramLogo className="rm-hero__monogram" />
            </div>
            <div className="rm-hero__content">
              <p className="rm-hero__kicker rm-hero-in">{subtitle}</p>
              <h1 className="rm-hero__names rm-hero-in rm-hero-in--2">{names}</h1>
              <p className="rm-hero__date rm-hero-in rm-hero-in--3">{event.date}</p>
              <div className="rm-hero__actions rm-hero-in rm-hero-in--4">
                <button type="button" className="rm-btn rm-btn--gold" onClick={() => scrollToId("jemputan")}>
                  Buka Jemputan
                </button>
                <button type="button" className="rm-btn rm-btn--line" onClick={() => scrollToId("butiran")}>
                  Butiran
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="rm-main">
        <RevealSection id="jemputan" className="rm-prose" variant="up">
          <p className="rm-prose__label">Jemputan</p>
          <p className="rm-prose__body">{event.invitation}</p>
        </RevealSection>

        <RevealSection id="butiran" className="rm-details" variant="from-zoom">
          <div className="rm-details__head">
            <h2 className="rm-details__title">Maklumat majlis</h2>
            <p className="rm-details__lead">Simpan tarikh — kami menanti kehadiran anda.</p>
          </div>
          <dl className="rm-spec">
            <div className="rm-spec__row">
              <dt className="rm-spec__k">Tarikh</dt>
              <dd className="rm-spec__v">{event.date}</dd>
            </div>
            <div className="rm-spec__row">
              <dt className="rm-spec__k">Masa</dt>
              <dd className="rm-spec__v">{masaDisplay}</dd>
            </div>
            <div className="rm-spec__row">
              <dt className="rm-spec__k">Lokasi</dt>
              <dd className="rm-spec__v">{event.venue}</dd>
            </div>
            <div className="rm-spec__row">
              <dt className="rm-spec__k">Alamat</dt>
              <dd className="rm-spec__v">{event.address}</dd>
            </div>
          </dl>
          <a className="rm-btn rm-btn--maroon rm-details__maps" href={event.mapsUrl} target="_blank" rel="noopener noreferrer">
            Buka di Peta
          </a>
        </RevealSection>

        <section
          ref={countdownRef}
          className={`rm-chrono ${scrollRevealClass(countdownVisible, "from-zoom")}`.trim()}
          aria-labelledby={countdownTitleId}
        >
          <div className="rm-chrono__inner">
            <h2 className="rm-chrono__title" id={countdownTitleId}>
              Kira detik
            </h2>
            <p className="rm-chrono__hint">Menuju hari bersejarah</p>
            {tick.done ? (
              <p className="rm-chrono__done">Alhamdulillah — jumpa di majlis.</p>
            ) : (
              <div className="rm-chrono__grid" role="timer" aria-live="polite" aria-atomic="true">
                {countdownUnits.map((u) => (
                  <div key={u.label} className="rm-chrono__cell">
                    <span className="rm-chrono__num">{u.padValue ? pad(u.value) : u.value}</span>
                    <span className="rm-chrono__unit">{u.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <RevealSection className="rm-gallery" variant="from-left">
          <div className="rm-gallery__head">
            <h2 className="rm-gallery__title">Galeri</h2>
            <p className="rm-gallery__lead">Sedutan sebelum hari bahagia.</p>
          </div>
          <div className="rm-bento">
            {galleryImages.map((src, i) => (
              <figure key={src} className={i === 0 ? "rm-bento__fig rm-bento__fig--hero" : "rm-bento__fig"}>
                <img src={src} alt="" loading="lazy" decoding="async" className="rm-bento__img" />
              </figure>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="rm-rsvp" variant="from-right">
          <div className="rm-rsvp__panel">
            <h2 className="rm-rsvp__title">Kehadiran</h2>
            <p className="rm-rsvp__lead">Satu ketukan untuk maklum — atau hubungi terus.</p>
            <div className="rm-rsvp__actions">
              <button type="button" className="rm-btn rm-btn--gold rm-rsvp__btn" onClick={onRsvp}>
                RSVP
              </button>
              <a className="rm-btn rm-btn--ghost rm-rsvp__btn" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </RevealSection>
      </main>

      <footer className="rm-footer">
        <p className="rm-footer__text">{event.footer}</p>
        <p className="rm-footer__names">{names}</p>
      </footer>
    </div>
  );
}
