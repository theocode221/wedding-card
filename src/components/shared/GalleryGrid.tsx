import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import { scrollRevealClass, type ScrollRevealVariant } from "./ScrollReveal";

export type GalleryGridProps = {
  images: string[];
  className?: string;
  eyebrow?: string;
  title?: string;
  scrollVariant?: ScrollRevealVariant;
};

export function GalleryGrid({
  images,
  className = "",
  eyebrow = "Moments",
  title = "A glimpse of us",
  scrollVariant = "up",
}: GalleryGridProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`shared-gallery ${scrollRevealClass(visible, scrollVariant)} ${className}`.trim()}
    >
      <div className="shared-gallery__inner">
        <p className="shared-gallery__eyebrow">{eyebrow}</p>
        <h2 className="shared-gallery__title">{title}</h2>
        <div className="shared-gallery__grid">
          {images.map((src, i) => (
            <figure key={src} className="shared-gallery__figure">
              <img className="shared-gallery__img" src={src} alt="" loading={i < 2 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
