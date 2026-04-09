export type WheelActionsProps = {
  onPrayAgain: () => void;
  onSpinMore: () => void;
};

export function WheelActions({ onPrayAgain, onSpinMore }: WheelActionsProps) {
  return (
    <div className="wheel-actions">
      <button type="button" className="wheel-actions__btn wheel-actions__btn--rose" onClick={onPrayAgain}>
        Doakan Lagi
      </button>
      <button type="button" className="wheel-actions__btn wheel-actions__btn--soft" onClick={onSpinMore}>
        Pusing Lagi
      </button>
    </div>
  );
}
