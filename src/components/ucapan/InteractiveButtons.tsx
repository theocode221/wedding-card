export type UcapanInteractiveButtonsProps = {
  onDoakan: () => void;
  onTambahUcapan: () => void;
  extraOpen: boolean;
  onKongsi: () => void;
  onMainSemula: () => void;
};

export function InteractiveButtons({
  onDoakan,
  onTambahUcapan,
  extraOpen,
  onKongsi,
  onMainSemula,
}: UcapanInteractiveButtonsProps) {
  return (
    <div className="ucapan-actions" role="group" aria-label="Tindakan">
      <button type="button" className="ucapan-btn ucapan-btn--primary" onClick={onDoakan}>
        <span aria-hidden>🌸</span> Doakan
      </button>
      <button
        type="button"
        className={`ucapan-btn ucapan-btn--soft ${extraOpen ? "ucapan-btn--active" : ""}`}
        onClick={onTambahUcapan}
        aria-pressed={extraOpen}
      >
        <span aria-hidden>📜</span> {extraOpen ? "Tutup Ucapan Tambahan" : "Tambah Ucapan"}
      </button>
      <button type="button" className="ucapan-btn ucapan-btn--soft" onClick={onKongsi}>
        <span aria-hidden>📲</span> Kongsi
      </button>
      <button type="button" className="ucapan-btn ucapan-btn--ghost" onClick={onMainSemula}>
        <span aria-hidden>🔁</span> Main Semula
      </button>
    </div>
  );
}
