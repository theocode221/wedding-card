export type InteractiveButtonsProps = {
  onSendUcapan: () => void;
  onPrayer: () => void;
  onShare: () => void;
  onToggleMusic: () => void;
  musicOn: boolean;
  onToggleDecor: () => void;
  decorOn: boolean;
  onReadMore: () => void;
  readMoreOpen: boolean;
};

export function InteractiveButtons({
  onSendUcapan,
  onPrayer,
  onShare,
  onToggleMusic,
  musicOn,
  onToggleDecor,
  decorOn,
  onReadMore,
  readMoreOpen,
}: InteractiveButtonsProps) {
  return (
    <nav className="congrats-actions" aria-label="Tindakan kad ucapan">
      <button type="button" className="congrats-btn congrats-btn--primary" onClick={onSendUcapan}>
        <span aria-hidden>💌</span> Hantar Ucapan
      </button>
      <button type="button" className="congrats-btn congrats-btn--gold" onClick={onPrayer}>
        <span aria-hidden>🎉</span> Doakan Pengantin
      </button>
      <button type="button" className="congrats-btn congrats-btn--secondary" onClick={onShare}>
        <span aria-hidden>📲</span> Kongsi Kad
      </button>
      <button
        type="button"
        className={`congrats-btn congrats-btn--secondary ${musicOn ? "congrats-btn--toggle-on" : ""}`}
        onClick={onToggleMusic}
        aria-pressed={musicOn}
      >
        <span aria-hidden>🎵</span> {musicOn ? "Hentikan Lagu" : "Mainkan Lagu"}
      </button>
      <button
        type="button"
        className={`congrats-btn congrats-btn--secondary ${decorOn ? "congrats-btn--toggle-on" : ""}`}
        onClick={onToggleDecor}
        aria-pressed={decorOn}
      >
        <span aria-hidden>🌸</span> {decorOn ? "Kurangkan Hiasan" : "Hias Kad"}
      </button>
      <button type="button" className="congrats-btn congrats-btn--gold" onClick={onReadMore}>
        <span aria-hidden>📜</span> {readMoreOpen ? "Sembunyikan Ayat" : "Baca Lagi"}
      </button>
    </nav>
  );
}
