import type { TemplateProps } from "../../types/event";
import { coupleLabel } from "../../data/mockEvent";
import { Countdown } from "../../components/shared/Countdown";
import { EventDetailsBlock } from "../../components/shared/EventDetailsBlock";
import { GalleryGrid } from "../../components/shared/GalleryGrid";
import { InvitationSection } from "../../components/shared/InvitationSection";
import { RsvpCta } from "../../components/shared/RsvpCta";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import {
  BatikFrameMotifs,
  BatikMainEdgeMotifs,
  BatikTexture,
  CornerOrnaments,
  FoliageAccent,
  OrganicVineEdges,
  SectionDivider,
} from "./decor";
import "./traditional.css";

const DEFAULT_HERO_TAGLINE =
  "Dengan penuh hormat, kami berbesar hati menjemput ke majlis perkahwinan kami.";

export function TraditionalTemplate({ event, onRsvp }: TemplateProps) {
  const names = coupleLabel(event);
  const heroTagline = event.tagline ?? DEFAULT_HERO_TAGLINE;

  const scrollToInvitation = () => {
    document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="theme-traditional">
      <BatikTexture surface="page" />

      <div className="trad-page-stack">
        <header className="trad-hero">
          <div
            className="trad-hero__photo"
            style={{ backgroundImage: `url("${event.heroImage}")` }}
            aria-hidden
          />
          <BatikTexture surface="hero" />
          <OrganicVineEdges zone="hero" />
          <div className="trad-hero__veil" aria-hidden />
          <div className="trad-hero__inner">
            <div className="trad-hero__frame">
              <BatikFrameMotifs />
              <CornerOrnaments variant="hero" />
              <div className="trad-hero__content">
                <p className="trad-hero__eyebrow trad-fade" style={{ animationDelay: "0.1s" }}>
                  Walimah
                </p>
                <h1 className="trad-hero__names trad-fade" style={{ animationDelay: "0.26s" }}>
                  {names}
                </h1>
                <p className="trad-hero__subtitle trad-fade" style={{ animationDelay: "0.42s" }}>
                  {heroTagline}
                </p>
                <div className="trad-hero__rule trad-fade" style={{ animationDelay: "0.5s" }} aria-hidden />
                <p className="trad-hero__date trad-fade" style={{ animationDelay: "0.56s" }}>
                  {event.date}
                </p>
                <button
                  type="button"
                  className="trad-btn trad-btn--primary trad-fade"
                  style={{ animationDelay: "0.72s" }}
                  onClick={scrollToInvitation}
                >
                  Open Invitation
                </button>
              </div>
            </div>
          </div>
        </header>

        <ScrollReveal variant="from-zoom" className="trad-scroll-edge">
          <SectionDivider />
        </ScrollReveal>

        <main className="trad-main">
          <div className="trad-main__wash" aria-hidden />
          <FoliageAccent placement="section-soft" />
          <OrganicVineEdges zone="main" />
          <BatikMainEdgeMotifs />

          <div className="trad-section trad-section--invitation">
            <InvitationSection text={event.invitation} eyebrow="Jemputan" className="trad-invitation" />
          </div>

          <ScrollReveal variant="from-left" className="trad-scroll-edge">
            <SectionDivider dense />
          </ScrollReveal>

          <div className="trad-section trad-section--event">
            <EventDetailsBlock
              event={event}
              eyebrow="Majlis"
              className="trad-event"
              scrollVariant="from-right"
            />
          </div>

          <ScrollReveal variant="from-right" className="trad-scroll-edge">
            <SectionDivider dense />
          </ScrollReveal>

          <div className="trad-section trad-section--countdown">
            <Countdown
              weddingDateTime={event.weddingDateTime}
              className="trad-countdown"
              scrollVariant="from-zoom"
            />
          </div>

          <ScrollReveal variant="from-zoom" className="trad-scroll-edge">
            <SectionDivider dense />
          </ScrollReveal>

          <div className="trad-section trad-section--gallery">
            <GalleryGrid
              images={event.gallery}
              className="trad-gallery"
              eyebrow="Kenangan"
              title="Detik yang dirakam"
              scrollVariant="from-left"
            />
          </div>

          <ScrollReveal variant="from-left" className="trad-scroll-edge">
            <SectionDivider dense />
          </ScrollReveal>

          <div className="trad-section trad-section--rsvp">
            <RsvpCta
              onConfirm={onRsvp}
              className="trad-rsvp"
              buttonClassName="trad-btn trad-btn--primary"
              eyebrow="Kehadiran"
              title="Sila sahkan kehadiran"
              hint="Kami menjangkakan dengan sukacita jawapan tuan."
              buttonLabel="Confirm Attendance"
              scrollVariant="from-right"
            />
          </div>
        </main>

        <ScrollReveal variant="up" className="trad-scroll-edge">
          <SectionDivider />
        </ScrollReveal>

        <ScrollReveal as="footer" variant="from-zoom" className="trad-footer">
          <div className="trad-footer__batik" aria-hidden />
          <div className="trad-footer__inner">
            <p>{event.footer}</p>
            <p className="trad-footer__names">{names}</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
