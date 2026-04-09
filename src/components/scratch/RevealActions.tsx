export type DoaDoaButtonProps = {
  onBlessing: () => void;
};

export function DoaDoaButton({ onBlessing }: DoaDoaButtonProps) {
  return (
    <button
      type="button"
      className="reveal-actions__btn reveal-actions__btn--rose reveal-actions__btn--hujan scratch-page__doaSecond"
      onClick={onBlessing}
      aria-label="Doa Doa"
    >
      <span className="reveal-actions__hujanInner" aria-hidden="true">
        ✨ Doa Doa (Tekan banyak kali)💕
      </span>
    </button>
  );
}

export type RevealActionsProps = {
  onReplay: () => void;
};

export function RevealActions({ onReplay }: RevealActionsProps) {
  return (
    <div className="reveal-actions reveal-actions--afterBaca">
      <button type="button" className="reveal-actions__btn reveal-actions__btn--ghost" onClick={onReplay}>
        Main Semula
      </button>
    </div>
  );
}
