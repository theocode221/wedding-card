type SectionDividerProps = {
  dense?: boolean;
};

/** Batik-inspired separator — SVG centre motif, repeating line caps */
export function SectionDivider({ dense = false }: SectionDividerProps) {
  return (
    <div className={`trad-section-divider ${dense ? "trad-section-divider--dense" : ""}`.trim()} aria-hidden>
      <span className="trad-section-divider__line trad-section-divider__line--batik" />
      <span className="trad-section-divider__motif">
        <svg viewBox="0 0 72 28" className="trad-section-divider__svg">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="0.55"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          >
            <path d="M8 14h8M56 14h8" opacity="0.5" />
            <circle cx="36" cy="14" r="3.5" />
            <path d="M28 14h4M40 14h4" opacity="0.65" />
            <path
              d="M22 8c4 2 6 6 6 6s2 4 8 4 8-4 8-4 2-4 6-6"
              opacity="0.45"
            />
            <path
              d="M22 20c4-2 6-6 6-6s2-4 8-4 8 4 8 4 2 4 6 6"
              opacity="0.45"
            />
          </g>
        </svg>
      </span>
      <span className="trad-section-divider__line trad-section-divider__line--batik" />
    </div>
  );
}
