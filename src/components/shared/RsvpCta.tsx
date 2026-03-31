import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import { scrollRevealClass, type ScrollRevealVariant } from "./ScrollReveal";

export type RsvpCtaProps = {
  onConfirm: () => void;
  className?: string;
  /** Merged with default button class (e.g. theme primary styles) */
  buttonClassName?: string;
  eyebrow?: string;
  title?: string;
  hint?: string;
  buttonLabel?: string;
  scrollVariant?: ScrollRevealVariant;
};

export function RsvpCta({
  onConfirm,
  className = "",
  buttonClassName = "",
  eyebrow = "Kindly respond",
  title = "Will you join us?",
  hint = "Let us know by confirming your attendance.",
  buttonLabel = "Confirm Attendance",
  scrollVariant = "up",
}: RsvpCtaProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`shared-rsvp ${scrollRevealClass(visible, scrollVariant)} ${className}`.trim()}
    >
      <div className="shared-rsvp__inner">
        <p className="shared-rsvp__eyebrow">{eyebrow}</p>
        <h2 className="shared-rsvp__title">{title}</h2>
        <p className="shared-rsvp__hint">{hint}</p>
        <button type="button" className={`shared-rsvp__btn ${buttonClassName}`.trim()} onClick={onConfirm}>
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}
