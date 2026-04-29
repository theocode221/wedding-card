/**
 * Comic / HUD page atmosphere — CSS only (no image assets).
 */
export function EggRevealPageDecor() {
  return (
    <div className="egg-reveal-decor" aria-hidden>
      <div className="egg-reveal-decor__speed" />
      <div className="egg-reveal-decor__rings" />
      <span className="egg-reveal-decor__glyph egg-reveal-decor__glyph--a">✦</span>
      <span className="egg-reveal-decor__glyph egg-reveal-decor__glyph--b">★</span>
      <span className="egg-reveal-decor__glyph egg-reveal-decor__glyph--c">✦</span>
      <span className="egg-reveal-decor__glyph egg-reveal-decor__glyph--d">★</span>
      <span className="egg-reveal-decor__glyph egg-reveal-decor__glyph--e">✦</span>
      <span className="egg-reveal-decor__glyph egg-reveal-decor__glyph--f">★</span>
    </div>
  );
}
