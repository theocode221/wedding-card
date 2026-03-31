/** Flowing vine silhouettes — left / right edges of hero & main */
export function OrganicVineEdges({ zone }: { zone: "hero" | "main" }) {
  const base = zone === "hero" ? "trad-vine trad-vine--hero" : "trad-vine trad-vine--main";
  return (
    <>
      <svg className={`${base} trad-vine--left`} viewBox="0 0 80 320" preserveAspectRatio="xMinYMid slice" aria-hidden>
        <path
          fill="currentColor"
          opacity="0.14"
          d="M52 0C38 48 62 96 44 144 28 188 48 232 36 276 32 292 24 308 12 320H0V0h52z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.22"
          d="M48 0 Q32 80 52 160 T44 320"
        />
      </svg>
      <svg className={`${base} trad-vine--right`} viewBox="0 0 80 320" preserveAspectRatio="xMaxYMid slice" aria-hidden>
        <path
          fill="currentColor"
          opacity="0.12"
          d="M28 0C42 52 18 100 36 152 52 200 32 244 44 288 48 304 56 320 68 320H80V0H28z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.2"
          d="M32 0 Q48 88 28 168 T36 320"
        />
      </svg>
    </>
  );
}
