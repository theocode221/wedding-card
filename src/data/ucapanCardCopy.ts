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
  /** Skrin kejutan — petunjuk kecil kelihatan di atas kawasan foto + untuk pembaca skrin */
  surpriseStageHint: string;
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
  introLine: "Hai Din & Ila :P",
  stampLabel: "buka",
  stampButtonAriaLabel: "buka",
  introSectionAriaLabel: "Surat untuk anda",
  openingSectionAriaLabel: "Membuka sampul",
  pullSectionAriaLabel: "Surat dalam sampul",
  pullHint: "keluakan surat",
  pullDragHitAriaLabel: "Tarik surat ke atas untuk membaca",
  revealSectionAriaLabel: "Ucapan",
  revealArticleAriaLabel: "Ucapan di atas surat",
  mainUcapanText: `Kepada Din dan Ila,
  Congrats dah lepas first stage. Semoga urusan korang untuk next step dipermudahkan!
  
  Best wishes from Anepo!`,
  buttonSurprise: "Tekan kalau nak tengok something lawak",
  buttonReplay: "Lihat sekali lagi",
  surpriseTitle: "jaga din leklok ila HAHA :D",
  surpriseBack: "BACK",
  surpriseStageHint: "click kat bola untuk tengok gambar penuh; bole swipe2 untuk menggerakkan gambar HAHAHA",
  viewerImageAriaLabel: "Gambar penuh",
  viewerVideoAriaLabel: "Video penuh",
  viewerBackdropAriaLabel: "Tutup",
  viewerCloseButton: "Tutup",
};

type StoredCopy = Partial<UcapanCardCopy> & { surpriseStageAriaLabel?: string };

/** Merges saved JSON; maps legacy `surpriseStageAriaLabel` → `surpriseStageHint`. */
export function mergeUcapanCardCopy(partial: Partial<UcapanCardCopy> | null | undefined): UcapanCardCopy {
  const raw = (partial ?? {}) as StoredCopy;
  const legacyHint = typeof raw.surpriseStageAriaLabel === "string" ? raw.surpriseStageAriaLabel : undefined;
  const hint =
    (typeof raw.surpriseStageHint === "string" ? raw.surpriseStageHint : undefined) ??
    legacyHint ??
    defaultUcapanCardCopy.surpriseStageHint;
  const { surpriseStageAriaLabel: _drop, ...rest } = raw;
  return { ...defaultUcapanCardCopy, ...rest, surpriseStageHint: hint };
}
