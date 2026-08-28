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

          <Link to="/jemputan-frame-maroon" className="home-selector__card">
            <span className="home-selector__cardTitle">Jemputan Maroon &amp; Gold</span>
            <span className="home-selector__cardDesc">Tema maroon diraja dengan aksen emas</span>
          </Link>

          <Link to="/laila" className="home-selector__card">
            <span className="home-selector__cardTitle">Jemputan Maroon Tradisional</span>
            <span className="home-selector__cardDesc">Tema maroon tradisional Melayu — latar oval, nama pada background</span>
          </Link>

          <Link to="/naim-nadhirah-nikah" className="home-selector__card">
            <span className="home-selector__cardTitle">Jemputan White &amp; Gold</span>
            <span className="home-selector__cardDesc">Tema ivory putih dengan aksen emas champagne</span>
          </Link>

          <Link to="/doodle" className="home-selector__card">
            <span className="home-selector__cardTitle">Jemputan Doodle</span>
            <span className="home-selector__cardDesc">Tema sketsa tangan — kertas bergaris dan tulisan playful</span>
          </Link>

          <Link to="/travellers" className="home-selector__card">
            <span className="home-selector__cardTitle">Jemputan Travellers</span>
            <span className="home-selector__cardDesc">Boarding pass, flight path, backpack &amp; passport stamps</span>
          </Link>

          <Link to="/cafe" className="home-selector__card">
            <span className="home-selector__cardTitle">Jemputan Café</span>
            <span className="home-selector__cardDesc">Menu café, steam, today&apos;s special — date-night vibe</span>
          </Link>

          <Link to="/demo-gold" className="home-selector__card">
            <span className="home-selector__cardTitle">Demo Gold</span>
            <span className="home-selector__cardDesc">Preview tema gold dengan nama contoh (Adam &amp; Sofea)</span>
          </Link>
        </div>

        <p className="home-selector__footnote">
          <Link to="/theocodewedding" className="home-selector__footnoteLink">
            —theocodewedding
          </Link>
          {" · "}
          <Link to="/kad-ucapan/sunting" className="home-selector__footnoteLink">
            Sunting teks kad ucapan
          </Link>
        </p>
      </section>
    </main>
  );
}
