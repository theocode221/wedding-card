type CornerOrnamentsProps = {
  variant: "hero";
};

/**
 * Decorative L-motifs for the hero frame (Malay / classical invitation corners).
 */
export function CornerOrnaments({ variant }: CornerOrnamentsProps) {
  return (
    <span className={`trad-corners trad-corners--${variant}`} aria-hidden>
      <span className="trad-corners__piece trad-corners__piece--tl" />
      <span className="trad-corners__piece trad-corners__piece--tr" />
      <span className="trad-corners__piece trad-corners__piece--bl" />
      <span className="trad-corners__piece trad-corners__piece--br" />
    </span>
  );
}
