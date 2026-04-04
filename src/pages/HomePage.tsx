import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="home-selector" aria-label="Pilih kad">
      <section className="home-selector__panel">
        <p className="home-selector__eyebrow">Wedding Cards</p>
        <h1 className="home-selector__title">Pilih jenis kad</h1>
        <p className="home-selector__subtitle">Teruskan ke kad jemputan atau kad ucapan tahniah.</p>

        <div className="home-selector__grid">
          <Link to="/kad-ucapan" className="home-selector__card">
            <span className="home-selector__cardTitle">Invitational Card</span>
            <span className="home-selector__cardDesc">Lihat kad jemputan majlis</span>
          </Link>

          <Link to="/ucapan" className="home-selector__card">
            <span className="home-selector__cardTitle">Congratulation Card</span>
            <span className="home-selector__cardDesc">Buka kad ucapan tahniah</span>
          </Link>
        </div>

        <p className="home-selector__footnote">
          <Link to="/kad-ucapan/sunting" className="home-selector__footnoteLink">
            Sunting teks kad ucapan (sampul, ucapan, butang, kejutan)
          </Link>
        </p>
      </section>
    </main>
  );
}
