import { publicUrl } from "../lib/publicAsset";

export type PortfolioCategory = "jemputan" | "ucapan" | "interaktif";

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: PortfolioCategory;
  previewImage?: string;
  previewGradient?: string;
  tags?: readonly string[];
};

export const PORTFOLIO_CATEGORIES: readonly { id: PortfolioCategory; label: string }[] = [
  { id: "jemputan", label: "Jemputan" },
  { id: "ucapan", label: "Ucapan & tahniah" },
  { id: "interaktif", label: "Interaktif" },
];

export const PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  {
    id: "laila",
    title: "Laila — Maroon Tradisional",
    description: "Latar oval maroon, nama tulisan tangan, RSVP, galeri & ucapan tetamu.",
    path: "/laila",
    category: "jemputan",
    previewImage: encodeURI(publicUrl("lela kb/marron bg laila.png")),
    tags: ["RSVP", "Galeri", "Ucapan"],
  },
  {
    id: "white-gold",
    title: "White & Gold",
    description: "Tema ivory putih dengan aksen emas champagne dan animasi pembuka.",
    path: "/naim-nadhirah-nikah",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1 gold.png"),
    tags: ["Animasi", "RSVP"],
  },
  {
    id: "maroon-gold",
    title: "Maroon & Gold (Bingkai)",
    description: "Jemputan berbingkai dengan tema maroon diraja dan emas.",
    path: "/jemputan-frame-maroon",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1.png"),
    tags: ["Animasi", "RSVP"],
  },
  {
    id: "frame",
    title: "Jemputan Bingkai",
    description: "Animasi pembuka berbingkai, kemudian kandungan jemputan penuh.",
    path: "/jemputan-frame",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1.png"),
  },
  {
    id: "royal-maroon",
    title: "Maroon Diraja",
    description: "Templat luxury maroon dengan tipografi elegan.",
    path: "/jemputan-maroon-diraja",
    category: "jemputan",
    previewGradient: "linear-gradient(145deg, #3a0c14 0%, #5c101c 45%, #b0893a 100%)",
  },
  {
    id: "demo-gold",
    title: "Demo Gold",
    description: "Preview tema gold dengan nama contoh (Nama & Pengantin).",
    path: "/demo-gold",
    category: "jemputan",
    previewImage: publicUrl("wedding-invitation/1 gold.png"),
    tags: ["Demo"],
  },
  {
    id: "kad-ucapan",
    title: "Kad Ucapan",
    description: "Aliran sampul, tarik surat, ucapan taip, dan kejutan.",
    path: "/kad-ucapan",
    category: "ucapan",
    previewGradient: "linear-gradient(160deg, #f6efe4 0%, #d4b896 55%, #5c101c 100%)",
  },
  {
    id: "congrats",
    title: "Congratulation Card",
    description: "Kad ucapan tahniah ringkas untuk pengantin baru.",
    path: "/ucapan",
    category: "ucapan",
    previewGradient: "linear-gradient(160deg, #fff8f0 0%, #e8d5c4 100%)",
  },
  {
    id: "party",
    title: "Party Congrats",
    description: "Kad ucapan dengan tema neon dan aliran kejutan.",
    path: "/ucapan-party",
    category: "ucapan",
    previewImage: encodeURI(publicUrl("assets/party!/2.png")),
    tags: ["Neon"],
  },
  {
    id: "scratch",
    title: "Kad Gosok",
    description: "Gosok untuk membuka ucapan rahsia — tiada imej luaran diperlukan.",
    path: "/kad-gosok",
    category: "interaktif",
    previewGradient: "linear-gradient(145deg, #c9a962 0%, #f6efe4 50%, #5c101c 100%)",
  },
  {
    id: "wheel",
    title: "Roda Doa",
    description: "Pusing roda berkat — ucapan mengikut segmen terpilih.",
    path: "/roda-doa",
    category: "interaktif",
    previewGradient: "linear-gradient(160deg, #f6efe4 0%, #7a1828 100%)",
  },
  {
    id: "egg",
    title: "Kad Telur Tahniah",
    description: "Pecahkan telur untuk membuka ucapan dan kejutan.",
    path: "/kad-wedding-badar",
    category: "interaktif",
    previewImage: publicUrl("assets/cartoon-newlywed1.png"),
  },
  {
    id: "egg-pastel",
    title: "Kad Telur (Pastel)",
    description: "Versi pastel lembut dengan animasi yang sama.",
    path: "/kad-wedding-badar-pastel",
    category: "interaktif",
    previewGradient: "linear-gradient(160deg, #fceef5 0%, #e8d4f0 55%, #f6efe4 100%)",
  },
];
