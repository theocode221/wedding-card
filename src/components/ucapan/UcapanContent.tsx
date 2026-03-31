import { Link } from "react-router-dom";

const LETTER_TEXT = `Bagai bulan dan bintang yang saling melengkapi,
begitulah indahnya dua hati disatukan hari ini.
Semoga cinta yang terbina mekar hingga ke syurga,
diberkati, dirahmati, dan bahagia selamanya.`;

export type UcapanContentProps = {
  onMainSemula: () => void;
};

export function UcapanContent({ onMainSemula }: UcapanContentProps) {
  return (
    <div className="ucapan-letter ucapan-letter--mount">
      <div className="ucapan-letter__card">
        <div className="ucapan-letter__frame" aria-hidden />
        <p className="ucapan-letter__body">{LETTER_TEXT}</p>
      </div>

      <div className="ucapan-letter__actions">
        <button type="button" className="ucapan-btn-reset" onClick={onMainSemula}>
          Main Semula
        </button>
        <Link to="/" className="ucapan-letter__home">
          Kembali ke jemputan
        </Link>
      </div>
    </div>
  );
}
