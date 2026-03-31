/**
 * Batik-inspired corner flourishes (TL + BR). Inline SVG — no image requests.
 */
export function BatikFrameMotifs() {
  return (
    <>
      <svg className="trad-batik-motif trad-batik-motif--frame-tl" viewBox="0 0 100 100" aria-hidden>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="0.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        >
          <path d="M12 88V12h76" />
          <path d="M22 78V22h56" opacity="0.65" />
          <circle cx="32" cy="32" r="5" />
          <path
            d="M52 24c8 4 12 12 10 20M68 44c-6 8-4 18 4 24M24 52c6 10 18 12 26 4"
            opacity="0.55"
          />
        </g>
      </svg>
      <svg className="trad-batik-motif trad-batik-motif--frame-br" viewBox="0 0 100 100" aria-hidden>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="0.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        >
          <path d="M88 12v76H12" />
          <path d="M78 22v56H22" opacity="0.65" />
          <circle cx="68" cy="68" r="5" />
          <path
            d="M48 76c-8-4-12-12-10-20M32 56c6-8 4-18-4-24M76 48c-6-10-18-12-26-4"
            opacity="0.55"
          />
        </g>
      </svg>
    </>
  );
}
