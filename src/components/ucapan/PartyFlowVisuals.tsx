/**
 * Party ucapan flow — envelope, opening, pull slot, letter peek, reveal mesh: CSS/SVG only (no PNG assets).
 */

type PartyIntroProps = {
  showStamp: boolean;
  onOpen: () => void;
  stampLabel: string;
  stampAriaLabel: string;
};

export function PartyIntroEnvelope({ showStamp, onOpen, stampLabel, stampAriaLabel }: PartyIntroProps) {
  return (
    <div className="ucapan-s1-envelope">
      <div className="ucapan-s1-envelope__bundle party-flow-bundle">
        <div className="ucapan-s1-envelope__shadow party-flow-envShadow" aria-hidden />
        <div className="party-flow-env party-flow-env--intro" aria-hidden>
          <div className="party-flow-env__glow" />
          <div className="party-flow-env__body" />
          <div className="party-flow-env__pocket" />
          <div className="party-flow-env__flap" />
          <div className="party-flow-env__edge" />
        </div>
        {showStamp && (
          <button type="button" className="ucapan-s1-stamp party-flow-stamp" onClick={onOpen} aria-label={stampAriaLabel}>
            <span className="ucapan-s1-stamp__motion">
              <span className="party-flow-stamp__disc" aria-hidden />
              <span className="ucapan-s1-stamp__label party-flow-stamp__label">{stampLabel}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

type PartyOpeningProps = {
  phase: 0 | 1 | 2;
};

export function PartyOpeningEnvelope({ phase }: PartyOpeningProps) {
  return (
    <div className={["party-flow-openRoot", phase >= 1 ? "party-flow-openRoot--p1" : "", phase >= 2 ? "party-flow-openRoot--p2" : ""].filter(Boolean).join(" ")}>
      <div className="ucapan-opening__shadow party-flow-envShadow" aria-hidden />
      <div className="party-flow-env party-flow-env--opening" aria-hidden>
        <div className="party-flow-env__glow" />
        <div className="party-flow-env__body" />
        <div className="party-flow-env__letterPeek" />
        <div className="party-flow-env__pocket" />
        <div className="party-flow-env__flap" />
        <div className="party-flow-env__edge" />
      </div>
    </div>
  );
}

export function PartyPullSlot() {
  return (
    <div className="party-flow-pullSlot" aria-hidden>
      <div className="party-flow-pullSlot__glow" />
      <div className="party-flow-pullSlot__body" />
      <div className="party-flow-pullSlot__lip" />
      <div className="party-flow-pullSlot__inner" />
    </div>
  );
}

export function PartyLetterPeek() {
  return (
    <div className="party-flow-letterPeek">
      <div className="party-flow-letterPeek__shine" />
      <div className="party-flow-letterPeek__rule" />
      <div className="party-flow-letterPeek__rule" />
      <div className="party-flow-letterPeek__rule" />
      <div className="party-flow-letterPeek__spark" aria-hidden>
        ✦
      </div>
    </div>
  );
}

export function PartyRevealMesh() {
  return (
    <div className="party-flow-revealMesh" aria-hidden>
      <div className="party-flow-revealMesh__grid" />
      <div className="party-flow-revealMesh__blob party-flow-revealMesh__blob--a" />
      <div className="party-flow-revealMesh__blob party-flow-revealMesh__blob--b" />
      <div className="party-flow-revealMesh__blob party-flow-revealMesh__blob--c" />
      <div className="party-flow-revealMesh__vignette" />
    </div>
  );
}
