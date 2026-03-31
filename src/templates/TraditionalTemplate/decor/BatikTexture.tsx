type BatikTextureProps = {
  /** Where the layer sits in the layout (controls intensity & pattern) */
  surface: "page" | "hero" | "section";
  className?: string;
};

/** Abstract batik-inspired noise / organic grid — decorative only */
export function BatikTexture({ surface, className = "" }: BatikTextureProps) {
  return (
    <div
      className={`trad-batik trad-batik--${surface} ${className}`.trim()}
      aria-hidden
    />
  );
}
