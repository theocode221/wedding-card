import { LAILA_BUNGA_BOTTOM, LAILA_BUNGA_TOP } from "./lailaInviteData";
import { LailaButterflies } from "./LailaButterflies";

/** Light flower bands + a few butterflies — used on details, RSVP, and gallery. */
export function LailaPageDecor() {
  return (
    <div className="laila-page-decor" aria-hidden>
      <img className="laila-page-decor__flower laila-page-decor__flower--top" src={LAILA_BUNGA_TOP} alt="" />
      <img className="laila-page-decor__flower laila-page-decor__flower--bottom" src={LAILA_BUNGA_BOTTOM} alt="" />
      <LailaButterflies density="sparse" />
    </div>
  );
}
