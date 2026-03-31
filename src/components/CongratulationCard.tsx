const ORNAMENT_SVG = (
  <svg width="120" height="24" viewBox="0 0 120 24" aria-hidden>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinecap="round"
      d="M8 12h16M96 12h16M60 12m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0"
    />
  </svg>
);

export type CongratulationCardProps = {
  title: string;
  subtitle: string;
  mainMessage: string;
  showMoreVerses: boolean;
  extraVerses: string;
};

export function CongratulationCard({
  title,
  subtitle,
  mainMessage,
  showMoreVerses,
  extraVerses,
}: CongratulationCardProps) {
  return (
    <>
      <header className="congrats-hero congrats-hero--enter congrats-sheet">
        <div className="congrats-hero__ornament">{ORNAMENT_SVG}</div>
        <h1 className="congrats-hero__title">{title}</h1>
        <p className="congrats-hero__subtitle">{subtitle}</p>
      </header>

      <article className="congrats-card congrats-card--enter congrats-sheet" aria-labelledby="congrats-card-heading">
        <div className="congrats-card__corners" aria-hidden />
        <h2 id="congrats-card-heading" className="visually-hidden">
          Ucapan penuh
        </h2>
        <p className="congrats-card__body">{mainMessage}</p>
        {showMoreVerses && (
          <div className="congrats-card__more">
            <div className="congrats-card__more-inner">{extraVerses}</div>
          </div>
        )}
      </article>
    </>
  );
}
