import type { TemplateProps } from "../../types/event";
import { coupleLabel } from "../../data/mockEvent";
import { Countdown } from "../../components/shared/Countdown";
import { EventDetailsBlock } from "../../components/shared/EventDetailsBlock";
import { GalleryGrid } from "../../components/shared/GalleryGrid";
import { InvitationSection } from "../../components/shared/InvitationSection";
import { RsvpCta } from "../../components/shared/RsvpCta";
import { ScrollReveal } from "../../components/shared/ScrollReveal";
import "./styles.css";

export function FloralTemplate({ event, onRsvp }: TemplateProps) {
  const names = coupleLabel(event);

  const scrollToInvitation = () => {
    document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="theme-floral">
      <div className="flo-bg" aria-hidden />

      <header className="flo-hero" style={{ backgroundImage: `url("${event.heroImage}")` }}>
        <div className="flo-hero__soft" aria-hidden />
        <div className="flo-hero__petals" aria-hidden />
        <div className="flo-hero__content">
          <p className="flo-hero__eyebrow flo-fade" style={{ animationDelay: "0.1s" }}>
            The wedding of
          </p>
          <h1 className="flo-hero__names flo-fade" style={{ animationDelay: "0.3s" }}>
            {names}
          </h1>
          <p className="flo-hero__date flo-fade" style={{ animationDelay: "0.5s" }}>
            {event.date}
          </p>
          <button type="button" className="flo-hero__btn flo-fade" style={{ animationDelay: "0.68s" }} onClick={scrollToInvitation}>
            Open Invitation
          </button>
        </div>
      </header>

      <main className="flo-main">
        <InvitationSection text={event.invitation} className="flo-invitation" />

        <EventDetailsBlock event={event} className="flo-event" scrollVariant="from-right" />

        <Countdown weddingDateTime={event.weddingDateTime} className="flo-countdown" scrollVariant="from-zoom" />

        <GalleryGrid images={event.gallery} className="flo-gallery" scrollVariant="from-left" />

        <RsvpCta onConfirm={onRsvp} className="flo-rsvp" scrollVariant="from-right" />
      </main>

      <ScrollReveal as="footer" variant="from-zoom" className="flo-footer">
        <p>{event.footer}</p>
        <p className="flo-footer__names">{names}</p>
      </ScrollReveal>
    </div>
  );
}
