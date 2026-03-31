import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="home-chooser">
      <div className="home-chooser__wash" aria-hidden />
      <section className="home-chooser__panel" aria-labelledby="home-chooser-title">
        <p className="home-chooser__eyebrow">Wedding Cards</p>
        <h1 id="home-chooser-title" className="home-chooser__title">
          Pilih Halaman Kad
        </h1>
        <p className="home-chooser__subtitle">Pilih kad jemputan atau kad ucapan tahniah.</p>

        <div className="home-chooser__grid">
          <Link to="/invitation" className="home-chooser__card home-chooser__card--invite">
            <span className="home-chooser__cardLabel">Invitational Card</span>
            <span className="home-chooser__cardHint">Buka kad jemputan majlis</span>
          </Link>

          <Link to="/ucapan" className="home-chooser__card home-chooser__card--congrats">
            <span className="home-chooser__cardLabel">Congratulation Card</span>
            <span className="home-chooser__cardHint">Buka kad ucapan tahniah</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
