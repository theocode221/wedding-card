import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="home-selector" aria-label="Pilih kad">
      <div className="home-selector__gold-decor" aria-hidden>
        <span className="home-selector__gold-corner home-selector__gold-corner--tl" />
        <span className="home-selector__gold-corner home-selector__gold-corner--tr" />
        <span className="home-selector__gold-corner home-selector__gold-corner--bl" />
        <span className="home-selector__gold-corner home-selector__gold-corner--br" />
        <span className="home-selector__gold-orb home-selector__gold-orb--a" />
        <span className="home-selector__gold-orb home-selector__gold-orb--b" />
        <span className="home-selector__gold-line" />
      </div>
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

          <Link to="/ucapan-party" className="home-selector__card">
            <span className="home-selector__cardTitle">Party Congrats</span>
            <span className="home-selector__cardDesc">Aliran sampul dan kejutan seperti kad ucapan — tema neon</span>
          </Link>

          <Link to="/kad-gosok" className="home-selector__card">
            <span className="home-selector__cardTitle">Kad Gosok</span>
            <span className="home-selector__cardDesc">Gosok untuk membuka ucapan rahsia — tiada imej luaran</span>
          </Link>

          <Link to="/roda-doa" className="home-selector__card">
            <span className="home-selector__cardTitle">Roda Doa</span>
            <span className="home-selector__cardDesc">Pusing roda berkat — ucapan mengikut segmen terpilih</span>
          </Link>

          <Link to="/jemputan-frame" className="home-selector__card">
            <span className="home-selector__cardTitle">Jemputan (bingkai)</span>
            <span className="home-selector__cardDesc">Animasi pembuka berbingkai, kemudian kandungan jemputan</span>
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
