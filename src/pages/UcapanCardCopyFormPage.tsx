import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUcapanCopy } from "../context/UcapanCopyContext";
import type { UcapanCardCopy } from "../data/ucapanCardCopy";
import { mergeUcapanCardCopy } from "../data/ucapanCardCopy";
import "../styles/ucapanCopyForm.css";

type FieldDef = {
  key: keyof UcapanCardCopy;
  label: string;
  hint: string;
  multiline?: boolean;
  tall?: boolean;
};

type GroupDef = {
  step: string;
  title: string;
  where: string;
  fields: FieldDef[];
};

const FORM_GROUPS: GroupDef[] = [
  {
    step: "1",
    title: "Skrin sampul",
    where: "Paparan pertama — teks di atas sampul tertutup, meterai, dan label untuk pembaca skrin.",
    fields: [
      {
        key: "introLine",
        label: "Teks taip di atas sampul",
        hint: "Baris yang ditaipkan dalam chip (sebelum meterai muncul).",
        multiline: true,
      },
      {
        key: "stampLabel",
        label: "Teks pada meterai",
        hint: "Perkataan besar di atas gambar meterai (contoh: BUKA).",
      },
      {
        key: "stampButtonAriaLabel",
        label: "Label aksesibiliti butang meterai",
        hint: "Untuk pembaca skrin apabila fokus pada meterai.",
      },
      {
        key: "introSectionAriaLabel",
        label: "Label kawasan intro (pembaca skrin)",
        hint: "Menerangkan keseluruhan kawasan skrin sampul.",
      },
    ],
  },
  {
    step: "2",
    title: "Animasi buka sampul",
    where: "Skrin peralihan selepas mengetik meterai — tiada teks pengguna, hanya label kawasan.",
    fields: [
      {
        key: "openingSectionAriaLabel",
        label: "Label kawasan animasi",
        hint: "Untuk pembaca skrin semasa sampul dibuka.",
      },
    ],
  },
  {
    step: "3",
    title: "Tarik surat keluar",
    where: "Petunjuk di atas surat dalam sampul + label butang seret.",
    fields: [
      {
        key: "pullHint",
        label: "Petunjuk (teks kelihatan)",
        hint: "Ayat di atas sampul yang mengajar tetamu menarik surat.",
      },
      {
        key: "pullDragHitAriaLabel",
        label: "Label aksesibiliti kawasan seret",
        hint: "Biasanya sama dengan petunjuk; untuk keyboard / pembaca skrin.",
      },
      {
        key: "pullSectionAriaLabel",
        label: "Label kawasan skrin tarik",
        hint: "Menerangkan keseluruhan kawasan surat dalam sampul.",
      },
    ],
  },
  {
    step: "4",
    title: "Ucapan penuh",
    where: "Latar surat terbuka — teks utama dikta + butang di bawah.",
    fields: [
      {
        key: "mainUcapanText",
        label: "Teks ucapan utama",
        hint: "Seluruh ucapan (baris baru kekal). Boleh guna Jawi, Rumi, dll.",
        multiline: true,
        tall: true,
      },
      {
        key: "revealSectionAriaLabel",
        label: "Label kawasan ucapan penuh",
        hint: "Untuk pembaca skrin (keseluruhan skrin surat terbuka).",
      },
      {
        key: "revealArticleAriaLabel",
        label: "Label artikel ucapan",
        hint: "Khusus untuk blok teks ucapan di atas surat.",
      },
      {
        key: "buttonSurprise",
        label: "Butang kejutan",
        hint: "Membuka skrin foto/video terapung.",
      },
      {
        key: "buttonReplay",
        label: "Butang ulang pengalaman",
        hint: "Kembali ke mula (sampul tertutup).",
      },
    ],
  },
  {
    step: "5",
    title: "Skrin kejutan & paparan penuh",
    where: "Selepas tekan butang kejutan — tajuk, kembali, dan dialog gambar/video.",
    fields: [
      {
        key: "surpriseTitle",
        label: "Tajuk skrin kejutan",
        hint: "Tajuk besar di atas gelembung foto.",
      },
      {
        key: "surpriseBack",
        label: "Butang kembali",
        hint: "Kembali ke skrin ucapan penuh.",
      },
      {
        key: "surpriseStageHint",
        label: "Petunjuk kawasan foto (teks kecil kelihatan)",
        hint: "Dipaparkan di bawah tajuk, di atas gelembung. Juga dibaca pembaca skrin (aria-describedby).",
      },
      {
        key: "viewerImageAriaLabel",
        label: "Tajuk dialog — gambar penuh",
        hint: "Apabila gambar dibuka besar.",
      },
      {
        key: "viewerVideoAriaLabel",
        label: "Tajuk dialog — video penuh",
        hint: "Apabila video dibuka besar.",
      },
      {
        key: "viewerBackdropAriaLabel",
        label: "Label butang tutup (latar gelap)",
        hint: "Ketik latar untuk tutup.",
      },
      {
        key: "viewerCloseButton",
        label: "Teks butang Tutup",
        hint: "Butang eksplisit di dialog paparan penuh.",
      },
    ],
  },
];

export function UcapanCardCopyFormPage() {
  const { copy, setCopy, resetCopy } = useUcapanCopy();
  const [draft, setDraft] = useState<UcapanCardCopy>(() => ({ ...copy }));
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setDraft({ ...copy });
  }, [copy]);

  const setField = (key: keyof UcapanCardCopy, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const handleSave = () => {
    setCopy(mergeUcapanCardCopy(draft));
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  };

  const handleReset = () => {
    if (window.confirm("Set semula teks ke lalai? Perubahan tersuai dalam pelayar akan dibuang.")) {
      resetCopy();
    }
  };

  return (
    <div className="ucapan-form-page">
      <header className="ucapan-form__top">
        <p className="ucapan-form__crumb">
          <Link to="/">Laman utama</Link>
          {" · "}
          <Link to="/kad-ucapan">Kad ucapan</Link>
          {" · "}
          <span>Sunting teks</span>
        </p>
        <h1 className="ucapan-form__title">Sunting teks kad ucapan</h1>
        <p className="ucapan-form__lead">
          Setiap bahagian di bawah diberi nombor langkah yang sepadan dengan aliran kad: dari sampul, tarik surat, ucapan,
          hingga skrin kejutan. Teks disimpan dalam pelayar anda (localStorage) dan dipaparkan pada laman{" "}
          <Link to="/kad-ucapan">/kad-ucapan</Link>.
        </p>
        <div className="ucapan-form__actions">
          <button type="button" className="ucapan-form__btn ucapan-form__btn--primary" onClick={handleSave}>
            Simpan teks
          </button>
          <Link to="/kad-ucapan" className="ucapan-form__btn ucapan-form__btn--ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Pratonton kad
          </Link>
          <button type="button" className="ucapan-form__btn ucapan-form__btn--danger" onClick={handleReset}>
            Set semula lalai
          </button>
        </div>
        {savedFlash && <p className="ucapan-form__saved">Disimpan. Muat semula kad jika ia sudah terbuka.</p>}
      </header>

      <div className="ucapan-form__stack">
        {FORM_GROUPS.map((group) => (
          <section key={group.step} className="ucapan-form__card">
            <div className="ucapan-form__cardHead">
              <span className="ucapan-form__step" aria-hidden>
                {group.step}
              </span>
              <div className="ucapan-form__cardTitles">
                <h2 className="ucapan-form__cardTitle">{group.title}</h2>
                <p className="ucapan-form__cardWhere">{group.where}</p>
              </div>
            </div>
            {group.fields.map((field) => (
              <div key={field.key} className="ucapan-form__field">
                <label className="ucapan-form__label" htmlFor={`ucapan-field-${field.key}`}>
                  {field.label}
                </label>
                <p className="ucapan-form__hint">{field.hint}</p>
                {field.multiline ? (
                  <textarea
                    id={`ucapan-field-${field.key}`}
                    className={["ucapan-form__textarea", field.tall ? "ucapan-form__textarea--tall" : ""]
                      .filter(Boolean)
                      .join(" ")}
                    value={draft[field.key]}
                    onChange={(e) => setField(field.key, e.target.value)}
                    rows={field.tall ? 14 : 5}
                  />
                ) : (
                  <input
                    id={`ucapan-field-${field.key}`}
                    className="ucapan-form__input"
                    type="text"
                    value={draft[field.key]}
                    onChange={(e) => setField(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
