import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import { scrollRevealClass, type ScrollRevealVariant } from "./ScrollReveal";

export type InvitationSectionProps = {
  text: string;
  className?: string;
  eyebrow?: string;
  sectionId?: string;
  /** Direction of the scroll-in motion */
  scrollVariant?: ScrollRevealVariant;
};

export function InvitationSection({
  text,
  className = "",
  eyebrow = "Invitation",
  sectionId = "invitation",
  scrollVariant = "up",
}: InvitationSectionProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id={sectionId}
      ref={ref}
      className={`shared-invitation ${scrollRevealClass(visible, scrollVariant)} ${className}`.trim()}
    >
      <div className="shared-invitation__inner">
        <p className="shared-invitation__eyebrow">{eyebrow}</p>
        <p className="shared-invitation__body">{text}</p>
      </div>
    </section>
  );
}
