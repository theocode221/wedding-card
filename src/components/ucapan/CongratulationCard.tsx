const MAIN_POEM = `Bagai bunga yang mekar di taman,
Cinta kalian disulam dengan penuh keindahan.
Semoga ikatan ini kekal hingga ke syurga,
Diberkati dan dirahmati selamanya.`;

const EXTRA_POEM = `Setiap langkah bersama adalah ayat baru
Dalam surah cinta yang ditulis oleh hati.
Moga rumah kalian dipenuhi ketenangan,
Dan senyuman yang tidak pernah pudar.`;

export type UcapanCongratulationCardProps = {
  showExtra: boolean;
};

export function CongratulationCard({ showExtra }: UcapanCongratulationCardProps) {
  return (
    <article className="ucapan-card" aria-labelledby="ucapan-card-heading">
      <div className="ucapan-card__frame" aria-hidden />
      <h2 id="ucapan-card-heading" className="visually-hidden">
        Ucapan tahniah
      </h2>
      <p className="ucapan-card__body">{MAIN_POEM}</p>
      {showExtra && (
        <div className="ucapan-card__more">
          <p className="ucapan-card__more-inner">{EXTRA_POEM}</p>
        </div>
      )}
    </article>
  );
}
