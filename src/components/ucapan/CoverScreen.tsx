type CoverScreenProps = {
  onOpen: () => void;
};

const ORNAMENT = (
  <svg width="100" height="28" viewBox="0 0 100 28" aria-hidden>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeLinecap="round"
      d="M6 14h14M80 14h14M50 14m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0"
    />
  </svg>
);

export function CoverScreen({ onOpen }: CoverScreenProps) {
  return (
    <div className="ucapan-cover">
      <div className="ucapan-cover__ornament">{ORNAMENT}</div>
      <h1 className="ucapan-cover__title">Selamat Pengantin Baru</h1>
      <p className="ucapan-cover__subtitle">Dengan penuh kasih dan doa</p>
      <button type="button" className="ucapan-cover__btn" onClick={onOpen}>
        Buka Kad
      </button>
    </div>
  );
}
