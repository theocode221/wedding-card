import type { ReactNode } from "react";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

/** Motion direction for IntersectionObserver-driven `.reveal` blocks */
export type ScrollRevealVariant = "up" | "from-left" | "from-right" | "from-zoom";

export function scrollRevealClass(visible: boolean, variant: ScrollRevealVariant = "up"): string {
  const mod = variant === "up" ? "" : ` reveal--${variant}`;
  return `reveal${mod} ${visible ? "reveal--visible" : ""}`.trim();
}

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  /** Root element — use `footer` when wrapping footers so semantics stay correct */
  as?: "div" | "footer" | "section";
};

export function ScrollReveal({
  children,
  className = "",
  variant = "up",
  as: Tag = "div",
}: ScrollRevealProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  return (
    <Tag ref={ref as never} className={`${scrollRevealClass(visible, variant)} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
