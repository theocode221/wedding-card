import { useId } from "react";

export type NnMonogramLogoProps = {
  className?: string;
  /** Screen reader label */
  label?: string;
};

/**
 * Wedding monogram: twin “n” in formal calligraphy (Pinyon Script) + pen flourishes.
 */
export function NnMonogramLogo({
  className = "",
  label = "Monogram N dan N — Nabil & NADHIRAH",
}: NnMonogramLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gid = `nn-grad-${uid}`;
  const gidSoft = `nn-grad-soft-${uid}`;
  const gidInk = `nn-ink-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 320 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gid} x1="36" y1="36" x2="284" y2="172" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff9ea" />
          <stop offset="0.28" stopColor="#f2e2b3" />
          <stop offset="0.55" stopColor="#d8b456" />
          <stop offset="0.82" stopColor="#b8892e" />
          <stop offset="1" stopColor="#7a5418" />
        </linearGradient>
        <linearGradient id={gidSoft} x1="160" y1="14" x2="160" y2="194" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8d49a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3d2410" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={gidInk} x1="160" y1="92" x2="160" y2="168" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9a24d" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2a1406" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Cartouche */}
      <ellipse cx="160" cy="104" rx="148" ry="90" stroke={`url(#${gidSoft})`} strokeWidth="2.35" />
      <ellipse cx="160" cy="104" rx="136" ry="82" stroke={`url(#${gid})`} strokeOpacity="0.26" strokeWidth="1.35" />

      {/* Upper sweep — pen entry */}
      <path
        d="M 62 56 C 118 28 202 28 258 56"
        stroke={`url(#${gid})`}
        strokeWidth="2.15"
        strokeLinecap="round"
        opacity="0.42"
      />

      {/* nn lettering */}
      <text
        x="160"
        y="148"
        textAnchor="middle"
        fill={`url(#${gid})`}
        stroke="#2c1810"
        strokeWidth="0.55"
        strokeOpacity="0.2"
        fontFamily="'Pinyon Script', 'Great Vibes', Georgia, serif"
        fontSize="158"
        fontWeight="400"
        style={{ paintOrder: "stroke fill", letterSpacing: "0.02em", fontStyle: "normal" }}
      >
        nn
      </text>

      {/* Baseline flourish */}
      <path
        d="M 56 162 C 108 184 212 184 264 162"
        stroke={`url(#${gidInk})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path
        d="M 72 158 Q 160 178 248 158"
        stroke={`url(#${gid})`}
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.38"
      />

      {/* Centre knot */}
      <path
        d="M 146 168 Q 160 178 174 168"
        stroke={`url(#${gid})`}
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.72"
      />
      <ellipse cx="160" cy="171" rx="4" ry="3.5" fill={`url(#${gid})`} opacity="0.55" />

      {/* Tail curls */}
      <path
        d="M 54 156 C 42 168 38 176 48 182"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M 266 156 C 278 168 282 176 272 182"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
