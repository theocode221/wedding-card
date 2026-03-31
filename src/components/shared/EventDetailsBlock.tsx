import type { WeddingEventData } from "../../types/event";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import { scrollRevealClass, type ScrollRevealVariant } from "./ScrollReveal";

export type EventDetailsBlockProps = {
  event: Pick<WeddingEventData, "venue" | "address" | "dateTimeLabel" | "mapsUrl">;
  className?: string;
  eyebrow?: string;
  scrollVariant?: ScrollRevealVariant;
};

export function EventDetailsBlock({
  event,
  className = "",
  eyebrow = "Celebration",
  scrollVariant = "up",
}: EventDetailsBlockProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`shared-event ${scrollRevealClass(visible, scrollVariant)} ${className}`.trim()}
    >
      <div className="shared-event__inner">
        <p className="shared-event__eyebrow">{eyebrow}</p>
        <h2 className="shared-event__venue">{event.venue}</h2>
        <p className="shared-event__datetime">{event.dateTimeLabel}</p>
        <address className="shared-event__address">{event.address}</address>
        <a className="shared-event__maps" href={event.mapsUrl} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
