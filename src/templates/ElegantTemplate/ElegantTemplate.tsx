import type { TemplateProps } from "../../types/event";
import { coupleLabel } from "../../data/mockEvent";
import { Countdown } from "../../components/shared/Countdown";
import { EventDetailsBlock } from "../../components/shared/EventDetailsBlock";
import { GalleryGrid } from "../../components/shared/GalleryGrid";
import { InvitationSection } from "../../components/shared/InvitationSection";
import { RsvpCta } from "../../components/shared/RsvpCta";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import "./styles.css";

export function ElegantTemplate({ event, onRsvp }: TemplateProps) {
  const names = coupleLabel(event);

  const scrollToInvitation = () => {
    document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="theme-elegant">
      <header className="el-hero" style={{ backgroundImage: `url("${event.heroImage}")` }}>
        <div className="el-hero__overlay" aria-hidden />
        <div className="el-hero__content">
          <p className="el-hero__eyebrow el-fade" style={{ animationDelay: "0.15s" }}>
            The wedding of
          </p>
          <h1 className="el-hero__names el-fade" style={{ animationDelay: "0.35s" }}>
            {names}
          </h1>
          <div className="el-hero__rule el-fade" style={{ animationDelay: "0.5s" }} aria-hidden />
          <p className="el-hero__date el-fade" style={{ animationDelay: "0.55s" }}>
            {event.date}
          </p>
          <button type="button" className="el-hero__btn el-fade" style={{ animationDelay: "0.72s" }} onClick={scrollToInvitation}>
            Open Invitation
          </button>
        </div>
      </header>

      <main className="el-main">
        <InvitationSection text={event.invitation} className="el-invitation" />

        <ScrollReveal variant="from-left" className="el-scroll-strip">
          <div className="el-divider" aria-hidden />
        </ScrollReveal>

        <EventDetailsBlock event={event} className="el-event" eyebrow="Details" scrollVariant="from-right" />

        <Countdown weddingDateTime={event.weddingDateTime} className="el-countdown" scrollVariant="from-zoom" />

        <GalleryGrid
          images={event.gallery}
          className="el-gallery"
          eyebrow="Gallery"
          title="Selected moments"
          scrollVariant="from-left"
        />

        <RsvpCta
          onConfirm={onRsvp}
          className="el-rsvp"
          eyebrow="RSVP"
          title="Your presence"
          hint="Please confirm your attendance."
          buttonLabel="Confirm Attendance"
          scrollVariant="from-right"
        />
      </main>

      <ScrollReveal as="footer" variant="from-zoom" className="el-footer">
        <p>{event.footer}</p>
        <p className="el-footer__names">{names}</p>
      </ScrollReveal>
    </div>
  );
}
