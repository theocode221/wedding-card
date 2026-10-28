import { LAILA_BUNGA_HEADER, LAILA_SALAM_KHAT, LAILA_SALAM_LATIN } from "./lailaInviteData";
import { LailaButterflies } from "./LailaButterflies";

/**
 * Full traditional Thuluth Arabic calligraphy for
 * "Assalamualaikum Warahmatullahi Wabarakatuh" (السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ).
 */
export function LailaSalamKhat({ className = "laila-khat laila-khat--salam" }: { className?: string }) {
  return (
    <p className={className} lang="ar" dir="rtl" aria-label={LAILA_SALAM_LATIN}>
      {LAILA_SALAM_KHAT}
    </p>
  );
}

/** Ornamental gold-and-maroon divider flourish between sections. */
export function LailaSectionFlourish({ className = "laila-section-flourish" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 220 24" fill="none">
        <line x1="8" y1="12" x2="82" y2="12" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
        <line x1="138" y1="12" x2="212" y2="12" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45" />
        <path
          d="M110 4 L116 12 L110 20 L104 12 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.14"
        />
        <circle cx="94" cy="12" r="2" fill="currentColor" fillOpacity="0.55" />
        <circle cx="126" cy="12" r="2" fill="currentColor" fillOpacity="0.55" />
      </svg>
    </div>
  );
}

/**
 * In-flow floral header/footer swags so they sit naturally above Assalamualaikum
 * and below the footer without ever overlapping any text on any screen size.
 */
export function LailaCardFloral({ position }: { position: "top" | "bottom" }) {
  return (
    <div className={`laila-card-floral laila-card-floral--${position}`} aria-hidden="true">
      <img
        className={`laila-card-floral__img${position === "bottom" ? " laila-card-floral__img--bottom" : ""}`}
        src={LAILA_BUNGA_HEADER}
        alt=""
        decoding="async"
      />
    </div>
  );
}

function CornerGoldFiligree({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M4 44 V14 C4 8.5 8.5 4 14 4 H44"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 34 V16 C10 12.7 12.7 10 16 10 H34"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeOpacity="0.65"
        strokeLinecap="round"
      />
      <path
        d="M4 14 C14 14 14 4 14 4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeOpacity="0.75"
      />
      <path d="M15 15 L20 17.5 L17.5 20 L15 15 Z" fill="currentColor" fillOpacity="0.65" />
      <circle cx="24" cy="10" r="1.4" fill="currentColor" fillOpacity="0.7" />
      <circle cx="10" cy="24" r="1.4" fill="currentColor" fillOpacity="0.7" />
      <circle cx="6" cy="6" r="1.8" fill="currentColor" />
    </svg>
  );
}

/**
 * Clean ivory reading surface with soft gold light effects, gold filigree corners,
 * and subtle twinkling gold dust along the outer margins.
 */
export function LailaPageDecor() {
  return (
    <div className="laila-page-decor" aria-hidden>
      <div className="laila-page-decor__frame">
        <div className="laila-page-decor__shimmer" />
        <CornerGoldFiligree className="laila-page-decor__corner laila-page-decor__corner--tl" />
        <CornerGoldFiligree className="laila-page-decor__corner laila-page-decor__corner--tr" />
        <CornerGoldFiligree className="laila-page-decor__corner laila-page-decor__corner--bl" />
        <CornerGoldFiligree className="laila-page-decor__corner laila-page-decor__corner--br" />
      </div>
      <LailaButterflies density="sparse" />
    </div>
  );
}
