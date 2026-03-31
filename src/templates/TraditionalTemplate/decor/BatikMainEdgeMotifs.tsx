/**
 * Large soft corner ornaments on the parchment column — edges only, not center.
 */
export function BatikMainEdgeMotifs() {
  return (
    <>
      <svg className="trad-batik-motif trad-batik-motif--main-tl" viewBox="0 0 140 140" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.85">
          <path d="M8 132V8h124" strokeWidth="0.55" />
          <path d="M24 116V24h92" opacity="0.5" />
          <path
            d="M38 38c12-8 28-6 38 4s10 26 2 38M44 90c10 6 22 4 30-4"
            strokeWidth="0.45"
            opacity="0.45"
          />
          <circle cx="48" cy="48" r="4" opacity="0.5" />
        </g>
      </svg>
      <svg className="trad-batik-motif trad-batik-motif--main-br" viewBox="0 0 140 140" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.85">
          <path d="M132 8v124H8" strokeWidth="0.55" />
          <path d="M116 24v92H24" opacity="0.5" />
          <path
            d="M102 102c-12 8-28 6-38-4s-10-26-2-38M96 50c-10-6-22-4-30 4"
            strokeWidth="0.45"
            opacity="0.45"
          />
          <circle cx="92" cy="92" r="4" opacity="0.5" />
        </g>
      </svg>
    </>
  );
}
