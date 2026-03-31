type FoliageAccentProps = {
  placement: "hero-left" | "hero-right" | "section-soft";
};

/** Soft leaf / vine silhouettes for edges — very low contrast */
export function FoliageAccent({ placement }: FoliageAccentProps) {
  return <div className={`trad-foliage trad-foliage--${placement}`} aria-hidden />;
}
