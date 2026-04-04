/**
 * All user-visible strings for `/kad-ucapan`.
 * Edit defaults here or use the form at `/kad-ucapan/sunting` (saved to localStorage).
 */
export type UcapanCardCopy = {
  /** Skrin 1 — teks taip di atas sampul (chip) */
  introLine: string;
  /** Skrin 1 — teks pada meterai */
  stampLabel: string;
  /** Skrin 1 — label aksesibiliti butang meterai */
  stampButtonAriaLabel: string;
  /** Skrin 1 — label kawasan intro (pembaca skrin) */
  introSectionAriaLabel: string;
  /** Skrin animasi buka sampul */
  openingSectionAriaLabel: string;
  /** Skrin tarik surat — label kawasan */
  pullSectionAriaLabel: string;
  /** Skrin tarik — petunjuk di atas sampul */
  pullHint: string;
  /** Skrin tarik — label butang seret (aksesibiliti) */
  pullDragHitAriaLabel: string;
  /** Skrin ucapan penuh — label kawasan */
  revealSectionAriaLabel: string;
  /** Skrin ucapan — label artikel */
  revealArticleAriaLabel: string;
  /** Skrin ucapan — teks ucapan utama (banyak baris) */
  mainUcapanText: string;
  /** Skrin ucapan — butang kejutan */
  buttonSurprise: string;
  /** Skrin ucapan — butang ulang */
  buttonReplay: string;
  /** Skrin kejutan — tajuk */
  surpriseTitle: string;
  /** Skrin kejutan — butang kembali */
  surpriseBack: string;
  /** Skrin kejutan — perihal kawasan seret (aksesibiliti) */
  surpriseStageAriaLabel: string;
  /** Paparan penuh gambar — tajuk dialog (aksesibiliti) */
  viewerImageAriaLabel: string;
  /** Paparan penuh video — tajuk dialog (aksesibiliti) */
  viewerVideoAriaLabel: string;
  /** Paparan penuh — label butang latar (tutup) */
  viewerBackdropAriaLabel: string;
  /** Paparan penuh — teks butang tutup */
  viewerCloseButton: string;
};

export const defaultUcapanCardCopy: UcapanCardCopy = {
  introLine: "Surat untuk Afiq Danial (Tenuk) dan Isteri",
  stampLabel: "BUKA",
  stampButtonAriaLabel: "Buka surat",
  introSectionAriaLabel: "Surat untuk anda",
  openingSectionAriaLabel: "Membuka sampul",
  pullSectionAriaLabel: "Surat dalam sampul",
  pullHint: "Tarik surat ke atas untuk membaca",
  pullDragHitAriaLabel: "Tarik surat ke atas untuk membaca",
  revealSectionAriaLabel: "Ucapan",
  revealArticleAriaLabel: "Ucapan di atas surat",
  mainUcapanText: `!سلامت ڤڠنتين بارو تنوق دان ڤاسڠءن

Dua jiwa dipertemukan dalam rahmat,
dua hati disatukan dalam kasih.
Semoga setiap langkah yang bermula hari ini
dihiasi bahagia, diselimuti sabar,
dan dipenuhi cinta hingga ke akhir usia.

Moga rumah tangga yang dibina
menjadi taman ketenangan,
mekar dengan mawaddah dan sakinah,
serta sentiasa dalam lindungan-Nya.`,
  buttonSurprise: "Tekan untuk kejutan",
  buttonReplay: "Lihat sekali lagi",
  surpriseTitle: "Kejutan Buatmu 💖",
  surpriseBack: "Kembali ke Ucapan",
  surpriseStageAriaLabel: "Ketik pantas pada bulatan untuk lihat penuh; seret untuk menggerakkan gambar",
  viewerImageAriaLabel: "Gambar penuh",
  viewerVideoAriaLabel: "Video penuh",
  viewerBackdropAriaLabel: "Tutup",
  viewerCloseButton: "Tutup",
};

export function mergeUcapanCardCopy(partial: Partial<UcapanCardCopy> | null | undefined): UcapanCardCopy {
  return { ...defaultUcapanCardCopy, ...partial };
}
